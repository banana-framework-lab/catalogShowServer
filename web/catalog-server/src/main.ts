import { createApp } from 'vue'
import './style.css'
import '@vime/core/themes/default.css'
// import '@vime/core/themes/light.css'

import App from './App.vue'
import naive from 'naive-ui'

createApp(App).use(naive).mount('#app')
