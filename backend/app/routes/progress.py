from fastapi import APIRouter
from starlette.responses import FileResponse

from progress_visualization.study_overview import create_sessions_network

progress_router = APIRouter(tags=["Progress"])


# view study progress
@progress_router.get('/{experiment_type}/{experiment_num}')
async def get_progress(experiment_type: str, experiment_num: int):
    """http://localhost:5000/progress/reward_network_iii/0"""
    file_path = await create_sessions_network(experiment_type, experiment_num)
    # return html document with the progress graph
    return FileResponse(file_path)
