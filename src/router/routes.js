const routes = [
  {
    path: '/',
    component: () => import('@/components/menus/MyApp.vue')
  },
  {
    path: '/new',
    component: () => import('@/components/menus/NewApp.vue')
  },
  {
    path: '/detail',
    component: () => import('@/components/menus/Detail.vue')
  }
]

export default routes
