from fastapi import APIRouter
from starlette.responses import FileResponse

from models.session import Session
from progress_visualization.study_overview import create_sessions_network

progress_router = APIRouter(tags=["Progress"])


# view study progress
@progress_router.get('/')
async def get_progress():
    file_path = create_sessions_network()
    # return html document with the progress graph
    return FileResponse(file_path)

