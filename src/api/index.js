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

  async searchUsers(limit, username) {
    console.log(username)
    return await http.get('/api/users', {
      params: {
        limit,
        username
      }
    })
  }

}

export default Api