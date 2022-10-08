import datetime
from typing import Optional, List, Union, Literal

from beanie import Document, PydanticObjectId
from pydantic import BaseModel

from models.trial import Trial


class Session(Document):
    experiment_num: int
    experiment_type: str = 'reward_network_iii'
    generation: int
    session_num_in_generation: int
    trials: List[Trial]
    current_trial_num: Optional[int] = 0
    created_at: datetime.datetime = datetime.datetime.now()
    advise_ids: Optional[Union[List[PydanticObjectId]]] = []
    unfinished_parents: Optional[int] = 0
    child_ids: Optional[Union[List[PydanticObjectId]]] = []
    valid: Optional[bool] = False
    finished: Optional[bool] = False
    available: Optional[bool] = False
    ai_player: Optional[bool] = False
    subject_id: Optional[PydanticObjectId]
    started: Optional[datetime.datetime]
    finished_at: Optional[datetime.datetime]

    class Config:
        # TODO: add example
        schema_extra = {
            "example": {}
        }


class SessionError(BaseModel):
    message: Literal[
        'No available session for the subject',
        'Multiple subjects with the same prolific id'
    ]
