from app.models.experiment import Experiment, Treatment
import numpy as np
import pandas as pd
from app.advisor.network_env import NetworkEnvironment
from app.models.advise import Advise, Explanation, AdviseRequest


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

    def explanation(self, *, treatment: Treatment, **_):
        if treatment.explanationType == 'table':
            return self.table_explanation()
        elif treatment.explanationType == 'rule':
            return self.rule_explanation()

    def rule_explanation(self):
        text = """
        If you take a large negative value as the first move, you will eventually gain more points. 
        For all later moves, the one with the large reward is the better.
        """
        return [Explanation(type='text', content=text)]

    def table_explanation(self):
        text = """
        Each value in the table represents the expected remaining total reward, when taking that action.
        """
        table = self.q_table.to_json()

        return [Explanation(type='text', content=text), Explanation(type='table', content=table)]

    def advise(self, environments, ar: AdviseRequest):
        environment = environments[ar.environmentId]
        env = NetworkEnvironment(environment)
        move, action_idx, action_types = env.set_state(ar.nodeIdx, ar.move)
        q, p = get_qp(self.q_table, move, action_types)
        actions = [{
            'actionIdx': aidx, 
            'recommendation': RECOMMENDATIONS[tp], 
            'expectedReward': ar.totalReward + tq
        } for aidx, tp, tq in zip(action_idx, p, q)]
        if ar.playout:
            actions = [
                {**a, 'playout': run_playout(self.q_table, env, ar.nodeIdx, ar.move, a['actionIdx'])}
                for a in actions
            ]
        return Advise(
            gameId=ar.gameId,
            environmentId=ar.environmentId,
            move=ar.move,
            userId=ar.userId,
            nodeIdx=ar.nodeIdx,
            actions=actions
        )


def get_qp(q_table, move, action_types):
    q = q_table.loc[move,action_types]
    p = np.heaviside(q-q.mean(), 0.5)
    return q, p

def run_playout(q_table, env, node_idx, move, action_idx):
    move, action_idx, action_types = env.set_state(node_idx, move)
    obs, done, reward, info = env.step(action_idx)
    move, action_idx, action_types = obs
    done = False
    actions = []
    while not done:
        p = get_qp(q_table, move, action_types)
        selected_action_idx = np.random.choice(action_idx,p=p)
        obs, done, reward, info = env.step(selected_action_idx)
        move, action_idx, action_types = obs
        actions.append(selected_action_idx)
    return actions


    