import actions from '@root/api/actions'
import Chat from '@root/models/Chat'
import Message from '@root/models/Message'
import User from '@root/models/User'

class SocketListener {

  constructor(io) {
    this.io = io
    this.init()
  }

  init() {
    this.io.on('connection', async socket => {
      console.log(`User joined: ${socket.id}`)

      try {
        await actions.update({ sessionId: socket.id, _id: socket.request.user.id }, 'User')
      } catch (e) {
        throw new Error(e.message)
      }

      socket.on('send_message', async ({ chat_owner, chat_guest, text }) => {
        try {
          let chat = await Chat.findOne(
            {
              $or: [
                { chat_owner, chat_guest },
                { chat_owner: chat_guest, chat_guest: chat_owner }
              ]
            }
          )
          if (!chat) {
            chat = await Chat.create({ chat_guest, chat_owner })
          }
          const message = await Message.create({
            chat: chat._id,
            from: chat_owner,
            to: chat_guest,
            text
          })
          const destUser = await User.findById(message.to)
          socket.emit('chat_message', message)
          if (destUser.sessionId) {
            socket.broadcast.to(destUser.sessionId).emit('chat_message',  message)
          }
        } catch(e) {
          throw new Error(e.message)
        }
      })
    })

  }

}

export default SocketListener