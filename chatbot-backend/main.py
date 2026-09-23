from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.services.chatbot_service import get_answer

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Portfolio Chatbot Microservice")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://manish-kumar-portfolio-omega.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str
    confidence: float

@app.post("/chatbot/ask", response_model=ChatResponse)
@limiter.limit("12/hour")
def ask_chatbot(request: Request, body: ChatRequest):
    result = get_answer(body.message)
    return result

@app.get("/")
def read_root():
    return {"message": "Chatbot Microservice is running"}
