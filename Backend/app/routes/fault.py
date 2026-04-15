from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db_connection import get_db
from app.services import fault_service
from app.services.fault_service import load_faults_from_csv


router = APIRouter(prefix="/faults", tags=["Faults"])


@router.get("/")
def get_faults(db: Session = Depends(get_db)):
    return fault_service.get_all_faults(db)


@router.get("/by-date/{date}")
def get_faults_by_date(date: str, db: Session = Depends(get_db)):
    return fault_service.get_faults_by_date(db, date)


@router.get("/sync")
def sync_faults(db: Session = Depends(get_db)):
    load_faults_from_csv(db)
    return {"message": "Synced successfully"}



@router.get("/{inverter_id}")
def get_fault(inverter_id: str, db: Session = Depends(get_db)):
    return fault_service.get_fault_by_inverter(db, inverter_id)
