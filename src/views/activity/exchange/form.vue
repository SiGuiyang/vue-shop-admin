<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
    <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="100px">
      <el-form-item label="活动名称" prop="activityName">
        <el-input v-model="formData.activityName" placeholder="请设置"/>
      </el-form-item>
      <el-form-item label="活动图片" prop="activityImg">
        <div style="margin-bottom: 20px;">
          <Upload v-model="formData.activityImg" />
        </div>
      </el-form-item>
      <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker v-model="formData.beginTime" placeholder="开始时间" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" class="filter-item" type="date"/>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="formData.endTime" placeholder="结束时间" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" class="filter-item" type="date"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
      <el-button v-permission="'ROLE_SUPER_ADMIN'" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addExchangeActivity, modifyExchangeActivity } from '@/api/exchange'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Upload from '@/components/Upload/singleImage3'

export default {
  components: { Upload },
  directives: { waves, permission },
  props: {
    formData: {
      type: Object,
      default: () => ({
        beginTime: '2019-04-29',
        endTime: '2020-04-29'
      })
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑满赠换购',
        create: '新建满赠换购'
      },
      dialogStatus: undefined,
      dialogFormVisible: false,
      rules: {
        activityName: [{ required: true, message: '活动标题不能为空', trigger: 'blur' }],
        activityImg: [{ required: true, message: '活动图片不能为空', trigger: 'blur' }],
        beginTime: [{ required: true, message: '开始不能为空', trigger: 'blur' }],
        endTime: [{ required: true, message: '结束不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {

    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.createUser = this.$store.state.user.username
          addExchangeActivity(this.formData).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogFormVisible = false
            this.$parent.getExchange()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.formData)
          modifyExchangeActivity(tempData).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogFormVisible = false
            this.$parent.getExchange()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
