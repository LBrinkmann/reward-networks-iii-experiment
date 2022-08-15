from fastapi import APIRouter

experiment_router = APIRouter(
    tags=["Experiment"],
)

@experiment_router.get('/')
async def get_experiments():
    return Experiment.get_many()


@experiment_router.post('/', status_code=201)
async def post_experiment(experiment: Experiment):
    experiment = experiment.flush()
    environments = Environment.read_file(experiment.environments_path)
    create_chains(experiment, environments=environments)
    return experiment.experiment_name


@experiment_router.put('/{experiment_name}/active')
async def put_experiment_active(experiment_name):
    experiment = Experiment.get(experiment_name=experiment_name).set_active()
    # set_globals(experiment)
    return experiment
