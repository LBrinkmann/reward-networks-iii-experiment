import datetime
from typing import Optional, List, Literal, Dict

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
    solution: Optional[Solution]
    written_strategy: Optional[str]


class AdvisorSelection(BaseModel):
    advisor_ids: List[PydanticObjectId]  # advisor ids
    scores: List[int]  # scores for each advisor


class WrittenStrategy(BaseModel):
    strategy: str
    trial_id: Optional[int]  # trial number in session
    finished_at: Optional[datetime.datetime]


class PostSurvey(BaseModel):
    questions: Dict[str, str]
    trial_id: Optional[int]  # trial number in session
    finished_at: Optional[datetime.datetime]


class Trial(BaseModel):
    id: int  # trial number in session
    trial_type: Literal[
        'consent',
        'instruction',
        'practice',
        'social_learning_selection',
        'observation',
        'repeat',
        'try_yourself',
        'individual',
        'demonstration',
        'written_strategy',
        'post_survey',
        'debriefing'
    ]
    # instruction trial relevant field
    instruction_type: Optional[Literal[
        'welcome',
        'learning_selection',
        'learning',
        'individual',
        'individual_start',
        'demonstration',
        'written_strategy',
        'written_strategy_start',
    ]]
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
    # post survey trial relevant field
    post_survey: Optional[PostSurvey]
    # redirect url with the confirmation code
    redirect_url: Optional[str]

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


class SessionError(BaseModel):
    message: str
