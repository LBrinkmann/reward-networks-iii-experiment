from .utils import load_json

env = load_json('app/data/select_environments.json')
env_by_id = {e['environmentId']: e for e in env}


def get_all_ids():
    return [e['environmentId'] for e in env[:3]]


def get_by_id(environment_id):
    return env_by_id[environment_id]
