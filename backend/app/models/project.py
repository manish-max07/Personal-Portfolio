from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(String(300), nullable=False)
    github_url = Column(String(300), nullable=True)
    live_url = Column(String(300), nullable=True)
    image_urls = Column(Text, nullable=True)  # comma-separated list of image URLs
    created_at = Column(DateTime(timezone=True), server_default=func.now())