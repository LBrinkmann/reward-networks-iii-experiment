import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.connection import DatabaseSettings
from models.config import ExperimentSettings
from models.session import Session
from models.subject import Subject
from routes.progress import progress_router
from routes.session import session_router
from study_setup.generate_sessions import generate_sessions

api = FastAPI()

# load settings
config = ExperimentSettings()
db_settings = DatabaseSettings(db_name=config.experiment_name)

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


@api.on_event("startup")
async def startup_event():
    # initialize database
    await db_settings.initialize_database()

    # generate sessions
    await generate_experiment_sessions()

    # run only in development mode
    generate_frontend_types()


async def generate_experiment_sessions():
    if config.rewrite_previous_data:
        await Session.find().delete()
        await Subject.find().delete()

    # if the database is empty, generate sessions
    if config.rewrite_previous_data or not await Session.find().to_list():
        for replication in range(config.n_session_tree_replications):
            await generate_sessions(
                n_generations=config.n_individual_trials,
                n_sessions_per_generation=config.n_sessions_per_generation,
                n_advise_per_session=config.n_advise_per_session,
                experiment_type=config.experiment_name,
                experiment_num=replication,
                n_ai_players=config.n_ai_players,
                n_sessions_first_generation=config.n_players_first_generation,
                n_social_learning_trials=config.n_social_learning_trials,
                n_individual_trials=config.n_individual_trials,
                n_demonstration_trials=config.n_demonstration_trials,
            )
    if config.simulate_first_generation:
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
