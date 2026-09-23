import os
import numpy as np
from app.services.knowledge_base import KNOWLEDGE_BASE

# -------------------------------------------------------------
# Existing Model-based Approach (Preserved for future use/fallback)
# -------------------------------------------------------------
_model = None
_kb_embeddings = None
_kb_answer_map = None

def _load_model():
    global _model, _kb_embeddings, _kb_answer_map
    if _model is None:
        import torch
        torch.set_grad_enabled(False)
        torch.set_num_threads(1)
        
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

def _get_kb_keyword_answer(user_question: str) -> dict:
    """Lightweight keyword fallback in case local model runs out of memory on small servers."""
    q_words = set(user_question.lower().split())
    best_match = None
    max_overlap = 0

    for entry in KNOWLEDGE_BASE:
        for q in entry["questions"]:
            entry_words = set(q.lower().split())
            overlap = len(q_words.intersection(entry_words))
            if overlap > max_overlap:
                max_overlap = overlap
                best_match = entry["answer"]

    if best_match and max_overlap > 0:
        return {"answer": best_match, "confidence": 0.8}

    return {
        "answer": "I'm not sure about that one — feel free to ask me about Manish's skills, projects, experience, or achievements!",
        "confidence": 0.0
    }

def get_answer_from_model(user_question: str) -> dict:
    """Local model embedding match using sentence-transformers (preserved)."""
    try:
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
    except Exception as e:
        print(f"[CHATBOT] Local sentence-transformers model failed/OOM ({e}). Using direct knowledge base fallback.")
        return _get_kb_keyword_answer(user_question)

# -------------------------------------------------------------
# Groq API Integration (Fast inference via llama-3.1-8b-instant)
# -------------------------------------------------------------
_system_prompt = None

def _get_system_prompt() -> str:
    global _system_prompt
    if _system_prompt is not None:
        return _system_prompt

    kb_summary_lines = []
    for item in KNOWLEDGE_BASE:
        kb_summary_lines.append(f"- {item['answer']}")
    kb_text = "\n".join(kb_summary_lines)

    _system_prompt = f"""You are the friendly, professional AI Portfolio Assistant for Manish Kumar's personal portfolio website.
Your role is to answer visitors' questions accurately, concisely, and warmly based on the factual background information provided below.

### Manish Kumar's Portfolio Background:
{kb_text}

### Instructions:
1. Provide concise, natural, and helpful answers (typically 2 to 4 sentences).
2. Represent Manish accurately. If asked whether he is available for work, confirm he is available immediately for roles like Software Developer, SDE, Data Analyst, and Python Developer.
3. If asked for a resume, mention that they can download it directly using the "Download Resume" button on the site.
4. If asked how to contact Manish, mention the contact form on this website or his LinkedIn and GitHub links.
5. If someone asks a question completely unrelated to Manish, his projects, skills, or portfolio, politely say that you are here specifically to answer questions about Manish Kumar's work and experience.
6. Do not make up facts not present in his profile.
"""
    return _system_prompt

def _call_groq_http(api_key: str, model_name: str, messages: list) -> str:
    """Direct HTTP call to Groq API using Python standard library (no pip dependencies required)."""
    import json
    import urllib.request
    import urllib.error

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "User-Agent": "Portfolio-Chatbot/1.0"
    }
    payload = json.dumps({
        "model": model_name,
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": 350
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"]
    except urllib.error.HTTPError as err:
        err_body = err.read().decode("utf-8", errors="ignore")
        print(f"[CHATBOT] Groq HTTP {err.code} error: {err_body}")
        raise RuntimeError(f"Groq API HTTP {err.code}: {err_body}") from err

def _get_groq_answer(user_question: str, api_key: str) -> dict:
    import time

    start_time = time.time()
    configured_model = os.environ.get("GROQ_MODEL", "").strip()
    candidate_models = (
        [configured_model] if configured_model else ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"]
    )

    messages = [
        {"role": "system", "content": _get_system_prompt()},
        {"role": "user", "content": user_question.strip()},
    ]

    last_error = None
    for model_name in candidate_models:
        try:
            print(f"[CHATBOT] Querying Groq with model: {model_name}...")
            # Attempt via Groq SDK first if available, else direct HTTP
            try:
                from groq import Groq
                client = Groq(api_key=api_key)
                chat_completion = client.chat.completions.create(
                    messages=messages,
                    model=model_name,
                    temperature=0.3,
                    max_tokens=350,
                )
                answer_text = chat_completion.choices[0].message.content
            except ImportError:
                # Zero-dependency HTTP fallback
                answer_text = _call_groq_http(api_key, model_name, messages)

            elapsed = time.time() - start_time
            print(f"[CHATBOT] Groq responded successfully via {model_name} in {elapsed:.2f}s")
            return {
                "answer": answer_text,
                "confidence": 1.0
            }
        except Exception as err:
            print(f"[CHATBOT] Failed with model {model_name}: {err}")
            last_error = err
            continue

    raise last_error or RuntimeError("All Groq models failed")

# -------------------------------------------------------------
# Public API Entry Point
# -------------------------------------------------------------
def get_answer(user_question: str) -> dict:
    """
    Main entry point for chatbot answers.
    Uses Groq if GROQ_API_KEY is configured. Falls back to local model if not set or on error.
    """
    groq_api_key = os.environ.get("GROQ_API_KEY", "").strip()

    if groq_api_key:
        print("[CHATBOT] GROQ_API_KEY found. Attempting fast inference with Groq...")
        try:
            return _get_groq_answer(user_question, groq_api_key)
        except Exception as e:
            print(f"[CHATBOT] Groq API call failed ({e}). Falling back to local model.")
            return get_answer_from_model(user_question)

    print("[CHATBOT] No GROQ_API_KEY detected. Using local sentence-transformers model.")
    return get_answer_from_model(user_question)

