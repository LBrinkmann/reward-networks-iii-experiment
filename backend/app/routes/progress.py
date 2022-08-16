from fastapi import APIRouter
from starlette.responses import FileResponse

from models.session import Session
from progress_visualization.study_overview import create_sessions_network
from study_setup.generate_sessions import generate_sessions

progress_router = APIRouter(tags=["Progress"])


# view study progress
@progress_router.get('/{experiment_type}/{experiment_num}')
async def get_progress(experiment_type: str, experiment_num: int,
                       generate_new_sessions='false'):
    if generate_new_sessions == 'true':
        await Session.find().delete()
        await generate_sessions(experiment_type=experiment_type,
                                experiment_num=experiment_num)
    file_path = await create_sessions_network(experiment_type, experiment_num)
    # return html document with the progress graph
    return FileResponse(file_path)
