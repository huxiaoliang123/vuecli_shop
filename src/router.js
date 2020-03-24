import Vue from 'vue'
import VueRouter from 'vue-router'
import Users from './components/users.vue'
import Rights from './components/rights.vue'
import Goods from './components/goods.vue'
import Orders from './components/orders.vue'
import Settings from './components/settings.vue'
import UserInfo from './components/userinfo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/users'
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
export default router
