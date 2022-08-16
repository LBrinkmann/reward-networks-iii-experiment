import datetime
from typing import Optional, List

from beanie import Document

from models.trial import Trial


class Session(Document):
    experiment_num: int
    experiment_type: str = 'reward_network_iii'
    generation: int
    session_num_in_generation: int
    trials: List[Trial]
    current_trial_num: Optional[int] = 0
    advise_ids:  Optional[List[str]]
    valid: Optional[bool] = False
    available: Optional[bool] = False
    subject_id: Optional[str]
    started: Optional[datetime.datetime]
    finished: Optional[datetime.datetime]

    class Config:
        # TODO: add example
        schema_extra = {
            "example": {}
        }
