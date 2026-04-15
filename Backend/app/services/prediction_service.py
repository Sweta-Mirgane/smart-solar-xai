import pandas as pd
import asyncio
from sqlalchemy.orm import Session
from app.database.models import Prediction
from app.websocket.manager import manager
import os

CSV_FILE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../data/prediction_output.csv")
)


def load_predictions_from_csv(db: Session):
    df = pd.read_csv(CSV_FILE_PATH)

    df = df.dropna(subset=["timestamp"])

    for _, row in df.iterrows():
        timestamp = str(row["timestamp"]).strip()
        component = row["component"]

        existing = db.query(Prediction).filter(
            Prediction.timestamp == timestamp,
            Prediction.component == component
        ).first()

        if existing:
            existing.prediction = row["prediction"]
            existing.health_status = row["health_status"]
            existing.likely_cause = row["likely_cause"]

            try:
                loop = asyncio.get_running_loop()
                loop.create_task(manager.broadcast({
                    "type": "prediction",
                    "data": {
                        "component": existing.component,
                        "timestamp": existing.timestamp,
                        "prediction": existing.prediction,
                        "health_status": existing.health_status,
                        "likely_cause": existing.likely_cause,
                    }
                }))
            except RuntimeError:
                pass

        else:
            new_row = Prediction(
                timestamp=timestamp,
                component=component,
                prediction=row["prediction"],
                health_status=row["health_status"],
                likely_cause=row["likely_cause"]
            )
            db.add(new_row)

            try:
                loop = asyncio.get_running_loop()
                loop.create_task(manager.broadcast({
                    "type": "prediction",
                    "data": {
                        "component": new_row.component,
                        "timestamp": new_row.timestamp,
                        "prediction": new_row.prediction,
                        "health_status": new_row.health_status,
                        "likely_cause": new_row.likely_cause,
                    }
                }))
            except RuntimeError:
                pass

    db.commit()


# ============================
# ✅ FIXED MISSING FUNCTIONS
# ============================

def get_predictions_by_date(db: Session, date: str):
    """
    Returns all predictions for a given date.
    """
    return db.query(Prediction).filter(
        Prediction.timestamp.like(f"{date}%")
    ).all()


def get_component_predictions_by_date(db: Session, component: str, date: str):
    """
    Returns predictions for a specific component on a given date.
    """
    return db.query(Prediction).filter(
        Prediction.component == component,
        Prediction.timestamp.like(f"{date}%")
    ).all()
