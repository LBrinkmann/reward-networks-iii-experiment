from fastapi import APIRouter

from ..models.api import State
from ..models.experiment import Experiment
from ..models.game import Game
from ..models.step import Step
from ..models.user import User
from .results import argument_step

session_router = APIRouter(
    tags=["Session"],
)

@session_router.get('/games/{experiment_name}')
async def get_games(experiment_name):
    experiment = Experiment.get(experiment_name=experiment_name)
    return Game.get_many(experiment_id=experiment.id)


@session_router.get('/game/{prolific_id}', response_model_by_alias=False)
async def get_game(prolific_id):
    # check_experiment()
    EXPERIMENT = Experiment.get(active=True)
    user = User.get(prolific_id=prolific_id, experiment_id=EXPERIMENT.id)
    if not user:
        user = User(prolific_id=prolific_id,
                    experiment_id=EXPERIMENT.id).flush()
        game = Game.assign(experiment_id=EXPERIMENT.id, user_id=user.id)
    else:
        game = Game.get(experiment_id=EXPERIMENT.id, user_id=user.id)
    steps = Step.get_many(game_id=game.id)
    step = Step.get(game_id=game.id, current=True)
    treatment = EXPERIMENT.treatments[game.treatment_name]

    return State(**{
        "user": user,
        "game": game,
        "treatment": treatment,
        "steps": [{'stepId': s.id, 'phase': s.phase, 'phaseStep': s.phase_step}
                  for s in steps],
        "step": step,
        **argument_step(game, treatment, step)
    })