from typing import List, Optional, Literal, Any, Union
from .base import ExtBaseModel, SnakeModel, PyObjectId


class Table(SnakeModel):
    columns: List[str]
    index: List[str]
    column_name: str
    index_name: str
    data: List[List[float]]

replay = List[int]


class Explanation(SnakeModel):
    type: Literal['table', 'text', 'playout', 'expectedReward', 'placeholder', 'replay', 'title']
    content: Optional[Union[Table, str, replay]]


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
    phase: str


class EvaluatedAction(SnakeModel):
    action_idx: int
    advise: Literal['not_recommended', 'indifferent', 'recommended']
    expected_reward: Optional[float]
    playout: Optional[List[int]]
    move: int


class Advise(ExtBaseModel):
    advise_id: Optional[PyObjectId] = None
    environment_id: str
    move: int
    node_idx: int
    user_id: PyObjectId
    game_id: PyObjectId
    actions: List[EvaluatedAction]
