import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

export default {
  async get(username) {
    const res = await axios.get(`${API_URL}/categories/${username}`)
    return res.data
  },
  async create(username, name) {
    const data = {
      username: username,
      name: name
    }

    return await axios.post(`${API_URL}/category`, data)
  },
  async delete(id) {
    return await axios.delete(`${API_URL}/category/${id}`)
  }
}
