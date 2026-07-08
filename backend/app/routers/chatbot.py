from fastapi import APIRouter, Request
from pydantic import BaseModel
from app.services.chatbot_service import get_answer
from app.rate_limiter import limiter
router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str
    confidence: float

@router.post("/ask", response_model=ChatResponse)
@limiter.limit("12/hour")
def ask_chatbot(request: Request, body: ChatRequest):
    result = get_answer(body.message)
    return result