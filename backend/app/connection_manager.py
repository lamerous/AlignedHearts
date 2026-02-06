from fastapi import WebSocket
from starlette.websockets import WebSocketState
from typing import Dict, List
import websockets
import json

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
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                if connection != exclude_socket:
                    # Проверяем, что сокет еще жив
                    if connection.client_state == WebSocketState.CONNECTED:
                        try:
                            await connection.send_json(message)
                        except Exception as e:
                            print(f"Error sending message: {e}")

    async def get_ai_response_stream(self, prompt: str, room_id: str):
        uri = "ws://host.docker.internal:8001/ws/ai"
        try:
            async with websockets.connect(uri) as ai_ws:
                print(json.dumps({"prompt": prompt}))
                await ai_ws.send(json.dumps({"prompt": prompt}))
                
                async for message in ai_ws:
                    data = json.loads(message)
                    # Транслируем каждое обновление от ИИ в комнату
                    await self.broadcast(
                        {
                            "type": "ai_update", 
                            "step": data.get("status"),
                            "content": data.get("text")
                        },
                        room_id
                    )
        except Exception as e:
            print(f"AI Service WS error: {e}", flush=True)