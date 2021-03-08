import clone from 'lodash/clone'
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

      const chatIdx = list.findIndex(c => c._id === msg.chat ||
        (
          (c.chat_owner._id === msg.from && c.chat_guest._id === msg.to) ||
          (c.chat_guest._id === msg.from && c.chat_owner._id === msg.to)
        )
      )
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
      const { user, searchSection, chatSection } = getState()
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
        const chatIdx = chatSection.list.findIndex(c => {
          return c.chat_guest._id === userId || c.chat_owner._id === userId
        })

        let clonedChatList = clone(chatSection.list)

        if (chatIdx > - 1) {
          const currentChat = clonedChatList[chatIdx]
          clonedChatList[chatIdx][
            currentChat.chat_guest._id === userId 
              ? 'chat_guest'
              : 'chat_owner'
          ].status = status 

          dispatch({
            type: 'SET_MAIN_STATE',
            payload: {
              chatSection: {
                ...chatSection,
                list: clonedChatList
              }
            }
          })
        }

        if (usrIdx > -1) {
          const clonedList = clone(searchSection.list)
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