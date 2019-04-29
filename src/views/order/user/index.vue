<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('order.phone')" v-model="listQuery.phone" style="width: 200px;" class="filter-item" />
      <el-input :placeholder="$t('order.orderCode')" v-model="listQuery.orderCode" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.orderStatus" :placeholder="$t('order.orderStatus')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in orderStatusOptions" :key="index" :label="item.value" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.orderType" :placeholder="$t('order.orderType')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in orderTypeOptions" :key="index" :label="item.value" :value="item.type"/>
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
      <el-table-column type="selection" width="65" align="center"/>>
      <el-table-column label="手机号码" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userOrder.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userOrder.orderCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userOrder.orderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费积分" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userOrder.integralAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券金额" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userOrder.discountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag type="success">{{ getOrderStatus(scope.row.userOrder.orderStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userOrder.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <el-button v-permission="'ROLE_ADMIN'" type="primary" size="mini" @click="handleQuery(scope.row.userOrder.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getOrderList" />
    <i-form ref="dataForm" :order-data="orderDetail" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchOrderList, getOrderInfo } from '@/api/order'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'UserOrder',
  components: { Pagination, IForm },
  directives: { waves, permission },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20,
        phone: undefined,
        orderCode: undefined,
        orderStatus: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      orderDetailTitle: '订单详情',
      dialogFormVisible: false,
      imgUrl: 'http://pk6b0a7n8.bkt.clouddn.com/chaozhitehui.png',
      orderDetail: {
        address: {},
        order: {},
        coupon: {},
        buyerGoods: [],
        totalAmount: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'orderStatusOptions',
      'orderTypeOptions'
    ])
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderStatus(status) {
      if (status === undefined || status === '' || status === null) {
        return '——'
      }
      return this.orderStatusOptions.filter(os => os.key === status)[0].value
    },
    getOrderType(type) {
      if (type === undefined || type === '' || type === null) {
        return '——'
      }
      return this.orderTypeOptions.filter(ot => ot.type === type)[0].value
    },
    getOrderList() { // 订单列表
      this.listLoading = true
      fetchOrderList(this.listQuery).then(response => {
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
      this.getOrderList()
    },
    handleQuery(orderId) { // 查看订单详情
      const params = {}
      params.orderId = orderId
      const _this = this.$refs['dataForm']
      getOrderInfo(params).then(response => {
        _this.dialogFormVisible = true
        const orderData = response.data
        this.orderDetail.address = orderData.address
        this.orderDetail.buyerGoods = orderData.buyerGoods
        this.orderDetail.coupon = orderData.discountCoupon
        this.orderDetail.order = orderData.userOrder
        this.orderDetail.buyerGoods.forEach(g => {
          this.orderDetail.totalAmount += g.settlementAmount
        })
        _this.dialogFormVisible = true
      }).catch(() => {
        _this.dialogFormVisible = false
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .card-panel-col{
    margin-top: 32px;
  }
  .icon-money {
    color: #f4516c;
  }
  .common-color {
    color: #40c9c6;
  }
</style>
