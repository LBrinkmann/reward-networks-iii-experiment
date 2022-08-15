import datetime
from typing import Optional, List

from beanie import Document

from trial import Trial
from advise import Advise


class Session(Document):
    subject_id: str
    generation: int
    experiment: int
    repetition_in_generation: int
    started: Optional[datetime.datetime]
    finished: Optional[datetime.datetime]
    current_trial_inx: int
    trials: List[Trial]
    advises: List[Advise]
    valid: bool
    available: bool

    class Config:
        # TODO: add example
        schema_extra = {
            "example": {}
        }
