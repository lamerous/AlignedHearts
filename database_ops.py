from sqlalchemy import select, or_
from db_connection import async_session
from models import User, Room


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
                    email=None, 
                    hashed_password=None, 
                    sex="secret"
                )
                session.add(new_user)
                return "created"
            return "exists"
        

async def leave_room_in_db(tg_id):
    async with async_session() as session:
        async with session.begin():
            user_res = await session.execute(select(User).where(User.telegram_id == tg_id))
            user = user_res.scalar_one_or_none()
            
            if not user:
                return None

            room_stmt = select(Room).where(
                (Room.status == "active") & 
                ((Room.owner_id == user.id) | (Room.member_id == user.id))
            )
            room_res = await session.execute(room_stmt)
            #room = room_res.scalar_one_or_none()
            room = room_res.scalars().first()
            if room:
                partner_id = room.member_id if room.owner_id == user.id else room.owner_id
                partner_tg_id = None
                
                if partner_id:
                    p_res = await session.execute(select(User).where(User.id == partner_id))
                    partner = p_res.scalar_one_or_none()
                    if partner:
                        partner_tg_id = partner.telegram_id
                
                room.status = "closed"
                return partner_tg_id
            
            return None

async def create_room_in_db(tg_id):
    async with async_session() as session:
        async with session.begin():
            user_stmt = select(User).where(User.telegram_id == tg_id)
            user_res = await session.execute(user_stmt)
            user = user_res.scalar_one_or_none()
            
            if user:
                check_stmt = select(Room).where(
                    (Room.status == "active") & 
                    (or_(Room.owner_id == user.id, Room.member_id == user.id))
                )
                check_res = await session.execute(check_stmt)
                existing_room = check_res.scalars().first()

                if existing_room:
                    return existing_room.code, False

                new_room = Room(owner_id=user.id, status="active")
                session.add(new_room)
                await session.flush()
                return new_room.code, True
                
            return None, False

async def join_room_in_db(tg_id, room_code):
    async with async_session() as session:
        async with session.begin():
            user = (await session.execute(select(User).where(User.telegram_id == tg_id))).scalar_one_or_none()
            if not user: return "user_not_found"

            room = (await session.execute(select(Room).where(Room.code == room_code))).scalar_one_or_none()

            if not room: return "not_found"
            if room.status != "active": return "closed"
            if room.owner_id == user.id or room.member_id == user.id: return "already_in"
            if room.member_id is not None: return "full"
            
            room.member_id = user.id
            owner = (await session.execute(select(User).where(User.id == room.owner_id))).scalar_one()
            return {"status": "success", "owner_tg_id": owner.telegram_id}
        



async def save_message_to_db(tg_id, text):
    async with async_session() as session:
        async with session.begin():
            user = (await session.execute(select(User).where(User.telegram_id == tg_id))).scalar_one_or_none()
            if not user: return None

            stmt = select(Room).where((Room.status == "active") & ((Room.owner_id == user.id) | (Room.member_id == user.id)))
            room = (await session.execute(stmt)).scalar_one_or_none()

            if room:
                if room.owner_id == user.id:
                    room.owner_text = text
                else:
                    room.member_text = text
                
                partner_id = room.member_id if room.owner_id == user.id else room.owner_id
                if partner_id:
                    p_res = await session.execute(select(User).where(User.id == partner_id))
                    return p_res.scalar_one().telegram_id
            return None
        



