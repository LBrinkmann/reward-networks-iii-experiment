from fastapi.exceptions import HTTPException

from fastapi import APIRouter

from ..advisor import init_advisor
from ..models.advise import Explanation
from ..models.api import StepResult, StateUpdate
from ..models.environment import Environment
from ..models.experiment import Experiment, Treatment
from ..models.game import Game
from ..models.step import Step
# from ..server import EXPERIMENT, ENVIRONMENTS, ADVISOR
from .experiment import check_experiment

results_router = APIRouter(
    tags=["Results"],
)


@results_router.post('/step_result')
async def post_step_result(s_result: StepResult):
    # check_experiment()
    current_step = Step.get(s_result.step_id)
    if not current_step.current:
        raise HTTPException(status_code=404,
                            detail='Posted step is not the current step.')
    if s_result.solution:
        s_result.solution.flush()
    if s_result.explanation:
        s_result.explanation.flush()

    next_step = Step.next(current_step)
    game = Game.get(current_step.game_id)
    game.total_points += s_result.points
    game.flush()
    experiment = Experiment.get(active=True)
    if next_step:
        # treatment = EXPERIMENT.treatments[game.treatment_name]
        treatment = experiment.treatments[game.treatment_name]
        resp = argument_step(game, treatment, next_step)
        return StateUpdate(step=next_step, game=game, **resp)
    else:
        raise HTTPException(status_code=404, detail='No further step avaible.')


def argument_step(game: Game, treatment: Treatment, step: Step):
    if step is None:
        return {}
    data = {}
    experiment = Experiment.get(active=True)
    if step.phase == 'tutorial':

        # environment = ENVIRONMENTS[game.environment_ids[0]]
        environment = Environment.read_file(experiment.environments_path)
        environment = environment[game.environment_ids[0]]
        data['environment'] = environment
        data['explanations'] = [
            Explanation(type='text', content='Some explanation.')]
    else:
        environment = Environment.read_file(experiment.environments_path)
        environment = environment[step.environment_id]
        advisor = init_advisor(experiment)
        # environment = ENVIRONMENTS[step.environment_id]
        # expanation = ADVISOR[treatment.advisor].explanation(
        #     game=game, environment=environment, explanation_type=step.phase)
        explanation = advisor[treatment.advisor].explanation(
            game=game, environment=environment, explanation_type=step.phase)
        data['explanations'] = explanation
        data['environment'] = environment
    return data
