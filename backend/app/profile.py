from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.schemas import UserRead, RoomHistoryItem
from app.deps import get_current_user, get_db
from app.models import User, Room
from app.room_utils import generate_room_code

from typing import List


router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    """Получить данные текущего пользователя (требует JWT)"""
    return current_user

@router.get("/history", response_model=List[RoomHistoryItem])
async def user_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rooms = db.query(Room).filter(
        or_(
            Room.owner_id == current_user.id,
            Room.member_id == current_user.id
        )
    ).order_by(Room.created_at.desc()).all()

    return rooms