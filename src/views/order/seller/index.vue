<template>
  <div class="app-container">
    <span>Seller</span>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'

export default {
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
