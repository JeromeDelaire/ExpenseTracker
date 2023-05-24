<template>
  <div>
    <AddEditTransaction
      :modal-show="modalShow"
      :transaction="toEdit"
      @on-close="onModalClose"
      @ok="addEdit"
    />
    <div class="transactions-container">
      <div class="transactions-header">
        <h1>Recent transactions</h1>
        <b-form-datepicker id="example-datepicker" class="transactions-date" size="sm" />
        <b-dropdown size="lg" variant="link" toggle-class="text-decoration-none" no-caret>
          <template #button-content>
            <b-icon-plus class="add-transaction-icon" />
          </template>
          <b-dropdown-item href="#" @click="add(true)">Add income</b-dropdown-item>
          <b-dropdown-item href="#" @click="add(false)">Add expense</b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="transactions-list">
        <TransitionGroup name="list">
          <TransactionDetails
            v-for="transaction of props.transactions"
            :key="transaction.id"
            class="transaction-item"
            :transaction="transaction"
            @edit="edit(transaction)"
          />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup>
import TransactionDetails from './TransactionDetails.vue'
import AddEditTransaction from './AddEditTransaction.vue'
import { useExpensesStore } from '../stores/expenses'
import { useIncomesStore } from '../stores/incomes'
import { ref } from 'vue'

const expensesStore = useExpensesStore()
const incomesStore = useIncomesStore()

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  }
})

var modalShow = ref(false)
var toEdit = ref({})

function edit(transaction) {
  toEdit.value = { ...transaction }
  modalShow.value = true
}

function add(income) {
  if (income) {
    toEdit.value.category_name = 'Income'
  }
  modalShow.value = true
}

function addEdit() {
  if (Object.prototype.hasOwnProperty.call(toEdit.value, 'id')) {
    updateTransaction()
  } else {
    addTransaction()
  }
  toEdit.value = {}
}

function addTransaction() {
  if (toEdit.value.category_name !== 'Income') {
    expensesStore.addExpense(toEdit.value)
  } else {
    incomesStore.addIncome(toEdit.value)
  }
}

function updateTransaction() {
  if (toEdit.value.category_name !== 'Income') {
    expensesStore.updateExpense(toEdit.value)
  } else {
    incomesStore.updateIncome(toEdit.value)
  }
}

function onModalClose() {
  modalShow.value = false
  toEdit.value = {}
}
</script>

<style lang="scss" scoped>
@import '../css/custom.scss';

.transactions-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}

.transactions-header {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 20px;
  padding: 20px;
}

.transactions-date {
  width: max-content;
}

.transaction-item:not(:last-child) {
  border-bottom: 1px solid $light;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

h1 {
  margin-left: 0;
  margin-right: auto;
}

.add-transaction-icon {
  color: $light;
  background-color: black;
  border-radius: 50%;
}

@media only screen and (min-width: 1024px) {
  h1 {
    font-size: 30px;
    font-weight: bold;
  }
}

@media only screen and (max-width: 1024px) {
  h1 {
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
