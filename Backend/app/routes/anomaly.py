from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db_connection import get_db

from app.services.anomaly_service import (
    load_anomalies_from_csv,
    get_anomalies_by_date,
    format_anomaly_response
)

router = APIRouter(prefix="/anomalies", tags=["Anomaly"])


# ✅ LOAD CSV → DB
@router.get("/load")
def load_data(db: Session = Depends(get_db)):
    load_anomalies_from_csv(db)
    return {"message": "Anomalies loaded"}


# ✅ GET BY DATE
@router.get("/by-date/{date}")
def fetch_anomalies(date: str, db: Session = Depends(get_db)):
    data = get_anomalies_by_date(db, date)
    return format_anomaly_response(data)
