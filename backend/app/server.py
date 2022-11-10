import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette_exporter import PrometheusMiddleware, handle_metrics

from database.connection import DatabaseSettings
from routes.admin import admin_router
from routes.progress import progress_router
from routes.results import results_router
from routes.session import session_router
from study_setup.generate_sessions import generate_experiment_sessions

api = FastAPI()

# metrics on the /metrics endpoint for prometheus
api.add_middleware(PrometheusMiddleware)
api.add_route("/metrics", handle_metrics)

# load settings
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
api.include_router(admin_router, prefix="/admin")


@api.on_event("startup")
async def startup_event():
    # initialize database
    await db_settings.initialize_database()

    # generate sessions
    await generate_experiment_sessions()

    # run only in development mode
    generate_frontend_types()
    draw_db_diagram()


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
        from models.config import ExperimentSettings

        diagram = erd.create(Subject)
        diagram.draw("models/subject.png", args='-Gdpi=300')

        diagram = erd.create(Session)
        diagram.draw("models/session.png", args='-Gdpi=300')

        diagram = erd.create(ExperimentSettings)
        diagram.draw("models/config.png", args='-Gdpi=300')
