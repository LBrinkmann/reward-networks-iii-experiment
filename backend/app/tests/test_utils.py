import pytest

from models.network import Network
from utils.utils import estimate_solution_score


@pytest.mark.xfail
def test_estimate_solution_score():
    # TODO: change the test data
    network = Network.parse_file('tests/data/test_network.json')
    moves = [0, 5, 3, 4, 0, 5, 6, 7, 9]
    score = estimate_solution_score(network, moves)
    assert score == -240

    moves = [0]
    score = estimate_solution_score(network, moves)
    assert score == -800
