<template>
  <div class="categories_wrapper">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
      :data="catelist"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      :show-index="true"
      index-text="#"
      border
      :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success"
          v-if="scope.row.cat_deleted === false"
          style="color: lightgreen"
          ></i>
          <i class="el-icon-error"
          v-else
          style="color: red"
          ></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
          <el-button icon="el-icon-delete" type="danger" size="mini" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="isShowAddCateDialog"
      :center="false"
      @close="addCateDialogClosed">
      <!-- 添加分类的吧表单 -->
      <el-form
      :model="addCateForm"
      :rules="addCateFormRules"
      ref="addCateFormRef"
      label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options指定数据源 -->
          <!-- props用来指定具体的级联选择器的配置对象 -->
          <el-cascader
          v-model="seletedKeys"
          :options="parentCateLists"
          :props="cascaderProps"
          @change="parentCateChanged"
          clearable
          change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <!-- 弹框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="isShowEditCateDialog"
      :center="false"
      >
      <!-- 修改分类的吧表单 -->
      <el-form
      :model="editCateForm"
      :rules="editCateFormRules"
      ref="editCateFormRef"
      label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类数据列表
      catelist: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 分类总数据条数
      total: 0,
      // 表格数据显示的列配置
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          // 将当前列设置为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 将当前列设置为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 将当前列设置为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'opt'
        }
      ],
      // 控制显示添加分类对话框
      isShowAddCateDialog: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类表单验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 所有父级分类
      parentCateLists: [],
      // 级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选中的父级分类的ID数组
      seletedKeys: [],
      // 控制显示修改分类对话框
      isShowEditCateDialog: false,
      // 编辑分类表单对象
      editCateForm: {},
      // 修改分类表单验证规则对象
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList () {
      const { data: res } = await this.axios.get('categories', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      } else {
        this.catelist = res.data.result
        this.total = res.data.total
      }
    },
    // 监听pagesize改变的实践
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum的改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 显示分类对话框
    showAddCateDialog () {
      // 首先获取父级分类的数据列表，然后展示对话框
      this.getParentCateLists()
      this.isShowAddCateDialog = true
    },
    // 获取父级分类的数据列表
    async getParentCateLists () {
      const { data: res } = await this.axios.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      } else {
        this.parentCateLists = res.data
      }
    },
    // 添加分类选择父级分类项发生变化时的触发函数
    parentCateChanged () {
      console.log(this.seletedKeys)
      // 如果selectedKeys中的数组大于0，则说明选中了父级分类
      // 反之则没有选中父级分类，为顶级分类、
      if (this.seletedKeys.length > 0) {
        // 父级分类的ID,级联选择的最后一项为要添加分类的父级
        this.addCateForm.cat_pid = this.seletedKeys[this.seletedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.seletedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = this.seletedKeys.length
      }
    },
    // 添加分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        // 预检验成功，发起请求
        const { data: res } = await this.axios.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        } else {
          this.$message.success('添加分类成功！')
          this.getCateList()
          this.isShowAddCateDialog = false
        }
      })
    },
    // 监听对话框的的关闭事件，清空表单
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.seletedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 删除商品分类
    async deleteCate (catId) {
      const confirmResult = await this.$confirm('将永久删除该分类，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      } else {
        const { data: res } = await this.axios.delete('categories/' + catId)
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品分类失败！')
        } else {
          this.getCateList()
          this.$message.success('删除商品分类成功！')
        }
      }
    },
    // 编辑修改分类
    async showEditCateDialog (catId) {
      // 根据ID查询分类
      const { data: res } = await this.axios.get('categories/' + catId)
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类失败！')
      } else {
        this.editCateForm = res.data
        this.isShowEditCateDialog = true
      }
    },
    // 更新修改分类
    async editCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        // 预检验通过，提交
        const { data: res } = await this.axios.put('categories/' + this.editCateForm.cat_id, {
          cat_name: this.editCateForm.cat_name
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改分类失败！')
        }
        // 关闭对话框
        this.isShowEditCateDialog = false
        // 刷新数据列表
        this.getCateList()
        // 提示修改成功
        this.$message.success('修改分类成功！')
      })
    }
  }
}
</script>

<style scope>
.categories_wrapper .zk-table{
  margin: 20px 0;
  font-size: 14px;
  min-width: 800px;
}
.el-cascader{
  width: 100%;
}
</style>
