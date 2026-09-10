from datetime import datetime

from pydantic import BaseModel, ConfigDict, HttpUrl


class SourceCreate(BaseModel):
    url: HttpUrl


class SourceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str
    created_at: datetime


class HealthRead(BaseModel):
    status: str
    database: str
