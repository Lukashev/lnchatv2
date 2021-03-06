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
    list: []
  },
  activeRoom: null
}

export const reducer = (state = initialState, action) => ({
  ...state,
  ...action.payload
})

export const AppContext = React.createContext()