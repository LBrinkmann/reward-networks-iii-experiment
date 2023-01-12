from fastapi import Depends, APIRouter
from fastapi.security import HTTPBasicCredentials
from starlette.responses import FileResponse

from progress_visualization.study_overview import create_sessions_network
from routes.security_utils import get_user

progress_router = APIRouter(tags=["Progress"])


# view study progress
@progress_router.get('/')
async def get_progress(experiment_num: int = 0,
                       user: HTTPBasicCredentials = Depends(get_user)):
    """
    http://localhost:5000/progress
    or
    http://localhost:5000/progress/?experiment_num=0
    """
    try:
        file_path = await create_sessions_network(experiment_num)
        # return html document with the progress graph
        return FileResponse(file_path)
    except Exception as e:
        print(e)
        return "Error: " + str(e)
