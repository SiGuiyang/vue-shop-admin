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
      <el-table-column :label="$t('table.id')" type="selection" width="65" align="center"/>>
      <el-table-column :label="$t('order.phone')" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.orderCode')" width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.orderAmount')" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.integralAmount')" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.integralAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.discountAmount')" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.discountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.orderStatus')" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ getOrderStatus(scope.row.orderStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.createTime')" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" width="100" fixed="right" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <el-button v-permission="'/admin/order/user/info'" type="primary" size="mini" @click="handleQuery(scope.row.id)">{{ $t('table.query') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getOrderList" />

    <el-dialog :title="orderDetailTitle" :visible.sync="dialogFormVisible" width="70%">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="用户信息" name="1">
          <el-row :gutter="36" class="panel-group">
            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>手机号：</span>
              <span class="common-color">{{ orderDetail.address.phone }}</span>
            </el-col>

            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>地区：</span>
              <span class="common-color">{{ orderDetail.address.area }}</span>
            </el-col>

            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>配送地址：</span>
              <span class="common-color">{{ orderDetail.address.detailAddress }}</span>
            </el-col>

          </el-row>
        </el-collapse-item>
        <el-collapse-item title="订单信息" name="2">
          <el-row :gutter="36" class="panel-group">
            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>订单号：</span>
              <span>{{ orderDetail.order.orderCode }}</span>
            </el-col>

            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>订单状态：</span>
              <span>{{ getOrderStatus(orderDetail.order.orderStatus) }}</span>
            </el-col>

            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>订单类型：</span>
              <span>{{ getOrderType(orderDetail.order.orderType) }}</span>
            </el-col>

            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>订单金额：</span>
              <span class="icon-money"><svg-icon icon-class="money" />{{ orderDetail.order.orderAmount }}</span>
            </el-col>
            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>使用积分：</span>
              <span>{{ orderDetail.order.integral }}</span>
            </el-col>
            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>是否自提：</span>
              <span>{{ orderDetail.order.self ? '是': '否' }}</span>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="优惠券信息" name="3">
          <el-row :gutter="36" class="panel-group">
            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>优惠券名称：</span>
              <span>{{ orderDetail.coupon.couponName }}</span>
            </el-col>

            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>优惠券类型：</span>
              <span>{{ orderDetail.coupon.discountType }}</span>
            </el-col>

            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>优惠券订单金额：</span>
              <span class="icon-money"> <svg-icon icon-class="money" /> {{ orderDetail.coupon.orderAmount }}</span>
            </el-col>

            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>优惠券减免金额：</span>
              <span class="icon-money"> <svg-icon icon-class="money" /> {{ orderDetail.coupon.couponAmount }}</span>
            </el-col>

            <el-col :xs="18" :sm="18" :lg="12" class="card-panel-col">
              <span>优惠券说明：</span>
              <span>{{ orderDetail.coupon.description }}</span>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="商品信息" name="4">
          <el-row>
            <el-table
              :data="orderDetail.buyerGoods"
              style="width: 100%">
              <el-table-column label="商品名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.goods.goodsName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="商品图片">
                <template slot-scope="scope">
                  <span><img :src="scope.row.goodsDetail.goodsImg" width="100" height="100"></span>
                </template>
              </el-table-column>
              <el-table-column label="购买数量">
                <template slot-scope="scope">
                  <span>{{ scope.row.buyerGoodsCount }}</span>
                </template>
              </el-table-column>
              <el-table-column label="商品价格">
                <template slot-scope="scope">
                  <span class="icon-money"><svg-icon icon-class="money" />{{ scope.row.goods.goodsDiscountAmount }}</span>
                </template>
              </el-table-column>
              <el-table-column label="购买金额">
                <template slot-scope="scope">
                  <span class="icon-money"><svg-icon icon-class="money" />{{ scope.row.settlementAmount }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row :gutter="48" class="panel-group">
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <span>总计：<span class="icon-money"><svg-icon icon-class="money" /> {{ orderDetail.totalAmount }}</span></span>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.close') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchOrderList, getOrderInfo } from '@/api/order'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'UserOrder',
  components: { Pagination },
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
      activeNames: ['1', '2', '3', '4'],
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
      return this.$store.state.orderStatusOptions.filter(os => os.key === status)[0].value
    },
    getOrderType(type) {
      if (type === undefined || type === '' || type === null) {
        return '——'
      }
      return this.$store.state.orderTypeOptions.filter(ot => ot.type === type)[0].value
    },
    getOrderList() { // 订单列表
      this.listLoading = true
      fetchOrderList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch((error) => {
        this.$message.error(error)
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
      getOrderInfo(params).then(response => {
        this.dialogFormVisible = true
        const orderData = response.data
        this.orderDetail.address = orderData.address
        this.orderDetail.buyerGoods = orderData.buyerGoods
        this.orderDetail.coupon = orderData.discountCoupon
        this.orderDetail.order = orderData.userOrder
        this.orderDetail.buyerGoods.forEach(g => {
          this.orderDetail.totalAmount += g.settlementAmount
        })
      }).catch(error => {
        this.dialogFormVisible = false
        this.$message.error(error)
      })
    },
    handleChange(val) {
      console.log(val)
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
