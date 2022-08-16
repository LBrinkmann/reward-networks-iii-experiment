import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.connection import Settings
# from routes.advise import advise_router
from routes.progress import progress_router
# from routes.results import results_router
from routes.session import session_router
from routes.simulate_study import simulation_router

if os.getenv('GENERATE_FRONTEND_TYPES', default='false') == 'true':
    from pydantic2ts import generate_typescript_defs

api = FastAPI()

settings = Settings()

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
# api.include_router(advise_router, prefix="/advise")
# api.include_router(results_router, prefix="")

# Only for testing purposes
api.include_router(simulation_router, prefix="/simulation")


@api.on_event("startup")
async def startup_event():
    # initialize database
    await settings.initialize_database()

    # generate frontend types
    if os.getenv('GENERATE_FRONTEND_TYPES', default='false') == 'true':
        path = os.getenv('FOLDER_TO_SAVE_FRONTEND_TYPES', default='frontend')
        generate_typescript_defs(
            'app.models', os.path.join(path, 'apiTypes.ts'))
