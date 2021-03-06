import React, { useContext } from 'react'
import ChatItem from '../components/ChatItem'
import { AppContext } from '../store'

const Chat = () => {
  const { state: { chatSection, activeRoom }, dispatch } = useContext(AppContext)
  const chatList = chatSection.list

  const setActiveRoom = (id) => {
    dispatch({ payload: { activeRoom: id }})
  }

  return (
    <>
      {chatList.length
        ? chatList.map((chat, index) => {
          return <ChatItem 
          {...chat} 
          key={index} 
          focused={chat._id === activeRoom || index === activeRoom}
          handleClick={setActiveRoom}
          _id={chat._id || index} 
          />
        }) : 'You have no dialogues'}
    </>
  )
}

export default Chat
