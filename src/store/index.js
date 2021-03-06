import React from 'react'
import cookies from 'react-cookies'

export const initialState = {
  user: null,
  authToken: cookies.load('Authorization') || null,
  auth: {
    email: '',
    username: '',
    password: '',
    retypePassword: ''
  },
  searchSection: {
    list: [],
    value: '',
    newChat: {}
  },
  chatSection: {
    list: [],
    currentMsg: ''
  },
  activeRoom: null,
  socket: null
}

export const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'CHANGE_USER_STATE': 
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload 
        }
      }
    case 'UPDATE_CHAT_ITEM': {
      const { list } = state.chatSection
      const msg = action.payload
      const clonedList = list.slice()
      const idx = clonedList.findIndex(item => {
        return (item.chat_owner._id === msg.from && item.chat_guest._id === msg.to) ||
        (item.chat_owner._id === msg.to && item.chat_guest._id === msg.from)
      })
      if (!clonedList[idx]) {
        return {
          ...state,
          chatSection: {
            ...state.chatSection,
            list: clonedList
          }
        }
      } else {
        return state
      }
    }  
    default:
      return {
        ...state,
        ...action.payload
      }
  }
}

export const AppContext = React.createContext()