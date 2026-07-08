from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.blog_post import BlogPost
from app.schemas.blog_post import BlogPostCreate, BlogPostResponse
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/blog", tags=["Blog"])

@router.get("/", response_model=List[BlogPostResponse])
def get_posts(db: Session = Depends(get_db)):
    return db.query(BlogPost).all()

@router.get("/{post_id}", response_model=BlogPostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/", response_model=BlogPostResponse)
def create_post(
    post: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_post = BlogPost(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}