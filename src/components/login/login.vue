<template>
  <div class="login_wrap">
    <div class="login_box">
      <h1 class="title">eShop电商后台管理系统</h1>
      <div class="avatar_box">
        <img src="../../assets/logo.png">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input  prefix-icon="el-icon-user" v-model="loginForm.username" placeholder="请输入登录名称"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input  prefix-icon="el-icon-goods" v-model="loginForm.password" show-password placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, message: '密码长度必须大于6个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单
    resetForm () {
      console.log(this.$refs)
      this.$refs.loginFormRef.resetFields()
    },
    submitForm () {
      // 表单预验证，验证通过则可提交
      this.$refs.loginFormRef.validate(async result => {
        if (!result) return
        // { data: res }是解构赋值data给res
        // await等待异步函数执行完毕，同时所在函数必须设置为async异步函数
        const { data: res } = await this.axios.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          // 登录失败
          return this.$message.error('登录失败！')
        } else {
        //  登录成功
          this.$message.success('登录成功！')
          // 将token保存到客户端的sessionStorage中
          window.sessionStorage.setItem('eshopToken', res.data.token)
          // 编程式导航
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_wrap{
    height: 100%;
    background: #2b4b6b;
}
.login_box{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    transform: translate(-50%, -50%);
}
.title{
  position: absolute;
  top: -70%;
  width: 100%;
  text-align: center;
  color: #fff;
}
.avatar_box{
    position: absolute;
    left: 50%;
    height: 130px;
    width: 130px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    transform: translate(-50%, -50%);
    background: #fff;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
    }
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btn_box{
  display: flex;
  justify-content: flex-end;
}
</style>
