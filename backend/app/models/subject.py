from typing import Optional

from beanie import Document, PydanticObjectId


class Subject(Document):
    prolific_id: str
    session_id: Optional[str]
