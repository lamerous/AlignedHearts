from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from dotenv import load_dotenv
import os
import secrets

load_dotenv()

app = FastAPI(
    title="Aligned Hearts API",
    description="API для системы разрешения конфликтов в парах",
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None
)

security = HTTPBasic()

SWAGGER_USER = os.getenv("SWAGGER_USER").encode("utf-8")
SWAGGER_PASS = os.getenv("SWAGGER_PASS").encode("utf-8")

def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username.encode("utf-8"), SWAGGER_USER)
    correct_password = secrets.compare_digest(credentials.password.encode("utf-8"), SWAGGER_PASS)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

@app.get("/openapi.json", include_in_schema=False)
async def get_open_api_endpoint(username: str = Depends(get_current_username)):
    return get_openapi(title="Aligned Hearts API", version="0.1.0", routes=app.routes)

@app.get("/docs", include_in_schema=False)
async def get_documentation(username: str = Depends(get_current_username)):
    return get_swagger_ui_html(openapi_url="/openapi.json", title="Docs")

# --- Схемы данных (Pydantic модели) ---

class User(BaseModel):
    id: str
    login: str
    username: str
    email: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RoomCreateResponse(BaseModel):
    room_id: str
    invite_link: str

class ConflictAnalysis(BaseModel):
    emotion: str = Field(..., description="Результат ruBERT-tiny2: Агрессия, Тревога и т.д.")
    trigger: str = Field(..., description="Предмет конфликта: Быт, Секс, Деньги...")
    stage: str = Field(..., description="Стадия: Напряжение, Скандал и т.д.")

class AIResultResponse(BaseModel):
    analysis: ConflictAnalysis
    partner_perspective: str = Field(..., description="Объяснение чувств партнера от Llama 3.2")
    recommendations: List[str] = Field(..., description="Список советов из БД решений")

# --- Эндпоинты: Auth ---

@app.post("/api/auth/register", tags=["Auth"], response_model=Token)
async def register(login: str, email: str, password: str):
    """Регистрация нового пользователя"""
    pass

@app.post("/api/auth/login", tags=["Auth"], response_model=Token)
async def login(login: str, password: str):
    """Вход в систему"""
    pass

@app.get("/api/auth/me", tags=["Auth"], response_model=User)
async def get_me():
    """Получить данные текущего пользователя"""
    pass

@app.get("/api/google/login", tags=["Auth"])
async def google_login():
    return {"url": "https://accounts.google.com/o/oauth2/auth?..."}

@app.get("/api/auth/google/callback", tags=["Auth"], response_model=Token)
async def google_callback(code: str):
    return {
        "access_token": "google_session_token",
        "refresh_token": "google_refresh_token",
        "token_type": "bearer"
    }

# --- Эндпоинты: Rooms ---

@app.post("/api/rooms/create", tags=["Rooms"], response_model=RoomCreateResponse)
async def create_room():
    """Создание комнаты для двоих и генерация ссылки-приглашения"""
    pass

@app.get("/api/rooms/{id}", tags=["Rooms"])
async def get_room_status(id: str):
    """Проверка статуса комнаты: вошел ли партнер, готов ли результат"""
    pass

@app.post("/api/rooms/{id}/send_message", tags=["Rooms"], status_code=202)
async def send_message(id: str, text: str):
    """
    Отправка текста сообщения для анализа. 
    Возвращает 202 (Accepted), так как обработка нейросетью асинхронна.
    """
    return {"status": "processing"}

@app.get("/api/room/{id}/result", tags=["Rooms"], response_model=AIResultResponse)
async def get_ai_result(id: str):
    """Получение итогового анализа и рекомендаций"""
    pass

# --- WebSocket (Документируется отдельно, так как Swagger не поддерживает WS из коробки) ---

@app.websocket("/ws/room/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    """
    WebSocket для real-time обновлений:
    - Статусы печати (typing/stop_typing)
    - Статусы ИИ-пайплайна (analyzing_emotions, generating_result)
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Логика трансляции статусов
            await websocket.send_json({"event": "partner_typing", "status": True})
    except WebSocketDisconnect:
        print(f"Client disconnected from room {room_id}")