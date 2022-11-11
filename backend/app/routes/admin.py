from datetime import datetime

from fastapi import Depends, APIRouter
from fastapi.security import HTTPBasicCredentials

from models.config import ExperimentSettings
from routes.security_utils import get_user
from study_setup.generate_sessions import generate_experiment_sessions

admin_router = APIRouter(tags=["Admin"])


@admin_router.get("/config")
async def get_config(user: HTTPBasicCredentials = Depends(get_user)):
    config = await ExperimentSettings.find_one(
        ExperimentSettings.active == True)

    # return config in json format
    return config.dict()


@admin_router.post("/config")
async def update_config(new_config: ExperimentSettings,
                        user: HTTPBasicCredentials = Depends(get_user)):
    config = await ExperimentSettings.find_one(
        ExperimentSettings.active == True)

    # check the experiment type
    if config.experiment_type == new_config.experiment_type and \
            new_config.rewrite_previous_data == False:
        # await config.update(new_config.dict())
        # return error if the experiment type is the same
        return {
            "error": "Experiment type was not changed and rewrite_previous_data"
                     " is False."}

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
