import datetime
import pymongo
from .base import ExtBaseModel, PyObjectId
from typing import Optional, List


class Game(ExtBaseModel):
    game_id: Optional[PyObjectId] = None
    experiment_id: PyObjectId
    treatment_name: str
    generation: int
    locked: bool
    child_id: Optional[PyObjectId] = None
    parentId: Optional[PyObjectId] = None
    chain_id: PyObjectId
    user_id: Optional[PyObjectId]
    started: Optional[datetime.datetime]
    finished: Optional[datetime.datetime]
    environment_ids: List[str]
    total_points: int = 0


    @classmethod
    def assign(cls, experiment_id, user_id):
        game = cls.db().find_one_and_update(
            {'experimentId': experiment_id, 'locked': False},
            {"$set": {'userId': user_id, 'started': datetime.datetime.now(), 'locked': True}},
            return_document=pymongo.ReturnDocument.AFTER)
            # sort=[('rank', 1)]
        return Game(**game)

    def fail(self):
        copy_game = self.copy()
        copy_game.locked = False
        copy_game.userId = None
        copy_game.started = None
        copy_game.flush()

    def finish(self):
        self.finished = datetime.datetime.now()
        self.flush()
        child_game = self.get(self.childId)
        child_game.locked = False
        child_game.parent_id = self.id
        child_game.flush()
