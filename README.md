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

> **Note:** Make sure the local dev servers are stopped before running `docker compose up` — both use port 8000 and will conflict.

---

## Debugging in VSCode

The `.vscode/launch.json` provides three configurations, selectable from the **Run & Debug** panel:

| Configuration | Description |
|---|---|
| **FastAPI (debug)** | Starts the backend only with the Python debugger attached. Set breakpoints in any `.py` file. |
| **Full stack (debug)** | Starts the Vite frontend task, then launches the backend with the Python debugger. |
| **Full stack (debug both)** | Same as above, but also opens VSCode's built-in browser with the JavaScript debugger attached — set breakpoints in `.jsx` files too. |

The built-in browser debugger (`editor-browser`) requires no extensions — it is part of VSCode.

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
├── .vscode/
│   ├── launch.json         # Debug configs (Python + browser)
│   ├── tasks.json          # Ctrl+Shift+B: start both dev servers
│   ├── settings.json       # Interpreter path, formatters, WSL settings
│   └── extensions.json     # Recommended extensions
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
