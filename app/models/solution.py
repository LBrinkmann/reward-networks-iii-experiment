from app.models.base import ExtBaseModel, PyObjectId
from app.models.environment import Action
from typing import List, Optional


class Solution(ExtBaseModel):
    solution_id: Optional[PyObjectId] = None
    environment_id: str
    step_id: PyObjectId
    actions: List[Action]
