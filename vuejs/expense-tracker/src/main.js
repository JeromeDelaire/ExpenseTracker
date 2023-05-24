import { createApp } from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import { createPinia } from 'pinia'
import VueSSE from 'vue-sse'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

import './css/custom.scss'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(BootstrapVue)
app.use(BootstrapVueIcons)
app.use(VueSSE)

app.mount('#app')

export { app }
