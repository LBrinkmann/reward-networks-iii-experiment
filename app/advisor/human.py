from app.models.advise import HumanExplanation, Explanation, Advise, AdviseRequest
from app.models.game import Game
from app.models.environment import Environment
from app.models.solution import Solution


class HumanAdvisor():
    def __init__(self, *_, **__):
        pass

    def explanation(self, *, game: Game, environment: Environment, **_):
        parent_id = game.parent_id
        if parent_id is not None:
            written_exp = HumanExplanation.get(game_id=parent_id)
            replay = Solution.get(game_id=game.id, environment_id=environment.id)
            replay_exp = Explanation(type='replay', content=replay)
            return [written_exp, replay_exp]
        else:
            return []

    def advise(self, environments, ar: AdviseRequest):
        return Advise(
            gameId=ar.game_id,
            environmentId=ar.environment_id,
            move=ar.move,
            userId=ar.user_id,
            nodeIdx=ar.node_idx,
            actions=[]
        )
