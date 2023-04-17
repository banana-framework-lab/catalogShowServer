import { createApp } from 'vue'
import './style.css'
import '@vime/core/themes/default.css'
// import App from './App.vue'
import Test from './Test.vue'
import naive from 'naive-ui'
import router from '@/router'

createApp(Test).use(router).use(naive).mount('#app')
// createApp(App).use(router).use(naive).mount('#app')
