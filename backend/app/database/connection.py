from typing import Optional

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseSettings

from models.session import Session
from models.subject import Subject


class DatabaseSettings(BaseSettings):
    # reading variables from the deployment environment
    MONGO_URL: Optional[str] = 'mongodb://localhost:3002/'
    DATABASE_NAME: str = 'reward-network-iii'

    async def initialize_database(self):
        client = AsyncIOMotorClient(self.MONGO_URL)
        await init_beanie(
            database=client[self.DATABASE_NAME],
            document_models=[
                Session,
                Subject
            ])
