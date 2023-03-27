import json
import random
from pathlib import Path

from models.network import Network
from models.session import Session
from models.trial import Trial, Solution, WrittenStrategy
from utils.utils import estimate_solution_score, estimate_average_player_score

network_data = json.load(open(Path('data') / 'networks.json'))
solutions = json.load(open(Path('data') / 'solutions_loss.json'))


async def simulate_data(generation, config):
    # fill generations with mock sessions
    for gen_ind in range(generation):
        gen = await Session.find(Session.generation == gen_ind).to_list()

        for s in gen:

            trials = []
            n_trial = 0
            # Individual trial
            for i in range(config.n_individual_trials):
                network = Network.parse_obj(
                    network_data[random.randint(0, network_data.__len__() - 1)])
                moves = [s for s in solutions if s['network_id'] == network.network_id][0]['moves']
                moves[0] = network.starting_node
                ind_trial = Trial(
                    id=n_trial,
                    trial_type='individual',
                    network=network,
                    solution=Solution(
                        moves=moves,
                        score=estimate_solution_score(network, moves)
                    )
                )
                # update the starting node
                ind_trial.network.nodes[ind_trial.network.starting_node].starting_node = True
                trials.append(ind_trial)
                n_trial += 1

            # Demonstration trial
            for i in range(config.n_demonstration_trials):
                network = Network.parse_obj(
                    network_data[random.randint(0, network_data.__len__() - 1)])
                moves = [s for s in solutions if s['network_id'] == network.network_id][0]['moves']
                moves[0] = network.starting_node
                dem_trial = Trial(
                    id=n_trial,
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
                n_trial += 1

            # Written strategy
            trials.append(Trial(
                id=n_trial,
                trial_type='written_strategy',
                written_strategy=WrittenStrategy(strategy=''))
            )

            s.trials = trials
            s.finished = True
            s.available = False
            s.unfinished_parents = 0
            s.average_score = estimate_average_player_score(s)
            await s.save()
    gen = await Session.find(Session.generation == generation).to_list()
    for s in gen:
        s.available = True
        await s.save()
