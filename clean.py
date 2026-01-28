import asyncio
from db_connection import engine, Base

async def drop_all():
    async with engine.begin() as _conn:
        
        await _conn.run_sync(Base.metadata.drop_all)
    print("База полностью очищена!")

if __name__ == "__main__":
    asyncio.run(drop_all())