import httpx
import pytest

from models.session import Session
from study_setup.generate_sessions import generate_sessions


@pytest.mark.asyncio
async def test_generate_sessions(default_client: httpx.AsyncClient):
    url = '/simulation/reward_network_iii/0?' \
          'generate_new_sessions=true&run_simulation=false'
    response = await default_client.get(url)

    await generate_sessions(experiment_type="reward_network_iii-test",
                            n_sessions_per_generation=30)


def test_create_trials():
    pass
