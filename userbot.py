import telebot
from telebot import types
import random
import time 

import os
from dotenv import load_dotenv

load_dotenv()
_bot_token = os.getenv("BOT_TOKEN")
if not _bot_token:
    print("ОШИБКА: Токен не найден в файле .env!")
else:
    bot = telebot.TeleBot(_bot_token)


rooms = {}
user_data = {}

def get_main_menu():
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(types.KeyboardButton("🆕 Создать комнату"), types.KeyboardButton("🔗 Войти по коду"))
    return markup

def get_cancel_menu():
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(types.KeyboardButton("❌ Отмена / Выйти"))
    return markup




# --- ТЕСТОВЫЕ ДАННЫЕ ДЛЯ ПРОВЕРКИ ---
_test_room_code = "7777"
_test_partner_id = 123456789  


rooms[_test_room_code] = {
    "users": [_test_partner_id], 
    "messages": {
        _test_partner_id: "Я чувствую, что мы мало проводим времени вместе, и меня это расстраивает."
    }
}


user_data[_test_partner_id] = {"room": _test_room_code, "state": "sent"}
# ----------------------------------



@bot.message_handler(commands=['start'])
def start(message):
    welcome_text = (
        f"Привет, {message.from_user.first_name}! \n\n"
        "Это пространство для решения конфликтов. Создайте комнату или войдите по коду."
    )
    bot.send_message(message.chat.id, welcome_text, reply_markup=get_main_menu())

@bot.message_handler(func=lambda message: message.text == "🆕 Создать комнату")
def create_room(message):
    uid = message.chat.id
    if uid in user_data:
        bot.send_message(uid, "Вы уже находитесь в процессе. Нажмите 'Отмена', чтобы начать заново.")
        return

    room_code = str(random.randint(1000, 9999))
    while room_code in rooms:
        room_code = str(random.randint(1000, 9999))

    rooms[room_code] = {"users": [uid], "messages": {}}
    user_data[uid] = {"room": room_code, "state": "waiting_partner"}
    
    bot.send_message(uid, 
        f"Комната создана! Код: `{room_code}`\n\nОтправь его партнеру.", 
        parse_mode='Markdown', reply_markup=get_cancel_menu())

@bot.message_handler(func=lambda message: message.text == "🔗 Войти по коду")
def join_room_request(message):
    bot.send_message(message.chat.id, "Введите код комнаты:", reply_markup=get_cancel_menu())
    user_data[message.chat.id] = {"state": "entering_code"}

@bot.message_handler(func=lambda message: message.text == "❌ Отмена / Выйти")
def cancel(message):
    _uid = message.chat.id 
    
    if _uid in user_data:
        _room_code = user_data[_uid].get("room")
        if _room_code and _room_code in rooms:
            for _other_id in rooms[_room_code]["users"]:
                if _other_id != _uid:
                   
                    try:
                        bot.send_message(_other_id, "Партнер покинул комнату. Сессия завершена.", reply_markup=get_main_menu())
                    except Exception as _e:
                        print(f"DEBUG: Не удалось отправить уведомление фейку {_other_id}: {_e}")
                    
                    user_data.pop(_other_id, None)
            rooms.pop(_room_code, None)
        user_data.pop(_uid, None)
    
    
    bot.send_message(_uid, "Вы вышли в главное меню.", reply_markup=get_main_menu())

@bot.message_handler(func=lambda message: True, content_types=['text', 'photo', 'sticker', 'video', 'document'])
def handle_all_inputs(message):
    uid = message.chat.id
    if message.text == "❌ Отмена / Выйти":
        cancel(message) 
        return
    
    state = user_data.get(uid, {}).get("state")
   
    if not state: 
        return 

    if message.content_type != 'text':
        bot.send_message(uid, "⚠️ Пожалуйста, используй только текст.")
        return 

    if state == "entering_code":
        _code = message.text 
        
        if _code not in rooms:
            bot.send_message(uid, 
                "❌ Комната не найдена. Проверьте код и введите ещё раз:", 
                reply_markup=get_cancel_menu())
            return 

        if uid in rooms[_code]["users"]:
            bot.send_message(uid, "Вы уже находитесь в этой комнате. Ожидайте партнера.")
            return

        if len(rooms[_code]["users"]) >= 2:
            bot.send_message(uid, 
                "🚫 Эта комната уже заполнена. Вы можете создать свою.", 
                reply_markup=get_main_menu())
            user_data.pop(uid, None) 
            return

      
        rooms[_code]["users"].append(uid)
        for _user_id in rooms[_code]["users"]:
            user_data[_user_id] = {"room": _code, "state": "writing"}
            
            
            try:
                bot.send_message(_user_id, 
                    "🤝 Соединение установлено! Опишите свои чувства и ситуацию:", 
                    reply_markup=get_cancel_menu())
            except Exception as _e:
                
                print(f"Ошибка отправки для {_user_id}: {_e}")

    elif state == "writing":
        room_code = user_data[uid]["room"]
        rooms[room_code]["messages"][uid] = message.text
        user_data[uid]["state"] = "sent"
        bot.send_message(uid, "Сообщение принято. Ждем партнера...")

        if len(rooms[room_code]["messages"]) == 2:
            send_result(room_code)




def send_result(room_code):
    room = rooms[room_code]
    
    
    for user_id in room["users"]:
        bot.send_chat_action(user_id, 'typing')
    
    time.sleep(2) 

    result_text = "✨ **Анализ вашей ситуации готов:**\n\nБот изучил ваши позиции. Похоже, вам обоим важно быть услышанными. ❤️"
    
    for user_id in room["users"]:
        bot.send_message(user_id, result_text, parse_mode='Markdown', reply_markup=get_main_menu())
        user_data.pop(user_id, None)
    
    rooms.pop(room_code, None)

bot.polling(none_stop=True)

#structure of list with rooms
#rooms = {
#    "1111": {"users": [ID_1, ID_2], "messages": {ID_1: "...", ID_2: "..."}},
#    "2222": {"users": [ID_3, ID_4], "messages": {ID_3: "...", ID_4: "..."}},
#    "3333": {"users": [ID_5, ID_6], "messages": {ID_5: "...", ID_6: "..."}}
#}