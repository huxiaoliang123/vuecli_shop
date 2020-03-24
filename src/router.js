import Vue from 'vue'
import VueRouter from 'vue-router'
import Users from './components/users.vue'
import Rights from './components/rights.vue'
import Goods from './components/goods.vue'
import Orders from './components/orders.vue'
import Settings from './components/settings.vue'
import UserInfo from './components/userinfo.vue'
import Login from './components/login/login.vue'
import Home from './components/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/users',
    component: Users
  },
  {
    path: '/rights',
    component: Rights
  },
  {
    path: '/goods',
    component: Goods
  },
  {
    path: '/orders',
    component: Orders
  },
  {
    path: '/settings',
    component: Settings
  },
  {
    path: '/userinfo/:id',
    component: UserInfo,
    props: true
  }
]
const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from: 从哪个路径跳转而来
  // next: 是一个函数，表示放行，也可强制跳转
  if (to.path === '/login') return next()
  const eshopToken = window.sessionStorage.getItem('eshopToken')
  if (!eshopToken) return next('/login')
  next()
})

export default router
