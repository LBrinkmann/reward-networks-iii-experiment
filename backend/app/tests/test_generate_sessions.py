import httpx
import pytest

from models.config import ExperimentSettings
from models.session import Session
from study_setup.generate_sessions import generate_sessions, create_trials


@pytest.mark.asyncio
@pytest.mark.slow
@pytest.mark.parametrize(
    "n_generations,n_sessions_first_generation,n_ai_players,"
    "n_sessions_per_generation,n_advise_per_session",
    [
        (2, 10, 0, 10, 0),  # pilot 1B (first generation only AI players)
        (1, 10, 0, 10, 0),  # pilot 1A (no AI players, one generation)
        (3, 13, 3, 20, 5),  # full experiment
    ]
)
async def test_generate_sessions(default_client: httpx.AsyncClient,
                                 e_config: ExperimentSettings,
                                 n_generations,
                                 n_sessions_first_generation,
                                 n_ai_players,
                                 n_sessions_per_generation,
                                 n_advise_per_session,
                                 experiment_type='reward_network_iii'):
    sessions = await Session.find().first_or_none()
    assert sessions is None

    await generate_sessions(
        config_id=e_config.id,
        experiment_type=experiment_type,
        n_advise_per_session=n_advise_per_session,
        n_generations=n_generations,
        n_sessions_first_generation=n_sessions_first_generation,
        n_ai_players=n_ai_players,
        n_sessions_per_generation=n_sessions_per_generation)
    sessions = await Session.find().to_list()

    assert sessions is not None

    net_ids = []
    for s in sessions:
        assert s.experiment_type == "reward_network_iii"
        if s.generation != 0:
            # check the number of parents
            assert len(s.advise_ids) == n_advise_per_session
        # collect all network ids
        net_ids += [t.network.network_id for t in s.trials if
                    t.network is not None]

    # check that each network is unique
    assert len(net_ids) == len(set(net_ids))

    # Clean up resources
    await Session.find().delete()


@pytest.mark.asyncio
async def test_create_trials(default_client: httpx.AsyncClient,
                             e_config: ExperimentSettings):
    n_consent = 1
    n_practice = 1
    n_soc_learning = 3
    n_ind = 3
    n_demonstration = 3
    n_w_strategy = 1
    n_post_survey = 1
    n_debriefing = 1
    n_all_trials = n_consent + n_demonstration + n_w_strategy + n_post_survey
    n_all_trials += n_debriefing
    n_all_trials += n_practice
    n_all_trials += n_soc_learning * n_demonstration * 3 + n_ind
    n_all_trials += 4  # 5 instructions: welcome, individual, demo, w_strategy

    session = create_trials(
        config_id=e_config.id,
        experiment_num=0,
        experiment_type='test',
        generation=0,
        session_idx=0,
        n_social_learning_trials=n_soc_learning,
        n_individual_trials=n_ind,
        n_demonstration_trials=n_demonstration)

    assert len(session.trials) == n_all_trials
    for t in session.trials:
        assert t.trial_type not in ['social_learning_selection',
                                    'social_learning']
        assert t.trial_type in ['consent', 'demonstration', 'written_strategy',
                                'debriefing', 'individual', 'post_survey',
                                'instruction_welcome',
                                'instruction_individual',
                                'instruction_demonstration',
                                'instruction_written_strategy', 'practice']

    session = create_trials(
        config_id=e_config.id,
        experiment_num=0,
        experiment_type='test',
        generation=1,
        session_idx=0,
        n_social_learning_trials=n_soc_learning,
        n_individual_trials=n_ind,
        n_demonstration_trials=n_demonstration
    )

    # add n_all_trials because social_learning_selection counts as a trial
    # 2 instructions: social_learning_selection, social_learning
    assert len(session.trials) == n_all_trials + n_soc_learning + 2
    for t in session.trials:
        assert t.trial_type in [
            'consent', 'demonstration', 'written_strategy', 'debriefing',
            'individual', 'social_learning', 'social_learning_selection',
            'instruction_learning_selection', 'instruction_learning',
            'instruction_individual', 'instruction_demonstration',
            'instruction_written_strategy', 'instruction_welcome', 'practice',
            'post_survey']
