<template>
  <div class="totals-blocs-container">
    <TotalBloc
      title="Total Income"
      :amount="incomesStore.totalIncomes"
      :diff="incomesStore.totalDiffWithPreviousMonth"
      class="totals-blocs"
    />
    <TotalBloc
      title="Total Expense"
      :amount="expensesStore.totalExpenses"
      :diff="expensesStore.totalDiffWithPreviousMonth"
      class="totals-blocs"
    />
    <TotalBloc
      title="Balance"
      :amount="(incomesStore.totalIncomes - expensesStore.totalExpenses).toFixed(2)"
      :diff="
        (
          incomesStore.totalIncomes -
          expensesStore.totalExpenses -
          (incomesStore.totalPreviousIncomes - expensesStore.totalPreviousExpenses)
        ).toFixed(2)
      "
      class="totals-blocs"
    />
    <HistoricBloc class="historic-bloc" />
    <RecentTransactionsBloc class="transactions-bloc" :transactions="transactions" />
  </div>
</template>

<script setup>
import TotalBloc from '../components/TotalBloc.vue'
import HistoricBloc from '../components/HistoricBloc.vue'
import RecentTransactionsBloc from '../components/RecentTransactionsBloc.vue'
import { useExpensesStore } from '../stores/expenses'
import { useIncomesStore } from '../stores/incomes'
import { computed } from 'vue'

const expensesStore = useExpensesStore()
const incomesStore = useIncomesStore()

expensesStore.fetchExpenses()
incomesStore.fetchIncomes()

const transactions = computed(() => {
  const transactionsArray = [...expensesStore.expenses.values(), ...incomesStore.incomes.values()]
  transactionsArray.sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })
  return transactionsArray.slice(0, 10)
})
</script>

<style lang="scss" scoped>
@import '../css/custom.scss';

.totals-blocs-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 3fr auto;
  justify-items: stretch;
  align-items: stretch;
  column-gap: 5%;
  row-gap: 5%;
}

.historic-bloc {
  grid-area: 2 / 1 / 2 / 4;
}

.transactions-bloc {
  grid-area: 3 / 1 / 3 / 4;
  align-self: flex-start;
}

@media only screen and (max-width: 767px) {
}
</style>
