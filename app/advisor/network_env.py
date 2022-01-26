from app.models.environment import Environment


class NetworkEnvironment:
    def __init__(self, environment: Environment):
        self.env = environment

    def step(self, action_idx):
        assert not self.done, 'Environment is done already.'

        env = self.env
        action = env.actions[action_idx]
        reward = env.actionTypes[action.actionTypeIdx].reward
        self.total_reward += reward

        target_idx = action.targetIdx
        self.node = env.nodes[target_idx]

        self.move += 1
        if self.move >= env.nMoves:
            self.done = True

        return self.observe(), reward, self.done, {'total_reward': self.total_reward}


    @staticmethod
    def observe(self):
        if self.done:
            return
        else:
            action_types = (
                self.env.actions[aidx].actionTypeIdx
                for aidx in self.node.actionIdx
            )
            return self.move, self.node.actionIdx, action_types

    def set_state(self, node_idx, move, total_reward = 0):
        self.move = move
        self.node = self.env.nodes[node_idx]
        self.total_reward = total_reward
        self.done = False
        return self.observe()