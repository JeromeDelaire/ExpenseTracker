<template>
  <div class="total-bloc">
    <h1 class="total-cat">{{ props.title }}</h1>
    <p class="total-amount">{{ props.amount }} €</p>
    <span class="total-diff" :class="getDiffClass()">{{ getDiff() }}</span>
  </div>
</template>

<script setup>

const props = defineProps({
    title: String,
    amount: Number,
    diff: Number
})

function getDiffClass() {
  if (this.props.diff > 0) return 'diff-positive'
  else if (this.props.diff < 0) return 'diff-negative'
}

function getDiff() {
  if (this.props.diff >= 0) return '+' + this.props.diff + ' €'
  else if (this.props.diff < 0) return this.props.diff + ' €'
}
</script>

<style lang="scss" scoped>
@import '../css/custom.scss';

@media only screen and (min-width: 1024px) {
  h1 {
    font-size: 18px;
    color: $gray-text;
  }

  .total-amount {
    font-size: 30px;
  }

  .total-diff {
    font-size: 18px;
  }

  .total-bloc {
    padding: 20px;
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    align-items: center;
  }
}

@media only screen and (max-width: 1024px) {
  h1 {
    font-size: 12px;
    color: $gray-text;
  }

  .total-amount {
    font-size: 25px;
  }

  .total-diff {
    font-size: 12px;
  }

  .total-bloc {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
  }
}

.total-bloc {
  background-color: white;
  border-radius: 20px;
}

.total-amount {
  color: black;
  font-weight: bold;
  grid-column: 1;
  grid-row: 2;
  margin: 0px;
}

.total-cat {
  grid-column: 1;
  grid-row: 1;
}

.total-diff {
  grid-column: 2;
  grid-row: 1/3;
  font-weight: bold;
  justify-self: end;
}

.total-diff.diff-positive {
  color: lightgreen;
}

.total-diff.diff-negative {
  color: red;
}
</style>
