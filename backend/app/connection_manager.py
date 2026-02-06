from fastapi import WebSocket
from starlette.websockets import WebSocketState
from typing import Dict, List
import websockets
import json
import asyncio

from app.database import SessionLocal
from app.models import Room

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.room_messages: Dict[str, Dict[int, dict]] = {}
        self.processing_rooms: Dict[str, bool] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        self.active_connections[room_id].remove(websocket)
        if not self.active_connections[room_id]:
            del self.active_connections[room_id]

    async def broadcast(self, message: dict, room_id: str, exclude_socket: WebSocket = None):
        room_id = str(room_id)

        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                if connection != exclude_socket:
                    if connection.client_state == WebSocketState.CONNECTED:
                        try:
                            await connection.send_json(message)
                        except Exception as e:
                            print(f"Error sending message: {e}")

    async def handle_message(self, room_id: int, user_id: int, text: str, sex: str, owner_id: int):
        r_id = str(room_id)
        u_id = int(user_id) # Гарантируем, что ID пользователя - число
        
        if r_id not in self.room_messages:
            self.room_messages[r_id] = {}
        
        # Записываем сообщение
        self.room_messages[r_id][u_id] = {"text": text, "sex": sex}
        
        # ЛОГ ДЛЯ ОТЛАДКИ (поможет понять, почему не 2)
        current_msgs = self.room_messages[r_id]
        print(f"DEBUG: Room {r_id} has {len(current_msgs)} messages. User IDs: {list(current_msgs.keys())}", flush=True)

        if len(current_msgs) >= 2:
            if not self.processing_rooms.get(r_id):
                self.processing_rooms[r_id] = True
                
                # Подготавливаем данные
                payload = self._prepare_payload(r_id, owner_id)
                
                # ОЧИЩАЕМ сообщения СРАЗУ, чтобы избежать повторных триггеров
                self.room_messages[r_id] = {}
                
                print(f"DEBUG: Starting AI flow for room {r_id}", flush=True)
                asyncio.create_task(self._run_ai_flow(r_id, payload))
                return "processing"
            else:
                return "already_processing"
        
        return "waiting"

    def _prepare_payload(self, room_id: str, owner_id: int):
        msgs = self.room_messages[room_id]
        user_ids = list(msgs.keys())
        
        # Логика: если первый в списке - владелец, берем его как owner
        # Если нет - берем второго
        if user_ids[0] == owner_id:
            owner_data = msgs[user_ids[0]]
            member_data = msgs[user_ids[1]]
        else:
            # Если владелец отправил вторым или его вообще нет в этом списке
            owner_data = msgs.get(owner_id, msgs[user_ids[1]]) 
            # Берем того, кто не владелец, как member
            m_id = user_ids[1] if user_ids[0] == owner_id else user_ids[0]
            member_data = msgs[m_id]

        return {
            "text": owner_data["text"],
            "sex": owner_data["sex"],
            "member_text": member_data["text"],
            "member_sex": member_data["sex"]
        }

    async def _run_ai_flow(self, room_id: str, payload: dict):
        """Обертка для запуска ИИ с обработкой ошибок и снятием блокировки"""
        try:
            await self.get_ai_response_stream(room_id, payload)
        except Exception as e:
            print(f"DEBUG: Error in AI flow: {e}", flush=True)
        finally:
            self.processing_rooms[room_id] = False # Снимаем флаг в любом случае
            print(f"DEBUG: Lock released for room {room_id}", flush=True)

    # connection_manager.py
    async def get_ai_response_stream(self, room_id: str, payload: dict):
        uri = "ws://host.docker.internal:8001/ws/ai"
        try:
            # Добавляем таймаут для проверки соединения
            async with websockets.connect(uri) as ai_ws:
                await ai_ws.send(json.dumps(payload))

                async for message in ai_ws:
                    data = json.loads(message)
                    status = data.get("status")
                    content = data.get("text")

                    await self.broadcast(
                        {
                            "type": "ai_update", 
                            "step": status,
                            "content": content
                        },
                        str(room_id)
                    )

                    if status == "completed":
                        final_advice = content if content else ai_advice
                        self._update_room_in_db(room_id, payload, final_advice)

                        await self.close_room_connections(room_id)

        except Exception as e:
            print(f"DEBUG: AI Connection Failed: {type(e).__name__} - {e}", flush=True)
            await self.broadcast({"type": "error", "content": "ИИ-сервис недоступен"}, str(room_id))

    def _update_room_in_db(self, room_id: str, payload: dict, ai_advice: str):
        """Синхронная функция для обновления БД (вызывается из асинхронного контекста)"""
        db = SessionLocal()
        try:
            room = db.query(Room).filter(Room.id == int(room_id)).first()
            if room:
                room.owner_text = payload.get("text")
                room.member_text = payload.get("member_text")
                room.ai_advice = ai_advice
                room.status = "inactive"
                
                db.commit()
        except Exception as e:
            print(f"ERROR: DB Update failed: {e}", flush=True)
        finally:
            db.close()

    async def close_room_connections(self, room_id: str):
        if room_id in self.active_connections:
            sockets = list(self.active_connections[room_id])
            for ws in sockets:
                try:
                    await ws.close(code=1000)
                except Exception as e:
                    print(f"Error closing socket: {e}")
            
            self.active_connections.pop(room_id, None)
            self.room_messages.pop(room_id, None)