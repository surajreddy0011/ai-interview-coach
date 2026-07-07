# AI Interview Prep Coach

A monorepo for the AI Interview Prep Coach app: a FastAPI backend and a React + TypeScript frontend.

## Structure

```
.
├── backend/    FastAPI service (routes, models, services)
└── frontend/   React + TypeScript + Tailwind (Vite)
```

## Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API runs at http://localhost:8000. Check `GET /health` for a health-check response.

## Frontend (React + TypeScript + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:5173 and expects the backend at http://localhost:8000 (configurable via `VITE_API_BASE_URL`, see `.env.example`).

## Running both together

Start the backend and frontend in separate terminals using the commands above.
