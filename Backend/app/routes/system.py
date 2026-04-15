from fastapi import APIRouter

from app.services.system_status_service import get_system_status

router = APIRouter(prefix="/system", tags=["System"])


@router.get("/status")
def fetch_system_status():
    return get_system_status()
