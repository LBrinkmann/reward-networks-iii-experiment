from cmath import exp
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import HTTPException
from flask import current_app

from app.models import (
    Environment, AdviseRequest, Step, User, Game, Experiment, Treatment,
    StepResult, StateUpdate, State, Advise, Explanation)

from app.advisor import init_advisor
from app.create_experiment import create_chains

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:9000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXPERIMENT = None
ADVISOR = None
ENVIRONMENTS = None

def set_globals(experiment):
    global EXPERIMENT, ADVISOR, ENVIRONMENTS
    EXPERIMENT = experiment
    ADVISOR = init_advisor(experiment)
    ENVIRONMENTS = Environment.read_file(experiment.environments_path)


@app.on_event("startup")
async def startup_event():
    experiment = Experiment.get(active=True)
    if experiment:
        set_globals(experiment)

@app.get('/experiment')
async def get_experiments():
    return Experiment.get_many()

@app.post('/experiment', status_code=201)
async def post_experiment(experiment: Experiment):
    experiment = experiment.flush()
    environments = Environment.read_file(experiment.environments_path)
    create_chains(experiment, environments=environments)
    return experiment.experiment_name


@app.put('/experiment/{experiment_name}/active')
async def put_experiment_active(experiment_name):
    experiment = Experiment.get(experiment_name=experiment_name).set_active()
    set_globals(experiment)
    return experiment


@app.get('/games/{experiment_name}')
async def get_games(experiment_name):
    experiment = Experiment.get(experiment_name=experiment_name)
    return Game.get_many(experiment_id=experiment.id)


@app.get('/game/{prolific_id}', response_model_by_alias=False)
async def get_game(prolific_id):
    user = User.get(prolific_id=prolific_id, experiment_id=EXPERIMENT.id)
    if not user:
        user = User(prolific_id=prolific_id, experiment_id=EXPERIMENT.id).flush()
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
        "steps": [{'stepId': s.id, 'phase': s.phase, 'phaseStep': s.phase_step} for s in steps],
        "step": step,
        **argument_step(game, treatment, step)
    })


def argument_step(game: Game, treatment: Treatment, step: Step):
    if step is None:
        return {}
    data = {}
    if step.phase == 'tutorial':
        environment = ENVIRONMENTS[game.environment_ids[0]]
        data['environment'] = environment
        data['explanations'] = [Explanation(type='text', content='Some explanation.')]
    else:
        environment = ENVIRONMENTS[step.environment_id]
        expanation = ADVISOR[treatment.advisor].explanation(
            game=game, environment=environment, explanation_type=step.phase)
        data['explanations'] = expanation
        data['environment'] = environment
    return data



@app.post('/step_result')
async def post_step_result(s_result: StepResult):
    current_step = Step.get(s_result.step_id)
    if not current_step.current:
        raise HTTPException(status_code=404, detail='Posted step is not the current step.')
    if s_result.solution:
        s_result.solution.flush()
    if s_result.explanation:
        s_result.explanation.flush()
    next_step = Step.next(current_step)
    game = Game.get(current_step.game_id)
    game.total_points += s_result.points
    game.flush()
    if next_step:
        treatment = EXPERIMENT.treatments[game.treatment_name]
        resp = argument_step(game, treatment, next_step)
        return StateUpdate(step=next_step, **resp)
    else:
        raise HTTPException(status_code=404, detail='No further step avaible.')


@app.post('/advise')
async def post_advise(ad_request: AdviseRequest) -> Advise:
    environment = ENVIRONMENTS[ad_request.environment_id]
    advise = ADVISOR[ad_request.advisor].advise(environment, ad_request)
    return advise
