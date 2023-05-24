import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import categoriesAPI from '../api/categories'

export const useCategoriesStore = defineStore('categories', () => {
  const userStore = useUserStore()
  const categories = ref(new Map())
  async function fetchCategories() {
    const res = await categoriesAPI.get(userStore.user)
    for (var cat of res) {
      categories.value.set(cat.id, cat)
    }
  }

  async function createCategory(name) {
    await categoriesAPI.create(userStore.user, name)
  }

  async function deleteCategory(id) {
    await categoriesAPI.delete(id)
  }

  function onNewCategory(category) {
    categories.value.set(category.id, category)
  }

  function onCategoryDeleted(category) {
    categories.value.delete(category.id)
  }

  return {
    categories,
    fetchCategories,
    createCategory,
    deleteCategory,
    onNewCategory,
    onCategoryDeleted
  }
})
