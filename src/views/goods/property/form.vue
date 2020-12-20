<template>
  <el-dialog :title="dialogFormTitle"
             :visible.sync="dialogFormVisible"
             width="60%"
             @opened="handleOpen">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="100px">
      <el-form-item label="属性名称"
                    prop="propertyName">
        <el-input v-model="formData.propertyName"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="所属属性组"
                    prop="propertyGroupId">
        <el-select v-model="formData.propertyGroupId"
                   remote
                   reserve-keyword
                   :remote-method="handleGroup"
                   :loading="loading"
                   placeholder="请选择">
          <el-option v-for="group in groupList"
                     :key="group.id"
                     :label="group.propertyGroupName"
                     :value="group.id" />
        </el-select>
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
import { postCreate, putModify } from '@/api/goods/property'
import { getList } from '@/api/goods/propertyGroup'

export default {
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    brandGroup: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      loading: false,
      dialogStatus: undefined,
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      rules: {
        propertyName: [{ required: true, message: '属性名称不能为空', trigger: 'blur' }],
        groupId: [{ required: true, message: '属性组不能为空', trigger: 'blur' }]
      },
      groupList: []
    }
  },
  methods: {
    handleOpen () {
      this.$refs['dataForm'].clearValidate()
      getList({}).then((response) => {
        this.groupList = response.data
      })
    },
    handleGroup (data) {
      if (data !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          const param = { propertyGroupName: data }
          getList(param).then((response) => {
            this.groupList = response.data
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    createData () {
      const tempData = Object.assign({}, this.formData)
      tempData.createUser = this.$store.state.user.username
      tempData.updateUser = this.$store.state.user.username
      postCreate(tempData).then(() => {
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
      putModify(tempData).then(() => {
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
