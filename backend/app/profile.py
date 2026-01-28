from fastapi import APIRouter, Depends, HTTPException, Response, UploadFile, File, status

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.schemas import UserRead, RoomHistoryItem, SexEnum
from app.deps import get_current_user, get_db, get_s3_client
from app.models import User, Room
from app.s3client import S3Client

from app.auth_utils import create_access_token, set_auth_cookie, verify_password, hash_password
from app.room_utils import generate_room_code

from typing import List

MAX_FILE_SIZE = 5 * 1024 * 1024

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

@router.patch("/change_name")
async def change_username(
    new_name: str,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.username == new_name:
        return {"message": "Имя успешно обновлено"}

    current_user.username = new_name
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    token = create_access_token(data={"sub": current_user.username})
    set_auth_cookie(response, token)

    return {"message": "Имя успешно обновлено"}

@router.patch("/change_sex")
async def change_sex(
    new_sex: SexEnum,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.sex == new_sex:
        return {"message": "Пол успешно обновлен"}

    current_user.sex = new_sex
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {"message": "Пол успешно обновлен"}

@router.post("/change_password")
async def change_password(
    old_password: str,
    new_password: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(old_password, current_user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный пароль")

    if old_password == new_password:
        return {"message": "Пароль успешно обновлен"}

    current_user.hashed_password = hash_password(new_password)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {"message": "Пароль успешно обновлен"}

@router.patch("/change_avatar")
async def change_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    s3: S3Client = Depends(get_s3_client)
):
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Файл слишком большой. Максимальный размер 5 МБ"
        )

    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недопустимый формат файла. Используйте JPEG, PNG или WebP"
        )

    file_data = await file.read()
    extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    object_name = f"avatars/user_{current_user.id}.{extension}"

    try:
        await s3.upload_fileobj(
            file_data=file_data,
            key=object_name,
            content_type=file.content_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка загрузки в S3: {str(e)}")

    avatar_url = f"{s3.config['endpoint_url']}/{s3.bucket_name}/{object_name}"
    current_user.avatar = avatar_url
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {"message": "Аватарка успешно обновлена", "avatar_url": avatar_url}