import json
import random
from pathlib import Path

from models.config import ExperimentSettings
from models.network import Network
from models.session import Session
from models.trial import Trial, Solution, WrittenStrategy
from utils.utils import estimate_solution_score

network_data = json.load(open(Path('data') / 'train_viz.json'))
solutions = json.load(
    open(Path('data') / 'solution_moves_take_first_loss_viz.json'))

config = ExperimentSettings()


async def simulate_data(generation):
    # fill generations with mock sessions
    for gen_ind in range(generation):
        gen = await Session.find(Session.generation == gen_ind).to_list()

        for s in gen:

            trials = []

            # Demonstration trial
            for i in range(config.n_demonstration_trials):
                moves = [0, 5, 3, 4, 0, 5, 6, 7, 9]
                network = Network.parse_obj(
                    network_data[random.randint(0, network_data.__len__() - 1)])
                moves = \
                    [s for s in solutions if
                     s['network_id'] == network.network_id][
                        0]['moves']
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
                id=config.n_demonstration_trials + 1,
                trial_type='written_strategy',
                written_strategy=WrittenStrategy(strategy=''))
            )

            s.trials = trials
            s.finished = True
            s.available = False
            s.unfinished_parents = 0
            await s.save()
    gen = await Session.find(Session.generation == generation).to_list()
    for s in gen:
        s.available = True
        await s.save()
