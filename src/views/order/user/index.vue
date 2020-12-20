<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phone"
                placeholder="手机号码"
                clearable
                style="width: 200px;"
                class="filter-item" />
      <el-input v-model="listQuery.orderCode"
                placeholder="订单号"
                clearable
                style="width: 200px;"
                class="filter-item" />
      <el-select v-model="listQuery.orderStatus"
                 placeholder="订单状态"
                 multiple
                 clearable
                 style="width: 200px"
                 class="filter-item">
        <el-option v-for="(item,index) in orderStatusOptions"
                   :key="index"
                   :label="item.value"
                   :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.orderType"
                 placeholder="订单类型"
                 multiple
                 clearable
                 style="width: 200px"
                 class="filter-item">
        <el-option v-for="(item,index) in orderTypeOptions"
                   :key="index"
                   :label="item.value"
                   :value="item.type" />
      </el-select>
      <el-date-picker v-model="listQuery.timeRange"
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
                 @click="handleFilter">搜索
      </el-button>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column type="selection"
                       width="65"
                       align="center" />
      <el-table-column label="手机号码"
                       min-width="200"
                       align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号"
                       min-width="220"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付金额"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <span class="icon-money">
            <svg-icon icon-class="money" /> {{ scope.row.payAmount != null ? scope.row.payAmount: '——' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <span class="icon-money">
            <svg-icon icon-class="money" /> {{ scope.row.orderAmount != null ? scope.row.orderAmount: '——' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券金额"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <span class="icon-money">
            <svg-icon icon-class="money" /> {{ scope.row.discountAmount != null ? scope.row.discountAmount: '——' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="消费积分"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.integral != null ? scope.row.integral: '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <el-tag type="success">{{ getOrderStatus(scope.row.orderStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="下单时间"
                       min-width="220"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="220"
                       fixed="right"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     icon="el-icon-view"
                     @click="handleQuery(scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getOrderList" />
    <i-form ref="dataForm"
            :order-data="orderDetail" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { postUserOrderPage, getUserOrderInfo } from '@/api/order/user'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'UserOrder',
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
        pageSize: 20,
        phone: undefined,
        orderCode: undefined,
        orderStatus: undefined,
        timeRange: undefined
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
  created () {
    this.getOrderList()
  },
  methods: {
    getOrderStatus (status) {
      if (status === undefined || status === '' || status === null) {
        return '——'
      }
      return this.orderStatusOptions.filter(os => os.key === status)[0].value
    },
    getOrderType (type) {
      if (type === undefined || type === '' || type === null) {
        return '——'
      }
      return this.orderTypeOptions.filter(ot => ot.type === type)[0].value
    },
    getOrderList () { // 订单列表
      this.listLoading = true
      postUserOrderPage(this.listQuery).then(response => {
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
      this.getOrderList()
    },
    handleQuery (row) { // 查看订单详情
      const _this = this.$refs['dataForm']
      getUserOrderInfo({ id: row.id }).then(response => {
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
.card-panel-col {
  margin-top: 32px;
}

.icon-money {
  color: #f4516c;
}

.common-color {
  color: #40c9c6;
}
</style>
