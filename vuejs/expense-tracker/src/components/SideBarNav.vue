<template>
  <div class="nav-container">
    <img src="../../public/et.png" class="app-icon" alt="" />
    <div class="nav-item" :class="{ active: $route.path === '/' }">
      <b-icon-house-fill class="nav-icon" @click="$router.push('/')" :variant="getVariant('/')" />
    </div>
    <div class="nav-item" :class="{ active: $route.path === '/transactions' }">
      <b-icon-credit-card-fill
        class="nav-icon"
        @click="$router.push('/transactions')"
        :variant="getVariant('/transactions')"
      />
    </div>
    <div class="nav-item" :class="{ active: $route.path === '/path2' }">
      <b-icon-file-text-fill class="nav-icon" :variant="getVariant('/path2')" />
    </div>
    <div class="nav-item" :class="{ active: $route.path === '/path3' }">
      <b-icon-pie-chart-fill class="nav-icon" :variant="getVariant('/path3')" />
    </div>
    <div class="nav-item nav-settings" :class="{ active: $route.path === '/path3' }">
      <b-icon-gear-fill class="nav-icon" :variant="getVariant('/path4')" />
    </div>
  </div>
</template>

<script>
export default {
  created() {},
  name: 'SideBarNav',
  methods: {
    getVariant(path) {
      return this.$route.path === path ? 'primary' : 'secondary'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../css/custom.scss';

.nav-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 10vh;
  align-items: center;
  justify-content: space-around;
}

.app-icon {
  height: 50%;
}

.nav-item {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
}

.nav-item.active {
  border-top: 2px solid $primary;
  transition: all 0.3s ease-in-out;
}

.nav-icon {
  height: 30%;
  width: min-content;
  transition: all 0.3s ease-in-out;
  padding-top: auto;
}

@media only screen and (min-width: 1024px) {
  .nav-container {
    display: flex;
    flex-direction: column;
    width: 100px;
    height: 100%;
    background-color: $white;
    justify-content: start;
    gap: 30px;
  }

  .app-icon {
    width: 50%;
    height: min-content;
    margin-bottom: 30px;
  }

  .nav-item {
    display: flex;
    width: 100%;
    height: max-content;
    flex-direction: row;
    align-items: center;
  }

  .nav-item.active {
    border-top: none;
    border-right: 2px solid $primary;
    transition: all 0.3s ease-in-out;
  }

  .nav-icon,
  .nav-settings {
    width: 30px;
    height: min-content;
    transition: all 0.3s ease-in-out;
    padding-top: auto;
  }
  .nav-settings {
    position: fixed;
    bottom: 30px;
  }
}

.nav-icon:hover {
  cursor: pointer;
}
</style>
