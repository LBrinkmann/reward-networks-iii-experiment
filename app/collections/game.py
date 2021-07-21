from app.db import get_collection
import pymongo
import datetime
import uuid

g_coll = get_collection('game')


def check_experiment(experiment_name):
    res = g_coll.find({'experimentName': experiment_name})
    return res.count()


def create_chains(experiment_name, n_identical, treatments, environment_ids, chain_length):
    games = [
        {'experimentName': experiment_name, 'idx': idx, 'treatment': treatment, 'environmentId': env_id, 'chainId': str(uuid.uuid4()),
         'locked': False, "createdAt": datetime.datetime.now()}
        for idx in range(n_identical)
        for treatment in treatments
        for env_id in environment_ids
    ]

    games = [{**g, 'rank': i*chain_length+chain_pos, 'chainPos': chain_pos}
             for i, g in enumerate(games) for chain_pos in range(chain_length)]

    g_coll.insert_many(games)


def get_game(experiment_name, user_id):
    game = g_coll.find_one_and_update({'experimentName': experiment_name}, {"$set": {
        'userId': user_id, 'started': datetime.datetime.now(), 'locked': True}}, sort=[('rank', 1)],
        return_document=pymongo.ReturnDocument.AFTER)
    game = {**game, 'gameId': str(game['_id']), '_id': None, 'userId': str(game['userId'])}
    return game
