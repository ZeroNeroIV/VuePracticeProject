import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import pinia from './config/pinia-setup'
import router from './config/router-setup'
import vuetify from './config/vuetify-setup'

// Global Variables
export const title = ref<string>('')

// Create
const app = createApp(App)

// Use
app.use(pinia)
app.use(router)
app.use(vuetify)

// Mount
app.mount('#app')
