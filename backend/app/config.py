import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend root directory
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

class Settings:
    PROJECT_NAME: str = "resq-ai-backend"
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    CORS_ORIGINS: list[str] = (
        ["*"] if os.getenv("CORS_ORIGINS", "*").strip() == "*"
        else [origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin.strip()]
    )
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "").strip()

settings = Settings()
