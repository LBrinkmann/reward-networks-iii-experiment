from fastapi import Depends, APIRouter
from fastapi.security import HTTPBasicCredentials

from models.config import ExperimentSettings
from routes.security_utils import get_user

admin_router = APIRouter(tags=["Admin"])


@admin_router.get("/config")
async def get_config(user: HTTPBasicCredentials = Depends(get_user)):
    config = await ExperimentSettings.find_one()

    # remove sensitive data
    if config.BACKEND_PASSWORD:
        del config.BACKEND_PASSWORD

    # return config in json format
    return config.dict()
