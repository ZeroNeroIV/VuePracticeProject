import AuthPage from '@/components/AuthPage.vue'
import HomePage from '@/components/HomePage.vue'
import ForYouPage from '@/components/ForYouPage.vue'
import DashboardPage from '@/components/DashboardPage.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home Page',
    component: HomePage,
    meta: { requiresAuth: false },
  },
  {
    path: '/auth',
    name: 'Authentication Page',
    component: AuthPage,
    meta: { requiresAuth: false },
  },
  {
    path: '/dashboard',
    name: 'Dashboard Page',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/fyp',
    name: 'For You Page',
    component: ForYouPage,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/auth')
  } else {
    next()
  }
})

export default router
