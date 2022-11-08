import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

const routes = <RouteRecordRaw[]>[
  { path: '/', redirect: '/show' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
  },
  // {
  //   path: '/404',npm
  //   name: '404',
  //   component: () => import('@/views/404.vue'),
  //   meta: { hidden: true },
  // },
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
