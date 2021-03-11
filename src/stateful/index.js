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

    this.socket.on('chat_message', ({ message: msg, chat }) => {

      const decryptedText = CryptoJS.AES.decrypt(msg.text, process.env.REACT_APP_CRYPTO_KEY, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8)

      msg.text = decryptedText?.replace(/['"]+/g, '')

      const { getState, dispatch } = this.store
      const { chatSection, user } = getState()
      const { list } = chatSection

      if (msg.to === user._id) {
        notificationAudio.play()
      }

      const chatIdx = list.findIndex(c => c._id === msg.chat ||
        (
          (c.chat_owner._id === msg.from && c.chat_guest._id === msg.to) ||
          (c.chat_guest._id === msg.from && c.chat_owner._id === msg.to)
        )
      )
      const clonedList = clone(list)
      if (chatIdx > -1) {
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

    this.socket.on('user_update', (updatedUser) => {
      const { _id: userId } = updatedUser
      const { getState, dispatch } = this.store
      const { chatSection, searchSection } = getState()
      const chatList = clone(chatSection.list), searchList = clone(searchSection.list)

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