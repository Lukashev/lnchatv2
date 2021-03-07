import actions from '@root/api/actions'
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
        console.log(from, to, text)
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
          socket.emit('chat_message', message)
          if (destUser.sessionId) {
            socket.broadcast.to(destUser.sessionId).emit('chat_message', message)
          }
        } catch (e) {
          throw new Error(e)
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