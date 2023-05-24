import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

export default {
  async getTotalForCategoryThisMonth(username, categoryId) {
    const res = await axios.get(`${API_URL}/expensesAmount/${username}/${categoryId}`)
    return res.data
  },

  async getExpensesByMonth(username, year, month) {
    const res = await axios.get(`${API_URL}/expenses/${username}/${year}/${month}`)
    return res.data
  },

  async getTotalByMonth(username) {
    const res = await axios.get(`${API_URL}/totalExpensesByMonth/${username}`)
    return res.data
  },

  async update(newExpense) {
    const res = await axios.post(`${API_URL}/expense/update`, newExpense)
    return res.data
  },

  async add(expense) {
    const res = await axios.post(`${API_URL}/expense`, expense)
    return res.data
  },

  async delete(id) {
    return await axios.delete(`${API_URL}/expense/${id}`)
  }
}
