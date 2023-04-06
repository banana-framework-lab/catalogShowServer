import { createApp } from 'vue'
import './style.css'
import '@vime/core/themes/default.css'
import App from './App.vue'
import naive from 'naive-ui'
import router from '@/router'

import { vLoading } from '@/directive/loading/index'

createApp(App)
  .use(router)
  .use(naive)
  .directive('loading', vLoading)
  .mount('#app')
