import datetime
from typing import Optional, List, Literal

from beanie import PydanticObjectId

from models.network import Network
from pydantic import BaseModel


class Solution(BaseModel):
    moves: List[int]
    score: Optional[int]  # solution score
    trial_id: Optional[int]  # trial number in session
    finished_at: Optional[datetime.datetime]


class Advisor(BaseModel):
    advisor_id: PydanticObjectId  # advisor id
    demonstration_trial_id: int  # trial number in advisor's session
    network: Optional[Network]
    solution: Optional[Solution]
    written_strategy: Optional[str]


class AdvisorSelection(BaseModel):
    advisor_ids: List[PydanticObjectId]  # advisor ids
    advisor_demo_trial_ids: List[int]  # advisor demonstration trial ids
    scores: List[int]  # scores for each advisor


class WrittenStrategy(BaseModel):
    strategy: str
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
        'written_strategy',
        'debriefing'
    ]
    finished: Optional[bool] = False
    started_at: Optional[datetime.datetime]
    finished_at: Optional[datetime.datetime]
    network: Optional[Network]
    solution: Optional[Solution]
    # social learning trial related field
    advisor: Optional[Advisor]
    # social learning selection trial relevant field
    advisor_selection: Optional[AdvisorSelection]
    # demonstration trial relevant field
    selected_by_children: Optional[List[PydanticObjectId]] = []
    # written strategy trial relevant field
    written_strategy: Optional[WrittenStrategy]

    class Config:
        orm_mode = True


class TrialSaved(BaseModel):
    message: Optional[Literal['Trial saved']] = 'Trial saved'


class TrialError(BaseModel):
    message: Literal[
        'Trial type is not correct',
        'Trial results are missing',
        'Advisor session is not found'
    ]
