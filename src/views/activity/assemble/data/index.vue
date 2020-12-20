<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.activityName"
                placeholder="活动名称"
                style="width: 200px;"
                class="filter-item" />
      <el-select v-model="listQuery.state"
                 placeholder="状态"
                 clearable
                 class="filter-item">
        <el-option v-for="(item,index) in stateOptions"
                   :key="index"
                   :label="item.value"
                   :value="item.key" />
      </el-select>
      <el-date-picker v-model="listQuery.range"
                      :default-time="['00:00:00', '23:59:59']"
                      type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      class="filter-item" />
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
      <el-button v-waves
                 v-permission="'PAGER_ACTIVITY_ASSEMBLY_CREATE'"
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
      <el-table-column label="活动时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ getActivityTime(scope.row) }}</span>
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

      <el-table-column label="更新时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作人"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateUser }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       width="240"
                       fixed="right"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <!-- 编辑-->
          <el-button v-permission="'PAGER_ACTIVITY_ASSEMBLY_MODIFY'"
                     type="primary"
                     size="small"
                     @click="handleCommand('EDIT', scope.row)">编辑
          </el-button>
          <!-- 启用-->
          <el-button v-if="scope.row.state"
                     v-permission="'PAGER_ACTIVITY_ASSEMBLY_MODIFY'"
                     type="success"
                     size="small"
                     @click="handleCommand('ENABLED', scope.row, false)">启用
          </el-button>
          <!-- 禁用-->
          <el-button v-else
                     v-permission="'PAGER_ACTIVITY_ASSEMBLY_MODIFY'"
                     type="danger"
                     size="small"
                     @click="handleCommand('ENABLED', scope.row, true)">禁用
          </el-button>
          <!-- 拼团规则-->
          <el-button v-waves
                     v-permission="'PAGER_ACTIVITY_ASSEMBLY_RULE'"
                     type="success"
                     size="small"
                     @click="handleCommand('RULE', scope.row)">规则</el-button>
          <!-- 拼团商品-->
          <el-button v-waves
                     v-permission="'PAGER_ACTIVITY_ASSEMBLY_GOODS'"
                     type="warning"
                     size="small"
                     @click="handleCommand('GOODS', scope.row)">拼团商品</el-button>
          <!-- 拼团记录-->
          <el-button v-waves
                     v-permission="'PAGER_ACTIVITY_ASSEMBLY_RECORD'"
                     type="primary"
                     size="small"
                     @click="handleCommand('RECORD', scope.row)">成团记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getList()" />

    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { fetchList, modifyActivity } from '@/api/activity/activity'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'AssembleManage',
  components: { Pagination, IForm },
  directives: { waves, permission },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        activityType: 2,
        activityName: undefined,
        timeRange: undefined
      },
      stateOptions: [{ key: false, value: '启用' }, { key: true, value: '禁用' }],
      formData: {}
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () { // 活动列表
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
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
    getActivityTime (row) {
      const beginTime = row.beginTime
      const endTime = row.endTime

      return parseTime(beginTime, '{y}-{m}-{d}') + ' 至 ' + parseTime(endTime, '{y}-{m}-{d}')
    },
    handleCreate () {
      this.formData = {}
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.formData = Object.assign({}, row)
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleCommand (command, row, status) {
      switch (command) {
        case 'EDIT':
          this.handleUpdate(row)
          break
        case 'ENABLED':
          this.handleDisable(row.id, status)
          break
        case 'GOODS':
          this.handleJump('/activity/assemble/goods/' + row.id)
          break
        case 'RULE':
          this.handleJump('/activity/assemble/rule/' + row.id)
          break
        case 'RECORD':
          this.handleJump('/activity/assemble/record/' + row.id)
          break
      }
    },
    handleJump (router) { // 路由跳转
      this.$router.push({ path: router })
    },
    handleDisable (id, state) {
      const params = {
        id: id,
        state: state,
        updateUser: this.$store.state.user.username
      }
      modifyActivity(params).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getList()
      })
    }
  }
}
</script>
