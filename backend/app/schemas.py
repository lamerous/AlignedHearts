from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from enum import Enum

class SexEnum(str, Enum):
    male = "male"
    female = "female"
    secret = "secret"

class UserBase(BaseModel):
    username: str
    sex: SexEnum = SexEnum.secret
    email: EmailStr

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    avatar: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RoomCreateResponse(BaseModel):
    code: str
    ws_url: str

class RoomConnectResponse(BaseModel):
    ws_url: str

class ConflictAnalysis(BaseModel):
    emotion: str = Field(..., description="Результат ruBERT-tiny2: Агрессия, Тревога и т.д.")
    trigger: str = Field(..., description="Предмет конфликта: Быт, Секс, Деньги...")
    stage: str = Field(..., description="Стадия: Напряжение, Скандал и т.д.")

class AIResultResponse(BaseModel):
    analysis: ConflictAnalysis
    partner_perspective: str = Field(..., description="Объяснение чувств партнера от Llama 3.2")
    recommendations: List[str] = Field(..., description="Список советов из БД решений")