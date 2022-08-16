import datetime
from typing import Optional, List

from pydantic import BaseModel


class Node(BaseModel):
    node_idx: int
    display_name: str
    x: float
    y: float
    source_edge_idx: List[int]

    @classmethod
    def parse(cls, node, edge):
        source_edge_idx = [
            e.edge_idx for e in edge if e.source_idx == node['id']]
        return cls(
            node_idx=node['id'],
            display_name=node['displayName'],
            x=node['x'],
            y=node['y'],
            action_idx=source_edge_idx)

    class Config:
        schema_extra = {
            "example":
                {
                    {
                        "id": 0,
                        "displayName": "A",
                        "x": 0.7,
                        "y": 0.2,
                        "actionIdx": [0, 1, 2]
                    },
                }
        }


class EdgeType(BaseModel):
    action_type_idx: int
    reward: int

    EDGE_TYPES = [
        {'edgeType': 0, 'reward': -100},
        {'edgeType': 1, 'reward': -20},
        {'edgeType': 2, 'reward': 20},
        {'edgeType': 3, 'reward': 140}
    ]


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

    class Config:
        schema_extra = {
            "example":
                {
                    {},
                }
        }


class Network(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    edge_types: List[EdgeType]


class Trial(BaseModel):
    trial_num_in_session: int
    started: Optional[datetime.datetime]
    finished: Optional[datetime.datetime]
    network: Optional[Network]
