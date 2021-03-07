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

    this.socket.on('user_status', ({ userId, status }) => {
      this.dispatch((prevState, $dispatch) => {
        const { user, searchSection } = prevState
        if (userId === user._id && status !== 'offline') {
          $dispatch({
            payload: {
              user: {
                ...user,
                status
              }
            }
          })
        } else {
          const usrIdx = searchSection.list.findIndex(item => {
            return item._id === userId
          })
          if (usrIdx > -1) {
            const clonedList = searchSection.list.slice()
            clonedList[usrIdx].status = status
            $dispatch({
              searchSection: {
                ...searchSection,
                list: clonedList
              }
            })
          }
        }
      })
    })
  }

}

export default SocketListener