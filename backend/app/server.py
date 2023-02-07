import os

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from fastapi.security import HTTPBasicCredentials
from starlette_exporter import PrometheusMiddleware, handle_metrics

from database.connection import DatabaseSettings
from models.trial import SessionError
from routes.admin import admin_router
from routes.progress import progress_router
from routes.results import results_router
from routes.security_utils import get_user
from routes.session import session_router
from study_setup.generate_sessions import generate_experiment_sessions

api = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

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


# Routes for testing
@api.get("/session_error/{prolific_id}")
async def get_current_trial(prolific_id: str, error_id: int) -> SessionError:
    if error_id == 0:
        return SessionError(message=f"Prolific ID {prolific_id} already exists")
    elif error_id == 1:
        return SessionError(message="No available sessions")
    elif error_id == 2:
        return SessionError()


@api.on_event("startup")
async def startup_event():
    # initialize database
    await db_settings.initialize_database()

    # generate sessions
    await generate_experiment_sessions()

    # run only in development mode
    generate_frontend_types()
    draw_db_diagram()


# secure swagger ui
# SEE: https://github.com/tiangolo/fastapi/issues/364#issuecomment-789711477
@api.get("/docs")
async def get_documentation(user: HTTPBasicCredentials = Depends(get_user)):
    return get_swagger_ui_html(openapi_url="/openapi.json", title="docs")


# secure swagger ui
# SEE: https://github.com/tiangolo/fastapi/issues/364#issuecomment-789711477
@api.get("/openapi.json")
async def openapi(user: HTTPBasicCredentials = Depends(get_user)):
    return get_openapi(title="FastAPI", version="0.1.0", routes=api.routes)


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
