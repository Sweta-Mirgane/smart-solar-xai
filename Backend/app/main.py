import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db_connection import SessionLocal
from app.routes import auth, anomaly, fault, prediction, system
from app.services.anomaly_service import load_anomalies_from_csv
from app.services.fault_service import load_faults_from_csv
from app.services.prediction_service import load_predictions_from_csv
from app.websocket.ws import router as ws_router

app = FastAPI()

# ------------------- CORS -------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_initial_data():
    db = SessionLocal()

    try:
        print("Loading data into PostgreSQL...")
        load_faults_from_csv(db)
        load_anomalies_from_csv(db)
        load_predictions_from_csv(db)
        print("Data loaded successfully")
    finally:
        db.close()


async def load_initial_data_in_background():
    loop = asyncio.get_running_loop()
    await loop.run_in_executor(None, load_initial_data)


# ------------------- STARTUP -------------------
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(load_initial_data_in_background())


# ------------------- ROUTES -------------------
app.include_router(fault.router)
app.include_router(anomaly.router)
app.include_router(prediction.router)
app.include_router(system.router)
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(ws_router)

print("MAIN FILE LOADED")
