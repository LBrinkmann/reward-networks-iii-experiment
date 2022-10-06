# SEE: https://github.com/PacktPublishing/Building-Python-Web-APIs-with-FastAPI
import asyncio

import httpx
import pytest
from httpx import AsyncClient

from database.connection import Settings
from models.session import Session
from models.subject import Subject
from server import api


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()


async def init_db():
    test_settings = Settings()
    #test_settings.MONGO_URL = "mongodb://localhost:27017/testdb"
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
