import { fetchCommonEnumInfo } from '@/api/common'

const serviceConst = {
  state: {
    orderStatusOptions: [],
    orderTypeOptions: [],
    goodsTypeOptions: [],
    couponTypeOptions: []
  },
  mutations: {
    SET_ORDERSTATUSOPTIONS: (state, orderStatusOptions) => {
      state.orderStatusOptions = orderStatusOptions
    },
    SET_ORDERTYPEOPTIONS: (state, orderTypeOptions) => {
      state.orderTypeOptions = orderTypeOptions
    },
    SET_GOODSTYPEOPTIONS: (state, goodsTypeOptions) => {
      state.goodsTypeOptions = goodsTypeOptions
    },
    SET_COUPONTYPEOPTIONS: (state, couponTypeOptions) => {
      state.couponTypeOptions = couponTypeOptions
    }
  },
  actions: {
    FetchCommonEnumInfo({ commit }) {
      return new Promise((resolve, reject) => {
        const params = {}
        params.type = 'orderStatus'
        fetchCommonEnumInfo(params).then(response => { // 订单状态
          commit('SET_ORDERSTATUSOPTIONS', response.data)
        }).catch(error => {
          reject(error)
        })

        params.type = 'orderType'
        fetchCommonEnumInfo(params).then(response => { // 订单类型
          commit('SET_ORDERTYPEOPTIONS', response.data)
        }).catch(error => {
          reject(error)
        })

        params.type = 'couponType'
        fetchCommonEnumInfo(params).then(response => { // 优惠券类型
          commit('SET_COUPONTYPEOPTIONS', response.data)
        }).catch(error => {
          reject(error)
        })

        params.type = 'goodsType'
        fetchCommonEnumInfo(params).then(response => { // 商品类型
          commit('SET_GOODSTYPEOPTIONS', response.data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default serviceConst
