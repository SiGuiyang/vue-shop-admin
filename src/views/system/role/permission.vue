<template>
  <!-- 授权 -->
  <el-dialog :title="permissionTitle" :visible.sync="permissionVisible" align="center">
    <div style="height:460px;">
      <el-scrollbar style="height:98%">
        <el-tree
          ref="tree"
          :data="permissions"
          :default-expanded-keys="hadPermission"
          :default-checked-keys="hadPermission"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          highlight-current />
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePermission">确认</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { grantAuthorization } from '@/api/role'
export default {
  name: 'IPermission',
  props: {
    permissions: {
      type: Array,
      default: () => ([])
    },
    hadPermission: {
      type: Array,
      default: () => ([])
    },
    selectedRoleId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      permissionVisible: false,
      permissionTitle: '授予权限',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    handlePermission() {
      const data = []
      const checked = this.$refs.tree.getCheckedKeys() // 获取全选择中的节点
      const halfChecked = this.$refs.tree.getHalfCheckedKeys() // 获取半选中的节点
      checked.forEach(ck => data.push(ck))
      halfChecked.forEach(hc => data.push(hc))
      const params = {}
      params.permissions = data // 将最终获取的权限节点入参进行授权
      params.roleId = this.selectedRoleId
      grantAuthorization(params).then(() => {
        this.permissionVisible = false
        this.$notify({
          title: '成功',
          message: '菜单授权成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped>
  .el-dialog__body {
    padding: 40px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
</style>
