from fastapi import APIRouter
from pydantic import BaseModel
from app.services.chatbot_service import get_answer

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str
    confidence: float

@router.post("/ask", response_model=ChatResponse)
def ask_chatbot(request: ChatRequest):
    result = get_answer(request.message)
    return result