import os
from typing import Optional

def get_env_var(key: str, default: Optional[str] = None) -> str:
    """Get environment variable with optional default value."""
    value = os.getenv(key, default)
    if value is None:
        raise ValueError(f"Environment variable {key} is required but not set")
    return value

# Upstox Configuration
UPSTOX_API_SECRET = get_env_var("UPSTOX_API_SECRET")

# Server Configuration
PORT = int(get_env_var("PORT", "8000"))