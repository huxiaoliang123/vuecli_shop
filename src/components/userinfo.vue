<template>
  <div class="main-con">
    <el-button type="primary" @click="goBack">后退</el-button>
    <h1>用户ID为{{id}}的详情</h1>
  </div>
</template>

<script>
export default {
  props: ['id'],
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
</style>
