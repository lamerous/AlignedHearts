from sqlalchemy import Column, Integer, BigInteger, String, ForeignKey, CheckConstraint, DateTime, func
from sqlalchemy.orm import relationship, declarative_base
from app.database import Base
from app.room_utils import generate_room_code

from dotenv import load_dotenv
from os import getenv

import uuid

load_dotenv()

S3_ENDPOINT_URL = getenv("S3_ENDPOINT_URL")
S3_BUCKET_NAME = getenv("S3_BUCKET_NAME")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    sex = Column(String, nullable=False, default="secret")
    hashed_password = Column(String, nullable=True)
    telegram_id = Column(BigInteger, unique=True, nullable=True, default=None)
    avatar = Column(String, default=f"{S3_ENDPOINT_URL}{S3_BUCKET_NAME}/noavatar.png")
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        CheckConstraint("sex IN ('male', 'female', 'secret')", name="check_sex_types"),
        CheckConstraint("(email IS NOT NULL) OR (telegram_id IS NOT NULL)", name="check_user_contact_info"),
    )

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True)
    code = Column(String(6), unique=True, index=True, default=generate_room_code)
    owner_id = Column(Integer, ForeignKey("users.id"))
    member_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String, default="active")
    owner_text = Column(String, nullable=True)
    member_text = Column(String, nullable=True)
    ai_advice = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())