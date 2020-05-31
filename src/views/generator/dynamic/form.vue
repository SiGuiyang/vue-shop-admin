<template>
  <el-dialog width="60%"
             title="设置表单模型"
             :visible.sync="dialogFormVisible">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="100px">
      <el-form-item label="表单模型"
                    prop="bizType">
        <el-input v-model="formData.bizType"
                  :disabled="bizTypeDisabled"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="表单模型名称"
                    prop="name">
        <el-input v-model="formData.name"
                  placeholder="请设置" />
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="dialogStatus==='create'? handleCreate() : handleModify()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postFormCreate, putFormModify } from '@/api/generate/form'
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      bizTypeDisabled: false, // 编辑时表单模型不能编辑
      dialogStatus: 'create',
      rules: {
        bizType: [{ required: true, message: '表单模型能为空', trigger: 'blur' }],
        name: [{ required: true, message: '表单模型名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleCreate () {
      debugger
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.createUser = this.$store.state.user.username
          this.formData.updateUser = this.$store.state.user.username
          postFormCreate(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.handleList()
          })
        }
      })
    },
    handleModify () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.updateUser = this.$store.state.user.username
          putFormModify(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.handleList()
          })
        }
      })
    }
  }
}
</script>
