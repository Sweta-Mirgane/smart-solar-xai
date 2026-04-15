from sqlalchemy import Column, Integer, String, Float
from app.database.db_connection import Base


# ------------------- FAULT -------------------
class Fault(Base):
    __tablename__ = "faults"

    id = Column(Integer, primary_key=True, index=True)
    inverter = Column(String)
    date = Column(String)
    status = Column(String)
    root_level = Column(String)
    fault_type = Column(String)
    confidence = Column(String)
    confidence_score = Column(Float)
    likely_causes = Column(String)
    recommended_action = Column(String)


# ------------------- ANOMALY -------------------
class Anomaly(Base):
    __tablename__ = "anomalies"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String)
    anomaly_status = Column(String)
    anomaly_score = Column(Float)
    main_source = Column(String)
    contributors = Column(String)

    wms_score = Column(Float)
    inverter_score = Column(Float)
    dgr_score = Column(Float)
    ht_score = Column(Float)
    lt_score = Column(Float)


# ------------------- PREDICTION -------------------
class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    # core info
    timestamp = Column(String, index=True)
    component = Column(String, index=True)  # inverter, wms, ht_mfm, lt_mfm

    # prediction output
    prediction = Column(Float)

    # plant health (MAIN UI DRIVER 🔥)
    health_status = Column(String)  # NORMAL / WARNING / CRITICAL

    # explanation
    likely_cause = Column(String)


# ------------------- USER -------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)  # hashed password
