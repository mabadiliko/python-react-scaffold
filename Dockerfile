# ── Stage 1: Build the React frontend ─────────────────────────────────────────
FROM node:24-alpine AS client-builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm run build


# ── Stage 2: Python runtime ────────────────────────────────────────────────────
FROM python:3.13-slim

# Install uv from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

ENV TZ="Europe/Stockholm" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies (cached layer — only re-runs when deps change)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

ENV PATH="/app/.venv/bin:$PATH"

# Copy backend source
COPY pyapp/ ./pyapp/

# Copy the built frontend into the location FastAPI serves from
COPY --from=client-builder /app/client/dist ./pyapp/static

# Data directory — mount a volume here for persistent storage
VOLUME ["/app/pyapp/data"]

EXPOSE 8000

WORKDIR /app/pyapp

CMD ["python", "./start.py"]
