import json
from pathlib import Path

from .config import settings
from .models import Item


def _path() -> Path:
    return settings.data_dir / "items.json"


def _ensure(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text("[]", encoding="utf-8")


def load_items() -> list[Item]:
    p = _path()
    _ensure(p)
    return [Item(**i) for i in json.loads(p.read_text(encoding="utf-8"))]


def save_items(items: list[Item]) -> None:
    p = _path()
    _ensure(p)
    p.write_text(
        json.dumps([i.model_dump() for i in items], indent=2),
        encoding="utf-8",
    )
