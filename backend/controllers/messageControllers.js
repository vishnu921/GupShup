const asyncHandler = require('express-async-handler')
const Message = require('../models/messageModel')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body
  
  if (!content || !chatId) {
    console.log("Invalid data passed into request")
    return res.sendStatus(400)
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  }

  try {
    let message = await Message.create(newMessage)

    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    })

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })

    const io = req.app.get('io');
    const chat = message.chat;
    if (!chat.users) console.log('chat users not defined');
    else {
      chat.users.forEach(user => {
        // if (user._id == message.sender._id) return
  
        io.to(user._id.toString()).emit('message_received', message)
      });
    }

    res.json(message)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate(
      "sender",
      "name pic email"
    ).populate("chat")

    res.json(messages)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

module.exports = { sendMessage, allMessages }