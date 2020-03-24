<template>
  <div id="app1">
    <el-container>
      <el-aside width="250px">
        <ul class="nav">
          <li><router-link to="/users">用户管理</router-link></li>
          <li><router-link to="/rights">权限管理</router-link></li>
          <li><router-link to="/goods">商品管理</router-link></li>
          <li><router-link to="/orders">订单管理</router-link></li>
          <li><router-link to="/settings">系统设置</router-link></li>
        </ul>
      </el-aside>
      <el-container>
        <el-header>后台管理系统模板</el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>版权信息</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { s1 as ss2 } from './components/users.vue'
import './test.js'
export default {
  name: 'App',
  created () {
    console.log(ss2)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.el-container {
  height: 800px;
}
.el-header, .el-footer {
  background-color: #666;
  color: #fff;
  text-align: center;
  line-height: 60px;
  font-size: 24px;
}
.el-aside {
  background: #bbb;
  color: #333;
  text-align: center;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
}
body > .el-container {
  margin-bottom: 40px;
}
ul{
  margin-top: 60px;
  padding: 0;
  list-style: none;
}
a{
  text-decoration: none;
}
.nav li{
  height: 50px;
  line-height: 50px;
  margin-bottom: 5px;
  text-align: center;
  background: #aaa;
}
.nav li a{
  color: #fff;
}
.nav li a:hover{
  color: red;
}
.nav li a.router-link-active{
  color: royalblue;
  font-weight: bold;
}
</style>
