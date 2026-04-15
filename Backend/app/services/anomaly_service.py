import pandas as pd
import asyncio
from sqlalchemy.orm import Session
from app.database.models import Anomaly
from app.websocket.manager import manager
import os

CSV_FILE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../data/anomaly_decision_engine_output.csv")
)


def load_anomalies_from_csv(db: Session):
    df = pd.read_csv(CSV_FILE_PATH)

    df = df.dropna(subset=["timestamp"])

    for _, row in df.iterrows():
        timestamp = str(row["timestamp"]).strip()

        if "," in timestamp:
            timestamp = timestamp.replace(",", "")

        existing = db.query(Anomaly).filter(
            Anomaly.timestamp == timestamp
        ).first()

        if existing:
            existing.anomaly_status = row["anomaly_status"]
            existing.anomaly_score = row["anomaly_score"]
            existing.main_source = row["main_source"]
            existing.contributors = row["contributors"]

            existing.wms_score = row["wms_score"]
            existing.inverter_score = row["inverter_score"]
            existing.dgr_score = row["dgr_score"]
            existing.ht_score = row["ht_score"]
            existing.lt_score = row["lt_score"]

            try:
                loop = asyncio.get_running_loop()
                loop.create_task(manager.broadcast({
                    "type": "anomaly",
                    "data": {
                        "timestamp": existing.timestamp,
                        "status": existing.anomaly_status,
                        "score": existing.anomaly_score,
                        "main_source": existing.main_source,
                    }
                }))
            except RuntimeError:
                pass  # No event loop during startup

        else:
            new_row = Anomaly(
                timestamp=timestamp,
                anomaly_status=row["anomaly_status"],
                anomaly_score=row["anomaly_score"],
                main_source=row["main_source"],
                contributors=row["contributors"],
                wms_score=row["wms_score"],
                inverter_score=row["inverter_score"],
                dgr_score=row["dgr_score"],
                ht_score=row["ht_score"],
                lt_score=row["lt_score"],
            )
            db.add(new_row)

            try:
                loop = asyncio.get_running_loop()
                loop.create_task(manager.broadcast({
                    "type": "anomaly",
                    "data": {
                        "timestamp": timestamp,
                        "status": new_row.anomaly_status,
                        "score": new_row.anomaly_score,
                        "main_source": new_row.main_source,
                    }
                }))
            except RuntimeError:
                pass

    db.commit()


# ============================
# ✅ FIXED MISSING FUNCTIONS
# ============================

def get_anomalies_by_date(db: Session, date: str):
    """
    Returns anomalies filtered by date (prefix match on timestamp).
    """
    return db.query(Anomaly).filter(
        Anomaly.timestamp.like(f"{date}%")
    ).all()


def format_anomaly_response(data):
    """
    Formats DB response into frontend-friendly JSON.
    """
    return [
        {
            "timestamp": item.timestamp,
            "anomaly_status": item.anomaly_status,
            "anomaly_score": item.anomaly_score,
            "main_source": item.main_source,
            "contributors": item.contributors,
            "wms_score": item.wms_score,
            "inverter_score": item.inverter_score,
            "dgr_score": item.dgr_score,
            "ht_score": item.ht_score,
            "lt_score": item.lt_score,
        }
        for item in data
    ]
