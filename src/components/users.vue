<template>
  <div class="main-con">
    <h1>这是用户列表</h1>
    <el-table
    :data="userlist"
    border
    stripe
    style="width: 100%">
      <el-table-column
      prop="id"
      label="编号"
      width="100">
      </el-table-column>
      <el-table-column
      prop="name"
      label="姓名"
      width="280">
      </el-table-column>
      <el-table-column
      prop="age"
      label="年龄" width="100">
      </el-table-column>
      <el-table-column
      prop="job"
      label="职位">
      </el-table-column>
      <el-table-column
      label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="lookDetail(scope.row.id)">查看详情</el-button>
          <el-button
            size="mini"
            type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userlist: [
        { id: 1, name: 'huliang', age: 28, job: '普通科员' },
        { id: 2, name: 'huliang1', age: 18, job: '科长' },
        { id: 3, name: 'hulidasdang', age: 38, job: '普通科员' },
        { id: 4, name: 'hulcsaciang', age: 8, job: '副科长' },
        { id: 5, name: 'hulidasdasang', age: 20, job: '普通科员' },
        { id: 6, name: 'hulidasang', age: 22, job: '普通科员' }
      ]
    }
  },
  methods: {
    lookDetail (id) {
      console.log(id)
      this.$router.push('/userinfo/' + id)
    }
  }
}
export const s1 = 'huliang'
</script>

<style scoped>
</style>
