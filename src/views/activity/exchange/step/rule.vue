<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves
                 v-permission="'ROLE_SUPER_ADMIN'"
                 class="filter-item"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">添加
      </el-button>
    </div>
    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="活动名称"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.activityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动规则名称"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ruleName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="最低限额"
                       align="center">
        <template slot-scope="scope">
          <span class="icon-money">
            <svg-icon icon-class="money" />{{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态"
                       align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.serverStatus"
                  type="danger">禁用</el-tag>
          <el-tag v-else
                  type="success">启用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       fixed="right"
                       width="160"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <!-- 编辑-->
          <el-button v-permission="'ROLE_SUPER_ADMIN'"
                     type="primary"
                     size="small"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>

          <el-button v-if="scope.row.serverStatus"
                     v-permission="'ROLE_SUPER_ADMIN'"
                     type="success"
                     size="small"
                     @click="handleDisable(scope.row.id,false)">启用
          </el-button>

          <el-button v-else
                     v-permission="'ROLE_SUPER_ADMIN'"
                     type="danger"
                     size="small"
                     @click="handleDisable(scope.row.id,true)">禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <rule-form ref="ruleForm"
               :activity-rule="formData" />
  </div>
</template>

<script>
import { getRuleList, getExchangeActivity, modifyRule } from '@/api/activity/exchange'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import RuleForm from './ruleForm'

export default {
  components: { RuleForm },
  directives: { waves, permission },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20,
        activityId: undefined
      },
      formData: {},
      activity: {}
    }
  },
  created () {
    this.listQuery.activityId = this.$route.params.id
    this.initActivity(this.listQuery.activityId) // 初始化活动
    this.handleRuleList()
  },
  methods: {
    handleRuleList () { // 活动列表
      this.listLoading = true
      getRuleList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    initActivity (activityId) {
      getExchangeActivity({ activityId: activityId }).then(response => {
        this.activity = response.data
      })
    },
    handleCreate () {
      this.formData = {}
      this.formData.activityName = this.activity.activityName
      this.formData.activityId = this.activity.id
      const _this = this.$refs['ruleForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.formData = Object.assign({}, row)
      this.formData.activityId = this.activity.id
      const _this = this.$refs['ruleForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDisable (id, serverStatus) {
      const params = {
        id: id,
        updateUser: this.$store.state.user.username,
        serverStatus: serverStatus
      }
      modifyRule(params).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.handleRuleList()
      })
    }
  }
}
</script>
<style scoped>
.icon-money {
  color: #f4516c;
}
</style>
