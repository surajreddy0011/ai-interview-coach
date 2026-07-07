# AI Interview Prep Coach

A full-stack web app that generates role-specific interview questions and gives AI-powered feedback on your answers — built to help practice for technical and behavioral interviews.

**Live demo:** https://ai-interview-coach-livid.vercel.app
**Backend API:** https://ai-interview-coach-backend-jgbv.onrender.com

> Note: the backend is hosted on Render's free tier, so it may take 30-60 seconds to wake up on first load.

## Features

- Generate 5 tailored interview questions for any job role
- Submit answers and receive AI-scored feedback (1-10) with specific improvement suggestions
- Clean, responsive UI built with React and Tailwind

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Vite
**Backend:** FastAPI (Python), Uvicorn
**AI:** Claude API (Anthropic)
**Deployment:** Vercel (frontend), Render (backend)

## Architecture

```
frontend/  → React app, calls backend via fetch
backend/
  app/
    routes/     → API endpoints (health, questions, evaluate)
    services/   → Business logic, Claude API calls
    models/     → Pydantic request/response schemas
```

## Running Locally

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Create a .env file with:
# ANTHROPIC_API_KEY=your-key-here
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

## What I Learned

- Building a clean separation between routes, services, and models in FastAPI
- Handling real-world AI API quirks — e.g., Claude occasionally wraps JSON responses in markdown code fences, which required adding a sanitization step before parsing
- Deploying a decoupled frontend/backend architecture and configuring CORS across different domains
- Managing environment variables and secrets safely across local and production environments

## Author
Suraj Sirikonda — [LinkedIn](https://www.linkedin.com/in/surajsirikonda/) · [GitHub](https://github.com/surajreddy0011)