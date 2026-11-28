# Arbitra AI

**Evaluate. Verify. Decide.**

A dashboard for the LLM Output Arbitration System. It sends a benchmark question to two local models (via the FastAPI + Ollama backend), shows how each response was validated, verified and scored, and explains which answer the arbitration engine picked and why.

This is an evaluation and observability tool, not a chatbot. All inference and scoring happen in the Python backend. The frontend never computes a winner. It only displays what the backend returns.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui on Radix · Lucide · Recharts · TanStack Query · Sonner

## Getting started

Prerequisites: Node.js 20.9 or later, plus the backend running locally (Ollama with `llama3.2:1b` and `qwen2.5-coder:1.5b`). See the [root README](../README.md) for backend, Ollama and Docker setup.

```powershell
# 1. Start the backend (from the repository root)
.venv\Scripts\activate
uvicorn api:app --reload --port 8000
```

```powershell
# 2. Start the dashboard
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000. No environment file is needed for the default setup: when `NEXT_PUBLIC_API_URL` is not set, the API client falls back to `http://localhost:8000`.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (includes type checking) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Base URL of the FastAPI backend |

To point the dashboard at a different backend, set the variable in `frontend/.env` or `frontend/.env.local` (`.env.local` takes precedence):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Both files are git-ignored by the `.env*` rule in `frontend/.gitignore`, so a fresh clone has neither and uses the default.

The browser calls the backend directly at `NEXT_PUBLIC_API_URL`, so FastAPI must allow the dashboard's origin in its CORS settings (`http://localhost:3000` and `http://127.0.0.1:3000` are already configured). The value is inlined at build time, so restart the dev server or rebuild after changing it.

In Docker, the value comes from the `NEXT_PUBLIC_API_URL` build argument in `docker-compose.yml` instead, because `.env` files are excluded from the image by `.dockerignore`. Rebuild the image after changing it with `docker compose build frontend`.

## Backend integration

| Endpoint | Used by |
| --- | --- |
| `GET /` | Connection indicator (polled every 15 s) |
| `GET /questions` | Question selector |
| `POST /arbitrate` | Run Evaluation (never retried automatically, because each call creates a history record) |
| `GET /statistics` | Overview summary cards, model cards and chart; Model Analytics |
| `GET /history` | Recent runs, Evaluation History and the details drawer |

After every arbitration, including ones with `status: "failed"`, the history and statistics queries are invalidated, so they refresh automatically. All integrations live in [arbitration.service.ts](src/services/arbitration.service.ts), and responses are validated in [normalize.ts](src/lib/normalize.ts).

### Response shapes

```jsonc
// GET /questions — no reference answers or trusted sources
[{ "id": 1, "question": "What is the capital of Nigeria?" }]

// GET /statistics — rates are already percentages
{
  "total_runs": 17, "successful_runs": 15, "failed_runs": 2, "success_rate": 88.24,
  "models": {
    "llama3.2:1b": {
      "attempts": 17, "wins": 12, "total_score": 1200.0, "valid_responses": 12,
      "win_rate": 70.59, "average_score": 70.59, "schema_success_rate": 70.59
    }
  }
}

// GET /history — newest first
[{
  "timestamp": "2026-11-27T15:32:51+00:00",
  "question": "...", "candidates": [/* Candidate */], "winner": null,
  "status": "failed", "tie": false, "selection_reason": "..."
}]
```

`tie` and `selection_reason` are optional, because older log lines don't have them. When they are missing, the dashboard derives them from the candidates.

## Project structure

```text
src/
├── app/                 Routes: / · /evaluate · /history · /analytics · /rubric
├── components/
│   ├── layout/          AppShell, AppSidebar, AppHeader, BackendStatus, ThemeToggle
│   ├── evaluation/      QuestionSelector, CandidateCard, ScoreBreakdown, WinnerCard, ArbitrationResult, …
│   ├── dashboard/       OverviewDashboard, ModelCard, RecentRuns
│   ├── analytics/       Charts, ModelComparisonTable, AnalyticsDashboard
│   ├── history/         HistoryTable, HistoryFilters, EvaluationDetailsDrawer
│   ├── rubric/          PipelineDiagram
│   ├── shared/          PageHeader, StatCard, Loading/Error/EmptyState, JsonViewer, ValidationIndicator
│   └── ui/              shadcn/ui primitives
├── hooks/               React Query hooks
├── services/            API client and arbitration service
├── lib/                 Scoring breakdown, tie detection, normalisation, formatting
├── constants/           Model metadata, scoring weights, navigation, app info
├── providers/           Query and theme providers
└── types/               API types
```

## Design notes

- **No fabricated data.** Metrics shown on the dashboard come from the backend. Model metadata (name, parameter size) is static configuration.
- **Ties are explained.** When eligible candidates score equally, the UI says the first one was chosen by a deterministic tie-break, not because it is the better model.
- **No winner means no answer.** When no candidate passes the mandatory checks, the UI shows "No acceptable answer found." and does not pick an answer.
- **Loading is truthful.** The backend returns one response per run, so the UI shows the time elapsed and the participating models rather than stage-by-stage progress it cannot observe.
- **Raw output is preserved.** Malformed model output (for example JSON wrapped in Markdown fences) is shown exactly as returned, together with the parser error.
