from sqlalchemy import Column, Integer, BigInteger, String, ForeignKey, CheckConstraint, DateTime, func
from sqlalchemy.orm import relationship, declarative_base
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    sex = Column(String, nullable=False, default="secret")
    hashed_password = Column(String, nullable=True)
    telegram_id = Column(BigInteger, unique=True, nullable=True, default=None)
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        CheckConstraint("sex IN ('male', 'female', 'secret')", name="check_sex_types"),
    )

class Room(Base):
    __tablename__ = "rooms"
    id = Column(String, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    member_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="active")
    created_at = Column(DateTime, server_default=func.now())