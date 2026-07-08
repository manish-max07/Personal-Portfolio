from app.auth.dependencies import get_current_user
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.contact_message import ContactMessage
from app.schemas.contact_message import ContactMessageCreate, ContactMessageResponse
from app.rate_limiter import limiter

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("/", response_model=ContactMessageResponse)
@limiter.limit("3/hour")
def create_message(request: Request, msg: ContactMessageCreate, db: Session = Depends(get_db)):
    db_msg = ContactMessage(**msg.model_dump())
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

@router.get("/", response_model=List[ContactMessageResponse])
def get_messages(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()

@router.get("/{message_id}", response_model=ContactMessageResponse)
def get_message(message_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    return msg

@router.delete("/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"message": "Deleted"}