<template>
  <b-sidebar
    id="sidebar-right"
    right
    shadow
    v-model="sidebarOpen"
    bg-variant="white"
    @hidden="$emit('on-hidden')"
  >
    <div class="sidebar-profile-container">
      <div class="profile-header">
        <b-dropdown size="lg" variant="link" toggle-class="text-decoration-none" no-caret>
          <template #button-content>
            <b-avatar
              id="popover-avatar"
              button
              variant="primary"
              :text="username.charAt(0).toUpperCase()"
            ></b-avatar>
          </template>
          <b-dropdown-item href="#"  @click="logout()">Logout</b-dropdown-item>
        </b-dropdown>
        <span class="mr-auto"
          ><strong>{{ username }}</strong></span
        >
      </div>

      <div class="categories-header">
        <h1>Categories</h1>
        <b-icon-plus class="add-category-icon" @click="addCategory" />
      </div>

      <TransitionGroup name="list">
        <div class="category-item" v-if="newCategory">
          <b-icon-shop class="category-icon rounded bg-primary" scale="0.6" />
          <form>
            <div>
              <input
                v-autofocus
                v-model="newCategory.name"
                @keydown.enter="sendCategory"
                name="category-name"
                id="category-name"
                required
              />
              <label for="category-name">Category name</label>
            </div>
          </form>
          <b-icon-check-circle class="h4 category-validation" @click="sendCategory" />
        </div>
        <div
          class="category-item"
          v-for="category of [...categoriesStore.categories.values()].sort((a, b) =>
            String(a.name).localeCompare(b.name)
          )"
          :key="category.id"
        >
          <b-icon-shop class="category-icon rounded bg-primary" scale="0.6" />
          <span
            ><h2>{{ category.name }}</h2></span
          >
          <b-dropdown
            size="sm"
            variant="link"
            toggle-class="text-decoration-none"
            no-caret
            class="categories-actions"
          >
            <template #button-content>
              <b-icon-three-dots />
            </template>
            <b-dropdown-item href="#">Edit</b-dropdown-item>
            <b-dropdown-item href="#" @click="deleteCategory(category.id)">Delete</b-dropdown-item>
          </b-dropdown>
        </div>
      </TransitionGroup>
    </div>
  </b-sidebar>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import globalApi from "../api/global.js"

const categoriesStore = useCategoriesStore()

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  username: {
    type: String,
    required: true
  }
})

const sidebarOpen = ref(false)
const newCategory = ref()

watch(
  () => props.isOpen,
  (newValue) => {
    sidebarOpen.value = newValue
  }
)

function addCategory() {
  newCategory.value = { name: '' }
}

function sendCategory() {
  categoriesStore.createCategory(newCategory.value.name)
  newCategory.value = undefined
}

function deleteCategory(id) {
  categoriesStore.deleteCategory(id)
}

async function logout() {
 const res = await globalApi.logout()
 if(res) window.location.href = `${import.meta.env.VITE_API_URL}/login` ;
}
</script>

<style lang="scss" scoped>
@import '../css/custom.scss';

.sidebar-profile-container {
  display: flex;
  flex-direction: column;
  margin: 10px;
}

.profile-header {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.categories-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin: 20px 10px;
  justify-content: space-between;
}

h1 {
  font-size: 1.2em;
  font-weight: bold;
}

.add-category-icon {
  border: 2px dotted $secondary;
  border-radius: 25%;
  width: 2em;
  height: 2em;
}

.add-category-icon:hover {
  cursor: pointer;
}

.add-category-icon:active {
  background-color: $secondary;
}

.category-item {
  display: flex;
  flex-direction: row;
  margin: 0px 10px;
  gap: 5px;
  align-items: center;
  margin-bottom: 10px;
}

.category-icon {
  width: 3em;
  height: 3em;
  color: white;
}

h2 {
  font-size: 1em;
  font-weight: bold;
  margin: 0px;
}

.h4 {
  margin: 0;
}

.h4:hover {
  cursor: pointer;
}

.h4:active {
  color: lightgreen;
}

.categories-actions {
  margin-left: auto;
}
</style>
