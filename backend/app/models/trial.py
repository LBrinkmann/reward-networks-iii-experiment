import datetime
from typing import Optional, List, Literal

from models.network import Network
from beanie import PydanticObjectId
from pydantic import BaseModel


class Solution(BaseModel):
    moves: List[int]
    trial_id: Optional[PydanticObjectId]
    finished_at: Optional[datetime.datetime]


class Trial(BaseModel):
    trial_num_in_session: int
    trial_type: Optional[Literal['tutorial', 'main']] = 'main'
    finished: Optional[bool] = False
    started_at: Optional[datetime.datetime]
    finished_at: Optional[datetime.datetime]
    network: Optional[Network]
    solution: Optional[Solution]

    class Config:
        orm_mode = True


