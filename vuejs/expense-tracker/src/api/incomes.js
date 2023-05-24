import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

export default {
  async getByMonth(username, year, month) {
    const res = await axios.get(`${API_URL}/incomes/${username}/${year}/${month}`)
    return res.data
  },

  async getTotalByMonth(username) {
    const res = await axios.get(`${API_URL}/totalIncomesByMonth/${username}`)
    return res.data
  },

  async update(newIncome) {
    const res = await axios.post(`${API_URL}/income/update`, newIncome)
    return res.data
  },

  async add(income) {
    const res = await axios.post(`${API_URL}/income`, income)
    return res.data
  },

  async delete(id) {
    return await axios.delete(`${API_URL}/income/${id}`)
  }
}
