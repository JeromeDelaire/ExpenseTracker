<template>
  <div class="transaction-container">
    <b-avatar
      variant="primary"
      :text="props.transaction.description.charAt(0).toUpperCase()"
      class="transaction-avatar"
    ></b-avatar>
    <div class="transaction-description">{{ props.transaction.description }}</div>
    <div class="transaction-date">{{ formatDate(props.transaction.date) }}</div>
    <div class="transaction-category">{{ props.transaction.category_name }}</div>
    <b-dropdown
      size="sm"
      variant="link"
      toggle-class="text-decoration-none"
      no-caret
      class="transaction-actions"
    >
      <template #button-content>
        <b-icon-three-dots class="transaction-actions-icon" />
      </template>
      <b-dropdown-item href="#" @click="emit('edit')" :transaction="props.transaction"
        >Edit</b-dropdown-item
      >
      <b-dropdown-item href="#" @click="remove">Delete</b-dropdown-item>
    </b-dropdown>
    <div class="transaction-amount negative" v-if="transaction.hasOwnProperty('category_id')">
      -€ {{ transaction.amount }}
    </div>
    <div class="transaction-amount" v-else>+€ {{ transaction.amount }}</div>
  </div>
</template>

<script setup>
import { useExpensesStore } from '../stores/expenses'
import { useIncomesStore } from '../stores/incomes'

const expensesStore = useExpensesStore()
const incomesStore = useIncomesStore()

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit'])

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const formattedDate = date.toLocaleString('en-US')
  return formattedDate
}

function remove() {
  if (Object.prototype.hasOwnProperty.call(props.transaction, 'category_id')) {
    expensesStore.deleteExpense(props.transaction.id)
  } else {
    incomesStore.deleteIncome(props.transaction.id)
  }
}
</script>

<style lang="scss" scoped>
@import '../css/custom.scss';

.transaction-container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr 1fr 1fr;
  column-gap: 10px;
  align-items: center;
}

.transaction-avatar {
  grid-area: 1 / 1 / 4 / 2;
}

.transaction-container:nth-child(5n + 1) > .transaction-avatar {
  background-color: #574ae2; /* première couleur */
}

.transaction-container:nth-child(5n + 2) > .transaction-avatar {
  background-color: #222a68; /* deuxième couleur */
}

.transaction-container:nth-child(5n + 3) > .transaction-avatar {
  background-color: #654597; /* deuxième couleur */
}

.transaction-container:nth-child(5n + 4) > .transaction-avatar {
  background-color: #ab81cd; /* deuxième couleur */
}

.transaction-container:nth-child(5n + 5) > .transaction-avatar {
  background-color: #e2adf2; /* deuxième couleur */
}
.transaction-description {
  grid-area: 1 / 2 / 2 / 2;
  align-self: flex-end;
  font-weight: bold;
}

.transaction-category {
  grid-area: 2 / 2 / 3 / 3;
  font-size: 14px;
}

.transaction-date {
  grid-area: 3 / 2 / 4 / 3;
  font-size: 14px;
  color: gray;
}

.transaction-actions {
  grid-area: 1 / 3 / 2 / 4;
  justify-self: end;
}

.transaction-amount {
  grid-area: 2 / 3 / 3 / 4;
  justify-self: end;
  color: lightgreen;
  font-weight: bold;
  font-size: 12px;
}

.transaction-amount.negative {
  color: red;
}
</style>
