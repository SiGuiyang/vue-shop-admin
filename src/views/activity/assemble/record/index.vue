<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phone"
                type="text"
                placeholder="手机号码"
                style="width: 200px;"
                class="filter-item" />
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="用户名称"
                       align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否团长"
                       align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.master"
                  type="success">是</el-tag>
          <el-tag v-else
                  type="warning">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否开团"
                       align="center">
        <template slot-scope="scope">
          <el-tag type="success">{{ getStatus(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="参团时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成团时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.groupTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getList" />
  </div>
</template>

<script>
import { members } from '@/api/activity/assemble'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'FightGroupRecord',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: 'warning',
        1: 'danger',
        2: 'success'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20,
        activityId: undefined,
        phone: undefined
      },
      recordStatusOptions: [
        { key: 0, value: '已开团' },
        { key: 1, value: '未成团' },
        { key: 2, value: '已成团' }
      ]
    }
  },
  created () {
    this.tempRoute = Object.assign({}, this.$route)
    this.getList()
  },
  methods: {
    getList () { // 活动列表
      this.listLoading = true
      this.listQuery.activityId = this.$route.params.id
      members(this.listQuery).then(response => {
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
    getStatus (status) {
      return this.recordStatusOptions.filter(rso => rso.key === status)[0].value
    }
  }
}
</script>
