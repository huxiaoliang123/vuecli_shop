import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './assets/css/global.css'
import './plugins/elementUI.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置axios发起请求时的authorization
axios.interceptors.request.use(config => {
  // console.log(config)
  // 为请求头对象添加T验证Token的Authorization字段，便于后台接口识别用户登录状态
  config.headers.Authorization = window.sessionStorage.getItem('eshopToken')
  // 最后必须return config
  return config
})

// 将axios组件赋值给vue实例的axios对象
Vue.prototype.axios = axios
// 注册全局组件tree-table
Vue.component('tree-table', TreeTable)
// 注册全局时间过滤器
// 注册富文本编辑器组件
Vue.use(VueQuillEditor)
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // es6 padStart 不足两位自动补零
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
