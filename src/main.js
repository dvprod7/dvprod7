import { createApp } from 'vue'
import './styles/style.scss'
import App from './App.vue'
import router from './router/routes'

createApp(App)
  .use(router)
  .mount('#app')