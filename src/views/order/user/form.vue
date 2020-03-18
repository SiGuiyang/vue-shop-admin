<template>
  <el-dialog :visible.sync="dialogFormVisible"
             title="订单详情"
             width="70%">
    <el-collapse v-model="activeNames"
                 @change="handleChange">
      <el-collapse-item title="订单状态"
                        name="1">
        <el-row class="panel-group">
          <el-steps :active="orderStatusActive"
                    finish-status="success">
            <el-step title="待付款" />
            <el-step title="待收货" />
            <el-step title="已取消" />
            <el-step title="待评价" />
          </el-steps>
        </el-row>
      </el-collapse-item>

      <el-collapse-item title="用户信息"
                        name="2">
        <el-row :gutter="36"
                class="panel-group">
          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>手机号：</span>
            <span class="common-color">{{ orderData.address.phone }}</span>
          </el-col>

          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>地区：</span>
            <span class="common-color">{{ orderData.address.area }}</span>
          </el-col>

          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>配送地址：</span>
            <span class="common-color">{{ orderData.address.detailAddress }}</span>
          </el-col>

        </el-row>
      </el-collapse-item>
      <el-collapse-item title="订单信息"
                        name="3">
        <el-row :gutter="36"
                class="panel-group">
          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>订单号：</span>
            <span>{{ orderData.order.orderCode }}</span>
          </el-col>

          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>订单状态：</span>
            <span>{{ this.$parent.getOrderStatus(orderData.order.orderStatus) }}</span>
          </el-col>

          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>订单类型：</span>
            <span>{{ this.$parent.getOrderType(orderData.order.orderType) }}</span>
          </el-col>

          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>订单金额：</span>
            <span class="icon-money">
              <svg-icon icon-class="money" />{{ orderData.order.orderAmount }}</span>
          </el-col>
          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>使用积分：</span>
            <span>{{ orderData.order.integral }}</span>
          </el-col>
          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>是否自提：</span>
            <span>{{ orderData.order.self ? '是': '否' }}</span>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="优惠券信息"
                        name="4">
        <el-row :gutter="36"
                class="panel-group">
          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>优惠券名称：</span>
            <span>{{ orderData.coupon.couponName }}</span>
          </el-col>

          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>优惠券类型：</span>
            <span>{{ orderData.coupon.discountType }}</span>
          </el-col>

          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>优惠券订单金额：</span>
            <span class="icon-money">
              <svg-icon icon-class="money" /> {{ orderData.coupon.orderAmount }}</span>
          </el-col>

          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>优惠券减免金额：</span>
            <span class="icon-money">
              <svg-icon icon-class="money" /> {{ orderData.coupon.couponAmount }}</span>
          </el-col>

          <el-col :xs="18"
                  :sm="18"
                  :lg="12"
                  class="card-panel-col">
            <span>优惠券说明：</span>
            <span>{{ orderData.coupon.description }}</span>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="商品信息"
                        name="5">
        <el-row>
          <el-table :data="orderData.buyerGoods"
                    style="width: 100%">
            <el-table-column label="商品名称">
              <template slot-scope="scope">
                <span>{{ scope.row.goods.goodsName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品图片">
              <template slot-scope="scope">
                <span><img :src="scope.row.goodsDetail.goodsImg"
                           alt=""
                           width="100"
                           height="100"></span>
              </template>
            </el-table-column>
            <el-table-column label="购买数量">
              <template slot-scope="scope">
                <span>{{ scope.row.buyerGoodsCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品价格">
              <template slot-scope="scope">
                <span class="icon-money">
                  <svg-icon icon-class="money" />{{ scope.row.goods.goodsDiscountAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="购买金额">
              <template slot-scope="scope">
                <span class="icon-money">
                  <svg-icon icon-class="money" />{{ scope.row.settlementAmount }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row :gutter="48"
                class="panel-group">
          <el-col :xs="12"
                  :sm="12"
                  :lg="6"
                  class="card-panel-col">
            <span>总计：<span class="icon-money">
              <svg-icon icon-class="money" /> {{ orderData.totalAmount }}</span></span>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    orderData: {
      type: Object,
      default: () => ({
        address: {},
        order: {},
        coupon: {},
        buyerGoods: [],
        totalAmount: 0
      })
    }
  },
  data () {
    return {
      activeNames: ['1', '2', '3', '4', '5'],
      dialogFormVisible: false,
      orderStatusActive: 3
    }
  },
  methods: {
    handleChange (val) {
      console.log(val)
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
