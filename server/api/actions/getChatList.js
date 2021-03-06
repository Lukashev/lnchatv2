import Chat from '@root/models/Chat'
import Message from '@root/models/Message'

export default async function getChatList(req, res) {
  try {
    // TODO get chats and messages, user status change
  } catch(e) {
    res.status(500).send({ message: e.message })
  }
}