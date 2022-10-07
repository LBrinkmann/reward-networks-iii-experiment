import datetime
from typing import Optional, List, Literal

from models.network import Network
from pydantic import BaseModel


class Solution(BaseModel):
    moves: List[int]
    trial_id: Optional[int]  # trial number in session
    finished_at: Optional[datetime.datetime]


class Trial(BaseModel):
    id: int  # trial number in session
    trial_type: Literal[
        'consent',
        'social_learning_selection',
        'social_learning',
        'individual',
        'demonstration',
        'written_strategy'
    ]
    finished: Optional[bool] = False
    started_at: Optional[datetime.datetime]
    finished_at: Optional[datetime.datetime]
    network: Optional[Network]
    solution: Optional[Solution]

    class Config:
        orm_mode = True


class TrialSaved(BaseModel):
    message: Optional[Literal['Trial saved']] = 'Trial saved'
