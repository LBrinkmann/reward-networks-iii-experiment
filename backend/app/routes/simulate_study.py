from fastapi import APIRouter

from models.session import Session
from models.subject import Subject
from models.trial import Solution, Trial
from study_setup.generate_sessions import generate_sessions

from httpx import AsyncClient
import asyncio

import server

simulation_router = APIRouter(tags=["Simulation"])


@simulation_router.get('/{experiment_type}/{experiment_num}')
async def get_study_simulation(seconds_per_subject: float = 0.5,
                               n_subjects: int = 10,
                               experiment_type: str = 'reward_network_iii',
                               experiment_num: int = 0,
                               generate_new_sessions: bool = False):
    if generate_new_sessions:
        await Session.find().delete()
        await Subject.find().delete()
        await generate_sessions(experiment_type=experiment_type,
                                experiment_num=experiment_num)
    base_url = "http://testserver/"
    headers = {
        "Content-Type": "application/json",
    }
    for i in range(n_subjects):
        async with AsyncClient(app=server.api, base_url=base_url) as ac:
            for t in range(10):
                url = f'/session/prolific_id_{i}'
                response = await ac.get(url)
                # TODO: fix this
                # trial = Trial.parse_obj(response.json())
                # trial.solution = Solution(moves=[0, 1, 2, 3])
                # print(trial.json())
                trial = response.json()
                response = await ac.put(url, json=trial, headers=headers)

                print(response.json())

        # wait for seconds_per_subject seconds
        await asyncio.sleep(seconds_per_subject)



    return {'done': True}
