import Chat from '@root/models/Chat'
import mongoose from 'mongoose'
import Message from '@root/models/Message'

export default async function getChatList(req, res) {
  const userId = req.user.id
  try {
    // TODO get chats and messages, user status change
    const chats = await Chat.find({
      $or: [
        { chat_owner: mongoose.Types.ObjectId(userId) },
        { chat_guest: mongoose.Types.ObjectId(userId) }
      ]
    }).populate('chat_owner chat_guest')
    const messages = await Message.find({
      'chat': {
        $in: chats.map(c => mongoose.Types.ObjectId(c._id))
      }
    })
    res.status(200).json({ result: { chats, messages } })
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
}