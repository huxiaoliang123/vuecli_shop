<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="select-area">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
          v-model="seletedKeys"
          :options="cateLists"
          :props="cascaderProps"
          @change="selectChanged"
          clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="isShowAddDialog = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe="">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="deleteAttrVals(index,scope.row)">
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditParamsDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="isShowAddDialog = true">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe="">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="deleteAttrVals(index,scope.row)">
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditParamsDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
     <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="isShowAddDialog"
      :center="false"
      @close="addDialogClosed">
      <!-- 修改分类的吧表单 -->
      <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="100px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name" :placeholder="'请输入' + dialogTitle"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
     <el-dialog
      :title="'修改' + dialogTitle"
      :visible.sync="isShowEditDialog"
      :center="false"
      @close="editDialogClosed">
      <!-- 修改分类的吧表单 -->
      <el-form
      :model="editForm"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="100px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name" :placeholder="'请输入' + dialogTitle"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateLists: [],
      // 分类级联选择器选中的ID数组
      seletedKeys: [],
      // 级联选择器的配置项
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // tab激活面板名称
      activeName: 'many',
      // 动态参数列表
      manyTableData: [],
      // 静态参数列表
      onlyTableData: [],
      // 控制添加参数对话框的显示
      isShowAddDialog: false,
      // 添加表单对话框
      addForm: {
        attr_name: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改参数对话框的显示
      isShowEditDialog: false,
      // 修改表单对话框
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    // 如果按钮需要被禁用，返回true
    isBtnDisabled () {
      if (this.seletedKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 三级分类ID
    cateId () {
      if (this.seletedKeys.length === 3) {
        return this.seletedKeys[2]
      }
      return null
    },
    // 添加参数和属性对话框的标题
    dialogTitle () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  created () {
    this.getCateLists()
  },
  methods: {
    async getCateLists () {
      const { data: res } = await this.axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      } else {
        this.cateLists = res.data
      }
    },
    // 监听级联选择器的选中事件
    selectChanged () {
      this.getGoodsParams()
    },
    // tab页签点击事件
    handleClick () {
      console.log(this.activeName)
      this.getGoodsParams()
    },
    // 这是获取参数列表的函数
    async getGoodsParams () {
      // 判断选的是不是第三级
      if (this.seletedKeys.length !== 3) {
        // 不是三级分类
        this.seletedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
      } else {
        // 根据所选分类的ID和当前激活的面板名称获取对应的参数
        const { data: res } = await this.axios.get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName }
        })
        if (res.meta.status !== 200) {
          this.$message.error('获取参数列表失败！')
        } else {
          console.log(res.data)
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            // 控制文本框的显示与隐藏
            item.inputVisible = false
            // 文本框中输入的值
            item.inputTagValue = ''
          })
          if (this.activeName === 'many') {
            this.manyTableData = res.data
          } else {
            this.onlyTableData = res.data
          }
        }
      }
    },
    // 监听关闭添加参数对话框
    addDialogClosed () {
      // 清空表单数据
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addParams () {
      // 先进行数据预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          this.$message.error('添加参数失败！')
        } else {
          this.$message.success('添加参数成功！')
          this.isShowAddDialog = false
          this.getGoodsParams()
        }
      })
    },
    // 显示修改参数对话框
    async showEditParamsDialog (attrId) {
      // 获取相应要修改参数ID的数据
      const { data: res } = await this.axios.get(`categories/${this.cateId}/attributes/${attrId}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取参数信息失败！')
      } else {
        this.editForm = res.data
      }
      this.isShowEditDialog = true
    },
    // 监听关闭修改参数对话框
    editDialogClosed () {
      // 清空表单数据
      this.$refs.editFormRef.resetFields()
    },
    // 修改参数
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.editForm.attr_sel
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('修改参数失败！')
        } else {
          this.$message.success('修改参数成功！')
          this.getGoodsParams()
          this.isShowEditDialog = false
        }
      })
    },
    // 删除参数
    async deleteParams (attrId) {
      const confirmResult = await this.$confirm('将永久删除该参数，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      } else {
        const { data: res } = await this.axios.delete(
          `categories/${this.cateId}/attributes/${attrId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数失败！')
        } else {
          this.$message.success('删除参数成功！')
          this.getGoodsParams()
        }
      }
    },
    // 将对attr_vals的操作保存到数据库
    async saveAttrVals (row) {
      // 发起请求保存参数
      const { data: res } = await this.axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数可选项失败')
      } else {
        this.$message.success('修改参数可选项成功！')
      }
    },
    // 这是tag文本框失去焦点或按下enter键触发的函数
    handleInputConfirm (row) {
      if (row.inputTagValue.trim().length === 0) {
        row.inputTagValue = ''
        row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputTagValue.trim())
        row.inputTagValue = ''
        row.inputVisible = false
        this.saveAttrVals(row)
      }
    },
    // 显示tag标签的输入框
    showInput (row) {
      row.inputVisible = true
      // vue中是先修改数据，再异步更新视图
      // 使用$nextTick方法再dom更新结束之后再执行延迟回调
      this.$nextTick(() => {
        // dom更新之后才能获取焦点
        console.log(this.$refs.saveTagInput)
        this.$refs.saveTagInput.focus()
      })
    },
    // 删除对应的参数可选项
    deleteAttrVals (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  }
}
</script>

<style scope>
.select-area{
    margin: 20px 0;
}
.el-cascader{
    width: 20%;
}
.el-table{
  margin-top: 20px;
}
.input-new-tag.el-input{
  width: 150px;
}
</style>
