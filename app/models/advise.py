from typing import List, Optional, Literal, Any
from app.models.base import ExtBaseModel, SnakeModel, PyObjectId


class Explanation(SnakeModel):
    type: Literal['table', 'text']
    content: Any


class HumanExplanation(ExtBaseModel):
    explanation_id: Optional[PyObjectId] = None
    user_id: PyObjectId
    game_id: PyObjectId
    type: Literal['text']
    content: str


class AdviseRequest(SnakeModel):
    environment_id: str
    move: int
    node_idx: int
    user_id: PyObjectId
    game_id: PyObjectId
    advisor: str
    playout: bool
    total_reward: int


class EvaluatedAction(SnakeModel):
    action_idx: int
    advise: Literal['not_recommended', 'indifferent', 'recommended']
    expected_reward: Optional[float]
    playout: Optional[List[int]]


class Advise(ExtBaseModel):
    advise_id: Optional[PyObjectId] = None
    environment_id: str
    move: int
    node_idx: int
    user_id: PyObjectId
    game_id: PyObjectId
    actions: List[EvaluatedAction]
