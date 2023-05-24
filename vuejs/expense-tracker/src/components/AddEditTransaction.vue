<template>
  <b-modal
    centered
    v-model="modalShow"
    @hidden="emit('on-close')"
    @ok="handleOK"
    :title="getTitle()"
  >
    <form class="transaction-form">
      <div>
        <input
          name="desc"
          id="desc"
          class="desc-input"
          v-model="transaction.description"
          required
        />
        <label for="desc">Description</label>
      </div>
      <div v-if="transaction.category_name !== 'Income'">
        <select
          v-model="transaction.category_id"
          name="select-transaction-category"
          id="select-transaction-category"
          required
        >
          <option
            v-for="category of categoriesStore.categories.values()"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <label for="select-transaction-category">Category</label>
      </div>
      <div>
        <input
          v-model="transaction.amount"
          id="transaction-amount"
          name="transaction-amount"
          required
          type="number"
          step="any"
        />
        <label for="transaction-amount">Amount</label>
      </div>
      <div>
        <input
          type="date"
          v-model="transaction.date"
          id="transaction-date"
          name="transaction-date"
          required
        />
        <label for="transaction-date">Date</label>
      </div>
    </form>
  </b-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCategoriesStore } from '../stores/categories'

const categoriesStore = useCategoriesStore()

const props = defineProps({
  modalShow: {
    type: Boolean,
    default: false
  },
  transaction: {
    type: Object,
    default() {
      return {
        description: '',
        amount: 0,
        category_name: '',
        date: new Date()
      }
    }
  }
})

const emit = defineEmits(['on-close', 'ok'])

var modalShow = ref(props.modalShow)
var transaction = ref(props.transaction)

watch(
  () => props.modalShow,
  () => (modalShow.value = props.modalShow)
)

watch(
  () => props.transaction,
  () => (transaction.value = props.transaction)
)

function handleOK() {
  emit('ok')
}

function getTitle() {
  if (Object.prototype.hasOwnProperty.call(transaction.value, 'category_id'))
    return 'Edit transaction'
  else return 'Add transaction'
}
</script>

<style lang="scss" scoped>
@import '../css/custom.scss';
</style>
