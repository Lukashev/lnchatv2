import React, { useContext } from 'react'
import ChatItem from '../components/ChatItem'
import { AppContext } from '../store'

const Chat = () => {
  const { state: { chatSection, activeRoom } } = useContext(AppContext)
  const chatList = chatSection.list
  return (
    <>
      {chatList.length
        ? chatList.map((chat, index) => {
          return <ChatItem 
          {...chat} 
          key={index} 
          focused={chat._id === activeRoom || index === activeRoom} 
          />
        }) : 'You have no dialogues'}
    </>
  )
}

export default Chat
