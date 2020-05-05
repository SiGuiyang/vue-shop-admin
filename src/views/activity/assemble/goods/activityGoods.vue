<template>
  <el-dialog :visible.sync="dialogFormVisible"
             title="参与拼团活动商品"
             width="60%">
    <el-collapse v-model="activeName"
                 accordion>
      <el-collapse-item title="活动商品"
                        name="1">
        <div>
          商品名称：<span>{{ goodsData.goods.goodsName }}</span>
        </div>
        <div>
          商品编码：<span>{{ goodsData.goods.goodsCode }}</span>
        </div>
        <div>
          商品状态：<span>{{ this.$parent.getGoodsStatus(goodsData.goods.goodsStatus) }}</span>
        </div>
        <div>
          商品积分：<span>{{ goodsData.goods.integral }}</span>
        </div>
        <div>
          商品价格：<span class="icon-money">
            <svg-icon icon-class="money" />{{ goodsData.goods.goodsAmount }}</span>
        </div>
        <div>
          商品折扣价格：<span class="icon-money">
            <svg-icon icon-class="money" />{{ goodsData.goods.goodsDiscountAmount }}</span>
        </div>
        <div>
          商品描述：<span>{{ goodsData.goods.description }}</span>
        </div>
        <div>
          商品存储方式：<span>{{ goodsData.goods.storage }}</span>
        </div>
        <div>
          商品归属地：<span>{{ goodsData.goods.placeOrigin }}</span>
        </div>
        <div>
          商品LOGO：<img :src="goodsData.goodsDetail.goodsImg"
                      alt=""
                      width="200"
                      height="200">
        </div>
        <div>
          商品详情图片：<img :src="goodsData.goodsDetail.bannerFirst"
                      alt=""
                      width="200"
                      height="200">
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
</template>

<script>
export default {
  props: {
    goodsData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      activeName: '1',
      dialogFormVisible: false
    }
  }
}
</script>

<style scoped>
.icon-money {
  color: #f4516c;
}
</style>
