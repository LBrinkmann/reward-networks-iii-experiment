from fastapi import APIRouter

from models.session import Session
from models.subject import Subject
from study_setup.generate_sessions import generate_sessions

from httpx import AsyncClient
import asyncio

import server

simulation_router = APIRouter(tags=["Simulation"])


@simulation_router.get('/{experiment_type}/{experiment_num}')
async def get_study_simulation(seconds_per_subject: float = 2,
                               n_subjects: int = 10,
                               experiment_type: str = 'reward_network_iii',
                               experiment_num: int = 0,
                               generate_new_sessions: bool = False):
    if generate_new_sessions:
        await Session.find().delete()
        await Subject.find().delete()
        await generate_sessions(experiment_type=experiment_type,
                                experiment_num=experiment_num)
    for i in range(n_subjects):
        async with AsyncClient(
                app=server.api, base_url="http://testserver/") as ac:
            response = await ac.get(f'/session/prolific_id_{i}')
            print(response)
            print(response.content)
            print(response.headers)
            print(response.url)
        # wait for seconds_per_subject seconds
        await asyncio.sleep(seconds_per_subject)

    return {'done': True}
