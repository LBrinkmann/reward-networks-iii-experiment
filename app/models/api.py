from pydantic import BaseModel
from app.models.base import ExtBaseModel, PyObjectId, SnakeModel
from app.models import (
    Environment, Solution, User, Explanation, HumanExplanation)
from typing import Optional, List
from app.models.experiment import Treatment
from app.models.game import Game

from app.models.step import Step

class StepResult(ExtBaseModel):
    step_result_id: Optional[PyObjectId] = None
    step_id: PyObjectId
    points: int = 0
    solution: Optional[Solution]
    explanation: Optional[HumanExplanation]

class StateUpdate(SnakeModel):
    environment: Optional[Environment]
    explanations: Optional[List[Explanation]]
    step: Step

class StepPreview(SnakeModel):
    step_id: PyObjectId
    phase: str
    phase_step: int

class State(StateUpdate):
    user: User
    game: Game
    treatment: Treatment
    steps: List[StepPreview]
