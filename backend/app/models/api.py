from .advise import HumanExplanation, Explanation
from .base import ExtBaseModel, PyObjectId, SnakeModel
from typing import Optional, List

from .environment import Environment
from .experiment import Treatment
from .game import Game
from .solution import Solution

from .step import Step
from .user import User


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
    game: Game

class StepPreview(SnakeModel):
    step_id: PyObjectId
    phase: str
    phase_step: int

class State(StateUpdate):
    user: User
    game: Game
    treatment: Treatment
    steps: List[StepPreview]
