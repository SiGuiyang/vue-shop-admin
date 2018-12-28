<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('goods.goodsName')" v-model="listQuery.goodsName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('goods.goodsCode')" v-model="listQuery.goodsCode" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.goodsStatus" :placeholder="$t('goods.goodsStatus')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in orderStatusOptions" :key="item" :label="item.orderStatusName" :value="item.orderStatus"/>
      </el-select>
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
      <el-table-column :label="$t('table.id')" prop="id" align="center" min-width="25">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsName')" min-width="55" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsCode')" min-width="120" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.goodsCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsImg')" min-width="80" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.goodsImg }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsAmount')" min-width="40" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsDiscountAmount')" min-width="40" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsDiscountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsStatus')" min-width="40" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsInventory')" class-name="status-col" min-width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsInventory }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.createTime')" min-width="55" align="center">operationUser
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operationUser')" min-width="55" align="center">operationUser
        <template slot-scope="scope">
          <span>{{ scope.row.operationUser }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" min-width="50" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleQuery(scope.row.id)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getOrderList" />

  </div>
</template>

<script>
import { fetchGoodsStatus, fetchGoodsList } from '@/api/goods'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'GoodsManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 20,
        orderCode: undefined,
        phone: undefined,
        orderStatus: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      orderStatusOptions: [],
      showReviewer: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
  },
  methods: {
    getGoodsStatus() { // 商品状态
      this.listLoading = true
      fetchGoodsStatus().then(response => {
        this.orderStatusOptions = response.data
      }).catch(() => {
        this.listLoading = false
      })
    },
    getGoodsList() { // 商品列表
      this.listLoading = true
      fetchGoodsList(this.listQuery).then(response => {
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
    },
    handleQuery(orderId) { // 查看订单详情

    }
  }
}
</script>
