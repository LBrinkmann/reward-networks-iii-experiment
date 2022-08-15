from ..models.environment import Environment


class NetworkEnvironment:
    def __init__(self, environment: Environment):
        self.env = environment

    def step(self, action_idx):
        assert not self.done, 'Environment is done already.'

        env = self.env
        action = env.actions[action_idx]
        reward = env.action_types[action.action_type_idx].reward
        self.total_reward += reward

        target_idx = action.target_idx
        self.node = env.nodes[target_idx]

        self.move += 1
        obs = self.observe()
        if self.move >= env.n_moves:
            self.done = True

        return obs, reward, self.done, {'total_reward': self.total_reward}

    def observe(self):
        if self.done:
            return
        else:
            action_types = [
                self.env.actions[aidx].action_type_idx
                for aidx in self.node.action_idx
            ]
            return self.move, self.node.action_idx, action_types

    def set_state(self, node_idx, move, total_reward = 0):
        self.move = move
        self.node = self.env.nodes[node_idx]
        self.total_reward = total_reward
        self.done = False
        return self.observe()