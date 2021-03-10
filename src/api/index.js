import axios from 'axios'

const http = axios.create({
  baseURL: '/',
  withCredentials: true
})

class Api {

  async login(payload) {
    return await http.post('/api/login', payload)
  }

  async signup(payload) {
    return await http.post('/api/signup', payload)
  }

  async getUser() {
    return await http.get('/api/me')
  }

  async getChatList() {
    return await http.get('/api/chats')
  }

  async searchUsers(limit, username) {
    return await http.get('/api/users', {
      params: {
        limit,
        username
      }
    })
  }

  async updateUser(formData) {
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    return await http.post('/api/user', formData, config)
  }

}

export default Api