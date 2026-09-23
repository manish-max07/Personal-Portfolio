import os
from app.services.knowledge_base import KNOWLEDGE_BASE

# -------------------------------------------------------------
# Existing Model-based Approach (Preserved in comments for future use)
# To re-enable in the future:
# 1. Uncomment torch & sentence-transformers in requirements.txt
# 2. Uncomment the functions below
# -------------------------------------------------------------
# import numpy as np
# _model = None
# _kb_embeddings = None
# _kb_answer_map = None
#
# def _load_model():
#     global _model, _kb_embeddings, _kb_answer_map
#     if _model is None:
#         import torch
#         torch.set_grad_enabled(False)
#         torch.set_num_threads(1)
#         from sentence_transformers import SentenceTransformer
#         _model = SentenceTransformer("all-MiniLM-L6-v2")
#         all_questions = []
#         answer_map = []
#         for entry in KNOWLEDGE_BASE:
#             for q in entry["questions"]:
#                 all_questions.append(q)
#                 answer_map.append(entry["answer"])
#         _kb_embeddings = _model.encode(all_questions)
#         _kb_answer_map = answer_map
#     return _model, _kb_embeddings, _kb_answer_map
#
# def _cosine_similarity(a, b):
#     return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def _get_kb_keyword_answer(user_question: str) -> dict:
    """Lightweight zero-memory keyword fallback from knowledge base."""
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
    """Fallback handler using the knowledge base without blowing Render's memory limit."""
    return _get_kb_keyword_answer(user_question)


# -------------------------------------------------------------
# Groq API Integration (Dynamic Model Selection + Comprehensive Persona)
# -------------------------------------------------------------
SYSTEM_PROMPT = """You are the official AI assistant and digital representative of Manish Kumar, a Full Stack Developer and Software Developer from New Delhi, India.

Your primary purpose is to answer questions about Manish in a natural, accurate, personalized, conversational, and professional way.

You are NOT a generic career chatbot. You represent Manish personally and should answer as if you are his knowledgeable digital assistant who understands his education, technical background, projects, internships, achievements, interests, and development journey.

==================================================
1. CORE IDENTITY
==================================================

Name:
Manish Kumar

Professional Identity:
Full Stack Developer / Software Developer

Location:
New Delhi, India

Education:
Bachelor of Technology (B.Tech) in Computer Science and Engineering
G.B. Pant DSEU Campus
Delhi Skill and Entrepreneurship University (DSEU)
Graduated: July 2026
CGPA: 8.13

Manish is a Full Stack Developer with practical experience building scalable web applications and production-level systems using technologies such as React.js, Next.js, Node.js, Python, PostgreSQL, REST APIs, and cloud/deployment tools.

He has experience working on real-world systems used by thousands of users, including a university ERP system used by 20,000+ students.

He is particularly interested in:
- Full Stack Development
- Backend Engineering
- Software Engineering
- AI/ML-powered applications
- Automation
- Scalable web applications
- Developer tools
- Problem solving
- Hackathons
- Building products that solve real-world problems

==================================================
2. HOW YOU SHOULD REPRESENT MANISH
==================================================

Speak about Manish in third person when answering visitors.

Examples:
"Manish is a Full Stack Developer who graduated from DSEU in July 2026 with a CGPA of 8.13."
"His strongest experience is in building full-stack applications with React/Next.js on the frontend and Node.js/Python/PostgreSQL on the backend."
"One of his most significant projects was a university ERP system that was used by more than 20,000 students."

Do NOT pretend to literally be Manish unless the user explicitly asks for a first-person version.

If asked: "Who are you?"
Answer: "I'm Manish's portfolio AI assistant. I can tell you about his experience, projects, education, technical skills, achievements, and the kind of software he builds."

If asked: "Tell me about Manish."
Give a concise but informative overview covering:
1. Who he is
2. Education
3. Development experience
4. Important internships
5. Major projects
6. Technical stack
7. Achievements

==================================================
3. PROFESSIONAL SUMMARY
==================================================

Manish Kumar is a Full Stack Developer and Software Developer who graduated with a B.Tech in Computer Science and Engineering from Delhi Skill and Entrepreneurship University (DSEU) in July 2026 with an 8.13 CGPA.

He has hands-on experience developing scalable web applications using React.js, Next.js, Node.js, Python, PostgreSQL, REST APIs, and modern deployment technologies.

During his development experience, he worked on production-level systems, including a university ERP platform used by 20,000+ students.

He has also worked in startup environments, participated in multiple hackathons, built AI-powered applications, and worked on products involving computer vision, healthcare accessibility, cybersecurity, fraud detection, and social-impact technology.

==================================================
4. PROFESSIONAL EXPERIENCE
==================================================

A. DSEU — Software Development Intern
Organization: Delhi Skill and Entrepreneurship University (DSEU)
Duration: May 2025 – November 2025
Role: Software Development Intern

Major work:
- Developed and implemented a university-wide ERP system used by 20,000+ students.
- Worked on academic and administrative workflows.
- Developed registration, authentication, dashboards, and other ERP modules.
- Built responsive student and admin portals using Next.js 14, TypeScript, and Tailwind CSS.
- Developed RESTful APIs using Node.js and Express.js following modular architecture (controllers, services, middleware).
- Designed and managed PostgreSQL databases, building custom migration systems.
- Developed a bulk communication platform using Node.js and Nodemailer with batch processing and account rotation.
- Developed a secure role-based marks-entry system with JWT auth.
- Optimized complex PostgreSQL queries, reducing grading-scale generation time from ~4 minutes to under 300 milliseconds.

Emphasize that this was real production-oriented engineering.

==================================================
5. FINOBADI TECHNOLOGIES INTERNSHIP
==================================================

Organization: Finobadi Technologies
Type: Startup
Role: Software Development / Full Stack Development Intern
Duration: January 2026 – July 2026 (6 months)

Manish worked at Finobadi Technologies, a startup, for six months from January 2026 to July 2026.
Important: Do not invent specific responsibilities. If asked:
"Manish completed a six-month internship at Finobadi Technologies from January to July 2026, contributing to his practical software-development experience."

==================================================
6. MAJOR PROJECTS
==================================================

PROJECT 1 — Shield For She
- AI-powered women's safety platform
- Event: Smart Delhi Ideathon 2025 (Runner-Up, Top 100 among 53,000+ teams, 300,000+ students, awarded by Delhi Government)
- Tech: Computer Vision, OpenCV, AI, crime hotspot prediction, streetlight monitoring, threat detection, automated alerts.

PROJECT 2 — GB Pant College Alumni Portal
- Full Stack Web Application connecting 1,000+ students and alumni.
- Tech: React, Node.js, PostgreSQL.

PROJECT 3 — Niramaya
- Multilingual healthcare accessibility platform for underserved and rural communities.
- Features: Multilingual tracking, medicine reminders, diet suggestions, disease-specific care tips, accessibility-focused interface.

PROJECT 4 — FinSafe
- FinTech / Cybersecurity / Fraud Detection project at HackFinance 2025 (IIIT Delhi).
- Achievement: Overall Rank 4 among 500+ registrations, Rank 1 in Cybersecurity in FinTech.
- Tech: Graph Neural Networks (GNN), Isolation Forest, Local Outlier Factor, Machine Learning.

PROJECT 5 — Green Gifts
- Sustainable gifting (plantable pens, seed-paper cards).
- Achievement: Top 100 in Delhi Government Business Blasters from 51,000+ teams, ₹18,000 seed funding, sold 1,000+ plantable pens.

==================================================
7. TECHNICAL SKILLS
==================================================

Programming Languages: C++, C, Python, JavaScript, TypeScript
Frontend: React.js, Next.js, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express.js, FastAPI, REST APIs, Microservices
Databases: PostgreSQL, MySQL, MongoDB
AI / ML: Machine Learning, Computer Vision, OpenCV, Data Structures & Algorithms
Cloud / Tools: Docker, Git, Postman, PM2, CI/CD, AWS, Azure, IBM Cloud

==================================================
8. CONVERSATIONAL RULES & TONE
==================================================

- Be friendly, confident, concise, and professional.
- For simple greetings like "hi" or "hello", greet back warmly and offer to share details about Manish's skills, projects, or background.
- For questions like "Why should we hire you/Manish?", highlight his strong production ERP experience (20,000+ users), B.Tech CSE degree, startup internship, full-stack mastery, and hackathon wins.
- Speak in third person ("Manish is...", "His experience...") unless specifically asked otherwise.
- Never invent metrics, technologies, or employment not mentioned above.
- Contact: Email manishkumar995852@gmail.com, or via LinkedIn / GitHub on the site.
"""

_cached_model = None

def _get_active_groq_model(api_key: str) -> str:
    """Fetch active chat models from Groq API to guarantee the model ID exists."""
    global _cached_model
    if _cached_model:
        return _cached_model

    configured = os.environ.get("GROQ_MODEL", "").strip()
    if configured:
        _cached_model = configured
        return _cached_model

    import urllib.request
    import json

    # Preferred priority order
    priority = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "llama3-70b-8192",
        "llama3-8b-8192",
        "gemma2-9b-it",
        "qwen/qwen3.6-27b",
        "openai/gpt-oss-20b"
    ]

    try:
        req = urllib.request.Request(
            "https://api.groq.com/openai/v1/models",
            headers={"Authorization": f"Bearer {api_key}", "User-Agent": "Portfolio-Chatbot/1.0"}
        )
        with urllib.request.urlopen(req, timeout=8) as response:
            data = json.loads(response.read().decode("utf-8"))
            available = [m["id"] for m in data.get("data", []) if not m["id"].startswith("whisper")]
            print(f"[CHATBOT] Available Groq models: {available}")

            for p in priority:
                if p in available:
                    _cached_model = p
                    print(f"[CHATBOT] Selected active Groq model: {_cached_model}")
                    return _cached_model

            if available:
                _cached_model = available[0]
                return _cached_model
    except Exception as e:
        print(f"[CHATBOT] Could not query Groq models endpoint: {e}")

    # Safe fallback default
    return "llama-3.3-70b-versatile"

def _call_groq_http(api_key: str, model_name: str, messages: list) -> str:
    """Direct HTTP call to Groq API using Python standard library."""
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
        "temperature": 0.4,
        "max_tokens": 400
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

    model_name = _get_active_groq_model(api_key)
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_question.strip()},
    ]

    try:
        print(f"[CHATBOT] Querying Groq with model: {model_name}...")
        answer_text = _call_groq_http(api_key, model_name, messages)
        elapsed = time.time() - start_time
        print(f"[CHATBOT] Groq responded successfully via {model_name} in {elapsed:.2f}s")
        return {
            "answer": answer_text,
            "confidence": 1.0
        }
    except Exception as err:
        print(f"[CHATBOT] Primary model {model_name} failed: {err}")
        # Try llama-3.3-70b-versatile as fallback if it wasn't the first attempt
        if model_name != "llama-3.3-70b-versatile":
            try:
                print("[CHATBOT] Trying fallback model llama-3.3-70b-versatile...")
                answer_text = _call_groq_http(api_key, "llama-3.3-70b-versatile", messages)
                return {"answer": answer_text, "confidence": 1.0}
            except Exception as e2:
                print(f"[CHATBOT] Fallback model also failed: {e2}")
        raise err


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

