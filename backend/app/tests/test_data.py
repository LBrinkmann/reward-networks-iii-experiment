import json
from pathlib import Path

from models.network import Network
from utils.utils import estimate_solution_score


def test_network_solutions():
    networks_json = json.load(open(Path('data') / 'networks.json'))
    networks = [Network.parse_obj(n) for n in networks_json]
    solutions = json.load(open(Path('data') / 'solutions_loss.json'))

    ids = [s['network_id'] for s in solutions]

    for n in networks:
        assert n.network_id in ids
        moves = [s for s in solutions if s['network_id'] == n.network_id][0]['moves']
        moves[0] = n.starting_node

        # check that all moves are valid
        assert estimate_solution_score(n, moves) != -100_000
