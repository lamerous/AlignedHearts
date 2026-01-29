from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        # {room_id: [websocket1, websocket2]}
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        self.active_connections[room_id].remove(websocket)
        if not self.active_connections[room_id]:
            del self.active_connections[room_id]

    async def broadcast(self, message: dict, room_id: str, exclude_socket: WebSocket = None):
        # Send message to all room members
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                if connection != exclude_socket:
                    await connection.send_json(message)