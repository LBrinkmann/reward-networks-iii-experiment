from fastapi import APIRouter

from models.session import Session
from routes.session import get_current_trial
from study_setup.generate_sessions import generate_sessions

simulation_router = APIRouter(tags=["Simulation"])


@simulation_router.get('/{experiment_type}/{experiment_num}')
async def get_study_simulation(seconds_per_subject: float = 2,
                               n_subjects: int = 10,
                               experiment_type: str = 'reward_networks_iii',
                               experiment_num: int = 0,
                               generate_new_sessions: bool = False):
    if generate_new_sessions:
        await Session.find().delete()
        await generate_sessions(experiment_type=experiment_type,
                                experiment_num=experiment_num)
    # trial = await get_current_trial('prolific_id')

    return {'done': True}
