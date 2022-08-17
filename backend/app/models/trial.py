import datetime
from typing import Optional, List, Literal

from beanie import PydanticObjectId
from pydantic import BaseModel


class Node(BaseModel):
    node_idx: int
    display_name: str
    x: float
    y: float
    source_edge_idx: List[int]


class EdgeType(BaseModel):
    action_type_idx: int
    reward: int


class Edge(BaseModel):
    source_idx: int
    target_idx: int
    edge_idx: int
    edge_type_idx: int

    @classmethod
    def parse(cls, idx, **action):
        return cls(
            source_idx=action['sourceId'],
            target_idx=action['targetId'],
            edge_idx=idx,
            edge_type_idx=action['rewardId'])


class Network(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    edge_types: List[EdgeType]


class Solution(BaseModel):
    moves: List[int]
    trial_id: Optional[PydanticObjectId]
    finished_at: Optional[datetime.datetime]


class Trial(BaseModel):
    trial_num_in_session: int
    trial_type: Optional[Literal['tutorial', 'main']] = 'main'
    finished: Optional[bool] = False
    started_at: Optional[datetime.datetime]
    finished_at: Optional[datetime.datetime]
    network: Optional[Network]
    solution: Optional[Solution]

    class Config:
        orm_mode = True


