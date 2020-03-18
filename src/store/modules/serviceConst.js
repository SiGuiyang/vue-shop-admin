import { fetchCommonEnumInfo } from '@/api/common'

const serviceConst = {
  state: {
    orderStatusOptions: [],
    orderTypeOptions: [],
    goodsTypeOptions: [],
    couponTypeOptions: [],
    moduleTypeOptions: []
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
    SET_MODULE_TYPE_OPTIONS: (state, moduleTypeOptions) => {
      state.moduleTypeOptions = moduleTypeOptions
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
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default serviceConst
