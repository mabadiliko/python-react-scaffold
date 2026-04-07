import platform
import socket
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .config import settings
from .models import Item, ItemCreate, ItemUpdate, new_item
from .store import load_items, save_items

app = FastAPI(title="python-react-scaffold", version=settings.app_version)


# ── API routes ─────────────────────────────────────────────────────────────────


@app.get("/api/info")
def get_info():
    return {
        "version": settings.app_version,
        "hostname": socket.gethostname(),
        "python_version": platform.python_version(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "static": "hej hopp"
    }


@app.get("/api/items", response_model=list[Item])
def list_items():
    return load_items()


@app.post("/api/items", response_model=Item, status_code=201)
def create_item(data: ItemCreate):
    items = load_items()
    item = new_item(data)
    items.append(item)
    save_items(items)
    return item


@app.put("/api/items/{item_id}", response_model=Item)
def update_item(item_id: str, data: ItemUpdate):
    items = load_items()
    item = next((i for i in items if i.id == item_id), None)
    if item is None:
        raise HTTPException(404, "Item not found")
    if data.name is not None:
        item.name = data.name
    if data.description is not None:
        item.description = data.description
    save_items(items)
    return item


@app.delete("/api/items/{item_id}", status_code=204)
def delete_item(item_id: str):
    items = load_items()
    if not any(i.id == item_id for i in items):
        raise HTTPException(404, "Item not found")
    save_items([i for i in items if i.id != item_id])


# ── Static files / SPA fallback ────────────────────────────────────────────────

_static = Path(__file__).parent.parent / "static"

if (_static / "assets").exists():
    app.mount("/assets", StaticFiles(directory=_static / "assets"), name="assets")


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(full_path: str):
    index = _static / "index.html"
    if index.exists():
        return FileResponse(index)
    return {"message": "Frontend not built — use the Vite dev server for local development"}
