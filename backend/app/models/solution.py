from .base import ExtBaseModel, PyObjectId
from .environment import Action
from typing import List, Optional


class Solution(ExtBaseModel):
    solution_id: Optional[PyObjectId] = None
    environment_id: str
    step_id: PyObjectId
    actions: List[Action]
