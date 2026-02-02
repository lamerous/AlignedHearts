from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
from app import models, schemas, auth_utils, deps 
from dotenv import load_dotenv
import os
import httpx
from random import randint

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["Auth"])

oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid profile email"
    }
)

@router.post("/register", response_model=schemas.Token)
async def register(user_data: schemas.UserCreate, response: Response, db: Session = Depends(deps.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(
        username=user_data.username,
        email=user_data.email,
        sex=user_data.sex,
        hashed_password=auth_utils.hash_password(user_data.password),
        avatar=f"https://storage-667.s3hoster.by/alignedhearts/avatars/avatar{randint(1, 5)}.jpg"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = auth_utils.create_access_token(data={"sub": new_user.username})

    auth_utils.set_auth_cookie(response, token)

    return {"access_token": token, "refresh_token": "stub", "token_type": "bearer"}

@router.post("/login", response_model=schemas.Token)
async def login(user_data: schemas.UserLogin, response: Response, db: Session = Depends(deps.get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not auth_utils.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = auth_utils.create_access_token(data={"sub": user.username})
    auth_utils.set_auth_cookie(response, token)

    return {"access_token": token, "refresh_token": "stub", "token_type": "bearer"}

@router.get("/google/login")
async def login(request: Request):
    redirect_uri = request.url_for("auth_callback")
    if not request.url.is_secure and "localhost" not in str(redirect_uri):
        redirect_uri = str(redirect_uri).replace("http://", "https://")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def auth_callback(request: Request, response: Response, db: Session = Depends(deps.get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")
    
    if not user_info:
        raise HTTPException(status_code=400, detail="Google auth failed")

    user = db.query(models.User).filter(models.User.email == user_info["email"]).first()
    if not user:
        print(user_info)
        user = models.User(
            username=user_info["name"],
            email=user_info["email"],
            hashed_password="oauth_user_no_password"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    internal_token = auth_utils.create_access_token(data={"sub": user.username})

    response = RedirectResponse(url="/", status_code = 302)

    auth_utils.set_auth_cookie(response, internal_token)

    return response

@router.get('/logout')
async def logout(request: Request):
    request.session.pop('user', None)
    return {"message": "Вышли из аккаунта"}