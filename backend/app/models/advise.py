from typing import List, Optional, Literal, Union

from pydantic import BaseModel


class Table(BaseModel):
    columns: List[str]
    index: List[str]
    column_name: str
    index_name: str
    data: List[List[float]]


replay = List[int]


class Explanation(BaseModel):
    type: Literal[
        'table', 'text', 'playout', 'expectedReward', 'placeholder', 'replay', 'title']
    content: Optional[Union[Table, str, replay]]


class HumanExplanation(BaseModel):
    user_id: str
    game_id: str
    type: Literal['text']
    content: str


class AdviseRequest(BaseModel):
    environment_id: str
    move: int
    node_idx: int
    user_id: str
    game_id: str
    advisor: str
    playout: bool
    total_reward: int
    phase: str


class EvaluatedAction(BaseModel):
    action_idx: int
    advise: Literal['not_recommended', 'indifferent', 'recommended']
    expected_reward: Optional[float]
    playout: Optional[List[int]]
    move: int


class Advise(BaseModel):
    environment_id: str
    move: int
    node_idx: int
    user_id: str
    session_id: str
    actions: List[EvaluatedAction]
