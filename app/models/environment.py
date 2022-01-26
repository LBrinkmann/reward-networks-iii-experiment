from app.models.base import SnakeModel
from app.utils import load_json
from typing import List


class Node(SnakeModel):
    node_idx: int
    display_name: str
    x: float
    y: float
    action_idx: List[int]

    @classmethod
    def parse(cls, node, actions, version):
        if version == 'v1':
            node_action_idx = [a.action_idx for a in actions if a.source_idx == node['id']]
            return cls(
                nodeIdx=node['id'],
                x=node['x'],
                y=node['y'],
                displayName=node['displayName'],
                actionIdx=node_action_idx)
        else:
            raise ValueError('Unkown version')


class ActionType(SnakeModel):
    action_type_idx: int
    reward: int

class Action(SnakeModel):
    action_idx: int
    source_idx: int
    target_idx: int
    action_type_idx: int

    @classmethod
    def parse(cls, version, idx, **action):
        if version == 'v1':
            return cls(
                sourceIdx=action['sourceId'], targetIdx=action['targetId'], 
                actionTypeIdx=action['rewardId'],
                actionIdx=idx)
        else:
            raise ValueError('Unkown version')

ACTION_TYPES = [
    {'actionTypeIdx': 0, 'reward': -100},
    {'actionTypeIdx': 1, 'reward': -20},
    {'actionTypeIdx': 2, 'reward': 20},
    {'actionTypeIdx': 3, 'reward': 140}
]


class Environment(SnakeModel):
    environment_id: str
    starting_node_idx: int
    nodes: List[Node]
    actions: List[Action]
    action_types: List[ActionType]
    n_moves: int
    max_reward: int

    @staticmethod
    def read_file(network_file):
        envs = load_json(network_file)
        return {e['network_id']: Environment.parse(e) for e in envs}

    @classmethod
    def parse(cls, env, version='v1'):
        actions_sorted = sorted(env['actions'], key=lambda a: (a['sourceId'], a['targetId']))
        actions = [Action.parse(**a, idx=idx, version=version) for idx, a in enumerate(actions_sorted)]
        nodes = [Node.parse(n, actions, version=version) for n in env['nodes']]
        action_types = [ActionType(**at) for at in ACTION_TYPES]
        if version == 'v1':
            environment_id = env['network_id']
            starting_node_idx = env['starting_node']
        else:
            raise ValueError('Unkown version')
        return cls(
            environmentId=environment_id, startingNodeIdx=starting_node_idx, nodes=nodes, 
            actions=actions, actionTypes=action_types, nMoves=env['n_steps'], maxReward=env['max_reward']
        )
