import numpy as np
from app.services.knowledge_base import KNOWLEDGE_BASE

_model = None
_kb_embeddings = None
_kb_answer_map = None

def _load_model():
    global _model, _kb_embeddings, _kb_answer_map
    if _model is None:
        from sentence_transformers import SentenceTransformer  # deferred import
        _model = SentenceTransformer("all-MiniLM-L6-v2")

        all_questions = []
        answer_map = []

        for entry in KNOWLEDGE_BASE:
            for q in entry["questions"]:
                all_questions.append(q)
                answer_map.append(entry["answer"])

        _kb_embeddings = _model.encode(all_questions)
        _kb_answer_map = answer_map

    return _model, _kb_embeddings, _kb_answer_map

def _cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def get_answer(user_question: str) -> dict:
    model, kb_embeddings, kb_answer_map = _load_model()
    user_embedding = model.encode([user_question])[0]

    similarities = [
        _cosine_similarity(user_embedding, kb_emb)
        for kb_emb in kb_embeddings
    ]

    best_idx = int(np.argmax(similarities))
    best_score = float(similarities[best_idx])

    CONFIDENCE_THRESHOLD = 0.28

    if best_score < CONFIDENCE_THRESHOLD:
        return {
            "answer": "I'm not sure about that one — feel free to ask me about Manish's skills, projects, experience, or achievements!",
            "confidence": best_score
        }

    return {
        "answer": kb_answer_map[best_idx],
        "confidence": best_score
    }