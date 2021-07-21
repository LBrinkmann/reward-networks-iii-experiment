import json
import logging
import sys
import uuid
from flask import Flask, request
from flask_cors import CORS

from .collections.game import check_experiment, get_game, create_chains
from .collections.user import check_user, add_user
from .collections.app import set_setting, get_setting
from .collections.solutions import get_solutions, add_solutions
from .environments import get_all_ids, get_by_id


logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger(__name__)


# Log to stderr, where it will be delivered to ElasticSearch.
# `data` should be JSON serializable.

def log(data):
    print(json.dumps(data), file=sys.stderr)


app = Flask(__name__)
CORS(app)
EXPERIMENT_NAME = get_setting('experiment_name')


@app.route("/set_experiment/<name>", methods=['GET'])
def set_experiment(name):
    global EXPERIMENT_NAME
    if not check_experiment(name):
        return f"Experiment does not exists."
    else:
        set_setting('experiment_name', name)
        EXPERIMENT_NAME = name
        return f"Active experiment {name}"


@app.route("/new_experiment/<name>", methods=['GET'])
def new_experiment(name):
    print(check_experiment(name), name)
    if not check_experiment(name):
        env_ids = get_all_ids()
        create_chains(name, 1, ['control', 'hybrid'], env_ids, 5)
        return f"Experiment created."
    else:
        return f"Experiment exists."


@app.route("/game/<prolific_id>", methods=['GET'])
def game(prolific_id):

    if not prolific_id == 'test' and check_user(prolific_id):
        return {'userExist': True}
    else:
        user_id = add_user(prolific_id)
        game = get_game(EXPERIMENT_NAME, user_id)
        environment = get_by_id(game['environmentId'])
        if game['chainPos'] > 0:
            prev_solutions = get_solutions(
                chain_id=game['chainId'], chain_pos=game['chainPos'] - 1, n=2)
        else:
            prev_solutions = []

    print(user_id)

    respond = {
        "game": game,
        'environment': environment,
        'userId': str(user_id),
        'prevSolutions': prev_solutions,
        'userExist': False}
    print(respond)
    return respond


@app.route("/save_game", methods=['POST'])
def save_game():

    input = request.get_json()

    solutions = input['solutions']
    game = input['game']

    # verify solutions

    add_solutions(solutions, game)


if __name__ == '__main__':
    app.run(debug=True)
