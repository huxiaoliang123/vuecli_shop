import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/login/login.vue'
import Home from './components/home.vue'
import Welcome from './components/welcome.vue'
import Users from './components/user/users.vue'
import Rights from './components/rights/rights.vue'
import Roles from './components/rights/roles.vue'
import Categories from './components/goods/categories.vue'
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
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories }
    ]
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
