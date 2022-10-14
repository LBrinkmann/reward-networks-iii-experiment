from models.network import Network
from utils.utils import estimate_solution_score


def test_estimate_solution_score():
    network = Network.parse_file('tests/data/test_network.json')
    moves = [0, 5, 3, 4, 0, 5, 6, 7, 9]
    score = estimate_solution_score(network, moves)
    assert score == -240
