from sqlalchemy import Column, Integer,BigInteger, String, ForeignKey, DateTime, CheckConstraint, Text, func
from db_connection import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True)
    hashed_password = Column(String, nullable=False)
    sex = Column(String)
    
    telegram_id = Column(BigInteger, unique=True)
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        CheckConstraint("sex IN ('male', 'female', 'other')", name="check_sex"),
    )

class Room(Base):
    __tablename__ = "rooms"
   
    id = Column(Integer, primary_key=True) 
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

class Input(Base):
    __tablename__ = "inputs"
    id = Column(Integer, primary_key=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    raw_text = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class AIAdvice(Base):
    __tablename__ = "ai_advices"
    id = Column(Integer, primary_key=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    advice_text = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

  