# StackForge 🚀
### Build the Portfolio That Gets You Hired.

**Live Demo**: [https://stack-forge-xi.vercel.app](https://stack-forge-xi.vercel.app)  
**Backend API**: [https://stackforge-backend.onrender.com](https://stackforge-backend.onrender.com)

---

## 📌 The Problem Statement
Cloud and DevOps engineering is a highly competitive field. Many aspiring engineers build generic projects (like simple static websites or basic Dockerfiles) that don't demonstrate the advanced skills top tech companies require — such as Infrastructure as Code (IaC), CI/CD automation, security hardening, and observability. 

There is a **"Gap"** between the skills listed in job descriptions and the projects candidates show in their portfolios.

## ✨ The Solution: StackForge
StackForge is a precision-engineered platform that uses AI to bridge this gap. It turns any job description into an actionable, technical roadmap for portfolio development.

### The Four Pillars of StackForge:
1.  **🔍 Job Description Analyser**: Instantly extracts required skills, preferred tools, and identifies the "project gaps" in your current profile.
2.  **🎯 Project Recommender**: Generates 3-5 high-impact projects tailored specifically to the role you want, ranked by their impact on a hiring manager.
3.  **🛠️ Implementation Plan Generator**: Provides complete technical blueprints including architecture diagrams, directory structures, and the exact CLI commands needed to build.
4.  **🚀 Project Upgrader**: Analyzes your existing work and provides a "Senior Engineer's Checklist" to upgrade it to production-grade quality.

---

## 🛠️ Technical Architecture

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Modern, Dark Mode first)
- **Auth**: Supabase Auth (Google OAuth)
- **State Management**: React Context API

### Backend
- **Framework**: Python FastAPI
- **AI Engine**: Google Gemini 1.5 Flash
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Render (Web Service)

### Infrastructure & DevOps
- **IaC**: Terraform (GCP configuration ready)
- **CI/CD**: GitHub Actions (Automated deployments to Render/Vercel)
- **Security**: Supabase Row Level Security (RLS), Environment Variable Protection.

---

## 📂 Project Structure
- `backend/`: FastAPI logic and AI prompt engineering.
- `frontend/`: Next.js UI and client-side integration.
- `infrastructure/`: Multi-cloud Terraform definitions and SQL schemas.
- `.github/`: Automated workflows for continuous delivery.

---

## 👨‍💻 Author
**Akintade** — Senior DevSecOps & Platform Engineer

Built with the vision of empowering the next generation of Cloud and Platform Engineers.
