from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websocket.manager import manager
import asyncio

router = APIRouter()

@router.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    print("🔥 WS HIT")

    await manager.connect(websocket)
    print("🟢 WebSocket Connected")

    try:
        while True:
            await asyncio.sleep(1)   # ✅ KEEP ALIVE (NO receive_text)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("🔴 WebSocket Disconnected")
        