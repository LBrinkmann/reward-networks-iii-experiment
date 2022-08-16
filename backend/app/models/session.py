import datetime
from typing import Optional, List, Union

from beanie import Document, PydanticObjectId

from models.trial import Trial


class Session(Document):
    experiment_num: int
    experiment_type: str = 'reward_networks_iii'
    generation: int
    session_num_in_generation: int
    trials: List[Trial]
    current_trial_num: Optional[int] = 0
    created_at: datetime.datetime = datetime.datetime.now()
    advise_ids:  Optional[Union[List[PydanticObjectId], None]]
    valid: Optional[bool] = False
    finished: Optional[bool] = False
    available: Optional[bool] = False
    subject_id: Optional[str]
    started: Optional[datetime.datetime]
    finished_at: Optional[datetime.datetime]

    class Config:
        # TODO: add example
        schema_extra = {
            "example": {}
        }
