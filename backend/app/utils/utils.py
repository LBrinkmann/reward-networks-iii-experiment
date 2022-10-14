from typing import List

from models.network import Network


def estimate_solution_score(network: Network, moves: List[int]) -> int:
    """ Estimate solution score """
    score = 0
    for m0, m1 in zip(moves[:-1], moves[1:]):
        edge = [e for e in network.edges
                if e.source_num == m0 and e.target_num == m1]
        if len(edge) > 0:
            score += edge[0].reward
        else:
            return -100_000  # invalid move sequence
    return score
