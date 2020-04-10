import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './assets/css/global.css'
import './plugins/elementUI.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  // 为请求头对象添加T验证Token的Authorization字段，便于后台接口识别用户登录状态
  config.headers.Authorization = window.sessionStorage.getItem('eshopToken')
  // 最后必须return config
  return config
})
Vue.prototype.axios = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
