import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/auth/RegisterPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/DashboardPage.vue'),
      },
      {
        path: 'sellers',
        name: 'sellers',
        component: () => import('@/pages/sellers/SellersListPage.vue'),
      },
      {
        path: 'sellers/new',
        name: 'sellers.create',
        component: () => import('@/pages/sellers/CreateSellerPage.vue'),
      },
      {
        path: 'sales',
        name: 'sales',
        component: () => import('@/pages/sales/SalesListPage.vue'),
      },
      {
        path: 'sales/new',
        name: 'sales.create',
        component: () => import('@/pages/sales/CreateSalePage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return { name: 'login' }
  }

  if (to.meta.guest && token) {
    return { name: 'dashboard' }
  }
})

export default router
