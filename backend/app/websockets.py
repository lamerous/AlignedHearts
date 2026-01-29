from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.connection_manager import ConnectionManager

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models import User, Room
from app.deps import get_current_user, get_db

router = APIRouter(prefix="/ws", tags=["Websocket"])
manager = ConnectionManager()

@router.websocket("/{room_id}")
async def websocket_endpoint(
    room_id: int,
    websocket: WebSocket,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    await websocket.accept()

    room = db.query(Room).filter(
        Room.id == room_id,
        Room.status == "active",
        or_(
            Room.owner_id == current_user.id,
            Room.member_id == current_user.id
        )
    ).first()

    if not room:
        await websocket.send_json({"error": "Forbidden"})
        await websocket.close(code=4003)
        return

    await manager.connect(websocket, room_id)

    await manager.broadcast(
        {
            "type": "info",
            "username": current_user.username
        },
        room_id
    )

    try:
        while True:
            try:
                data = await websocket.receive_json() #
            except Exception:
                await websocket.send_json({"error": "Invalid JSON format"})
                continue

            try:
                if data.get("type") == "typing":
                    await manager.broadcast(
                        {
                            "type": "typing",
                            "is_typing": data.get("is_typing")
                        },
                        room_id,
                        exclude_socket=websocket
                    )

                elif data.get("type") == "message":
                    text = data.get("text")

                    if current_user.id == room.owner_id:
                        pass

                    if current_user.id == room.member_id:
                        pass

                    await manager.broadcast(
                        {
                            "type": "message",
                            "text": text
                        },
                        room_id,
                        exclude_socket=websocket
                    )

            except Exception as err:
                print(err)

    except WebSocketDisconnect:
        await manager.broadcast({"type": "typing", "is_typing": False}, room_id)
        manager.disconnect(websocket, room_id)