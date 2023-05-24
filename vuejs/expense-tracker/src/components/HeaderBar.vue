<template>
  <div class="header-container">
    <h1>{{ props.title }}</h1>
    <transition name="fade">
      <b-icon-list v-if="props.toggleVisible" class="icon-toggle" @click="$emit('open-side-bar')" />
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  toggleVisible: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped>
@import '../css/custom.scss';

@media only screen and (min-width: 1024px) {
  h1 {
    font-size: 40px;
    font-weight: bold;
  }

  .icon-toggle {
    width: 40px;
    height: 40px;
  }
}

@media only screen and (max-width: 1024px) {
  h1 {
    font-size: 25px;
    font-weight: bold;
  }

  .icon-toggle {
    width: 25px;
    height: 25px;
  }
}

.header-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.icon-toggle:hover {
  cursor: pointer;
}

.icon-toggle:active {
  background-color: $secondary;
}
</style>
