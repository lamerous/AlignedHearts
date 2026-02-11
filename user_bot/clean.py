import asyncio
from sqlalchemy import delete, select

from models import User, Room
from db_connection import async_session

async def delete_user_rooms(tg_id):
  
    async with async_session() as _session:
        
        async with _session.begin():
            
            _user_stmt = select(User).where(User.telegram_id == tg_id)
            _user_res = await _session.execute(_user_stmt)
            _user = _user_res.scalar_one_or_none()
            
            if not _user:
                print(f"Пользователь с ID {tg_id} не найден в базе данных.")
                return

            
            _delete_stmt = delete(Room).where(
                (Room.owner_id == _user.id) | (Room.member_id == _user.id)
            )
            
            await _session.execute(_delete_stmt)
            print(f"Готово! Все записи комнат для пользователя {tg_id} (внутренний ID: {_user.id}) удалены.")

if __name__ == "__main__":
    # Telegram ID
    _my_id = 1114320066
    asyncio.run(delete_user_rooms(_my_id))