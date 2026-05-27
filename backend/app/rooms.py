from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.schemas import RoomCreateResponse, RoomConnectResponse
from app.deps import get_current_user, get_db
from app.models import Room
from app.room_utils import generate_room_code

router = APIRouter(prefix="/api/rooms", tags=["Rooms"])

@router.post("/create", response_model=RoomCreateResponse)
async def create_room(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    active_room_exists = db.query(Room).filter(
        Room.owner_id == current_user.id,
        Room.status == "active"
    ).first()
    
    if active_room_exists:
        raise HTTPException(status_code=400, detail="У вас уже есть активная комната")

    room_code = generate_room_code()

    new_room = Room(
        owner_id=current_user.id,
        code=room_code,
        status="active"
    )

    try:
        db.add(new_room)
        db.commit()
        db.refresh(new_room)
    except Exception as err:
        print(err)
        db.rollback()
        raise HTTPException(status_code=500, detail="Ошибка при создании комнаты")

    return {
        "code": room_code,
        "ws_url": f"ws://10.81.171.73:8000/ws/{new_room.id}"
    }

@router.post("/connect", response_model=RoomConnectResponse)
async def room_connect(
    code: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    room = db.query(Room).filter(Room.code == code, Room.member_id == None).first()

    if not room:
        raise HTTPException(status_code=404, detail="Комната не найдена")

    room.member_id = current_user.id

    db.add(room)
    db.commit()

    return {
        "ws_url": f"ws://10.81.171.73:8000/ws/{room.id}"
    }

@router.delete("/cancel")
async def delete_created_room(
    current_user=Depends(get_current_user), db: Session = Depends(get_db)
):
    try:
        room = db.query(Room).filter(
            or_(
            Room.owner_id == current_user.id,
            Room.member_id == current_user.id
            ),
            Room.status == "active"
        ).first()

        if room and room.member_id:
            partner_id = room.member_id if current_user.id == room.owner_id else room.owner_id
        else:
            partner_id = -1

        if room:
            db.delete(room)
            db.commit()

        return {
            "message": "Вы отменили поиск комнат",
            "partner_id": partner_id
        }

    except Exception as err:
        db.rollback()
        print("Error:", err)
        raise HTTPException(status_code=500, detail="Ошибка обновления статуса комнаты")