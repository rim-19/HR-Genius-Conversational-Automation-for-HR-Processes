# HR-Genius — Conversational HR Automation

A full-stack, AI-powered HR platform. HR teams manage employees, run HR workflows, and answer policy questions through a chat interface — while all rules and permissions are enforced deterministically on the server. The AI decides *what* to do; the backend decides *how* to do it safely.

## Overview

You talk to HR-Genius in natural language ("create a leave request for…", "what's the remote-work policy?"), and a planner-executor backend turns that into safe, permission-checked actions. Policy questions are answered with retrieval-augmented generation grounded in a company handbook, and every reply is explained strictly from verified backend results.

## Features

- **Conversational assistant** — asks for missing details instead of guessing, confirms destructive actions, and remembers context across turns
- **Role-based access** (Admin, HR, Manager, Employee) enforced server-side
- **RAG policy answers** grounded in a Markdown knowledge base with embeddings
- **Leave management**, employee self-service profiles, and in-app notifications
- **AI-generated documents** (PDF/DOCX) from editable templates, delivered through n8n workflows
- **Analytics** answered from live database aggregations
- **Audit log** of every action

## Architecture

```
User message
  -> intent extraction (LangChain + Gemini)
  -> planner       (decides the action)
  -> permission + business-rule checks  (server-side, deterministic)
  -> executor      (runs the action / RAG lookup / DB query)
  -> grounded reply (explained only from verified results)
```

Monorepo: a React frontend and a Node/Express + TypeScript backend.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Query, React Hook Form, Framer Motion, Recharts
- **Backend:** Node.js, Express, TypeScript
- **AI:** LangChain + Google Gemini; RAG over a Markdown knowledge base with embeddings
- **Database:** PostgreSQL via Prisma (employees, documents, leave, templates, conversational memory, action logs)
- **Auth & security:** JWT access + refresh tokens, bcrypt, Helmet, rate limiting, Zod validation
- **Documents & automation:** pdfkit / docx, n8n webhooks
- **Testing:** Vitest

## Getting started

The backend and frontend are separate apps.

```bash
# Backend
cd backend
npm install
cp .env.example .env       # fill in the values below
npx prisma migrate dev
npm run kb:embed           # build the knowledge-base embeddings
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment variables (backend)

```
DATABASE_URL=          # PostgreSQL
JWT_SECRET=
JWT_REFRESH_SECRET=
GEMINI_API_KEY=        # Google Gemini
N8N_WEBHOOK_URL=       # document-delivery workflow
PORT=
API_BASE_URL=
CORS_ORIGIN=
LOG_LEVEL=
NODE_ENV=
```

Never commit real secrets — `.env` is gitignored.

## Testing

```bash
cd backend
npm test        # Vitest
```

## Docs

- `frontend/ROLE_BASED_ACCESS_CONTROL.md` — how roles and permissions work
- `frontend/TESTING_ROLES.md` — testing the role-based flows
