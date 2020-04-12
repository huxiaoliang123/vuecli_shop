<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 选择商品分类区域 -->
      <el-row class="select-area" :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select"  v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="goAddGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- goods table -->
      <el-table
      :data="goodsList"
      style="width: 100%"
      border
      stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="150px"></el-table-column>
        <el-table-column label="商品数量" prop="goods_number" width="100px"></el-table-column>
        <el-table-column label="创建时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditGoodsDialog(scope.row.goods_id)">修改</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
        </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 控制显示添加商品对话框
      isShowAddGoodsDialog: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      // 商品总数
      total: 0
    }
  },
  computed: {
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      const { data: res } = await this.axios.get('goods', {
        params: {
          query: this.queryInfo.query,
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败！')
      } else {
        this.goodsList = res.data.goods
        this.total = res.data.total
        console.log(this.goodsList)
      }
    },
    // 显示修改商品对话框
    showEditGoodsDialog (goodId) {
    },
    // 删除商品
    async deleteGoods (goodId) {
      const confirmResult = await this.$confirm('将永久删除该参数，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除商品！')
      } else {
        const { data: res } = await this.axios.delete('goods/' + goodId)
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品失败！')
        } else {
          this.$message.success('删除商品成功！')
          this.getGoodsList()
        }
      }
    },
    // 分页显示条数变化
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 页码变化
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 路由导航到添加商品页面
    goAddGoodsPage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style scope>
.el-pagination{
    margin-top: 20px;
}
</style>
