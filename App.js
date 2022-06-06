// We will create a Telegram bot who wil generate a strong password and notify the user change password 
import TelegramBot from "node-telegram-bot-api"
import generator from "generate-password"
import uniqueRandom from 'unique-random';

// Define the bot TOKEN ! It will be use later to connect the code to the bot
const TOKEN = "TOKEN"
// Now we create a connection with our bot
const Bot = new TelegramBot(TOKEN, {polling:true})
// We add a event listener on start message receive

Bot.onText(/\/start/, async (msg)=>{
    // We recover the user id to send back a message
    const userId = msg.chat.id
    // Now we create the message we want to send
    let message = `<b>Bonjour</b> 👋 je suis le générateur de mot de passe aléatoires 🤖 ! Veuillez choisir parmis les options ci-dessous pour commencer.`
    // We add to this message a inline keyboard for user choice
    let inline = [
        [
            {
                text: "🔒 Mot de passe (8 et 16 caractères)",
                callback_data: "low_password"
            }
        ],[
            {
                text: "🔒 Mot de passe (16 à 24 caractères)",
                callback_data: "hard_password"
            }
        ],[
            {
                text: "👮‍♂️ Politique de confidentialité",
                callback_data: "display_policy"
            }
        ],[
            {
                text: "⭐ Contacter le créateur",
                callback_data: "show_creator",
                url: "tg://user?id=HTBROBOT"
            }
        ]
    ]
    Bot.sendMessage(userId, message, {reply_markup: JSON.stringify({
        inline_keyboard:inline
    }), parse_mode: "HTML"})
})


Bot.on("callback_query",(callback)=>{
    let ID = callback.message.chat.id;
    switch(callback.data){
        case "low_password": 
            sender(ID, 8, 16)
            break;

        case "hard_password":
            sender(ID, 16, 24)
            break

        case "display_policy":
            break

        case "show_creator":
            break
            
        case "copy":
            let value = callback.message.text.toString().split(":")[1].split("Que voulez-vous")[0].trim()
            copy(ID, value)
            break
    }
    Bot.deleteMessage(ID, callback.message.message_id.toString())
})


function copy(ID, password){
    Bot.sendMessage(ID, password)
}

function sender(id, min, max){
    const randomNumber = uniqueRandom(min, max);
    let inline = [[
        {
            text: "🔁 Regénerer",
            callback_data: "low_password"
        }, {
            text: "📄 Copier",
            callback_data: "copy"
        }
    ]]
    let password = generator.generate({
        length: randomNumber(),
        numbers: true
    })
    Bot.sendMessage(id, `⚠️ Votre <b>Mot de passe</b> est : ${password}\nQue voulez-vous faire ?`, {parse_mode: "HTML", reply_markup: JSON.stringify({
        inline_keyboard:inline
    })
})
}