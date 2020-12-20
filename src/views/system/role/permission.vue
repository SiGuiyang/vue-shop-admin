<template>
  <el-container>
    <el-aside class="p-aside">
      <h3>路由权限</h3>
      <el-tree ref="tree"
               :data="routers"
               :default-expanded-keys="routerPermission"
               :default-checked-keys="routerPermission"
               :check-strictly="checkStrictly"
               :props="defaultProps"
               show-checkbox
               node-key="id"
               highlight-current
               @node-click="handleNodeClick"
               @check-change="handleCheckChange" />
    </el-aside>
    <el-main>
      <div class="p-main-header">
        <h3>按钮权限</h3>
        <el-button type="success"
                   icon="el-icon-check"
                   @click="handlePermission">提交</el-button>
      </div>
      <el-checkbox-group v-model="checkBtn">
        <el-checkbox v-for="btn in btns"
                     :key="btn.id"
                     :label="btn.id">{{ btn.name }}</el-checkbox>
      </el-checkbox-group>
    </el-main>
  </el-container>
</template>

<script>
import { grantAuthorization, postRolePermission, getPermission } from '@/api/role'

export default {
  name: 'IPermission',
  data () {
    return {
      checkStrictly: true,
      routers: [],
      routerPermission: [],
      btns: [],
      checkBtnPermission: [],
      checkBtn: [],
      selectedRoleId: 0,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created () {
    const roleId = this.$route.params.id
    this.selectedRoleId = roleId
    this.initPermission(roleId)
  },
  methods: {
    initPermission (roleId) {
      // 获取菜单列表
      postRolePermission({ roleId: roleId }).then(response => {
        this.routers = response.data.routers
        this.routerPermission = response.data.routerPermission
        this.checkBtn = response.data.btnPermission
      })
    },
    handlePermission () {
      const data = []
      const checked = this.$refs.tree.getCheckedKeys() // 获取全选择中的节点
      const halfChecked = this.$refs.tree.getHalfCheckedKeys() // 获取半选中的节点
      checked.forEach(ck => data.push(ck))
      this.checkBtn.forEach(cb => data.push(cb))
      halfChecked.forEach(hc => data.push(hc))
      const params = {}
      params.permissions = data // 将最终获取的权限节点入参进行授权
      params.roleId = this.selectedRoleId
      console.log(data)
      grantAuthorization(params).then(() => {
        this.$message({
          message: '菜单授权成功',
          type: 'success'
        })
      })
    },
    handleNodeClick (data) {
      getPermission(data).then(res => {
        this.btns = res.data
      })
    },
    handleCheckChange (data) {
      getPermission(data).then(res => {
        this.btns = res.data
      })
    }
  }
}
</script>

<style scoped>
.p-aside {
  margin: 20px;
}

.p-main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
