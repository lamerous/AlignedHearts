from fastapi import FastAPI, Query
from pydantic import BaseModel
from websocket_router import router as websocket_router
from random import randint

app = FastAPI(title="AlignedHearts API")

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

class RoomCreateResponse(BaseModel):
    room_id: str

class WebSocketOutgoingStates(BaseModel):
    event: str

class WebSocketIncomingStates(BaseModel):
    partner_status: str
    ai_pipeling_state: str


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, Dict[int, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: int, user_id: int):
        await websocket.accept()
        self.create_room(room_id)
        self.active_connections[room_id][user_id] = websocket

    def disconnect(self, room_id: int, user_id: int):
        if room_id in self.active_connections and user_id in self.active_connections[room_id]:
            del self.active_connections[room_id][user_id]
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]
    
    def create_room(self, room_id: int):
        if room_id not in self.active_connections:
            self.active_connections[room_id] = {}

    async def broadcast(self, message: str, room_id: int, sender_id: int):
        if room_id in self.active_connections:
            for user_id, connection in self.active_connections[room_id].items():
                message_with_class = {
                    "text": message,
                    "is_self": user_id == sender_id
                }
                await connection.send_json(message_with_class)

manager = ConnectionManager()

@app.post("/api/rooms/create", tags=["Rooms"], response_model=RoomCreateResponse)
async def create_room():
    room_id = str(randint(1000, 9999))
    manager.create_room(room_id)
    room = RoomCreateResponse(
        room_id = room_id
    )

    return room

@app.post("/api/rooms/send_message", tags=["Rooms"], status_code=202)
async def send_message(text: str = Query(min_length=5, max_length=2000)):
    # Получение комнаты пользователя в которой он состоит
    room_id = 1
    # Сохранение текста в Redis
    print(text)

    return {"message": "sended"}

@app.websocket("/ws/room/{user_id}/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: int, user_id: int, username: str):
    await manager.connect(websocket, room_id, user_id)
    await manager.broadcast(f"{username} (ID: {user_id}) присоединился к чату.", room_id, user_id)

    try:
        while True:
            data_json = await websocket.receive_text()
            
            data = WebSocketOutgoingStates.model_validate_json(data_json)

            print(data)

            await manager.broadcast(f"{username} (ID: {user_id}): {data_json}", room_id, user_id)
    except WebSocketDisconnect:
        manager.disconnect(room_id, user_id)
        await manager.broadcast(f"{username} (ID: {user_id}) покинул чат.", room_id, user_id)
