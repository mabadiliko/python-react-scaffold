import uuid
from datetime import datetime, timezone

from pydantic import BaseModel


class Item(BaseModel):
    id: str
    name: str
    description: str
    created_at: str


class ItemCreate(BaseModel):
    name: str
    description: str = ""


class ItemUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


def new_item(data: ItemCreate) -> Item:
    return Item(
        id=str(uuid.uuid4()),
        name=data.name,
        description=data.description,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
