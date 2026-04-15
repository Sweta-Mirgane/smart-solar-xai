# Backend/app/routes/prediction.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db_connection import get_db
from app.services.prediction_service import (
    get_predictions_by_date,
    get_component_predictions_by_date
)

router = APIRouter(prefix="/predictions", tags=["Prediction"])


# ✅ OVERVIEW (CARDS)
@router.get("/by-date/{date}")
def fetch_predictions(date: str, db: Session = Depends(get_db)):
    return get_predictions_by_date(db, date)


# ✅ COMPONENT DETAILS (MODAL)
@router.get("/component/{component}/{date}")
def fetch_component_predictions(component: str, date: str, db: Session = Depends(get_db)):
    return get_component_predictions_by_date(db, component, date)
