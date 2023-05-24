import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

export default {
  async logout() {
    const response = await axios.post(`${API_URL}/logout`)
    return response.status === 200
  }
}
