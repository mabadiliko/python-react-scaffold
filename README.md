# python-react-scaffold

A minimal demo/scaffold showing how to package a **FastAPI** backend and a **React/Vite** frontend into a single Docker container — distributable like an Electron app.

- Python 3.13 · [uv](https://docs.astral.sh/uv/) package manager
- React 19 · Vite 6 · plain JSX
- CRUD demo backed by a JSON file store
- No authentication

---

## Quick start (Docker)

```bash
docker compose up --build
```

Open [http://localhost:8000](http://localhost:8000).

To stop and remove data:

```bash
docker compose down -v
```

---

## Local development (WSL / Linux)

### Prerequisites

- [uv](https://docs.astral.sh/uv/getting-started/installation/) — Python package manager
- Node.js 20+ / npm

### One-time setup

```bash
# From repo root
uv sync              # creates .venv, installs Python deps

cd client
npm install          # install Node deps
```

### Start both servers

```bash
# Terminal 1 — FastAPI with auto-reload (from pyapp/)
cd pyapp
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 — Vite dev server (from client/)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite dev server proxies all `/api/*` requests to the FastAPI backend on `:8000`.

In **VSCode**, press `Ctrl+Shift+B` to start both servers in parallel via the configured tasks.

---

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/info` | System info: version, hostname, Python version, timestamp |
| GET | `/api/items` | List all items |
| POST | `/api/items` | Create item `{name, description}` |
| PUT | `/api/items/{id}` | Update item |
| DELETE | `/api/items/{id}` | Delete item |

Interactive docs (Swagger UI) available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## Project structure

```
python-react-scaffold/
├── pyproject.toml          # Python deps (uv)
├── Dockerfile              # Multi-stage: Node build → Python runtime
├── docker-compose.yml
│
├── pyapp/
│   ├── start.py            # uvicorn entry point
│   ├── data/               # items.json lives here (gitignored, auto-created)
│   └── app/
│       ├── main.py         # FastAPI app, routes, static serving
│       ├── config.py       # Settings via pydantic-settings
│       ├── models.py       # Pydantic models
│       └── store.py        # JSON file read/write
│
└── client/
    ├── vite.config.js      # Proxy /api → :8000 in dev
    └── src/
        ├── App.jsx
        └── components/
            ├── InfoPanel.jsx
            └── ItemsPanel.jsx
```

---

## Configuration

Backend settings are read from environment variables with the `APP_` prefix:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_APP_VERSION` | `0.1.0` | Displayed in the Info panel |
| `APP_DATA_DIR` | `pyapp/data` | Directory for `items.json` |

In Docker, mount a volume at `/app/pyapp/data` (already configured in `docker-compose.yml`) to persist data across restarts.
