from app.db import get_collection

a_coll = get_collection('app')


def set_setting(name, value):
    a_coll.update({'name': name}, {'value': value, 'name': name}, upsert=True)


def get_setting(name):
    res = a_coll.find_one({'name': name})
    if res is not None:
        return res.get('value')
