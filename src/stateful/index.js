class SocketListener {

  constructor(socket, store, open) {
    this.triggerSnack = open
    this.store = store
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
      const { getState, dispatch } = this.store
      const { chatSection } = getState()
      const { list } = chatSection

      const chatIdx = list.findIndex(c => c._id === msg.chat)
      const clonedList = list.slice()
      if (chatIdx > -1) {
        clonedList[chatIdx].messages.push(msg)
        dispatch({
          type: 'SET_MAIN_STATE',
          payload: {
            ...chatSection,
            list: clonedList
          }
        })
      }
    })

    this.socket.on('user_status', ({ userId, status }) => {
      const { dispatch, getState } = this.store
      const { user, searchSection } = getState()
      if (userId === user._id && status !== 'offline') {
        dispatch({
          type: 'SET_MAIN_STATE',
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
          dispatch({
            type: 'SET_MAIN_STATE',
            payload: {
              searchSection: {
                ...searchSection,
                list: clonedList
              }
            }
          })
        }
      }
    })
  }

}

export default SocketListener