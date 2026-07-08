from pydantic import BaseModel, EmailStr
from datetime import datetime

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactMessageResponse(ContactMessageCreate):
    id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True