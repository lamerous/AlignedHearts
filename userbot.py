import telebot
from telebot import types
import random
import time 
import os
import asyncio 

from dotenv import load_dotenv
from db_connection import init_db
from database_ops import (
    register_user_in_db, 
    create_room_in_db, 
    join_room_in_db, 
    save_user_input, 
    save_ai_advice_to_db, 
    get_ai_advice_from_db,
    close_room_and_get_partner
)


user_data = {}

load_dotenv()
_bot_token = os.getenv("BOT_TOKEN")

if not _bot_token:
    print("ОШИБКА: Токен не найден в файле .env!")
else:
    bot = telebot.TeleBot(_bot_token)


try:
    asyncio.run(init_db())
    print("База данных успешно инициализирована!")
except Exception as _e:
    print(f"Ошибка при подключении к базе: {_e}")


def get_main_menu():
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(types.KeyboardButton("🆕 Создать комнату"), types.KeyboardButton("🔗 Войти по коду"))
    return markup

def get_cancel_menu():
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(types.KeyboardButton("❌ Отмена / Выйти"))
    return markup



@bot.message_handler(commands=['start'])
def start(message):
    uid = message.chat.id
    uname = message.from_user.username
    first_name = message.from_user.first_name

    
    asyncio.run(register_user_in_db(uid, uname, first_name))
    
    welcome_text = (
        f"Привет, {first_name}! \n\n"
        "Это пространство для решения конфликтов. Создайте комнату или войдите по коду."
    )
    bot.send_message(uid, welcome_text, reply_markup=get_main_menu())

    
@bot.message_handler(func=lambda message: message.text == "🆕 Создать комнату")
def create_room(message):
    uid = message.chat.id
    
    
    room_code = random.randint(1000, 9999) 

    
    success = asyncio.run(create_room_in_db(uid, room_code))

    if success:
        bot.send_message(
            uid, 
            f"Комната создана! Код: `{room_code}`\n\nОтправь его партнеру.", 
            parse_mode='Markdown', 
            reply_markup=get_cancel_menu()
        )
    else:
        bot.send_message(uid, "Ошибка: сначала перезапустите бота командой /start")



@bot.message_handler(func=lambda message: message.text == "🔗 Войти по коду")
def join_room_request(message):
    uid = message.chat.id
    bot.send_message(uid, "Введите код комнаты:", reply_markup=get_cancel_menu())
    
    user_data[uid] = {"state": "entering_code"}

@bot.message_handler(func=lambda message: message.text == "❌ Отмена / Выйти")
def cancel(message):
    uid = message.chat.id 
    
    
    partner_tg_id = asyncio.run(close_room_and_get_partner(uid))
    
    
    if partner_tg_id:
        try:
            bot.send_message(
                partner_tg_id, 
                "Партнер покинул комнату. Сессия завершена.", 
                reply_markup=get_main_menu()
            )
            
            user_data.pop(partner_tg_id, None)
        except Exception as e:
            print(f"Ошибка уведомления партнера {partner_tg_id}: {e}")
    
   
    user_data.pop(uid, None)
    
    bot.send_message(uid, "Вы вышли в главное меню.", reply_markup=get_main_menu())


    
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
        room_code = message.text 
        
       
        if not room_code.isdigit():
            bot.send_message(uid, "❌ Код должен состоять только из цифр. Попробуйте еще раз:")
            return

       
        success = asyncio.run(join_room_in_db(uid, int(room_code)))
        
        if not success:
            bot.send_message(uid, 
                "❌ Комната не найдена, заполнена или это ваш собственный код.\nПроверьте и введите ещё раз:", 
                reply_markup=get_cancel_menu())
            return

       
        
        user_data[uid] = {"room": room_code, "state": "writing"}
        
        
        
        bot.send_message(uid, 
            "🤝 Соединение установлено! Опишите свои чувства и ситуацию:", 
            reply_markup=get_cancel_menu())

   
    elif state == "writing":
        room_code = user_data[uid].get("room")
        if not room_code:
            bot.send_message(uid, "Ошибка: комната не найдена. Нажмите /start")
            return

        
        ready_for_ai = asyncio.run(save_user_input(uid, room_code, message.text))
        
        user_data[uid]["state"] = "sent"
        bot.send_message(uid, "✅ Ваша позиция принята. Ожидаем партнера...")

        if ready_for_ai:
           
            send_result(room_code)

def send_result(room_code):
    # 1. Текст от AI (здесь будет вызов твоей нейросети)
    generated_text = (
        "✨ **Анализ вашей ситуации готов:**\n\n"
        "Я проанализировал обе стороны. Кажется, возникло недопонимание в приоритетах. "
        "Попробуйте обсудить это вечером в спокойной обстановке. ❤️"
    )

    
    asyncio.run(save_ai_advice_to_db(room_code, generated_text))

    
    users_to_clean = []
    for uid, data in user_data.items():
        if data.get("room") == room_code:
           
            advice_from_db = asyncio.run(get_ai_advice_from_db(room_code, uid))
            
            if advice_from_db:
                try:
                    bot.send_chat_action(uid, 'typing')
                    bot.send_message(uid, advice_from_db, parse_mode='Markdown', reply_markup=get_main_menu())
                    users_to_clean.append(uid)
                except Exception as e:
                    print(f"Ошибка отправки для {uid}: {e}")

    
    for uid in users_to_clean:
        user_data.pop(uid, None)

bot.polling(none_stop=True)

#structure of list with rooms
#rooms = {
#    "1111": {"users": [ID_1, ID_2], "messages": {ID_1: "...", ID_2: "..."}},
#    "2222": {"users": [ID_3, ID_4], "messages": {ID_3: "...", ID_4: "..."}},
#    "3333": {"users": [ID_5, ID_6], "messages": {ID_5: "...", ID_6: "..."}}
#}