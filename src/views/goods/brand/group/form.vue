<template>
  <el-dialog :title="dialogFormTitle"
             :visible.sync="dialogFormVisible"
             width="50%"
             @opened="handleOpen">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="left"
             label-width="100px">
      <el-form-item label="品牌组名称"
                    prop="brandGroupName">
        <el-input v-model="formData.brandGroupName"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="序号"
                    prop="sequence">
        <el-input-number v-model="formData.sequence"
                         :min="1"
                         :max="100"
                         label="请设置" />
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { postCreate, putModify } from '@/api/goods/group'

export default {
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      dialogStatus: 'create',
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      rules: {
        brandGroupName: [{ required: true, message: '品牌组名称不能为空', trigger: 'blur' }],
        sequence: [{ required: true, message: '序号不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleOpen () {
      this.$refs['dataForm'].clearValidate()
    },
    createData () {
      const tempData = Object.assign({}, this.formData)
      tempData.createUser = this.$store.state.user.username
      tempData.updateUser = this.$store.state.user.username
      tempData.event = this.dialogStatus === 'create' ? 'add' : 'modify'
      postCreate(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        this.$parent.getList()
      })
    },
    updateData () {
      const tempData = Object.assign({}, this.formData)
      tempData.updateUser = this.$store.state.user.username
      putModify(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.$parent.getList()
      })
    }
  }
}
</script>
