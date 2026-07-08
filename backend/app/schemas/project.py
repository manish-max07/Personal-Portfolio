from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProjectBase(BaseModel):
    title: str
    description: str
    tech_stack: str
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_urls: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True