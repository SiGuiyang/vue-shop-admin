<template>
  <el-dialog :title="textMap[dialogDetailStatus]"
             :visible.sync="dialogDetailFormVisible"
             @open="handleOpen">
    <el-form ref="dataDetailForm"
             :rules="rules"
             :model="detailFormData"
             label-position="top"
             label-width="100px"
             width="50%">
      <el-form-item label="配置项名称"
                    prop="configName">
        <el-input v-model="detailFormData.configName"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="配置项类型"
                    prop="configType">
        <el-input v-model="detailFormData.configType"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="配置项值"
                    prop="configValue">
        <el-input v-model="detailFormData.configValue"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="配置项Key"
                    prop="configKey">
        <el-input v-model="detailFormData.configKey"
                  :disabled="configKeyDisabled"
                  placeholder="请设置" />
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogDetailFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="dialogDetailStatus==='create'?createData():updateData()">确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postConfigDetailCreate, putConfigDetailModify } from '@/api/config'

export default {
  name: 'DetailForm',
  props: {
    detailFormData: {
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
        update: '编辑明细配置',
        create: '新增明细配置'
      },
      dialogDetailStatus: 'create',
      dialogDetailFormVisible: false,
      configKeyDisabled: true,
      rules: {
        configName: [{ required: true, message: '配置项名称不能为空', trigger: 'blur' }],
        configType: [{ required: true, message: '配置项类型不能为空', trigger: 'blur' }],
        configValue: [{ required: true, message: '配置项值不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleOpen () {
      this.$nextTick(() => {
        this.$refs['dataDetailForm'].clearValidate()
      })
    },
    createData () {
      this.$refs['dataDetailForm'].validate((valid) => {
        if (valid) {
          this.detailFormData.createUser = this.$store.state.user.username
          this.detailFormData.updateUser = this.$store.state.user.username
          const tempData = Object.assign({}, this.detailFormData)
          postConfigDetailCreate(tempData).then(() => {
            this.dialogDetailFormVisible = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.handleDetailList({ configKey: this.detailFormData.configKey }) // 回调列表
          })
        }
      })
    },
    updateData () {
      this.$refs['dataDetailForm'].validate((valid) => {
        if (valid) {
          this.detailFormData.updateUser = this.$store.state.user.username
          const tempData = Object.assign({}, this.detailFormData)
          putConfigDetailModify(tempData).then(() => {
            this.dialogDetailFormVisible = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.handleDetailList({ configKey: this.detailFormData.configKey }) // 回调列表
          })
        }
      })
    }
  }
}
</script>
