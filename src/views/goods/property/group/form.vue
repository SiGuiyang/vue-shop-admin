<template>
  <el-dialog :title="dialogFormTitle"
             :visible.sync="dialogFormVisible"
             width="50%"
             @opened="handleOpen">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="100px">
      <el-form-item label="属性组名称"
                    prop="propertyGroupName">
        <el-input v-model="formData.propertyGroupName"
                  placeholder="请设置" />
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
import { postpropertyGroupCreate, putpropertyGroupModify } from '@/api/goods/propertyGroup'

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
        propertyGroupName: [{ required: true, message: '属性组名称不能为空', trigger: 'blur' }]
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
      postpropertyGroupCreate(tempData).then(() => {
        this.dialogFormVisible = false
        this.$message({
          message: '创建成功',
          type: 'success'
        })
        this.$parent.getList()
      })
    },
    updateData () {
      const tempData = Object.assign({}, this.formData)
      tempData.updateUser = this.$store.state.user.username
      putpropertyGroupModify(tempData).then(() => {
        this.dialogFormVisible = false
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.$parent.getList()
      })
    }
  }
}
</script>
