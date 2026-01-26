from fastapi import APIRouter, Depends
from app.schemas import RoomCreateResponse
from app.deps import get_current_user

router = APIRouter(prefix="/api/rooms", tags=["Rooms"])

@router.post("/create", response_model=RoomCreateResponse)
async def create_room(current_user=Depends(get_current_user)):
    # Логика создания комнаты
    return {"room_id": "uuid"}