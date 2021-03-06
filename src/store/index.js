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
    list: []
  },
  chatSection: {
    list: []
  }
}

export const reducer = (state = initialState, action) => ({
  ...state,
  ...action.payload
})

export const AppContext = React.createContext()