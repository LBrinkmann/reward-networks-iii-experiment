from fastapi import Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from starlette.status import HTTP_401_UNAUTHORIZED

from models.config import ExperimentSettings

# load settings
config = ExperimentSettings()

# protect some routes with basic auth
security = HTTPBasic()


def get_user(credentials: HTTPBasicCredentials = Depends(security)):
    if credentials.username != config.BACKEND_USER or \
            credentials.password != config.BACKEND_PASSWORD:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username
