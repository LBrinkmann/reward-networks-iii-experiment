from typing import List

from fastapi import Depends, APIRouter
from fastapi.security import HTTPBasicCredentials

from models.session import Session
from models.subject import Subject
from routes.security_utils import get_user

results_router = APIRouter(tags=["Results"])


@results_router.get('/sessions')
async def get_results(
        user: HTTPBasicCredentials = Depends(get_user)) -> List[Session]:
    sessions = await Session.find().to_list()
    # return html document with the progress graph
    return sessions


@results_router.get('/subjects')
async def get_results(
        user: HTTPBasicCredentials = Depends(get_user)) -> List[Subject]:
    subjects = await Subject.find().to_list()
    # return html document with the progress graph
    return subjects
