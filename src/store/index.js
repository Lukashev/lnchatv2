import cookies from 'react-cookies'
import Api from '../api'

export const initialState = {
  user: null,
  authToken: cookies.load('Authorization') || null,
  api: new Api(),
  auth: {
    email: '',
    username: '',
    password: '',
    retypePassword: ''
  },
  searchSection: {
    list: [],
    value: '',
    newChat: null
  },
  chatSection: {
    list: [],
    currentMsg: ''
  },
  activeRoom: null,
  socket: null
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MAIN_STATE':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
