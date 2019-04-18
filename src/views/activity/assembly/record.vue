<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker v-model="listQuery.beginTime" :placeholder="$t('time.beginTime')" format="yyyy-MM-dd HH:mm:ss" class="filter-item" type="datetime"/>
      <el-date-picker v-model="listQuery.endTime" :placeholder="$t('time.endTime')" format="yyyy-MM-dd HH:mm:ss" class="filter-item" type="datetime"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.id')" type="selection" width="65" align="center"/>>
      <el-table-column :label="$t('activity.fightGroup.activityName')" width="350" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.activityName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.status')" width="350" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ getStatus(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('activity.fightGroup.time')" width="350" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" fixed="right" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <!-- 编辑-->
          <el-button v-permission="'/admin/activity/fightGroup/members'" type="primary" size="mini" @click="handleQuery(scope.row)">{{ $t('table.detail') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getFightGroupRecordList" />

    <el-dialog :title="dialogVisibleTitle" :visible.sync="dialogFormVisible" width="70%">
      <div slot="footer" class="dialog-footer">
        <el-table
          v-loading="memberListLoading"
          :data="memberList"
          border
          fit
          highlight-current-row
          style="width: 100%;">
          <el-table-column :label="$t('table.id')" type="selection" width="65" align="center"/>>
          <el-table-column :label="$t('activity.coupon.phone')" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('activity.coupon.username')" width="210" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('activity.fightGroup.master')" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.master ? '是' : '否' }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('activity.fightGroup.time')" width="300" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="memberTotal>0" :total="memberTotal" :page.sync="memberListQuery.page" :limit.sync="memberListQuery.pageSize" @pagination="getMembers" />
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchFightGroupRecord, fetchFightGroupMembers } from '@/api/activity'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'FightGroupRecord',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'warning',
        1: 'danger',
        2: 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      memberList: null,
      total: 0,
      memberListLoading: false,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20,
        id: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      memberTotal: 0,
      memberListQuery: {
        page: 1,
        pageSize: 20
      },
      recordStatusOptions: [
        { key: 0, value: '已开团' },
        { key: 1, value: '未成团' },
        { key: 2, value: '已成团' }
      ],
      dialogVisibleTitle: '开团成员',
      dialogFormVisible: false,
      tempRoute: {}
    }
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route)
    this.getFightGroupRecordList()
  },
  methods: {
    getFightGroupRecordList() { // 活动列表
      this.listLoading = true
      this.listQuery.id = this.$route.params.id
      fetchFightGroupRecord(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() { // 搜索
      this.listQuery.page = 1
      if (this.listQuery.beginTime !== undefined &&
        this.listQuery.endTime !== undefined &&
        this.listQuery.beginTime.getTime() > this.listQuery.endTime.getTime()) {
        this.$message({
          message: '开始时间不能大于结束时间',
          type: 'warning'
        })

        return
      }
      this.getFightGroupRecordList()
    },
    getStatus(status) {
      return this.recordStatusOptions.filter(rso => rso.key === status)[0].value
    },
    handleQuery(row) {
      this.dialogFormVisible = true
      this.getMembers(row)
    },
    getMembers(row) {
      this.memberListLoading = true
      this.memberListQuery.recordId = row.id
      fetchFightGroupMembers(this.memberListQuery).then(response => {
        this.memberList = response.data
        this.memberTotal = response.total

        setTimeout(() => {
          this.memberListLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.memberListLoading = false
      })
    }
  }
}
</script>
