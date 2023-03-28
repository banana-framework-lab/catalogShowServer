import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'
import vue404 from '@/views/404.vue'

const routes = <RouteRecordRaw[]>[
  { path: '/', redirect: '/show' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: vue404,
  },
  {
    path: '/show',
    name: 'show',
    component: () => import('@/views/show.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return {
      el: '#app',
      left: 0,
      behavior: 'smooth',
    }
  },
  routes: routes,
})

export default router
