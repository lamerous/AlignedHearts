import os
import secrets
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv

from app.auth import router as auth_router
from app.rooms import router as rooms_router
from app.profile import router as profile_router
from app.models import Base
from app.database import engine

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Aligned Hearts API",
    description="API для системы разрешения конфликтов в парах",
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None
)

app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET"))
app.include_router(auth_router)
app.include_router(rooms_router)
app.include_router(profile_router)

security = HTTPBasic()
SWAGGER_USER = os.getenv("SWAGGER_USER").encode("utf-8")
SWAGGER_PASS = os.getenv("SWAGGER_PASS").encode("utf-8")

def get_swagger_auth(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username.encode("utf-8"), SWAGGER_USER)
    correct_password = secrets.compare_digest(credentials.password.encode("utf-8"), SWAGGER_PASS)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect login or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

@app.get("/")
async def root():
    return {"message": "Aligned Hearts API is running"}

@app.get("/api/openapi.json", include_in_schema=False)
async def get_open_api_endpoint(username: str = Depends(get_swagger_auth)):
    return get_openapi(title="Aligned Hearts API", version="0.1.0", routes=app.routes)

@app.get("/api/docs", include_in_schema=False)
async def get_documentation(username: str = Depends(get_swagger_auth)):
    return get_swagger_ui_html(openapi_url="/api/openapi.json", title="Docs")