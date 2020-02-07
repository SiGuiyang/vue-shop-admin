<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <generate-form
      ref="generateForm"
      :data="widgetForm"
      :value="widgetModels"
      insite="true"/>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import GenerateForm from '@/components/DynamicForm/GenerateForm'
// import { addConfig, modifyConfig } from '@/api/config'
import { getForm } from '@/api/common'
export default {
  name: 'Form2',
  components: {
    GenerateForm
  },
  data() {
    return {
      textMap: {
        update: '编辑配置',
        create: '新增配置'
      },
      dialogStatus: undefined,
      dialogFormVisible: false,
      configNameDisabled: false,
      configTypeDisabled: false,
      previewTitle: '',
      widgetForm: {
        widgets: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small'
        }
      },
      widgetModels: {}
    }
  },
  methods: {
    handleInit() {
      getForm({ bizType: 'SYSTEM_CONFIG' }).then(response => {
        response.data.forEach(item => this.widgetForm.widgets.push(item))
        console.log(this.widgetForm)
      })
    },
    createData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     this.formData.createUser = this.$store.state.user.username
      //     const tempData = Object.assign({}, this.formData)
      //     addConfig(tempData).then(() => {
      //       this.dialogFormVisible = false
      //       this.$message({
      //         type: 'success',
      //         message: '创建成功'
      //       })
      //       this.$parent.getList()
      //     })
      //   }
      // })
    },
    updateData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     const tempData = Object.assign({}, this.formData)
      //     modifyConfig(tempData).then(() => {
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         type: 'success',
      //         message: '更新成功'
      //       })
      //       this.$parent.getList()
      //     })
      //   }
      // })
    }
  }
}
</script>

<style scoped>

</style>
