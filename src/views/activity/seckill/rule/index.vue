<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves
                 v-permission="'PAGER_ACTIVITY_EXCHANGE_RULE_CREATE'"
                 class="filter-item"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">创建
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
                       align="left">
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
      <el-table-column label="更新时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state"
                  type="danger">禁用</el-tag>
          <el-tag v-else
                  type="success">启用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       fixed="right"
                       width="220"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <!-- 编辑-->
          <el-button v-permission="'PAGER_ACTIVITY_EXCHANGE_RULE_MODIFY'"
                     type="primary"
                     size="small"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>

          <el-button v-permission="'PAGER_ACTIVITY_EXCHANGE_RULE_MODIFY'"
                     type="danger"
                     size="small"
                     @click="handleDelete(scope.row)">删除
          </el-button>

          <el-button v-if="scope.row.state"
                     v-permission="'PAGER_ACTIVITY_EXCHANGE_RULE_MODIFY'"
                     type="success"
                     size="small"
                     @click="handleDisable(scope.row,false)">启用
          </el-button>

          <el-button v-else
                     v-permission="'PAGER_ACTIVITY_EXCHANGE_RULE_MODIFY'"
                     type="danger"
                     size="small"
                     @click="handleDisable(scope.row,true)">禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <rule-form ref="ruleForm"
               :activity-rule="formData" />
  </div>
</template>

<script>
import { getRuleList, modifyRule, deleteRule } from '@/api/activity/exchange'
import { getActivity } from '@/api/activity/activity'
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
      getActivity({ activityId: activityId }).then(response => {
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
    handleDelete (row) {
      deleteRule({ id: row.id, activityId: row.activityId }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.handleRuleList()
      })
    },
    handleDisable (row, state) {
      const params = {
        id: row.id,
        activityId: row.activityId,
        updateUser: this.$store.state.user.username,
        state: state
      }
      modifyRule(params).then(() => {
        this.$message({
          message: '更新成功',
          type: 'success'
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
