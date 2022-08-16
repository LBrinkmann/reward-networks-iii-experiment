import datetime
import random

from fastapi import APIRouter

from models.session import Session
from models.subject import Subject
from study_setup.generate_sessions import generate_sessions

from httpx import AsyncClient
import asyncio

import server

simulation_router = APIRouter(tags=["Simulation"])


@simulation_router.get('/{experiment_type}/{experiment_num}')
async def get_study_simulation(# seconds_per_subject: float = 0.5,
                               n_subjects: int = 10,
                               experiment_type: str = 'reward_network_iii',
                               experiment_num: int = 0,
                               generate_new_sessions: bool = False,
                               n_trials_per_session: int =10,
                               n_gen: int = 5,
                               n_s_per_gen: int = 10,
                               n_adv: int = 5):
    random.seed(42)
    if generate_new_sessions:
        await Session.find().delete()
        await Subject.find().delete()
        await generate_sessions(n_generations=n_gen,
                                n_sessions_per_generation=n_s_per_gen,
                                n_trials_per_session=n_trials_per_session,
                                n_advise_per_session=n_adv,
                                experiment_type=experiment_type,
                                experiment_num=experiment_num)

    base_url = "http://testserver/"

    headers = {
        "Content-Type": "application/json",
    }
    tasks = []
    for ii in range(2):
        for i in range(n_subjects):
            subj = i + 10 * ii
            task = asyncio.create_task(
                one_subject(base_url, headers, subj, n_trials_per_session))
            tasks.append(task)
            await asyncio.sleep(0.5)
        [await t for t in tasks]

    return {'done': True}


async def one_subject(base_url, headers, subj: int, n_trials_per_session: int):
    for t in range(n_trials_per_session):
        await one_subject_trial(base_url, headers, subj)


async def one_subject_trial(base_url, headers, subj: int):
    async with AsyncClient(app=server.api, base_url=base_url) as ac:
        url = f'/session/prolific_id_{subj}'
        print(f'subject: {subj}; time: {datetime.datetime.now().time()}')
        response = await ac.get(url)
        # TODO: fix this
        # trial = Trial.parse_obj(response.json())
        # trial.solution = Solution(moves=[0, 1, 2, 3])
        # print(trial.json())
        trial = response.json()

        # wait for seconds_per_subject seconds
        trial_time = random.randint(2, 5)
        await asyncio.sleep(trial_time)
        print(f'subject: {subj}; trial num:{trial["trial_num_in_session"]}; '
              f'trial time {trial_time}; '
              f'time: {datetime.datetime.now().time()}')

        response = await ac.put(url, json=trial, headers=headers)
        # print(response.json())

