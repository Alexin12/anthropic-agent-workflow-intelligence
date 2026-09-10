# Anthropic Agent Workflow Intelligence

A local React and FastAPI dashboard backed by PostgreSQL with pgvector.

## Run locally

Start PostgreSQL:

```bash
docker compose up -d database
```

Start the backend:

```bash
cd backend
uv sync
uv run alembic upgrade head
uv run fastapi dev app/main.py
```

Start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.
