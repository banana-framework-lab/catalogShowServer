import { createApp } from 'vue'
import './style.css'
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import App from './App.vue'
import naive from 'naive-ui'

createApp(App).use(naive).use(VueVideoPlayer).mount('#app')
