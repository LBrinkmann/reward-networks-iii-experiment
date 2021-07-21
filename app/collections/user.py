from app.db import get_collection
import datetime

u_coll = get_collection('user')


def add_user(prolific_id):
    insert = u_coll.insert_one({
        "prolificId": prolific_id,
        "createdAt": datetime.datetime.now()
    })
    user_id = insert.inserted_id
    return user_id


def check_user(prolific_id):
    res = u_coll.find({'prolificId': prolific_id})
    return res.count() > 0
