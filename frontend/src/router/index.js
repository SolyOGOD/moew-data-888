import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guestOnly: true }
  },
  // Catch-all redirect to dashboard
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Try to load user from localStorage if not loaded yet
  if (!authStore.token) {
    authStore.initialize()
  }

  const isAuthenticated = !!authStore.token

  if (to.matched.some(record => record.meta.guestOnly) && isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
