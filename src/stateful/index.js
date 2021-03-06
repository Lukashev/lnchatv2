class SocketListener {

  constructor(socket, dispatch, open) {
    this.triggerSnack = open
    this.dispatch = dispatch
    this.socket = socket
    this.init()
  }

  init() {
    this.socket.on('connect', () => {
      this.triggerSnack('WS connection was established', 1000)
    })

    this.socket.on('error', (e) => {
      this.triggerSnack(String(e), 2000)
    })

    this.socket.on('chat_message', msg => {
      this.dispatch({ type: 'UPDATE_CHAT_ITEM', payload: { chatId: msg.chat, msg } })
    })
  }

}

export default SocketListener