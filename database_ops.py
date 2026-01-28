from sqlalchemy import select, func
from db_connection import async_session
from models import User, Room, Input, AIAdvice


async def register_user_in_db(tg_id, username, first_name):
    async with async_session() as session:
        async with session.begin():
            stmt = select(User).where(User.telegram_id == tg_id)
            res = await session.execute(stmt)
            user = res.scalar_one_or_none()

            if not user:
                new_user = User(
                    telegram_id=tg_id,
                    username=username or f"user_{tg_id}",
                    email=f"{tg_id}@alignedhearts.ru", 
                    hashed_password="tg_authorized",         
                    sex="secret"
                )
                session.add(new_user)
                return "created"
            return "exists"


async def create_room_in_db(_tg_id, _room_code):
    async with async_session() as _session:
        async with _session.begin():
           
            _stmt = select(User).where(User.telegram_id == _tg_id)
            _res = await _session.execute(_stmt)
            _user = _res.scalar_one_or_none()
            
            if _user:
                _new_room = Room(
                    id=int(_room_code), 
                    owner_id=_user.id, 
                    status=0
                )
                _session.add(_new_room)
                return True
            return False
        
async def join_room_in_db(tg_id, room_code):
    async with async_session() as session:
        async with session.begin():
            user = (await session.execute(select(User).where(User.telegram_id == tg_id))).scalar_one_or_none()
            room = (await session.execute(select(Room).where(Room.id == room_code))).scalar_one_or_none()

            if room and user and room.member_id is None and room.owner_id != user.id:
                room.member_id = user.id
                room.status = 0 # Остается 0, пока не закроют
                return True
            return False

async def close_room_and_get_partner(tg_id):
    async with async_session() as session:
        async with session.begin():
            user = (await session.execute(select(User).where(User.telegram_id == tg_id))).scalar_one_or_none()
            if not user: return None

            stmt = select(Room).where(((Room.owner_id == user.id) | (Room.member_id == user.id)) & (Room.status == 0))
            room = (await session.execute(stmt)).scalar_one_or_none()
            
            if room:
                p_id = room.member_id if room.owner_id == user.id else room.owner_id
                room.status = 1 # ЗАКРЫВАЕМ
                if p_id:
                    p_user = await session.get(User, p_id)
                    return p_user.telegram_id
            return None


async def save_user_input(tg_id, room_code, text):
    async with async_session() as session:
        async with session.begin():
            user = (await session.execute(select(User).where(User.telegram_id == tg_id))).scalar_one_or_none()
            room = (await session.execute(select(Room).where(Room.id == room_code))).scalar_one_or_none()
            
            if user and room:
                new_input = Input(room_id=room.id, user_id=user.id, raw_text=text)
                session.add(new_input)
                
                
                count = (await session.execute(select(func.count(Input.id)).where(Input.room_id == room.id))).scalar()
                return count == 2 
            return False


async def save_ai_advice_to_db(room_code, advice_text):
    async with async_session() as session:
        async with session.begin():
            room = (await session.execute(select(Room).where(Room.id == room_code))).scalar_one_or_none()
            if room:
                
                for uid in [room.owner_id, room.member_id]:
                    if uid:
                        session.add(AIAdvice(room_id=room.id, user_id=uid, advice_text=advice_text))
                return True
            return False

async def get_ai_advice_from_db(room_code, tg_id):
    async with async_session() as session:
       
        stmt = select(AIAdvice.advice_text).join(User).where(
            User.telegram_id == tg_id, 
            AIAdvice.room_id == room_code
        )
        res = await session.execute(stmt)
        return res.scalar()