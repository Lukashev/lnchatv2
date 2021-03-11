import React, { useEffect } from 'react'
import CryptoJS from 'crypto-js'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-simple-snackbar'
import ChatItem from '../components/ChatItem'

const Chat = () => {
  const { chatSection, activeRoom, api, searchSection, user } = useSelector(state => state)
  const [open] = useSnackbar()
  const dispatch = useDispatch()
  const chatList = chatSection.list

  const setActiveRoom = (id) => {
    dispatch({ type: 'SET_MAIN_STATE', payload: { activeRoom: id } })
  }

  useEffect(() => {
    const fn = async () => {
      try {
        const { data } = await api.getChatList()
        const { chats, messages } = data.result
        const list = chats.map(c => {
          return {
            ...c,
            messages: messages
              .map(m => {
                const decryptedMsg = CryptoJS.AES.decrypt(m.text, process.env.REACT_APP_CRYPTO_KEY, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8)
                return {
                  ...m,
                  text: decryptedMsg?.replace(/['"]+/g, '')
                }
              })
              .filter(m => m.chat === c._id)
          }
        })
        const { newChat } = searchSection
        dispatch({
          type: 'SET_MAIN_STATE',
          payload: {
            chatSection: {
              ...chatSection,
              list: newChat ? [newChat, ...list] : list
            },
            searchSection: {
              ...searchSection,
              newChat: null
            }
          }
        })
      } catch (e) {
        open(String(e), 2000)
      }
    }
    fn()
  }, []) // eslint-disable-line

  return (
    <>
      {chatList.length
        ? chatList.map((chat, index) => {
          return <ChatItem
            {...chat}
            key={index}
            focused={chat._id === activeRoom || index === activeRoom}
            handleClick={setActiveRoom}
            userId={user._id}
            _id={chat._id || index}
          />
        }) : 'You have no dialogues'}
    </>
  )
}

export default Chat
