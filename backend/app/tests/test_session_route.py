import asyncio

import httpx
import pytest
from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import In

from models.session import Session
from models.subject import Subject


@pytest.mark.asyncio
async def test_one_subject(default_client: httpx.AsyncClient,
                           create_empty_experiment):
    await one_subject(default_client, 0)

    # Clean up resources
    await Session.find().delete()
    await Subject.find().delete()


@pytest.mark.asyncio
async def test_multiple_subjects(default_client: httpx.AsyncClient,
                                 create_empty_experiment):
    tasks = []
    for i in range(30):
        task = asyncio.create_task(one_subject(default_client, i))
        tasks.append(task)
    [await t for t in tasks]

    subjects = await Subject.find().to_list()

    assert len(subjects) == 30

    sessions = await Session.find(
        In(Session.subject_id, [s.id for s in subjects])).to_list()

    assert len(sessions) == 17

    # Clean up resources
    await Session.find().delete()
    await Subject.find().delete()


async def one_subject(default_client, subj):
    subj_name = f'test-{subj}'
    headers = {
        "Content-Type": "application/json",
    }
    solution = {
        'moves': [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
    url = f'/session/prolific_id_{subj_name}'
    # consent
    await get_post_trial(default_client, 'consent', 0, url)
    # Individual trials
    await get_post_trial(default_client, 'individual', 1, url, solution,
                         headers)


async def get_post_trial(client, trial_type, t_id, url, solution=None,
                         headers=None):
    # get trial
    response = await client.get(url)
    assert response.status_code == 200

    data = response.json()

    if 'message' in data:
        assert data['message'] in [
            "Multiple subjects with the same prolific id",
            "No available session for the subject"]
        return
    else:
        trial = data

    assert trial['id'] == t_id
    assert trial['trial_type'] == trial_type

    await asyncio.sleep(0.1)

    # post solution
    url = f'{url}/{trial_type}'
    if solution is not None:
        response = await client.post(url, json=solution, headers=headers)
    else:
        response = await client.post(url)

    assert response.status_code == 200
    assert response.json()['message'] == 'Trial saved'
