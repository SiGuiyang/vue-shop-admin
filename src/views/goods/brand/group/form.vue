<template>
  <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="50%" @opened="handleOpen">
    <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="100px">
      <el-form-item label="品牌组名称" prop="brandGroupName">
        <el-input v-model="formData.brandGroupName" placeholder="请设置"/>
      </el-form-item>
      <el-form-item label="序号" prop="sequence">
        <el-input v-model="formData.sequence" placeholder="请设置"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createOrModify } from '@/api/goods/group'

export default {
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogStatus: 'create',
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      rules: {
        brandGroupName: [{ required: true, message: '品牌组名称不能为空', trigger: 'blur' }],
        sequence: [{ required: true, message: '序号不能为空', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (/^[1-9]\d*|0$/.test(value)) {
              callback()
            } else {
              callback(new Error('序号不正确'))
            }
          }, trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    handleOpen() {
      this.$refs['dataForm'].clearValidate()
    },
    updateData() {
      const tempData = Object.assign({}, this.formData)
      tempData.createUser = this.$store.state.user.username
      tempData.updateUser = this.$store.state.user.username
      tempData.event = this.dialogStatus === 'create' ? 'add' : 'modify'
      createOrModify(tempData).then(() => {
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.$parent.getList()
      })
    }
  }
}
</script>
