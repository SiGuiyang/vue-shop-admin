<template>
  <el-dialog :title="dialogFormTitle"
             :visible.sync="dialogFormVisible"
             append-to-body
             width="60%"
             @opened="handleOpen">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="100px">
      <el-form-item label="分类名称"
                    prop="className">
        <el-input v-model="formData.className"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="序号"
                    prop="sequence">
        <el-input-number v-model="formData.sequence"
                         :min="0"
                         :max="100"
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
import { postClassificationCreate, putClassificationModify } from '@/api/goods/classification'
export default {
  name: 'GcForm',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    spu: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      dialogStatus: 'create',
      dialogFormTitle: '编辑',
      rules: {
        className: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
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
      tempData.updateUser = this.$store.state.user.username
      tempData.createUser = this.$store.state.user.username
      tempData.spuId = this.spu.id
      postClassificationCreate(tempData).then(() => {
        this.dialogFormVisible = false
        this.$message({
          message: '创建成功',
          type: 'success'
        })
        this.$parent.$parent.getList()
      })
    },
    updateData () {
      const tempData = Object.assign({}, this.formData)
      tempData.createUser = this.$store.state.user.username
      tempData.spuId = this.spu.id
      putClassificationModify(tempData).then(() => {
        this.dialogFormVisible = false
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.$parent.$parent.getList()
      })
    }
  }
}
</script>
