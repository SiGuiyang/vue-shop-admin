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
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="任务名称"
                        prop="jobName">
            <el-input v-model="formData.jobName"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务组名称"
                        prop="jobGroupId">
            <el-select v-model="formData.jobGroupId"
                       :filterable="true"
                       placeholder="请选择"
                       class="display-block"
                       @change="handleChange">
              <el-option label="新增"
                         value="create">
                <span style="float: left"> + 新增</span>
              </el-option>
              <el-option v-for="(item,index) in jobGroupList"
                         :key="index"
                         :label="item.groupName"
                         :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="cron表达式"
                        prop="cron">
            <el-input v-model="formData.cron"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务实例"
                        prop="serviceName">
            <el-input v-model="formData.serviceName"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="请求方法"
                        prop="serviceMethod">
            <el-input v-model="formData.serviceMethod"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="说明"
                        prop="description">
            <el-input v-model="formData.description"
                      type="textarea"
                      :rows="4"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
    <el-dialog width="60%"
               title="新增任务组"
               :show-close="false"
               :visible.sync="jobGroupVisible"
               append-to-body>
      <el-form ref="dataGroupForm"
               :model="formGroupData"
               label-position="top"
               label-width="100px">
        <el-form-item label="任务组名称"
                      prop="name">
          <el-input v-model="formGroupData.name"
                    placeholder="请设置" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="jobGroupCancel">取消</el-button>
        <el-button type="primary"
                   @click="createJobGroupData()">确认</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { postJobCreate, putJobModify, postJobGroupCreate, getJobGroupList } from '@/api/job/job'

export default {
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      jobGroupVisible: false,
      dialogStatus: 'create',
      dialogFormTitle: '编辑',
      formGroupData: {},
      jobGroupList: [], // job任务组 列表
      rules: {
        jobName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
        jobGroupId: [{ required: true, message: '任务组名称不能为空', trigger: 'blur' }],
        cron: [{ required: true, message: 'cron不能为空', trigger: 'blur' }],
        serviceName: [{ required: true, message: '服务实例不能为空', trigger: 'blur' }],
        serviceMethod: [{ required: true, message: '请求方法不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleOpen () {
      this.$refs['dataForm'].clearValidate()
      this.handleJobGroupList()
    },
    handleJobGroupList () { // job组列表
      getJobGroupList().then(response => {
        this.jobGroupList = response.data
      })
    },
    handleChange (val) {
      console.log(val)
      if (val === 'create') {
        this.jobGroupVisible = true
      }
    },
    jobGroupCancel () {
      this.formData.jobGroupId = ''
      this.jobGroupVisible = false
    },
    createJobGroupData () { // 创建jobGroup
      const tempData = Object.assign({}, this.formGroupData)
      postJobGroupCreate(tempData).then(() => {
        this.jobGroupVisible = false
        this.$notify({
          type: 'success',
          title: '成功',
          message: '创建成功',
          duration: 2000
        })
        this.handleJobGroupList()
      })
    },
    createData () {
      const tempData = Object.assign({}, this.formData)
      tempData.updateUser = this.$store.state.user.username
      tempData.createUser = this.$store.state.user.username
      postJobCreate(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          type: 'success',
          title: '成功',
          message: '创建成功',
          duration: 2000
        })
        this.$parent.getList()
      })
    },
    updateData () {
      const tempData = Object.assign({}, this.formData)
      tempData.createUser = this.$store.state.user.username
      putJobModify(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          type: 'success',
          title: '成功',
          message: '更新成功',
          duration: 2000
        })
        this.$parent.getList()
      })
    }
  }
}
</script>
