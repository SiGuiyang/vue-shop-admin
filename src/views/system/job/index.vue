<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.jobName"
                placeholder="任务名称"
                style="width: 200px;"
                class="filter-item" />
      <el-select v-model="listQuery.jobGroupId"
                 :filterable="true"
                 class="filter-item"
                 placeholder="任务组名称">
        <el-option v-for="(item,index) in jobGroupList"
                   :key="index"
                   :label="item.groupName"
                   :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.jobStatus"
                 :filterable="true"
                 class="filter-item"
                 placeholder="任务状态">
        <el-option v-for="(item,index) in jobStatusList"
                   :key="index"
                   :label="item.desc"
                   :value="item.code" />
      </el-select>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">新增</el-button>
    </div>

    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="任务名称"
                       width="200"
                       align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.jobName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务组名称"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jobGroup }}</span>
        </template>
      </el-table-column>
      <el-table-column label="cron表达式"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cron }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务实例"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求方法"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceMethod }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jobStatusName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       class-name="small-padding fixed-width"
                       width="260"
                       fixed="right"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     @click="handleQuery(scope.row)">编辑</el-button>
          <el-button type="danger"
                     @click="handleDel(scope.row)">删除</el-button>
          <el-button type="default"
                     @click="handlePause(scope.row)">暂停</el-button>
          <el-button type="warning"
                     @click="handleResume(scope.row)">恢复</el-button>
          <el-button type="success"
                     @click="handleExecute(scope.row)">立即执行</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getList" />
    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { postJobList, getJobGroupList, getJobStatusList, deleteJob, parseJob, resumeJob, executeJob } from '@/api/job/job'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'Job',
  components: { Pagination, IForm },
  directives: { waves },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      expand: false,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 5,
        jobName: undefined,
        jobGroup: undefined,
        jobStatus: undefined
      },
      jobGroupList: [], // job任务组 列表
      jobStatusList: [], // job状态 列表
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      formData: {
        id: undefined,
        className: undefined,
        icon: undefined,
        createUser: undefined
      },
      rules: {
        className: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getList()
    this.handleJobGroupList()
    this.handleJobStatusList()
  },
  methods: {
    getList () { // 任务列表
      this.listLoading = true
      postJobList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter () { // 搜索
      this.listQuery.page = 1

      this.getList()
    },
    handleJobGroupList () { // job组列表
      getJobGroupList().then(response => {
        this.jobGroupList = response.data
      })
    },
    handleJobStatusList () { // job状态列表
      getJobStatusList().then(response => {
        this.jobStatusList = response.data
      })
    },
    handleCreate () { // 新增
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.formData = {}
    },
    handleQuery (row) { // 查看分类中的商品
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogFormVisible = true
      _this.dialogStatus = 'update'
    },
    handleDel (row) { // 删除任务
      deleteJob(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList() // 刷新页面
      })
    },
    handlePause (row) { // 暂停任务
      parseJob(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '暂停成功',
          type: 'success',
          duration: 2000
        })
        this.getList() // 刷新页面
      })
    },
    handleResume (row) { // 恢复任务
      resumeJob(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '恢复成功',
          type: 'success',
          duration: 2000
        })
        this.getList() // 刷新页面
      })
    },
    handleExecute (row) { // 执行任务
      const params = {
        id: row.id
      }
      executeJob(params).then(() => {
        this.$notify({
          title: '成功',
          message: '执行成功',
          type: 'success',
          duration: 2000
        })
        this.getList() // 刷新页面
      })

    }
  }
}
</script>
