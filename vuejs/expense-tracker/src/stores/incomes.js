import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import incomesAPI from '../api/incomes'
import { computed } from 'vue'
import utils from '../utils'

export const useIncomesStore = defineStore('incomes', () => {
  const userStore = useUserStore()

  const incomes = ref(new Map())
  const previousIncomes = ref(new Map())
  const nextIncomes = ref(new Map())
  const currentDate = ref(new Date())
  const totalIncomesByMonth = ref({})

  const totalIncomes = computed(() => {
    let sum = 0
    incomes.value.forEach((income) => {
      sum += parseFloat(income.amount)
    })
    return sum.toFixed(2)
  })

  const totalPreviousIncomes = computed(() => {
    let sum = 0
    previousIncomes.value.forEach((expense) => {
      sum += parseFloat(expense.amount)
    })
    return sum.toFixed(2)
  })

  const totalDiffWithPreviousMonth = computed(() => {
    return (totalIncomes.value - totalPreviousIncomes.value).toFixed(2)
  })

  async function fetchIncomes() {
    var res = await incomesAPI.getByMonth(
      userStore.user,
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1
    )
    for (var income of res) {
      income.category_name = 'Income'
      incomes.value.set(income.id, income)
    }

    res = await incomesAPI.getByMonth(
      userStore.user,
      currentDate.value.getFullYear(),
      currentDate.value.getMonth()
    )
    for (income of res) {
      previousIncomes.value.set(income.id, income)
    }

    res = await incomesAPI.getByMonth(
      userStore.user,
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 2
    )
    for (income of res) {
      nextIncomes.value.set(income.id, income)
    }

    fetchTotals()
  }

  async function fetchTotals() {
    totalIncomesByMonth.value = await incomesAPI.getTotalByMonth(userStore.user)
  }

  async function deleteIncome(id) {
    await incomesAPI.delete(id)
  }

  async function updateIncome(newIncome) {
    await incomesAPI.update(newIncome)
  }

  async function addIncome(income) {
    income.username = userStore.user
    await incomesAPI.add(income)
  }

  function onNewIncome(income) {
    if (utils.dateIsSameMonth(currentDate.value, income.date)) {
      income.category_name = 'Income'
      incomes.value.set(income.id, income)
      fetchTotals()
    }
  }

  function onIncomeDeleted(income) {
    if (utils.dateIsSameMonth(currentDate.value, income.date)) {
      incomes.value.delete(income.id)
      fetchTotals()
    }
  }

  return {
    incomes,
    totalIncomes,
    totalPreviousIncomes,
    totalDiffWithPreviousMonth,
    totalIncomesByMonth,
    fetchIncomes,
    deleteIncome,
    updateIncome,
    addIncome,
    onNewIncome,
    onIncomeDeleted
  }
})
