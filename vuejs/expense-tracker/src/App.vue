<template>
  <body>
    <div class="app-container">
      <main>
        <HeaderBar
          class="header-bar"
          title="Dashboard"
          @open-side-bar="showSideBar = true"
          :toggle-visible="!showSideBar"
        />
        <RouterView
          class="router-view"
          :class="{ 'with-sidebar': showSideBar }"
          v-slot="{ Component }"
        >
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
      <aside>
        <SideBarNav class="sidebar-nav" />
      </aside>
      <SideBarProfile
        class="sidebar-profile"
        :isOpen="showSideBar"
        @on-hidden="showSideBar = false"
        username="jeromeDelaire"
      />
    </div>
  </body>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import SideBarNav from './components/SideBarNav.vue'
import SideBarProfile from './components/SideBarProfile.vue'
import HeaderBar from './components/HeaderBar.vue'
import { useCategoriesStore } from '@/stores/categories'
import { useExpensesStore } from '@/stores/expenses'
import { useIncomesStore } from '@/stores/incomes'
import { ref } from 'vue'
import { app } from './main.js'

const categoriesStore = useCategoriesStore()
const expensesStore = useExpensesStore()
const incomesStore = useIncomesStore()
categoriesStore.fetchCategories()

const showSideBar = ref(false)

onMounted(() => {
  app.config.globalProperties.$sse
    .create(import.meta.env.VITE_API_URL + '/events')
    .on('message', (item) => {
      if (item !== 'ping') {
        const json = JSON.parse(item)
        if (json.type === 'INSERT' || json.type === 'UPDATE') {
          for (var row of json.affectedRows) {
            switch (json.table) {
              case 'categories':
                categoriesStore.onNewCategory(row.after)
                break

              case 'incomes':
                incomesStore.onNewIncome(row.after)
                break

              case 'expenses':
                expensesStore.onNewExpense(row.after)
                break
            }
          }
        } else if (json.type === 'DELETE') {
          for (var deletedRow of json.affectedRows) {
            switch (json.table) {
              case 'categories':
                categoriesStore.onCategoryDeleted(deletedRow.before)
                break

              case 'incomes':
                incomesStore.onIncomeDeleted(deletedRow.before)
                break

              case 'expenses':
                expensesStore.onExpenseDeleted(deletedRow.before)
                break
            }
          }
        }
      }
    })
    .on('error', (err) => console.error('Failed to parse or lost connection:', err))
    .connect()
    .catch((err) => console.error('Failed make initial connection:', err))
})
</script>

<style lang="scss" scoped>
@import 'css/custom.scss';

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

body {
  overflow: hidden;
  height: 100vh;
  background-color: $light;
}

main {
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 20px;
}

aside {
  background-color: white;
}

@media only screen and (min-width: 1024px) {
  .app-container {
    display: flex;
    flex-direction: row-reverse;
    height: 100%;
    width: 100%;
    justify-content: start;
  }

  main {
    margin-bottom: 0px;
    padding: 100px 10%;
    width: 100%;
  }

  .router-view {
    transition: all 0.5s ease;
  }

  .router-view.with-sidebar {
    padding-right: 320px;
    transition: all 0.5s ease;
  }
}
</style>
