import clone from 'lodash/clone'
import CryptoJS from 'crypto-js'

const notificationAudio = new Audio('assets/audio/notification.mp3')
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

    this.socket.on('delete_message', ({ msgId, chatId }) => {
      const { getState, dispatch } = this.store
      const { chatSection } = getState()
      const { list } = Object.assign({}, chatSection)
      const chatIdx = list.findIndex(c => {
        return c._id === chatId
      })
      list[chatIdx].messages = list[chatIdx].messages.filter(m => m._id !== msgId)
      dispatch({
        type: 'SET_MAIN_STATE',
        payload: {
          chatSection: {
            ...chatSection,
            list
          }
        }
      })
    })

    this.socket.on('message_read', (data) => {
      const { chat, from, msgIds } = data
      const { getState, dispatch } = this.store
      const { chatSection, user } = getState()

      if (user._id === from) {
        const clonedState = Object.assign({}, chatSection)
        let chatList = clonedState.list
        const chatIdx = chatList.findIndex(c => c._id === chat)
        if (chatIdx > -1) {
          chatList[chatIdx].messages = chatList[chatIdx].messages.map(m => {
            if (msgIds.includes(m._id)) {
              return { ...m, unread: false }
            }
            return m
          })
          dispatch({
            type: 'SET_MAIN_STATE',
            payload: {
              ...chatSection,
              list: chatList
            }
          })
        }
      }
    })

    this.socket.on('chat_message', ({ message: msg, chat }) => {

      const decryptedText = CryptoJS.AES.decrypt(msg.text, process.env.REACT_APP_CRYPTO_KEY, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8)

      msg.text = decryptedText?.replace(/['"]+/g, '')

      const { getState, dispatch } = this.store
      const { chatSection, activeRoom, user } = getState()
      const { list } = Object.assign({}, chatSection)

      if (msg.to === user._id) {
        notificationAudio.play()
        if (activeRoom && activeRoom === msg.chat) {
          this.socket.emit('message_read', { to: msg.to, from: msg.from, chat: msg.chat })
        }
      }

      const chatIdx = list.findIndex(c => c._id === msg.chat ||
        (
          (c.chat_owner._id === msg.from && c.chat_guest._id === msg.to) ||
          (c.chat_guest._id === msg.from && c.chat_owner._id === msg.to)
        )
      )
      let clonedList = clone(list)

      // console.log(clonedList, chat)

      if (chatIdx > -1) {
        if (!clonedList[chatIdx].messages.length) {
          clonedList[chatIdx]._id = chat._id
        }
        clonedList[chatIdx].messages.push(msg)
        dispatch({
          type: 'SET_MAIN_STATE',
          payload: {
            chatSection: {
              ...chatSection,
              list: clonedList
            }
          }
        })
      } else {
        dispatch({
          type: 'SET_MAIN_STATE',
          payload: {
            chatSection: {
              ...chatSection,
              list: [...clonedList, { ...chat, messages: [msg] }]
            }
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

        let { list: clonedChatList } = Object.assign({}, chatSection)

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

    this.socket.on('user_update', (updatedUser) => {
      const { _id: userId } = updatedUser
      const { getState, dispatch } = this.store
      const { chatSection, searchSection } = getState()
      let { list: chatList } = Object.assign({}, chatSection), { list: searchList } = Object.assign({}, searchSection)

      const chatIdx = chatList.findIndex(c => c.chat_owner._id === userId || c.chat_guest._id === userId)
      const srchIdx = searchList.findIndex(u => u._id === userId)

      if (chatIdx > -1) {
        chatList[chatIdx][chatList[chatIdx].chat_owner._id === userId ? 'chat_owner' : 'chat_guest'] = updatedUser
      }
      if (srchIdx > -1) {
        searchList[srchIdx] = updatedUser
      }

      dispatch({
        type: 'SET_MAIN_STATE',
        payload: {
          chatSection: {
            ...chatSection,
            list: chatList
          },
          searchSection: {
            ...searchSection,
            list: searchList
          }
        }
      })

    })

  }

}

export default SocketListener