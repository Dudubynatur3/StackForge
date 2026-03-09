# StackForge 🚀

**StackForge** is a precision-engineered platform for Cloud and DevOps engineers. It bridges the gap between the jobs you want and the portfolio you've built by using AI to analyse job descriptions and recommend high-impact, tailored projects.

---

## ✨ Features

- **🔍 Job Description Analyser**: Extract required skills, tools, and project gaps from any Cloud/DevOps job posting.
- **🎯 Project Recommender**: Get 3-5 ranked project recommendations that specifically target the skills employers are looking for.
- **🛠️ Implementation Plan Generator**: Receive step-by-step guides, including architecture, file structures, and verification commands.
- **🚀 Project Upgrader**: Get professional advice on how to turn your existing projects into production-grade portfolio pieces.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Python FastAPI
- **AI Layer**: Google Gemini API (gemini-1.5-flash-lite)
- **Database/Auth**: Supabase (PostgreSQL & Google OAuth)
- **Infrastructure**: Terraform (GCP) & Render (Backend)
- **CI/CD**: GitHub Actions

---

## 📂 Project Structure

```text
stackforge/
├── backend/            # FastAPI Backend
│   ├── routers/        # API Endpoints
│   ├── services/       # AI & DB Logic
│   └── models/         # Pydantic Schemas
├── frontend/           # Next.js Frontend
│   ├── app/            # App Router Pages
│   ├── components/     # UI Components
│   └── lib/            # API Utilities
├── infrastructure/     # Terraform IaC
└── .github/            # CI/CD Workflows
```

---

## 🚀 Quick Start

### Backend Setup
1. `cd backend`
2. `pip install -r requirements.txt`
3. Create a `.env` file with `GOOGLE_API_KEY`, `SUPABASE_URL`, and `SUPABASE_KEY`.
4. `uvicorn main:app --reload`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env.local` with `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. `npm run dev`

---

## 📄 License
This project is for educational and portfolio purposes. Built as part of the StackForge Engineering Brief.

---

## 👨‍💻 Author
**Akintade** - Senior DevSecOps & Platform Engineer
