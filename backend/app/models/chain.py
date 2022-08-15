from .base import ExtBaseModel, PyObjectId
from typing import List, Optional


class Chain(ExtBaseModel):
    chain_id: Optional[PyObjectId] = None
    experiment_id: PyObjectId
    treatment_name: str
    environment_ids: List[str]