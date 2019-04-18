<template>
  <div>
    <!-- 新增编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @open="handleOpen">
      <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="100px" width="50%">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请设置"/>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="formData.roleCode" placeholder="请设置"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, modifyRole } from '@/api/role'
export default {
  name: 'Form',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleCode: [{ required: true, message: '角色代码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleOpen() {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.createUser = this.$store.state.user.username
          addRole(this.formDatam).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.getRoleList()
          })
        }
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.formData)
          modifyRole(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.getRoleList()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
