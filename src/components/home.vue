<template>
  <el-container>
    <el-header>
      后台管理系统模板
      <el-button type="primary" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠区域 -->
        <div class="toogle-button" @click="toogleMenu" :title="isCollapse ? '展开菜单' : '折叠菜单'">|||</div>
        <!-- 菜单区域 -->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="(item, index) in menuList" :key="item.id" :index="item.id + ''" >
            <template slot="title">
              <i :class="menuIcon[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="subitem in item.children" :index="'/' + subitem.path + ''" :key="subitem.id" @click="saveNavStatus('/' + subitem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-footer>版权信息</el-footer>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      // 菜单图标
      menuIcon: [
        'el-icon-user-solid',
        'el-icon-s-check',
        'el-icon-s-goods',
        'el-icon-s-order',
        'el-icon-s-data'
      ],
      // 菜单切换标志
      isCollapse: false,
      // 高亮显示激活链接地址
      activePath: ''
    }
  },
  created () {
    console.log('crated')
    // 获取菜单列表数据
    this.getMenuList()
    // 设置当前菜单高亮显示
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loginOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单列表
    async getMenuList () {
      const { data: res } = await this.axios.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.mag)
      this.menuList = res.data
    },
    // 菜单的折叠与展开
    toogleMenu () {
      this.isCollapse = !this.isCollapse
    },
    // 保存导航链接的激活状态
    saveNavStatus (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #666;
  color: #fff;
  text-align: center;
  line-height: 60px;
  font-size: 24px;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  background: #bbb;
  color: #333;
  text-align: center;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
}
.el-menu {
  border-right: none;
}
.el-submenu .el-menu-item{
  padding: 0 20px;
}
.toogle-button{
  height: 30px;
  line-height: 30px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
</style>
