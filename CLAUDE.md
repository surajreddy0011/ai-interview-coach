# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

AI Interview Prep Coach — a monorepo with a FastAPI backend and a React + TypeScript frontend.

## Stack

- **Backend**: FastAPI (Python), served with Uvicorn
  - `backend/app/main.py` — app entrypoint, CORS, router registration
  - `backend/app/routes/` — API route handlers (currently `health.py`)
  - `backend/app/models/` — data models/schemas
  - `backend/app/services/` — business logic / external integrations
- **Frontend**: React + TypeScript, built with Vite, styled with Tailwind CSS v4 (via `@tailwindcss/vite`)
  - `frontend/src/` — application source

## Running the app

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Runs at http://localhost:8000. `GET /health` returns `{"status": "ok"}`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at http://localhost:5173. Reads the backend URL from `VITE_API_BASE_URL` (see `frontend/.env.example`), defaulting to `http://localhost:8000`.

Run both commands in separate terminals to develop against a live backend.

## Conventions

- New backend endpoints go in `backend/app/routes/`, with request/response models in `backend/app/models/` and business logic in `backend/app/services/`. Register new routers in `backend/app/main.py`.
- The backend's CORS config in `main.py` allows `http://localhost:5173`; update it if the frontend origin changes.
