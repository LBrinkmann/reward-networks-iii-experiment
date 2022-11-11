from datetime import datetime

from fastapi import Depends, APIRouter
from fastapi.security import HTTPBasicCredentials
from starlette.requests import Request

from models.config import ExperimentSettings
from routes.security_utils import get_user
from study_setup.generate_sessions import generate_experiment_sessions

admin_router = APIRouter(tags=["Admin"])


@admin_router.get("/config")
async def get_config(user: HTTPBasicCredentials = Depends(get_user)):
    config = await ExperimentSettings.find_one(
        ExperimentSettings.active == True)

    # remove sensitive data
    if config.BACKEND_PASSWORD:
        del config.BACKEND_PASSWORD

    # return config in json format
    return config.dict()


@admin_router.post("/config")
async def update_config(new_config: ExperimentSettings,
                        user: HTTPBasicCredentials = Depends(get_user)):
    config = await ExperimentSettings.find_one(
        ExperimentSettings.active == True)
    # update config and make it inactive
    config.active = False
    await config.replace()

    # create a new config
    new_config.active = True
    new_config.created_at = datetime.now()
    await new_config.save()

    # generate sessions
    await generate_experiment_sessions()

    return new_config.dict()
