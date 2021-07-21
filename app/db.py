import pymongo
import os

MONGO_URL = os.environ.get('MC_MONGO_URL', "mongodb://localhost:3002/")


def get_database(db_name='reward-network-ii'):
    client = pymongo.MongoClient(MONGO_URL)
    db = client[db_name]
    return db


def get_collection(collection, db_name='reward-network-ii'):
    db = get_database(db_name)
    return db[collection]
