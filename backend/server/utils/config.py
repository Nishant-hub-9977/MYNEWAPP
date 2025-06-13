import os
from typing import Optional

def get_env_var(key: str, default: Optional[str] = None) -> str:
    """Get environment variable with optional default value."""
    value = os.getenv(key, default)
    if value is None:
        raise ValueError(f"Environment variable {key} is required but not set")
    return value

# DhanHQ Configuration
DHAN_SANDBOX_TOKEN = get_env_var("DHAN_SANDBOX_TOKEN")
DHAN_API_URL = get_env_var("DHAN_API_URL", "https://api-sandbox.dhan.co")
PORT = int(get_env_var("PORT", "8000"))