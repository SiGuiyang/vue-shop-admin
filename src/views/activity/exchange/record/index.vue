<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phone"
                type="text"
                placeholder="手机号码"
                style="width: 200px;"
                class="filter-item" />
      <el-select v-model="listQuery.ruleId"
                 placeholder="换购规则"
                 style="width: 200px;"
                 class="filter-item">
        <el-option v-for="item in exchangeRules"
                   :key="item.id"
                   :value="item.id"
                   :label="item.ruleName" />
      </el-select>

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
      <el-table-column label="活动名称"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.activityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="换购规则"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ruleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品价格"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getExchangeRecordList" />
  </div>
</template>

<script>
import { postExchangeRecordList, getRuleList } from '@/api/activity/exchange'
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
        ruleId: undefined,
        phone: undefined
      },
      recordStatusOptions: [
        { key: 0, value: '已开团' },
        { key: 1, value: '未成团' },
        { key: 2, value: '已成团' }
      ],
      exchangeRules: []
    }
  },
  created () {
    this.tempRoute = Object.assign({}, this.$route)
    this.listQuery.activityId = this.$route.params.id
    this.initRule(this.listQuery)
    this.getExchangeRecordList()
  },
  methods: {
    getExchangeRecordList () { // 活动列表
      this.listLoading = true
      this.listQuery.activityId = this.$route.params.id
      postExchangeRecordList(this.listQuery).then(response => {
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
      this.getExchangeRecordList()
    },
    initRule (data) {
      getRuleList(data).then(response => {
        this.exchangeRules = response.data
      })
    }
  }
}
</script>
