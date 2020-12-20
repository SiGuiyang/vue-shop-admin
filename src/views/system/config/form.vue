<template>
  <el-dialog :title="textMap[dialogStatus]"
             :visible.sync="dialogFormVisible"
             @open="handleOpen">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="100px"
             width="50%">
      <el-form-item label="配置项名称"
                    prop="configName">
        <el-input v-model="formData.configName"
                  :disabled="configNameDisabled"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="配置项类型"
                    prop="configType">
        <el-input v-model="formData.configType"
                  :disabled="configTypeDisabled"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="说明">
        <el-input v-model="formData.description"
                  :autosize="{ minRows: 4, maxRows: 8}"
                  type="textarea"
                  placeholder="请添加说明" />
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="dialogStatus==='create'?createData():updateData()">确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addConfig, modifyConfig } from '@/api/config'

export default {
  name: 'Form',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      textMap: {
        update: '编辑配置',
        create: '新增配置'
      },
      dialogStatus: undefined,
      dialogFormVisible: false,
      configNameDisabled: false,
      configTypeDisabled: false,
      rules: {
        configName: [{ required: true, message: '配置项名称不能为空', trigger: 'blur' }],
        configType: [{ required: true, message: '配置项类型不能为空', trigger: 'blur' }],
        configValue: [{ required: true, message: '配置项值不能为空', trigger: 'blur' }],
        module: [{ required: true, message: '模块不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleOpen () {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.createUser = this.$store.state.user.username
          this.formData.updateUser = this.$store.state.user.username
          const tempData = Object.assign({}, this.formData)
          addConfig(tempData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.$parent.getList()
          })
        }
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.updateUser = this.$store.state.user.username
          const tempData = Object.assign({}, this.formData)
          modifyConfig(tempData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.getList()
          })
        }
      })
    }
  }
}
</script>
