from sqlalchemy import select, or_, update, desc
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
        
async def get_ai_advice_from_db(tg_id):
    async with async_session() as _session:
        async with _session.begin():
            _user_res = await _session.execute(select(User).where(User.telegram_id == tg_id))
            _user = _user_res.scalar_one_or_none()
            
            if not _user:
                return None

            _stmt = select(Room).where(
                (Room.status == "active") & 
                (or_(Room.owner_id == _user.id, Room.member_id == _user.id))
            )
            
            _res = await _session.execute(_stmt)
            _room = _res.scalars().first()

            if _room:
                return _room.ai_advice
                
            return None
        
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


async def clear_user_rooms_in_db(tg_id):
    async with async_session() as session:
        async with session.begin():
            user_res = await session.execute(select(User).where(User.telegram_id == tg_id))
            user = user_res.scalar_one_or_none()
            
            if not user:
                return False

            stmt = (
                update(Room)
                .where(
                    (Room.status == "active") & 
                    (or_(Room.owner_id == user.id, Room.member_id == user.id))
                )
                .values(status="closed")
            )
            
            await session.execute(stmt)
            return True
        

async def join_room_in_db(tg_id, room_code):
    async with async_session() as _session:
        async with _session.begin():
            user = (await _session.execute(select(User).where(User.telegram_id == tg_id))).scalar_one_or_none()
            if not user: return "user_not_found"

            check_stmt = select(Room).where(
                (Room.status == "active") & 
                (or_(Room.owner_id == user.id, Room.member_id == user.id))
            )
            existing_room = (await _session.execute(check_stmt)).scalars().first()
            
            if existing_room:
                return "already_in"

            room = (await _session.execute(select(Room).where(Room.code == room_code))).scalar_one_or_none()

            if not room: return "not_found"
            if room.status != "active": return "closed"
            if room.member_id is not None: return "full"
            
            room.member_id = user.id
            owner = (await _session.execute(select(User).where(User.id == room.owner_id))).scalar_one()
            return {"status": "success", "owner_tg_id": owner.telegram_id}
        


async def join_room_in_db(tg_id, room_code):
    async with async_session() as _session:
        res = await _session.execute(select(User).where(User.telegram_id == tg_id))
        user = res.scalar_one_or_none()
        if not user: return "user_not_found"

        clean_code = str(room_code).strip()
        
        stmt = select(Room).where((Room.code == clean_code) & (Room.status == "active"))
        res = await _session.execute(stmt)
        room = res.scalar_one_or_none()

        if not room: return "not_found"
        if room.member_id is not None: return "full"
        if room.owner_id == user.id: return "already_in"

        try:
            room.member_id = user.id
            await _session.commit()
            
            owner_res = await _session.execute(select(User).where(User.id == room.owner_id))
            owner = owner_res.scalar_one()
            
            return {"status": "success", "owner_tg_id": owner.telegram_id}
        except Exception as _e:
            await _session.rollback()
            return "error"
        
        

async def save_message_to_db(tg_id, text):
    async with async_session() as _session:
        async with _session.begin():
            res = await _session.execute(select(User).where(User.telegram_id == tg_id))
            user = res.scalar_one_or_none()
            if not user: return None

            stmt = select(Room).where(
                (Room.status == "active") & 
                ((Room.owner_id == user.id) | (Room.member_id == user.id))
            ).order_by(desc(Room.id))
            
            res = await _session.execute(stmt)
            room = res.scalars().first()

            if not room: return None

            if (room.owner_id == user.id and room.owner_text) or \
               (room.member_id == user.id and room.member_text):
                return {"status": "already_sent"}

            if room.owner_id == user.id:
                room.owner_text = text
            else:
                room.member_text = text

            both_ready = room.owner_text is not None and room.member_text is not None
            
            partner_id = room.member_id if room.owner_id == user.id else room.owner_id
            partner_tg_id = None
            if partner_id:
                res = await _session.execute(select(User).where(User.id == partner_id))
                partner = res.scalar_one_or_none()
                if partner:
                    partner_tg_id = partner.telegram_id

            return {
                "status": "success",
                "partner_tg_id": partner_tg_id,
                "both_ready": both_ready,
                "advice": room.ai_advice
            }

