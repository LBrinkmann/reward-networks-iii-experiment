import json
import random
from pathlib import Path

from fastapi import APIRouter

from models.network import Network
from models.session import Session
from models.subject import Subject
from models.trial import Trial, Solution, WrittenStrategy
from utils.utils import estimate_solution_score
from study_setup.generate_sessions import generate_sessions

simulation_router = APIRouter(tags=["Simulation"])
test_network_data = json.load(
    open(Path('tests') / 'data' / 'test_network.json'))
n_demonstration_trials = 3


@simulation_router.get('/{experiment_num}')
async def get_study_simulation(experiment_num: int = 0,
                               new_sessions: bool = False,
                               generation: int = 0):
    """ http://localhost:5000/simulation/0?new_sessions=true&generation=0 """
    random.seed(42)
    if new_sessions:
        await Session.find().delete()
        await Subject.find().delete()
        await generate_sessions(n_generations=5,
                                n_sessions_per_generation=20,
                                n_advise_per_session=5,
                                experiment_type='reward_network_iii',
                                experiment_num=experiment_num)
    if generation != 0:
        await simulate_data(generation)

    return {'done': True}


async def simulate_data(generation):
    # fill generations with mock sessions
    for gen_ind in range(generation):
        gen = await Session.find(Session.generation == gen_ind).to_list()

        for s in gen:

            trials = []

            # Demonstration trial
            for i in range(n_demonstration_trials):
                moves = [0, 5, 3, 4, 0, 5, 6, 7, 9]
                network = Network.parse_obj(test_network_data)
                dem_trial = Trial(
                    id=i,
                    trial_type='demonstration',
                    network=network,
                    solution=Solution(
                        moves=moves,
                        score=estimate_solution_score(network, moves)
                    )
                )
                # update the starting node
                dem_trial.network.nodes[
                    dem_trial.network.starting_node].starting_node = True
                trials.append(dem_trial)

            # Written strategy
            trials.append(Trial(
                id=n_demonstration_trials + 1,
                trial_type='written_strategy',
                written_strategy=WrittenStrategy(strategy=''))
            )

            s.trials = trials
            s.finished = True
            s.available = False
            await s.save()
    gen = await Session.find(Session.generation == generation).to_list()
    for s in gen:
        s.available = True
        await s.save()
