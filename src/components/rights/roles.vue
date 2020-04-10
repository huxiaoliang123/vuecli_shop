<template>
 <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="card-box">
      <!-- table视图 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="isShowAddDialog = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
       :data="rolesLists"
       border
       stripe
       style="width: 100%" class="table">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row v-for="(item,i) in scope.row.children" :key="item.id" :class="['bottom-line', i==0 ? 'top-line' : '', 'align-center']">
                <el-col :span="5">
                  <el-tag class="role-tag" closable @close="deleteRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row v-for="(item1,j) in item.children" :key="item1.id" :class="[j==0 ? '' : 'top-line', 'align-center']">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="deleteRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag v-for="item2 in item1.children" :key="item2.id" type="warning" closable @close="deleteRightById(scope.row,item2.id)">
                        {{item2.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column width="290px" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showDistributRightDialog(scope.row)">分配权限</el-button>
            </template>
         </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
    title="添加用户"
    :visible.sync="isShowAddDialog"
    :center="false"
    @close="addDialogClosed"
    >
      <el-form
      :model="addRoleForm"
      :rules="addRoleFormRules"
      ref="addRoleFormRef"
      label-width="100px"
      status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
    title="编辑用户"
    :visible.sync="isShowEditDialog"
    :center="false"
    @close="editDialogClosed"
    >
      <el-form
      :model="editRoleForm"
      :rules="editRoleFormRules"
      ref="editRoleFormRef"
      label-width="100px"
      status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog
    title="分配权限"
    :visible.sync="isShowDistributeRightDialog"
    :center="false"
    >
      <el-tree
        :data="rightsListData"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="rightTree"
        :props="rightTreeProps"
        :default-checked-keys="defaultCheckedKeys"
      >
      </el-tree>
      <!-- 弹框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDistributeRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="distributeRight">确 定</el-button>
      </span>
    </el-dialog>
 </div>
</template>

<script>
export default {
  data () {
    return {
      rolesLists: [],
      isShowAddDialog: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色验证规则
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      isShowEditDialog: false,
      editRoleForm: {},
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      isShowDistributeRightDialog: false,
      // 权限列表
      rightsListData: [],
      // 树形控件中要显示的prop
      rightTreeProps: {
        label: 'authName',
        children: 'children'
      },
      // 树形控件默认勾选节点的数组
      defaultCheckedKeys: [],
      // 即将分配权限的角色ID
      roleId: 0
    }
  },
  created () {
    this.getRolesLists()
  },
  methods: {
    async getRolesLists () {
      const { data: res } = await this.axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      } else {
        console.log(res.data)
        this.rolesLists = res.data
      }
    },
    // 删除角色
    async deleteRole (roleId) {
      const confirmResult = await this.$confirm('将永久删除该角色，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult === 'confirm') {
        // 发送请求
        const { data: res } = await this.axios.delete('/roles/' + roleId)
        if (res.meta.status !== 200) {
          return this.$message.error('删除角色失败，待会再试！')
        } else {
          this.$message.success('删除角色成功！')
          this.getRolesLists()
        }
      } else {
        this.$message.info('已取消删除该角色')
      }
    },
    // 监听关闭弹窗事件
    addDialogClosed () {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 添加角色
    addRole () {
      // 预验证规则
      this.$refs.addRoleFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 预校验成功
        const { data: res } = await this.axios.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        } else {
          this.$message.success('添加角色成功！')
          this.getRolesLists()
          this.isShowAddDialog = false
        }
      })
    },
    // 展示修改角色对话框
    async showEditRoleDialog (roleId) {
      const { data: res } = await this.axios.get('roles/' + roleId)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      } else {
        this.editRoleForm = res.data
        this.isShowEditDialog = true
      }
    },
    // 关闭修改角色对话框
    editDialogClosed () {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 提交修改角色
    editRole () {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.put('roles/' + this.editRoleForm.roleId, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户角色失败！')
        } else {
          this.isShowEditDialog = false
          this.getRolesLists()
          this.$message.success('更新用户角色成功！')
        }
      })
    },
    // 取消角色权限
    async deleteRightById (role, rightId) {
      const confirmResult = await this.$confirm('将永久删除该角色的权限，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了该角色权限的删除')
      } else {
        const { data: res } = await this.axios.delete('roles/' + role.id + '/rights/' + rightId)
        if (res.meta.status !== 200) {
          this.$message.error('取消权限失败！')
        } else {
          this.$message.success('取消权限成功！')
          role.children = res.data
        }
      }
    },
    // 显示分配权限弹窗
    async showDistributRightDialog (role) {
      // 清空默认勾选的数组
      this.defaultCheckedKeys = []
      // 当前分配角色ID
      this.roleId = role.id
      const { data: res } = await this.axios.get('rights/tree')
      console.log(role)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      } else {
        this.rightsListData = res.data
        this.getDefaultCheckedKeys(role, this.defaultCheckedKeys)
        this.isShowDistributeRightDialog = true
      }
    },
    // 递归获取所有要勾选的三级树形节点的id,并保存到deflautCheckedKeys中
    getDefaultCheckedKeys (node, arr) {
      // 判断是不是三级节点
      if (!node.children) {
        return arr.push(node.id)
      } else {
        node.children.forEach(item => {
          this.getDefaultCheckedKeys(item, arr)
        })
      }
    },
    // 分配权限提交
    async distributeRight () {
      const keys = [
        this.$refs.rightTree.getCheckedKeys(),
        this.$refs.rightTree.getHalfCheckedKeys()
      ]
      const keysStr = keys.join(',')
      console.log(keysStr)
      const { data: res } = await this.axios.post('roles/' + this.roleId + '/rights', { rids: keysStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      } else {
        this.$message.success('分配权限成功')
        this.getRolesLists()
        this.isShowDistributeRightDialog = false
      }
    }
  }
}
</script>

<style scope>
  .table{
    margin-top: 20px;
  }
  .el-tag{
    margin: 10px;
  }
  .top-line{
    border-top: 1px solid #eee;
  }
  .bottom-line{
    border-bottom: 1px solid #eee;
  }
  .align-center{
    display: flex;
    align-items: center;
  }
</style>
