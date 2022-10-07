# SEE: https://github.com/PacktPublishing/Building-Python-Web-APIs-with-FastAPI
import asyncio

import httpx
import pytest
from httpx import AsyncClient

from database.connection import Settings
from models.session import Session
from models.subject import Subject
from server import api
from study_setup.generate_sessions import generate_sessions


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()


async def init_db():
    test_settings = Settings()
    test_settings.MONGO_URL = "mongodb://localhost:27017"
    test_settings.APP_NAME = "reward-network-iii-test"

    await test_settings.initialize_database()


@pytest.fixture(scope="session")
async def default_client():
    await init_db()
    async with AsyncClient(app=api, base_url="http://testserver/") as client:
        yield client

        # Clean up resources
        await Session.find().delete()
        await Subject.find().delete()


@pytest.fixture(scope="function")
async def create_empty_experiment(default_client: httpx.AsyncClient):
    await generate_sessions(experiment_type='reward_network_iii',
                            n_advise_per_session=5,
                            n_generations=2,
                            n_sessions_per_generation=20,
                            num_ai_players=3)
