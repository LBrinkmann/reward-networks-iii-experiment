from fastapi import APIRouter

from ..advisor import init_advisor
from ..experiment.utils import load_experiments
from ..models.advise import AdviseRequest, Advise
# from ..server import ENVIRONMENTS, ADVISOR
from ..models.environment import Environment
from ..models.experiment import Experiment

advise_router = APIRouter(
    tags=["Advise"],
)

@advise_router.post('/')
async def post_advise(ad_request: AdviseRequest) -> Advise:
    if ad_request.phase == 'none':
        return None
    else:
        # environment = ENVIRONMENTS[ad_request.environment_id]
        # advise = ADVISOR[ad_request.advisor].advise(environment, ad_request)
        experiment = Experiment.get(active=True)
        environment = Environment.read_file(experiment.environments_path)
        environment = environment[ad_request.environment_id]
        advisor = init_advisor(experiment)
        advise = advisor[ad_request.advisor].advise(environment, ad_request)
        return advise
