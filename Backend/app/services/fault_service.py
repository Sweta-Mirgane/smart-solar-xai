import csv
import os
import asyncio
from sqlalchemy.orm import Session
from app.database.models import Fault
from app.websocket.manager import manager

CSV_FILE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../data/decision_engine_output.csv")
)


def load_faults_from_csv(db: Session):
    with open(CSV_FILE_PATH, newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        new_count = 0
        updated_count = 0

        for row in reader:
            existing_fault = db.query(Fault).filter(
                Fault.inverter == row["inverter"],
                Fault.date == row["date"]
            ).first()

            if existing_fault:
                existing_fault.status = row["status"]
                existing_fault.root_level = row["root_level"]
                existing_fault.fault_type = row["fault_type"]
                existing_fault.confidence = row["confidence"]
                existing_fault.confidence_score = float(row["confidence_score"])
                existing_fault.likely_causes = row["likely_causes"]
                existing_fault.recommended_action = row["recommended_action"]
                updated_count += 1

                try:
                    loop = asyncio.get_running_loop()
                    loop.create_task(manager.broadcast({
                        "type": "fault",
                        "data": {
                            "inverter": existing_fault.inverter,
                            "date": existing_fault.date,
                            "status": existing_fault.status,
                            "fault_type": existing_fault.fault_type,
                            "confidence": existing_fault.confidence,
                            "confidence_score": existing_fault.confidence_score,
                            "likely_causes": existing_fault.likely_causes,
                            "recommended_action": existing_fault.recommended_action,
                        }
                    }))
                except RuntimeError:
                    pass

            else:
                fault = Fault(
                    inverter=row["inverter"],
                    date=row["date"],
                    status=row["status"],
                    root_level=row["root_level"],
                    fault_type=row["fault_type"],
                    confidence=row["confidence"],
                    confidence_score=float(row["confidence_score"]),
                    likely_causes=row["likely_causes"],
                    recommended_action=row["recommended_action"]
                )

                db.add(fault)
                new_count += 1

                try:
                    loop = asyncio.get_running_loop()
                    loop.create_task(manager.broadcast({
                        "type": "fault",
                        "data": {
                            "inverter": fault.inverter,
                            "date": fault.date,
                            "status": fault.status,
                            "fault_type": fault.fault_type,
                            "confidence": fault.confidence,
                            "confidence_score": fault.confidence_score,
                            "likely_causes": fault.likely_causes,
                            "recommended_action": fault.recommended_action,
                        }
                    }))
                except RuntimeError:
                    pass

        db.commit()

    print(f"CSV synced -> {new_count} new records added, {updated_count} existing records updated")


# ============================
# ✅ FIXED MISSING FUNCTIONS
# ============================

def get_all_faults(db: Session):
    return db.query(Fault).all()


def get_faults_by_date(db: Session, date: str):
    return db.query(Fault).filter(Fault.date == date).all()


def get_fault_by_inverter(db: Session, inverter_id: str):
    return db.query(Fault).filter(Fault.inverter == inverter_id).first()
