import secrets
import string

def generate_room_code(length=6):
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789"
    return ''.join(secrets.choice(chars) for _ in range(length))