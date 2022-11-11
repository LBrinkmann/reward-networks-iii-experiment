import os

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from starlette.status import HTTP_401_UNAUTHORIZED
from dotenv import load_dotenv

# protect some routes with basic auth
security = HTTPBasic()


async def get_user(credentials: HTTPBasicCredentials = Depends(security)):
    load_dotenv()

    # find an active configuration
    BACKEND_USER = os.getenv("BACKEND_USER")
    BACKEND_PASSWORD = os.getenv("BACKEND_PASSWORD")

    if credentials.username != BACKEND_USER or \
            credentials.password != BACKEND_PASSWORD:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username
