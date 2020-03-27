<template>
  <div class="main-con">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <!-- layout布局 -->
      <el-row :gutter="5">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="isShowAddUserDialog = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
      :data="userlist"
      border
      stripe
      style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditUserDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <!-- 分配权限按钮 -->
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="isShowAddUserDialog"
      :center="false"
      @close="addDialogClosed">
      <!-- 弹框主体区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        status-icon
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="addForm.checkPassword" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="isShowEditUserDialog"
      :center="false"
      @close="editDialogClosed">
      <!-- 弹框主体区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        status-icon
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义添加用户表单中邮箱的验证规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入正确的邮箱'))
    }
    // 自定义添加用户表单中手机号的验证规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法手机号
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    // 自定义添加用户表单中确认密码的验证规则
    var checkConfirmPassword = (rule, value, callback) => {
      console.log(this.addForm.password)
      if (value !== this.addForm.password) {
        // 两次输入密码一致
        callback(new Error('两次输入密码不一致！'))
      }
      return callback()
    }
    return {
      // 获取用户列表的查询参数对象
      queryInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 每页最多显示多少条数据
        pagesize: 5
      },
      // 用户列表
      userlist: [],
      // 用户总数
      total: 0,
      // 是否显示添加用户弹出层
      isShowAddUserDialog: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        checkPassword: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '用户名的最小长度为3个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码的最小长度为6个字符', trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: checkConfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 是否显示修改用户对话框
      isShowEditUserDialog: false,
      // 修改用户表单数据
      editForm: {},
      // 修改用户表单的验证规则对象
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '用户名的最小长度为3个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 获取用户数据
    this.getUsers()
  },
  methods: {
    lookDetail (id) {
      console.log(id)
      this.$router.push('/userinfo/' + id)
    },
    // 获取用户数据
    async getUsers () {
      const { data: res } = await this.axios.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听pagesize改变事件
    handleSizeChange (newPageSize) {
      console.log('pagesize change   ' + newPageSize)
      this.queryInfo.pagesize = newPageSize
      // 重新发送请求获取用户列表
      this.getUsers()
    },
    // 监听页码值改变事件
    handleCurrentChange (newPage) {
      console.log('将跳转到第' + newPage + '页')
      this.queryInfo.pagenum = newPage
      this.getUsers()
    },
    // 监听用户状态切换变化
    async userStateChange (userInfo) {
      console.log(userInfo.mg_state)
      const uid = userInfo.id
      const state = userInfo.mg_state
      const { data: res } = await this.axios.put(`users/${uid}/state/${state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addForm.resetFields()
    },
    // 添加用户
    addUser () {
      this.$refs.addForm.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 预校验成功，可以发起网络请求
        const { data: res } = await this.axios.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户对话框
        this.isShowAddUserDialog = false
        // 重新获取用户列表
        this.getUsers()
      })
    },
    // 监听关闭修改用户对话框事件
    editDialogClosed () {
      this.$refs.editForm.resetFields()
    },
    // 展示编辑用户对话框
    async showEditUserDialog (userId) {
      const { data: res } = await this.axios.get('users/' + userId)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.editForm = res.data
      this.isShowEditUserDialog = true
    },
    // 修改用户信息
    editUser () {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        // 关闭对话框
        this.isShowEditUserDialog = false
        // 刷新数据列表
        this.getUsers()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 删除用户
    async deleteUser (userId) {
      const confirmResult = await this.$confirm('将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.error('已取消删除')
      }
      const { data: res } = await this.axios.delete('users/' + userId)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getUsers()
    }
  }
}
export const s1 = 'huliang'
</script>

<style scoped>
.el-table{
  margin-top: 25px;
  font-size: 14px;
}
.el-pagination{
  margin-top: 25px;
}
</style>
