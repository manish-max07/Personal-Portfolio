# Manish Kumar | Full-Stack Developer Portfolio

Welcome to my personal portfolio repository! This is a modern, high-performance, and visually stunning web application built to showcase my selected work, work experience, technical skills, and achievements. The repository is structured as a monorepo featuring a Next.js frontend, a FastAPI core backend, and a specialized PyTorch-powered AI chatbot backend for semantic search.

---
<table align="center">
  <tr>
    <td align="center">
      <img src="https://res.cloudinary.com/ddiw6optp/image/upload/v1783535729/ezgif-3685094a82012f26_g2stw4.gif"
           alt="Manish Kumar coding GIF"
           width="256" />
    </td>
    <td align="center">
      <img src="https://res.cloudinary.com/ddiw6optp/image/upload/v1783606420/ManishPortfolioGIF_nmctfq.gif"
           alt="Manish Portfolio GIF"
           width="256" />
    </td>
  </tr>
</table>

## 🏗️ Repository Architecture

The project is split into three main modules:

```
portfolio-project/
├── frontend/          # Next.js 16, TypeScript, & Tailwind CSS v4 Client
├── backend/           # FastAPI Core Backend with SQLite/PostgreSQL & Auth
└── chatbot-backend/   # PyTorch & Sentence-Transformers AI Chatbot Service
```

---

## 🚀 Key Features

### 💻 Frontend (Next.js)
- **Fluid Animations**: Leveraging `framer-motion` for page entries, scroll-triggered reveals, and micro-interactions.
- **Glassmorphism & Neon Glows**: Premium UI design with Tailwind CSS v4, customizable color palettes, and glass card layouts.
- **Dynamic Projects Showcase**: Direct click-on-grid details modal showcasing project descriptions, tech tags, and code links.
- **Responsive Timelines**: Interactive experience and achievements sections.

### ⚡ Core Backend (FastAPI)
- **FastAPI Framework**: High performance, asynchronous Python backend API.
- **Data Persistence**: Configured using SQLAlchemy for robust DB interactions (SQLite for development / PostgreSQL ready).
- **Authentication**: JWT tokens, password hashing via bcrypt, and secure admin routes.
- **Migrations**: Database schema version control powered by Alembic.
- **Security & Rate Limiting**: Slowapi integration to prevent spam.

### 🤖 AI Chatbot Backend (AI Semantic Search)
- **NLP & Semantic Matching**: Utilizes `sentence-transformers` (BERT-based architectures) to embed portfolio contents.
- **FastAPI Gateway**: Offers a lightning-fast endpoint for users to interactively search and query questions about my resume, skills, and background.
- **PyTorch Integration**: CPU-optimized PyTorch execution for hosting models efficiently in cloud environments.

---

## 🛠️ Tech Stack

### Client-Side
* **Core**: Next.js 16 (React 19), TypeScript
* **Styling**: Tailwind CSS v4, Lucide React, React Icons
* **Animation**: Framer Motion
* **HTTP Client**: Axios

### Servers & ML
* **Backend API**: FastAPI (Python), Uvicorn
* **Database**: PostgreSQL / SQLite, SQLAlchemy ORM, Alembic
* **AI/NLP**: PyTorch (CPU-only), Sentence-Transformers, HuggingFace Models
* **Security**: Slowapi, Bcrypt, PyJWT, Python-dotenv

---

## ⚙️ Setup & Installation

Follow these steps to run the entire system locally:

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- `pip` and `npm`

---

### 2. Setting Up the Core Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file based on your environment variables (DB URLs, Secret Keys) and run Alembic migrations:
   ```bash
   alembic upgrade head
   ```
5. Seed database or create an admin account:
   ```bash
   python create_admin.py
   ```
6. Start the development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

---

### 3. Setting Up the AI Chatbot Backend

1. Navigate to the chatbot directory:
   ```bash
   cd ../chatbot-backend
   ```
2. Create and activate a separate virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the dependencies (includes PyTorch CPU-only pip configurations):
   ```bash
   pip install -r requirements.txt
   ```
4. Run the chatbot service:
   ```bash
   uvicorn main:app --reload --port 8001
   ```

---

### 4. Setting Up the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install Node modules:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📄 License & Contact

Developed by **Manish Kumar**.
- **LinkedIn**: [Manish Kumar](https://www.linkedin.com/in/manish-kumar-35484a207)
- **GitHub**: [@manish-max07](https://github.com/manish-max07)

