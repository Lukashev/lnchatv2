import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChatItem from '../components/ChatItem'

const Chat = () => {
  const { chatSection, activeRoom } = useSelector(state => state)
  const dispatch = useDispatch() 
  const chatList = chatSection.list

  const setActiveRoom = (id) => {
    dispatch({  type: 'SET_MAIN_STATE', payload: { activeRoom: id }})
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
