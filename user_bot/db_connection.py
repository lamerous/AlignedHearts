import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool 

load_dotenv()

DATABASE_URL = f"postgresql+asyncpg://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
print(f"DEBUG URL: {DATABASE_URL}")

engine = create_async_engine(DATABASE_URL, echo=True, poolclass=NullPool)

async_session = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def init_db():
    
    from models import User, Room
    async with engine.begin() as _conn:
        await _conn.run_sync(Base.metadata.create_all)
    print("Таблицы успешно инициализированы!")