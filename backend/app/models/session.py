import datetime
from typing import Optional, List

from beanie import Document

from trial import Trial
from advice import Adviсe


class Session(Document):
    subject_id: str
    generation: int
    experiment: int
    repetition_in_generation: int
    started: Optional[datetime.datetime]
    finished: Optional[datetime.datetime]
    trials: List[Trial]
    advices: List[Adviсe]
    valid: bool

    class Config:
        # TODO: add example
        schema_extra = {
            "example": {}
        }
