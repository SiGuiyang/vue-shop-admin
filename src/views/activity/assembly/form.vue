<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
    <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="100px">
      <el-form-item :label="$t('activity.fightGroup.activityName')" prop="activityName">
        <el-input v-model="formData.activityName" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('activity.fightGroup.activityImg')" prop="activityImg">
        <div style="margin-bottom: 20px;">
          <Upload v-model="formData.activityImg" />
        </div>
      </el-form-item>
      <el-form-item :label="$t('time.beginTime')" prop="beginTime">
        <el-date-picker v-model="formData.beginTime" :placeholder="$t('time.beginTime')" format="yyyy-MM-dd HH:mm:ss" class="filter-item" type="datetime"/>
      </el-form-item>
      <el-form-item :label="$t('time.endTime')" prop="endTime">
        <el-date-picker v-model="formData.endTime" :placeholder="$t('time.endTime')" format="yyyy-MM-dd HH:mm:ss" class="filter-item" type="datetime"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
      <el-button v-permission="'ROLE_ADMIN'" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addAssembly, modifyAssembly } from '@/api/assembly'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Upload from '@/components/Upload/singleImage3'

export default {
  components: { Upload },
  directives: { waves, permission },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogStatus: undefined,
      dialogFormVisible: false,
      rules: {
        activityName: [{ required: true, message: '活动标题不能为空', trigger: 'blur' }],
        activityImg: [{ required: true, message: '分享地址不能为空', trigger: 'blur' }],
        beginTime: [{ required: true, message: '分享标题不能为空', trigger: 'blur' }],
        endTime: [{ required: true, message: '分享副标题不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {

    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.createUser = this.$store.state.user.username
          addAssembly(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getFightGroup()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.formData)
          modifyAssembly(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getFightGroup()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
