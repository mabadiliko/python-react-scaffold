from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_version: str = "0.1.0"
    data_dir: Path = Path(__file__).parent.parent / "data"

    model_config = {"env_prefix": "APP_"}


settings = Settings()
