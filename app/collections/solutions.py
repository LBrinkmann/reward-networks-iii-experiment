from app.db import get_collection
import uuid


s_coll = get_collection('solutions')


def add_solutions(solutions, game):
    solutions = [{**s, **game} for s in solutions]
    s_coll.insert_many(solutions)


def get_solutions(chain_id, chain_pos, n):
    solutions = s_coll.find({'chainId': chain_id, 'chainPos': chain_pos},
                            sort={'solutionIdx': 1}, limit=n)
    return solutions
