import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from fastapi import Depends, HTTPException, status, Request, WebSocket
from fastapi.security import OAuth2PasswordBearer
from starlette.requests import HTTPConnection

from jose import jwt, JWTError
from dotenv import load_dotenv

from app.models import User
from app.auth_utils import SECRET_KEY, ALGORITHM
from app.database import SessionLocal

from app.s3client import S3Client

load_dotenv()

s3client = S3Client(
    access_key=os.getenv("S3_ACCESS_KEY"),
    secret_key=os.getenv("S3_SECRET_KEY"),
    endpoint_url=os.getenv("S3_ENDPOINT_URL"),
    bucket_name=os.getenv("S3_BUCKET_NAME")
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(
    connection: HTTPConnection, 
    db: Session = Depends(get_db)
):
    token = connection.cookies.get("access_token")
    
    if token and token.startswith("Bearer "):
        token = token.split(" ")[1]
    else:
        auth_header = connection.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось валидировать учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

def get_s3_client():
    return s3client