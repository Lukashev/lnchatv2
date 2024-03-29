import Chat from '@root/models/Chat'
import Message from '@root/models/Message'
import User from '@root/models/User'
import closeSession from './handlers/closeSession'
import openSession from './handlers/openSession'

/**
 * @summary SocketListener
 */
class SocketListener {

  constructor(io) {
    this.io = io
    this.init()
  }

  init() {
    /**
     * Connection event handler
     */
    this.io.on('connection', (socket) => {
      // Create scope for binding functions
      const scope = { io: this.io, socket }

      /**
       * Initial actions: set session id and status to online
       */
      openSession.call(scope)

      socket.on('change_user_status', (arg) => {
        openSession.call(scope, arg)
      })
      /**
       * When user send private message
       */
      socket.on('send_message', async ({ from, to, text }) => {
        try {
          let chat = await Chat.findOne(
            {
              $or: [
                { chat_owner: from, chat_guest: to },
                { chat_owner: to, chat_guest: from }
              ]
            }
          )
          if (!chat) {
            chat = await Chat.create({ chat_guest: to, chat_owner: from })
          }
          const message = await Message.create({
            chat: chat._id,
            from,
            to,
            text
          })
          const destUser = await User.findById(message.to)

          chat = await chat.populate('chat_owner chat_guest').execPopulate()

          socket.emit('chat_message', { message: { ...message._doc }, chat: { ...chat._doc } })
          if (destUser.sessionId) {
            socket.broadcast.to(destUser.sessionId).emit('chat_message', { message: { ...message._doc }, chat: { ...chat._doc } })
          }
        } catch (e) {
          throw new Error(e)
        }
      })

      socket.on('message_read', async ({ chat, to, from }) => {
        try {
          const fromUser = await User.findById(from)
          const readMsgList = await Message.find({ chat, from, to, unread: true })
          await Message.update({ unread: true, to, chat }, { $set: { unread: false } }, { multi: true })
          if (fromUser.sessionId) {
            socket.broadcast.to(fromUser.sessionId).emit('message_read', { from, chat, msgIds: readMsgList.map(m => m._id) })
          }
        } catch (e) {
          throw new Error(e)
        }
      })

      socket.on('delete_message', async msgId => {
        const deletedMsg = await Message.findOneAndDelete({ _id: msgId })
        const receiver = await User.findById(deletedMsg.to)
        if (receiver.sessionId) {
          socket.broadcast.to(receiver.sessionId).emit('delete_message', { msgId, chatId: deletedMsg.chat })
        }
      })

      /**
       * User disconnected listener
       */
      socket.on('disconnect', closeSession.bind(scope))
      /**
       * Set to online after login
       */

    })


  }

}

export default SocketListener