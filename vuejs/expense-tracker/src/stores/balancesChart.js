import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useExpensesStore } from './expenses'
import { useIncomesStore } from './incomes'
import moment from 'moment'

export const useBalancesChartStore = defineStore('balancesChart', () => {
  const expensesStore = useExpensesStore()
  const incomesStore = useIncomesStore()

  const displayedYear = ref(new Date().getFullYear())
  const years = ref([])

  const balances = computed(() => {
    var earliestDate = getEarliestDate(
      Object.keys(expensesStore.totalExpensesByMonth)[0],
      Object.keys(incomesStore.totalIncomesByMonth)[0]
    )
  
    var currentDate = earliestDate
    var now = new Date()

    var balances = new Map()
    while (currentDate <= now) {
      if(!years.value.includes(currentDate.getFullYear())) years.value.push(currentDate.getFullYear())
      var currentDateStr = moment(currentDate).format('MMMM YYYY')
      var expense = expensesStore.totalExpensesByMonth[currentDateStr]
      if (expense === undefined) expense = 0
      var income = incomesStore.totalIncomesByMonth[currentDateStr]
      if (income === undefined) income = 0
      if (currentDate.getFullYear() === displayedYear.value)
        balances.set(currentDateStr, income - expense)
      currentDate = moment(currentDate).add(1, 'M').toDate()
    }

    return balances
  })

  var hasNextYear = computed(() => {
    return years.value.includes(displayedYear.value + 1)
  }) 

  var hasPreviousYear = computed(() => {
    return years.value.includes(displayedYear.value - 1)
  }) 

  return {
    balances,
    displayedYear,
    hasNextYear,
    hasPreviousYear
  }
})

function getEarliestDate(dateStr1, dateStr2) {
  const date1 = moment(dateStr1, 'MMMM YYYY').toDate()
  const date2 = moment(dateStr2, 'MMMM YYYY').toDate()

  if (date1 < date2) {
    return date1
  } else {
    return date2
  }
}
