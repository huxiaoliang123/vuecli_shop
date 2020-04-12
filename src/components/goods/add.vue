<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFromRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- tab栏 -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="tabPosition"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateLists"
                :props="cateCascaderProps"
                @change="cateSelectedChange"
                clearable>
              </el-cascader>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyParamsLists"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                v-for="(cb,i) in item.attr_vals"
                :key="i"
                :label="cb" border class="checkbox"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyParamsLists"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headers"
              :on-success="handlePicSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="addBtn" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog :visible.sync="isShowPreviewDialog" title="图片预览" width="80%">
      <img :src="previewPath" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      // 步骤条当前激活索引
      activeIndex: '0',
      // tab栏显示位置
      tabPosition: 'left',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类数组
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 添加商品的验证规则对象
      addFromRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类数据
      cateLists: [],
      // 分类级联选择器的配置项
      cateCascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表
      manyParamsLists: [],
      // 静态属性列表
      onlyParamsLists: [],
      // 上传图片的地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的请求头对象
      headers: {
        Authorization: window.sessionStorage.getItem('eshopToken')
      },
      // 图片预览对话框
      isShowPreviewDialog: false,
      // 预览图片地址
      previewPath: ''
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    }
  },
  created () {
    this.getCateLists()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateLists () {
      const { data: res } = await this.axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败！')
      } else {
        this.cateLists = res.data
      }
    },
    // 分类级联选择器选中事件
    cateSelectedChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // tab标签页点击的钩子函数
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // tab标签点击事件
    async tabClick () {
      // 访问的是动态参数面板
      if (this.activeIndex === '1') {
        // 请求参数列表
        const { data: res } = await this.axios.get(
          `categories/${this.cateId}/attributes`, {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        } else {
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          })
          this.manyParamsLists = res.data
          console.log(this.manyParamsLists)
        }
      } else if (this.activeIndex === '2') {
        // 访问的静态属性标签
        // 请求参数列表
        const { data: res } = await this.axios.get(
          `categories/${this.cateId}/attributes`, {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性列表失败！')
        } else {
          this.onlyParamsLists = res.data
        }
      }
    },
    // 监听图片上传成功的事件
    handlePicSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    // 处理图片预览事件
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.isShowPreviewDialog = true
    },
    // 处理移除图片事件
    handleRemove (file) {
      // 获取要移除的临时对象
      const filePath = file.response.data.tmp_path
      // 从addForm.pics数组中找到该路径的索引值
      const i = this.addForm.pics.findIndex(x =>
        x.pic === filePath
      )
      // 移除该项
      this.addForm.pics.splice(i, 1)
    },
    // 添加商品
    addGood () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        } else {
          // 深拷贝addForm对象，否则直接将goods_cat数组转为字符串会影响分类的级联选择器
          // 安装lodash插件,深拷贝
          const deepAddForm = _.cloneDeep(this.addForm)
          deepAddForm.goods_cat = deepAddForm.goods_cat.join(',')
          // 处理动态参数和静态属性
          this.manyParamsLists.forEach(item => {
            console.log(item)
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(',')
            }
            this.addForm.attrs.push(newInfo)
          })
          this.onlyParamsLists.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          deepAddForm.attrs = this.addForm.attrs
          // console.log(deepAddForm, this.manyParamsLists, this.onlyParamsLists)
          // 处理完数据，发送请求
          const { data: res } = await this.axios.post('goods', deepAddForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加商品失败！')
          } else {
            this.$message.success('添加商品成功！')
            this.$router.push('/goods')
          }
        }
      })
    }
  }
}
</script>

<style scope>
.el-steps{
    margin: 20px 0;
}
.el-steps .el-step__title{
    font-size: 12px;
}
.checkbox.el-checkbox.is-bordered+.el-checkbox.is-bordered {
    margin-left: 0px;
}
.previewImg {
    width: 100%;
}
.ql-editor {
  min-height: 300px;
}
.addBtn.el-button {
  margin-top: 15px;
}
</style>
