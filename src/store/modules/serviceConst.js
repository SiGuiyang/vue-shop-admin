import { fetchCommonEnumInfo } from '@/api/common'

const serviceConst = {
  state: {
    orderStatusOptions: [], // 订单状态
    orderTypeOptions: [], // 订单类型
    goodsTypeOptions: [], // 商品类型
    couponTypeOptions: [], // 优惠券种类
    offerTypeOptions: [], // 优惠种类
    moduleTypeOptions: [], // 系统模块
    bannerTypeOptions: [], // Banner 类型
    shareChannelOptions: [] // banner 分享渠道
  },
  mutations: {
    SET_ORDER_STATUS_OPTIONS: (state, orderStatusOptions) => {
      state.orderStatusOptions = orderStatusOptions
    },
    SET_ORDER_TYPE_OPTIONS: (state, orderTypeOptions) => {
      state.orderTypeOptions = orderTypeOptions
    },
    SET_GOODS_TYPE_OPTIONS: (state, goodsTypeOptions) => {
      state.goodsTypeOptions = goodsTypeOptions
    },
    SET_COUPON_TYPE_OPTIONS: (state, couponTypeOptions) => {
      state.couponTypeOptions = couponTypeOptions
    },
    SET_OFFER_TYPE_OPTIONS: (state, offerTypeOptions) => {
      state.offerTypeOptions = offerTypeOptions
    },
    SET_MODULE_TYPE_OPTIONS: (state, moduleTypeOptions) => {
      state.moduleTypeOptions = moduleTypeOptions
    },
    SET_BANNER_TYPE_OPTIONS: (state, bannerTypeOptions) => {
      state.bannerTypeOptions = bannerTypeOptions
    },
    SET_SHARE_CHANNEL_OPTIONS: (state, shareChannelOptions) => {
      state.shareChannelOptions = shareChannelOptions
    }
  },
  actions: {
    FetchCommonEnumInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        fetchCommonEnumInfo({}).then(response => { // 订单状态
          commit('SET_ORDER_STATUS_OPTIONS', response.data.orderStatus)
          commit('SET_ORDER_TYPE_OPTIONS', response.data.orderType)
          commit('SET_GOODS_TYPE_OPTIONS', response.data.goodsType)
          commit('SET_COUPON_TYPE_OPTIONS', response.data.couponType)
          commit('SET_MODULE_TYPE_OPTIONS', response.data.moduleType)
          commit('SET_OFFER_TYPE_OPTIONS', response.data.offerType)
          commit('SET_BANNER_TYPE_OPTIONS', response.data.bannerType)
          commit('SET_SHARE_CHANNEL_OPTIONS', response.data.shareChannel)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default serviceConst
