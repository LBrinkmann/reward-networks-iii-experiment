import httpx
import pytest

from models.session import Session
from study_setup.generate_sessions import generate_sessions


@pytest.mark.asyncio
async def test_generate_sessions(default_client: httpx.AsyncClient,
                                 experiment_type='reward_network_iii',
                                 n_advise_per_session=5,
                                 n_generations=5,
                                 n_sessions_per_generation=20
                                 ):
    await generate_sessions(experiment_type=experiment_type,
                            n_advise_per_session=n_advise_per_session,
                            n_generations=n_generations,
                            n_sessions_per_generation=n_sessions_per_generation)
    sessions = await Session.find().to_list(100)

    for s in sessions:
        assert s.experiment_type == "reward_network_iii"
        if s.generation != 0:
            # check the number of parents
            assert len(s.advise_ids) == n_advise_per_session


@pytest.mark.skip
def test_create_trials():
    pass
