import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import expensesAPI from '../api/expenses'
import { computed } from 'vue'
import utils from '../utils'

export const useExpensesStore = defineStore('expenses', () => {
  const userStore = useUserStore()

  const expenses = ref(new Map())
  const previousExpenses = ref(new Map())
  const nextExpenses = ref(new Map())
  const currentDate = ref(new Date())
  const totalExpensesByMonth = ref({})

  const totalExpenses = computed(() => {
    let sum = 0
    expenses.value.forEach((expense) => {
      sum += parseFloat(expense.amount)
    })
    return sum.toFixed(2)
  })

  const totalPreviousExpenses = computed(() => {
    let sum = 0
    previousExpenses.value.forEach((expense) => {
      sum += parseFloat(expense.amount)
    })
    return sum.toFixed(2)
  })

  const totalDiffWithPreviousMonth = computed(() => {
    return (totalExpenses.value - totalPreviousExpenses.value).toFixed(2)
  })

  async function fetchExpenses() {
    var res = await expensesAPI.getExpensesByMonth(
      userStore.user,
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1
    )
    for (var expense of res) {
      expenses.value.set(expense.id, expense)
    }

    res = await expensesAPI.getExpensesByMonth(
      userStore.user,
      currentDate.value.getFullYear(),
      currentDate.value.getMonth()
    )
    for (expense of res) {
      previousExpenses.value.set(expense.id, expense)
    }

    res = await expensesAPI.getExpensesByMonth(
      userStore.user,
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 2
    )
    for (expense of res) {
      nextExpenses.value.set(expense.id, expense)
    }

    fetchTotals()
  }

  async function fetchTotals() {
    totalExpensesByMonth.value = await expensesAPI.getTotalByMonth(userStore.user)
  }

  async function deleteExpense(id) {
    await expensesAPI.delete(id)
  }

  async function updateExpense(newExpense) {
    await expensesAPI.update(newExpense)
  }

  async function addExpense(expense) {
    expense.username = userStore.user
    await expensesAPI.add(expense)
  }

  function onNewExpense(expense) {
    if (utils.dateIsSameMonth(currentDate.value, expense.date)) {
      expenses.value.set(expense.id, expense)
      fetchTotals()
    }
  }

  function onExpenseDeleted(expense) {
    if (utils.dateIsSameMonth(currentDate.value, expense.date)) {
      expenses.value.delete(expense.id)
      fetchTotals()
    }
  }

  return {
    expenses,
    totalExpenses,
    totalDiffWithPreviousMonth,
    totalPreviousExpenses,
    totalExpensesByMonth,
    fetchExpenses,
    deleteExpense,
    updateExpense,
    addExpense,
    onNewExpense,
    onExpenseDeleted
  }
})
