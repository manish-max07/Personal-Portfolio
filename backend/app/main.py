from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import projects
from app.routers import projects, blog
from app.routers import projects, blog, contact
from app.routers import projects, blog, contact, chatbot
from app.routers import projects, blog, contact, chatbot, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Manish Kumar Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://manish-kumar-portfolio-omega.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router)
app.include_router(blog.router)
app.include_router(contact.router)
app.include_router(chatbot.router)
app.include_router(auth.router)
@app.get("/")
def read_root():
    return {"message": "Portfolio API is running"}