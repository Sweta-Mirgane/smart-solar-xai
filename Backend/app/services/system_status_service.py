import os
from datetime import datetime, timezone
from typing import Any


DEFAULT_HEARTBEAT_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../data/system_heartbeat.txt")
)
DEFAULT_TIMEOUT_SECONDS = 30


def _get_timeout_seconds() -> int:
    raw_value = os.getenv("SYSTEM_HEARTBEAT_TIMEOUT_SECONDS", str(DEFAULT_TIMEOUT_SECONDS))

    try:
        return max(1, int(raw_value))
    except ValueError:
        return DEFAULT_TIMEOUT_SECONDS


def _get_heartbeat_file_path() -> str:
    return os.path.abspath(os.getenv("SYSTEM_HEARTBEAT_FILE", DEFAULT_HEARTBEAT_FILE))


def get_system_status() -> dict[str, Any]:
    heartbeat_file = _get_heartbeat_file_path()
    timeout_seconds = _get_timeout_seconds()

    if not os.path.exists(heartbeat_file):
        return {
            "online": False,
            "status": "offline",
            "source": "heartbeat_file",
            "heartbeat_file": heartbeat_file,
            "last_heartbeat": None,
            "age_seconds": None,
            "timeout_seconds": timeout_seconds,
        }

    modified_at = os.path.getmtime(heartbeat_file)
    modified_at_dt = datetime.fromtimestamp(modified_at, tz=timezone.utc)
    current_dt = datetime.now(timezone.utc)
    age_seconds = max(0.0, (current_dt - modified_at_dt).total_seconds())
    online = age_seconds <= timeout_seconds

    return {
        "online": online,
        "status": "online" if online else "offline",
        "source": "heartbeat_file",
        "heartbeat_file": heartbeat_file,
        "last_heartbeat": modified_at_dt.isoformat(),
        "age_seconds": round(age_seconds, 1),
        "timeout_seconds": timeout_seconds,
    }
