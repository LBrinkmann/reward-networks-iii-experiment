from app.models.base import ExtBaseModel, PyObjectId
from typing import Optional


class User(ExtBaseModel):
    user_id: Optional[PyObjectId] = None
    experiment_id: PyObjectId
    prolific_id: str