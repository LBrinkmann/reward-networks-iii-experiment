# SEE: https://github.com/PacktPublishing/Building-Python-Web-APIs-with-FastAPI
import asyncio

import httpx
import pytest
from httpx import AsyncClient

from database.connection import DatabaseSettings
from models.config import ExperimentSettings
from models.session import Session
from models.subject import Subject
from server import api
from study_setup.generate_sessions import generate_sessions


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def default_client():
    test_settings = DatabaseSettings()
    test_settings.MONGO_URL = "mongodb://localhost:27017"
    test_settings.DATABASE_NAME = 'test-reward-network-iii'

    await test_settings.initialize_database()

    async with AsyncClient(app=api, base_url="http://testserver/") as client:
        yield client

        # Clean up resources
        await Session.find().delete()
        await Subject.find().delete()


@pytest.fixture(scope="session")
async def admin_client():
    async with AsyncClient(app=api, base_url="http://testserver/", auth=('admin', 'admin')) as client:
        yield client


@pytest.fixture(scope="session")
async def e_config(default_client):
    # find an active configuration
    config = await ExperimentSettings.find_one(
        ExperimentSettings.active == True)
    if config is None:
        # if there are no configs in the database
        # create a new config
        config = ExperimentSettings()
        config.active = True
        await config.save()
    return config


@pytest.fixture(scope="function")
async def create_empty_experiment(default_client: httpx.AsyncClient,
                                  e_config: ExperimentSettings):
    for replication in range(e_config.n_session_tree_replications):
        await generate_sessions(
            config_id=e_config.id,
            n_generations=e_config.n_individual_trials,
            n_sessions_per_generation=e_config.n_sessions_per_generation,
            n_advise_per_session=e_config.n_advise_per_session,
            experiment_type=e_config.experiment_type,
            experiment_num=replication,
            n_ai_players=e_config.n_ai_players,
            n_sessions_first_generation=e_config.n_sessions_first_generation,
            n_social_learning_trials=e_config.n_social_learning_trials,
            n_individual_trials=e_config.n_individual_trials,
            n_demonstration_trials=e_config.n_demonstration_trials,
        )
