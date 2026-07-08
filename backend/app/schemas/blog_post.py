from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BlogPostBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostResponse(BlogPostBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True