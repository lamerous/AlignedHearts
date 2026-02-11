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
    save_message_to_db, 
    leave_room_in_db ,
    clear_user_rooms_in_db,
    get_ai_advice_from_db
)




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
    markup.add(types.KeyboardButton("🆕 Создать комнату"), types.KeyboardButton("🔑 Войти в комнату"),types.KeyboardButton("🔄 Сбросить состояние"))
    return markup


def get_room_menu():
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(types.KeyboardButton("❌ Закрыть комнату"))
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

# Обработчик кнопки ОТМЕНА 
@bot.message_handler(func=lambda message: message.text == "⬅️ Отмена")
def cancel_action(message):
    uid = message.chat.id
    
    bot.send_message(
        uid, 
        "Действие отменено.", 
        reply_markup=get_main_menu()
    )

@bot.message_handler(func=lambda message: message.text == "🔄 Сбросить состояние")
def reset_status(message):
    uid = message.chat.id
    success = asyncio.run(clear_user_rooms_in_db(uid))
    if success:
        bot.send_message(uid, "🧹 Все ваши активные комнаты закрыты. Теперь вы можете создать новую!")
    else:
        bot.send_message(uid, "❌ Ошибка при очистке данных.")

@bot.message_handler(func=lambda message: message.text == "🆕 Создать комнату")
def create_room(message):
    uid = message.chat.id
    room_code, is_new = asyncio.run(create_room_in_db(uid))

    if room_code:
        if is_new:
            markup = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
            markup.add(types.KeyboardButton("Да"), types.KeyboardButton("Нет"))

            bot.send_message(
                uid, 
                f"✅ Комната создана!\nКод: `{room_code}`\n\nХотите написать о своих переживаниях?", 
                parse_mode='Markdown',
                reply_markup=markup
            )
            bot.register_next_step_handler(message, handle_ask_feelings)
        else:
            bot.send_message(
                uid, 
                f"⚠️ У вас уже есть активная комната!\nКод: `{room_code}`\n\n"
                "Сначала закройте её, чтобы создать новую.",
                parse_mode='Markdown'
            )
    else:
        bot.send_message(uid, "❌ Ошибка при создании комнаты.")



def handle_ask_feelings(message):
    uid = message.chat.id
    if message.text == "Да":
        msg = bot.send_message(uid, "📝 Напишите о ваших переживаниях:", reply_markup=get_room_menu())
        bot.register_next_step_handler(msg, process_initial_text)
    else:
        bot.send_message(uid, "Ожидайте партнера.", reply_markup=get_room_menu())



@bot.message_handler(func=lambda message: message.text == "❌ Закрыть комнату")
def close_room_action(message):
    uid = message.chat.id
    partner_tg_id = asyncio.run(leave_room_in_db(uid))

    bot.send_message(uid, "Вы закрыли комнату.", reply_markup=get_main_menu())

    if partner_tg_id:
        bot.send_message(partner_tg_id, "⚠️ Партнер завершил сессию.", reply_markup=get_main_menu())



@bot.message_handler(func=lambda message: message.text == "🔑 Войти в комнату")
def join_room_request(message):
    uid = message.chat.id
    msg = bot.send_message(uid, "Введите 6-значный код комнаты:", reply_markup=get_room_menu())
    bot.register_next_step_handler(msg, validate_received_code)



def validate_received_code(message):
    uid = message.chat.id
    if message.text == "⬅️ Отмена":
        bot.send_message(uid, "Вход отменен.", reply_markup=get_main_menu())
        return 

    result = asyncio.run(join_room_in_db(uid, message.text))
    
    if isinstance(result, dict) and result.get("status") == "success":
        bot.send_message(uid, "✅ Вы успешно вошли!", reply_markup=get_room_menu())
        bot.send_message(result["owner_tg_id"], "🎉 Партнер подключился!")
        msg = bot.send_message(uid, "📝 Напишите о ваших переживаниях:")
        bot.register_next_step_handler(msg, process_initial_text)
    elif result == "already_in":
        bot.send_message(uid, "🧐 Вы уже в этой комнате!", reply_markup=get_room_menu())
    elif result == "closed":
        bot.send_message(uid, "🚫 Комната закрыта.", reply_markup=get_main_menu())
    elif result == "full":
        bot.send_message(uid, "👥 Комната занята.", reply_markup=get_main_menu())
    elif result == "not_found":
        bot.send_message(uid, "❓ Код неверный.", reply_markup=get_main_menu())
    else:
        bot.send_message(uid, "❌ Ошибка.", reply_markup=get_main_menu())
      
        print(f"DEBUG: Result from DB was: {result}") # Это покажет, что именно пошло не так
        bot.send_message(uid, "❌ Ошибка.", reply_markup=get_main_menu())
        



def process_initial_text(message):
    uid = message.chat.id
    text = message.text

   
    if text == "⬅️ Отмена":
        bot.send_message(uid, "Вход отменен.", reply_markup=get_main_menu())
        return
    if text == "❌ Закрыть комнату":
        return close_room_action(message)

    
    result = asyncio.run(save_message_to_db(uid, text))
    
    if not result:
        bot.send_message(uid, "❌ Ошибка: комната не найдена.")
        return

    if result.get("status") == "already_sent":
        bot.send_message(uid, "⚠️ Вы уже записали свои переживания. Ожидайте совета или партнера.")
        return

    
    bot.send_message(uid, "✅ Ваши переживания сохранены.")

    
    if result.get("both_ready"):
        advice_text = result.get("advice") or "Ваши мысли услышаны обеими сторонами. Попробуйте обсудить их спокойно."
        
        
        bot.send_message(uid, f"💡 Совет от AI для вас обоих:\n\n{advice_text}")
        if result.get("partner_tg_id"):
            bot.send_message(result["partner_tg_id"], f"💡 Совет от AI для вас обоих:\n\n{advice_text}")
    else:
        
        if result.get("partner_tg_id"):
            bot.send_message(result["partner_tg_id"], "✉️ Ваш партнер поделился своими переживаниями. Теперь ваша очередь!")



# @bot.message_handler(func=lambda message: True)
# def echo_all(message):
#    print(f"ID пользователя {message.from_user.first_name}: {message.from_user.id}")

bot.polling(none_stop=True)

