import telebot
from telebot import types
import webbrowser

bot = telebot.TeleBot('8112834276:AAFbAJrvTBHEabWb-pL7Oztum8YkikUTLNI')

@bot.message_handler(commands=['start'])
def main(message):
    bot.send_message(
        message.chat.id,
        f'Hello, {message.from_user.username}! This is your assistant Speedster for controlling your speed on streets. How can I help?'
    )
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton('Go on Speedster website', url='https://www.webpagetest.org/'))
    markup.add(types.InlineKeyboardButton('Description', callback_data='description'))
    bot.send_message(message.chat.id, "Choose an option:", reply_markup=markup)

@bot.message_handler(commands=['description'])
def description(message):
    bot.send_message(
        message.chat.id,
        'Speedster is a bot whose main goal is to help drivers control their speed while driving through city streets. All you need is to be registered on the main web application Speedster.'
    )
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton('Go on Speedster website', url='https://diploma-application-github-io.onrender.com/'))
    markup.add(types.InlineKeyboardButton('Description', callback_data='description'))
    bot.send_message(message.chat.id, "Choose an option:", reply_markup=markup)

@bot.message_handler(commands=['site', 'website'])
def site(message):
    webbrowser.open('https://diploma-application-github-io.onrender.com/')


@bot.callback_query_handler(func=lambda call: call.data == 'description')
def callback_description(call):
    description(call.message)

bot.polling(none_stop=True)

