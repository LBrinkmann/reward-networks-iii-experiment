import asyncio
from datetime import datetime, timedelta

import httpx
import pytest
from beanie.odm.operators.find.comparison import In

from models.config import ExperimentSettings
from models.session import Session
from models.subject import Subject
from routes.session_utils.session_lifecycle import replace_stale_session, \
    initialize_session, get_session, end_session
from simultate_session_data import simulate_data


@pytest.mark.asyncio
async def test_one_subject(default_client: httpx.AsyncClient,
                           e_config: ExperimentSettings,
                           create_empty_experiment):
    """Test one subject from the generation 0"""
    await one_subject(default_client, e_config, 0)

    # Clean up resources
    await Session.find().delete()
    await Subject.find().delete()


@pytest.mark.asyncio
async def test_one_subject_gen_1(default_client: httpx.AsyncClient,
                                 e_config: ExperimentSettings,
                                 create_empty_experiment):
    """Test one subject from the generation 0"""
    # simulate data for generation 0
    generation = 1
    await simulate_data(generation, e_config)

    await one_subject(default_client, e_config, 0, generation)

    session = await Session.find_one(Session.generation == generation, Session.finished == True)
    assert session is not None

    for t in session.trials:
        if t.trial_type == 'social_learning':
            assert t.advisor is not None
            assert t.network is not None

    # Clean up resources
    await Session.find().delete()
    await Subject.find().delete()


@pytest.mark.asyncio
@pytest.mark.very_slow  # > 1 minute
async def test_multiple_subjects(default_client: httpx.AsyncClient,
                                 e_config: ExperimentSettings,
                                 create_empty_experiment):
    """Test multiple parallel subjects from the generation 0 and 1"""
    # generation 0
    tasks = []
    for i in range(30):
        task = asyncio.create_task(one_subject(default_client, e_config, i))
        tasks.append(task)
    [await t for t in tasks]

    subjects = await Subject.find().to_list()

    assert len(subjects) == 30

    sessions = await Session.find(
        In(Session.subject_id, [s.id for s in subjects])).to_list()

    assert len(
        sessions) == e_config.n_sessions_first_generation - e_config.n_ai_players

    # generation 1
    tasks = []
    for i in range(30, 60):
        task = asyncio.create_task(one_subject(default_client, e_config, i, generation=1))
        tasks.append(task)
    [await t for t in tasks]

    subjects = await Subject.find().to_list()

    assert len(subjects) == 60

    sessions = await Session.find(
        In(Session.subject_id, [s.id for s in subjects]),
        Session.generation == 1
    ).to_list()

    assert len(sessions) == e_config.n_sessions_per_generation

    # Clean up resources
    await Session.find().delete()
    await Subject.find().delete()


async def one_subject(default_client: httpx.AsyncClient,
                      e_config: ExperimentSettings,
                      subj: int,
                      generation: int = 0):
    subj_name = f'test-{subj}'
    headers = {
        "Content-Type": "application/json",
    }
    solution = {
        'moves': [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
    written_strategy = {
        'strategy': 'test'
    }

    post_survey = {
        'questions': {
            'q1': 'a1',
            'q2': 'a2',
            'q3': 'a3',
        }
    }

    url = f'/session/prolific_id_{subj_name}'
    trial_num = 0

    # consent
    await get_post_trial(default_client, 'consent', trial_num, url)
    trial_num += 1

    # welcome
    await get_post_trial(default_client, 'instruction', trial_num, url)
    trial_num += 1

    # practice
    await get_post_trial(default_client, 'practice', trial_num, url)
    trial_num += 1

    if generation != 0:
        # individual_start
        await get_post_trial(default_client, 'instruction', trial_num, url)
        trial_num += 1

        # individual
        for _ in range(2):
            await get_post_trial(default_client, 'individual', trial_num, url, solution, headers)
            trial_num += 1

        # written_strategy_start
        await get_post_trial(default_client, 'instruction', trial_num, url)
        trial_num += 1

        # written_strategy
        await get_post_trial(default_client, 'written_strategy', trial_num, url, written_strategy, headers)
        trial_num += 1

        for i in range(e_config.n_social_learning_trials):
            if i == 0:
                # instruction_learning_selection
                await get_post_trial(default_client, 'instruction', trial_num, url)
                trial_num += 1

            # social learning selection
            await get_post_trial(default_client, 'social_learning_selection',
                                 trial_num, url, headers=headers)
            trial_num += 1

            if i == 0:
                await get_post_trial(default_client, 'instruction', trial_num, url)
                trial_num += 1

            # social learning
            for _ in range(e_config.n_demonstration_trials):
                await get_post_trial(default_client, 'try_yourself', trial_num, url, solution, headers)
                trial_num += 1
                await get_post_trial(default_client, 'observation', trial_num, url, solution, headers)
                trial_num += 1
                await get_post_trial(default_client, 'try_yourself', trial_num, url, solution, headers)
                trial_num += 1

    if generation > 0:
        n_individual_trials = e_config.n_individual_trials - 2
    else:
        n_individual_trials = e_config.n_individual_trials
        n_individual_trials += e_config.n_social_learning_trials * e_config.n_demonstration_trials * 3

    for i in range(n_individual_trials):
        if i == 0:
            # instruction individual
            await get_post_trial(default_client, 'instruction', trial_num, url)
            trial_num += 1

        # individual trial
        await get_post_trial(default_client, 'individual', trial_num, url, solution, headers)
        trial_num += 1

    # demonstration trial
    for i in range(e_config.n_demonstration_trials):
        if i == 0:
            # instruction demonstration
            await get_post_trial(default_client, 'instruction',
                                 trial_num, url)
            trial_num += 1

        await get_post_trial(default_client, 'demonstration', trial_num, url,
                             solution, headers)
        trial_num += 1

    # written strategy trial
    await get_post_trial(default_client, 'instruction', trial_num, url)
    trial_num += 1

    await get_post_trial(default_client, 'written_strategy', trial_num, url, written_strategy, headers)
    trial_num += 1

    await get_post_trial(default_client, 'post_survey', trial_num, url, post_survey, headers)
    trial_num += 1

    # debriefing
    await get_post_trial(default_client, 'debriefing', trial_num, url)
    trial_num += 1


async def get_post_trial(client, trial_type, t_id, url, solution=None, headers=None):
    # get trial
    response = await client.get(url)
    assert response.status_code == 200

    data = response.json()

    if 'message' in data:
        assert data['message'] is not None
        return
    else:
        trial = data

    assert trial['id'] == t_id
    assert trial['trial_type'] == trial_type

    # wait for 0.05 seconds before post trial
    await asyncio.sleep(0.05)

    # post solution
    url = f'{url}/{t_id}'
    if solution is not None:
        response = await client.post(url, json=solution, headers=headers)
    else:
        if trial_type == 'social_learning_selection':
            # select the first advisor
            payload = {
                'advisor_id': str(trial['advisor_selection']['advisor_ids'][0])
            }
            response = await client.post(url, json=payload, headers=headers)
        else:
            response = await client.post(url)

    assert response.status_code == 200
    data = response.json()
    assert data['message'] == 'Trial saved'


@pytest.mark.asyncio
async def test_replace_stale_session(create_empty_experiment,
                                     default_client: httpx.AsyncClient,
                                     e_config: ExperimentSettings):
    subj = Subject(prolific_id='test-1')
    await subj.save()
    await initialize_session(subj)
    # get session
    session = await get_session('test-1')
    session_id = session.id

    session.started_at = datetime.now() - timedelta(minutes=10)
    await session.save()
    await replace_stale_session(e_config, 10)

    replaced_session = await Session.get(session_id)
    expired_session = await Session.find_one(Session.expired == True)
    assert replaced_session.expired == False
    assert expired_session.expired == True
    assert replaced_session.subject_id is None
    assert expired_session.subject_id == subj.id
    assert len(replaced_session.trials) == len(expired_session.trials)

    # test finished and expired but not replaced session
    subj = Subject(prolific_id='test-2')
    await subj.save()
    await initialize_session(subj)
    session = await get_session('test-2')
    session_id = session.id
    session.finished = True
    session.time_spent = timedelta(minutes=15)
    await session.save()
    await replace_stale_session(e_config, 10)
    replaced_session = await Session.get(session_id)
    expired_session = await Session.find_one(Session.subject_id == subj.id)
    assert replaced_session.subject_id is None
    assert expired_session.subject_id == subj.id

    # Clean up resources
    await Session.find().delete()
    await Subject.find().delete()


@pytest.mark.asyncio
async def test_end_session(create_empty_experiment,
                           default_client: httpx.AsyncClient,
                           e_config: ExperimentSettings):
    generation = 1
    await simulate_data(generation, e_config)

    # select the session from the 0 generation (session with the simulated data)
    session = await Session.find_one(Session.generation == 0)
    session.started_at = datetime.now() - timedelta(minutes=60)
    await session.save()
    await end_session(session)
    # update the session
    session = await Session.get(session.id)
    assert session.finished == False
    # expired session should be in the database
    expired_session = await Session.find_one(Session.expired == True)
    assert expired_session is not None

    # Clean up resources
    await Session.find().delete()
    await Subject.find().delete()