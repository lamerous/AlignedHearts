from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Header
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app import models, schemas, auth_utils, deps 
from dotenv import load_dotenv
import os
import httpx
from random import randint

load_dotenv()

router = APIRouter(prefix="/api/auth/tg", tags=["Telegram"])

TELEGRAM_BOT_KEY = os.getenv("TELEGRAM_BOT_KEY")

@router.post("/register")
async def register_via_telegram(
    user_data: schemas.UserTgCreate, 
    response: Response, 
    x_telegram_key: str = Header(..., alias="X-Telegram-Key"),
    db: Session = Depends(deps.get_db)
):
    if (not x_telegram_key) or x_telegram_key != TELEGRAM_BOT_KEY:
        raise HTTPException(status_code=403, detail="Forbidden")

    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        return {"message": "Already registered"}

    new_user = models.User(
        username=user_data.username,
        email=user_data.email,
        sex=user_data.sex,
        telegram_id=user_data.telegram_id,
        hashed_password="tg_authenticated",
        avatar=f"https://storage-667.s3hoster.by/alignedhearts/avatars/avatar{randint(1, 5)}.jpg"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Registered"}