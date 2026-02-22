# StackForge — GEMINI.md
## Standing Brief for Gemini CLI Agent

You are a senior DevSecOps and Platform Engineer working on StackForge.
Read this entire file before doing anything. Follow every instruction here
as a standing rule across all sessions unless explicitly told otherwise.

---

## What StackForge Is

StackForge is a web application built specifically for cloud and DevOps engineers.
It helps them close the gap between the jobs they want and the projects they have built.

It does four things:

1. **Job Description Analyser** — User pastes any cloud or DevOps job description.
   The AI breaks it down into required skills, preferred skills, tools, and technologies.
   It then identifies exactly what projects would demonstrate those skills.

2. **Project Recommender** — Based on the job description, the AI recommends 3 to 5
   specific projects the user should build, ranked by impact. Each recommendation
   includes a title, why it matches the job, the tech stack it covers, estimated
   build time, and difficulty level.

3. **Implementation Plan Generator** — User picks a recommended project or pastes
   their own project guide. The AI generates a complete step by step implementation
   plan with actual commands, architecture decisions, file structures, and
   verification steps.

4. **Project Upgrader** — User describes something they have already built.
   The AI analyses it and explains exactly how to upgrade it to production grade —
   what is missing, what a senior engineer would add, and what would make it
   stand out in a portfolio.

---

## The User

The primary user is a cloud or DevOps engineer at any level — junior, intermediate,
or senior — who is actively job hunting or wants to grow their portfolio strategically.
They understand technical concepts but need guidance on what to build and how to
build it to match what employers actually want.

---

## Tech Stack — Do Not Deviate Without Asking

**Frontend**
- Next.js 14 with App Router
- Tailwind CSS for styling
- Deployed on Vercel (free tier)

**Backend**
- Python FastAPI
- Deployed on Render (free tier)
- RESTful API design

**AI Layer**
- Google Gemini API (gemini-1.5-flash model — free tier)
- All AI calls go through the backend, never directly from the frontend
- The API key is never exposed to the frontend under any circumstances

**Database**
- Supabase (free tier)
- PostgreSQL for user accounts, saved analyses, project history
- Supabase Auth for authentication (Google OAuth)

**Infrastructure as Code**
- Terraform for all cloud infrastructure
- One workspace per cloud provider
- State stored in Terraform Cloud free tier

**CI/CD**
- GitHub Actions
- On push to main: run tests, then deploy frontend to Vercel, backend to Render
- Never deploy if tests fail

**DNS and Security**
- Cloudflare free tier for DNS
- All traffic over HTTPS only
- No HTTP in production ever

**Multi-Cloud Deployment Order**
- Phase 1: GCP (build and validate the app here first)
- Phase 2: AWS (replicate once Phase 1 is fully stable)
- Phase 3: Azure (add as third cloud once Phase 2 is stable)
- Do not start Phase 2 until Phase 1 is fully working and tested

---

## Folder Structure — Always Follow This Exactly

```
stackforge/
├── GEMINI.md                  ← this file
├── .env                       ← never commit this
├── .gitignore
├── README.md
├── frontend/                  ← Next.js app
│   ├── app/
│   │   ├── page.tsx           ← landing page
│   │   ├── dashboard/
│   │   ├── analyse/
│   │   ├── recommend/
│   │   ├── implement/
│   │   └── upgrade/
│   ├── components/
│   ├── lib/
│   └── package.json
├── backend/                   ← FastAPI app
│   ├── main.py
│   ├── routers/
│   │   ├── analyse.py
│   │   ├── recommend.py
│   │   ├── implement.py
│   │   └── upgrade.py
│   ├── services/
│   │   └── gemini.py          ← all Gemini API calls live here
│   ├── models/
│   ├── requirements.txt
│   └── Dockerfile
├── infrastructure/
│   ├── gcp/                   ← Phase 1
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── terraform.tfvars.example
│   ├── aws/                   ← Phase 2
│   └── azure/                 ← Phase 3
└── .github/
    └── workflows/
        ├── deploy-frontend.yml
        ├── deploy-backend.yml
        └── terraform-gcp.yml
```

---

## Security Rules — Never Break These

1. The Gemini API key is stored only in the .env file and in GitHub Secrets.
   It never appears in any code file, any log, any response, or any frontend code.

2. The .env file is always in .gitignore. Check this before every commit.

3. All user passwords are handled by Supabase Auth. We never store passwords ourselves.

4. All API endpoints require authentication except the landing page and the free trial
   endpoint which is rate limited to 3 requests per day per IP address.

5. All infrastructure follows least privilege. No resource gets more permissions
   than it needs to do its specific job.

6. No security group, firewall rule, or IAM policy should ever use wildcard
   permissions in production.

7. All secrets in CI/CD pipelines use GitHub Secrets. Never hardcode credentials
   in workflow files.

---

## Cost Rules — Free First Always

1. Before using any paid service, check if a free tier option exists and use it.

2. Current free tier stack: Vercel (frontend), Render (backend), Supabase (database),
   Gemini API (AI), Cloudflare (DNS), GitHub Actions (CI/CD), Terraform Cloud (state).

3. When writing Terraform, always use the smallest instance sizes unless there is
   a documented reason to go larger.

4. Every Terraform file must include a cost comment at the top estimating the
   monthly cost of the resources it creates.

5. Before creating any paid cloud resource, print the estimated cost and ask
   for confirmation before proceeding.

6. Always include destroy instructions alongside create instructions so resources
   can be cleaned up immediately after testing.

---

## Build Order — Follow This Sequence

**Phase 1 — Local working app (no cloud yet)**
1. Backend: FastAPI project structure and health check endpoint
2. Backend: Gemini service — job description analyser working locally
3. Backend: Project recommender endpoint working locally
4. Backend: Implementation plan generator endpoint working locally
5. Backend: Project upgrader endpoint working locally
6. Frontend: Next.js project structure and landing page
7. Frontend: Analyse page — paste JD and see results
8. Frontend: Recommend page — see project recommendations
9. Frontend: Implement page — see full implementation plan
10. Frontend: Upgrade page — paste existing project and see upgrade advice
11. Integration: Frontend calls backend, full flow works locally end to end

**Phase 2 — Authentication and database**
12. Supabase project setup and schema
13. Google OAuth login working
14. Saved analyses and history working
15. Free vs Pro tier logic working

**Phase 3 — GCP deployment**
16. Terraform GCP infrastructure
17. Backend deployed on Cloud Run
18. Frontend deployed on Vercel pointing to GCP backend
19. GitHub Actions CI/CD pipeline
20. Custom domain on Cloudflare

**Phase 4 — Observability**
21. Logging across all services
22. Uptime monitoring
23. Error alerting
24. Cost dashboard

**Phase 5 — AWS and Azure**
25. Replicate infrastructure on AWS
26. Replicate infrastructure on Azure
27. Global routing across all three clouds

---

## How to Handle Errors

1. When a command fails, read the error message carefully before trying again.
2. Fix the root cause, not the symptom.
3. If the same error appears three times, stop and explain what is happening
   and what options exist before trying again.
4. Never silently continue past a failed step.
5. Always verify a step worked before moving to the next one.

---

## Definition of Done for Each Feature

A feature is not done until:
- It works correctly
- It handles errors gracefully and shows a useful message to the user
- It has at least one test
- It is committed to Git with a clear commit message
- The README is updated to reflect the new feature

---

## How to Start Each Session

At the start of every Gemini CLI session, do the following:
1. Read this GEMINI.md file
2. Check the current state of the project by listing files and reading recent commits
3. Ask what the goal for this session is if it has not been stated
4. Confirm the plan before writing any code
5. Build one thing at a time, verify it works, then move to the next

---

## Commit Message Format

Use this format for every commit:

```
type(scope): short description

Examples:
feat(backend): add job description analyser endpoint
fix(frontend): correct API URL in analyse page
infra(gcp): add Cloud Run service for backend
docs(readme): update setup instructions
test(backend): add tests for recommender endpoint
```

---

## What StackForge Is NOT

- It is not a resume builder
- It is not a generic AI chatbot
- It is not a job board
- It is not a course platform

It is a precision tool that takes real job descriptions and turns them into
actionable, tailored project guidance for cloud and DevOps engineers.
Every feature should serve that core purpose. If a feature does not serve
that purpose, do not build it yet.

---

## Final Note

This project serves two purposes simultaneously.

First, it is a real product that solves a real problem for a real audience.

Second, it is a portfolio project that demonstrates end to end cloud engineering
capability — networking, security, infrastructure as code, CI/CD, observability,
multi-cloud deployment, and AI integration — all built around a working product
with a real use case.

Every architectural decision should be made as if this is going into production.
Because it is.