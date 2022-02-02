from operator import index
from app.models.environment import Environment
from app.models.experiment import Experiment, Treatment
import numpy as np
import pandas as pd
from app.advisor.network_env import NetworkEnvironment
from app.models.advise import Advise, Explanation, AdviseRequest, Table



RECOMMENDATIONS = {
    0: 'not_recommended',
    0.5: 'indifferent',
    1: 'recommended'
}

class QTableAdvisor():
    def __init__(self, experiment: Experiment):
        self.q_table = pd.read_json(experiment.q_table_path, orient='split')
        self.n_moves = len(self.q_table)
        self.rewards = list(self.q_table.columns)

    def explanation(self, *, environment: Environment, explanation_type, **_):
        if explanation_type == 'table':
            return self.table_explanation()
        elif explanation_type == 'rule':
            return self.rule_explanation()
        elif explanation_type == 'play':
            return self.play_explanation(environment)
        elif explanation_type == 'none':
            return self.placeholder_explanation()
        elif explanation_type == 'expectedReward':
            return self.expected_reward_explanation()
        elif explanation_type == 'playout':
            return self.playout_explanation()


    def expected_reward_explanation(self):
        return [Explanation(type='title', content='Expected Reward'), Explanation(type='expectedReward')]


    def placeholder_explanation(self):
        return [Explanation(type='placeholder')]


    def rule_explanation(self):
        text = """
        If you take a large negative value as the first move, you will eventually gain more points. 
        For all later moves, the one with the large reward is the better.
        """
        return [Explanation(type='title', content='Rule Explanation'), Explanation(type='text', content=text)]

    def table_explanation(self):
        text = """
        Each value in the table represents the expected remaining total reward, when taking that action. The recommended
        action is hightlighted green. The not recommended action is hightlighted red. For each move the best action is depicted
        in light green. 
        """
        table = self.q_table.to_dict(orient='split')
        table['columns'] = [str(r) for r in table['columns']]
        table['index'] = [str(m) for m in table['index']]
        table = Table(**table, index_name='move', column_name='reward')

        return [Explanation(type='title', content='Action Value Table'), Explanation(type='text', content=text), Explanation(type='table', content=table)]

    def play_explanation(self, environment: Environment):
        play, total_reward = self.get_playout(environment)
        text = f"""
        You see a the algorithm playing on this environment. It got a total reward of {total_reward}
        """
        play = [int(p) for p in play]
        return [Explanation(type='title', content='AI Play'),Explanation(type='text', content=text), Explanation(type='replay', content=play)]


    def playout_explanation(self):
        text = """
        For each action you are entering, a playout is visualized for both, the recommended and the non
        recommended action.
        """
        return [Explanation(type='title', content='Playouts'), Explanation(type='text', content=text), Explanation(type='playout')]
        

    def advise(self, environment, ar: AdviseRequest):
        # environment = environments[ar.environmentId]
        env = NetworkEnvironment(environment)
        move, action_idx, action_types = env.set_state(ar.node_idx, ar.move)
        q, p = get_qp(self.q_table, move, action_types)
        actions = [{
            'actionIdx': aidx, 
            'advise': RECOMMENDATIONS[tp], 
            'expectedReward': ar.total_reward + tq,
            'move': ar.move
        } for aidx, tp, tq in zip(action_idx, p, q)]
        if ar.playout:
            actions = [
                {**a, 'playout': run_playout(self.q_table, env, ar.node_idx, ar.move, a['actionIdx'])[0]}
                for a in actions
            ]
        return Advise(
            gameId=ar.game_id,
            environmentId=ar.environment_id,
            move=ar.move,
            userId=ar.user_id,
            nodeIdx=ar.node_idx,
            actions=actions
        )

    def get_playout(self, environment: Environment):
        env = NetworkEnvironment(environment)
        node_idx = environment.starting_node_idx
        return run_playout(self.q_table, env, node_idx, 0)


def get_qp(q_table, move, action_types):
    q = q_table.values[move,action_types]
    p = np.heaviside(q-q.mean(), 0.5)
    return q, p

def run_playout(q_table, env, node_idx, move, start_action_idx=None):
    obs = env.set_state(node_idx, move)
    if start_action_idx is not None:
        actions = [start_action_idx]
        obs, total_reward, done, info = env.step(start_action_idx)
        if move >= env.env.n_moves-1:
            return actions, total_reward
    else:
        actions = []
        total_reward = 0
    move, action_idx, action_types = obs
    done = False
    while not done:
        q, p = get_qp(q_table, move, action_types)
        selected_action_idx = np.random.choice(action_idx,p=p)
        obs, reward, done, info = env.step(selected_action_idx)
        total_reward += reward
        move, action_idx, action_types = obs
        actions.append(selected_action_idx)
    return actions, total_reward


    