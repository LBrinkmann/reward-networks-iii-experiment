import datetime
from app.models.base import ExtBaseModel, PyObjectId
from typing import Optional


class Step(ExtBaseModel):
    step_id: Optional[PyObjectId] = None
    phase: str
    phase_step: int
    game_id: PyObjectId
    step_idx: int
    finished_at: Optional[datetime.datetime]
    current: bool = False
    trail_idx: Optional[int]
    environment_id: Optional[str]

    @classmethod
    def next(cls, current: 'Step'):
        cls.db().update_one(
            {'_id': current.id}, 
            {'$set': {'finishedAt': datetime.datetime.now(), 'current': False}}    
        )
        next_step = cls.db().find_one({'gameId': current.game_id, 'stepIdx': current.step_idx+1})
        return cls(**next_step)

