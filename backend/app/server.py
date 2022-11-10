import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette_exporter import PrometheusMiddleware, handle_metrics

from database.connection import DatabaseSettings
from models.config import ExperimentSettings
from models.session import Session
from models.subject import Subject
from routes.progress import progress_router
from routes.results import results_router
from routes.session import session_router
from study_setup.generate_sessions import generate_sessions

api = FastAPI()

# metrics on the /metrics endpoint for prometheus
api.add_middleware(PrometheusMiddleware)
api.add_route("/metrics", handle_metrics)

# load settings
config = ExperimentSettings()
db_settings = DatabaseSettings()

api.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
api.include_router(session_router, prefix="/session")
api.include_router(progress_router, prefix="/progress")
api.include_router(results_router, prefix="/results")


@api.on_event("startup")
async def startup_event():
    # initialize database
    await db_settings.initialize_database()

    # generate sessions
    await generate_experiment_sessions()

    # run only in development mode
    generate_frontend_types()
    draw_db_diagram()


async def generate_experiment_sessions():
    configs = await ExperimentSettings.find().to_list()
    if len(configs) == 0:
        # if there are no configs in the database
        # create a new config
        config = ExperimentSettings()
        await config.save()
    else:
        # if there is a config in the database
        config = configs[0]

    if config.rewrite_previous_data:
        await Session.find().delete()
        await Subject.find().delete()

    sessions = await Session.find().first_or_none()

    if sessions is None:
        # if the database is empty, generate sessions
        for replication in range(config.n_session_tree_replications):
            await generate_sessions(
                n_generations=config.N_GENERATIONS,
                n_sessions_per_generation=config.n_sessions_per_generation,
                n_advise_per_session=config.n_advise_per_session,
                experiment_type=config.experiment_type,
                experiment_num=replication,
                n_ai_players=config.n_ai_players,
                n_sessions_first_generation=config.n_sessions_first_generation,
                n_social_learning_trials=config.n_social_learning_trials,
                n_individual_trials=config.n_individual_trials,
                n_demonstration_trials=config.n_demonstration_trials,
            )

        if config.SIMULATE_FIRST_GENERATION:
            from tests.simultate_session_data import simulate_data
            await simulate_data(1)


def generate_frontend_types():
    # generate frontend types
    # environment variables are set in the docker-compose.yml
    if os.getenv('GENERATE_FRONTEND_TYPES', default='false') == 'true':
        from pydantic2ts import generate_typescript_defs
        path = os.getenv('FOLDER_TO_SAVE_FRONTEND_TYPES', default='frontend')
        generate_typescript_defs(
            'app.models.trial', os.path.join(path, 'apiTypes.ts'))


def draw_db_diagram():
    # draw database diagram (for development and documentation)
    # environment variables are set in the docker-compose.yml
    if os.getenv('DRAW_DB_DIAGRAM', default='false') == 'true':
        import erdantic as erd
        from models.subject import Subject
        from models.session import Session

        diagram = erd.create(Subject)
        diagram.draw("models/subject.png", args='-Gdpi=300')

        diagram = erd.create(Session)
        diagram.draw("models/session.png", args='-Gdpi=300')
