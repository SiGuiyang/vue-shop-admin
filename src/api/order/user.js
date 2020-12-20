import service from '@/utils/request'

/**
 * 用户订单列表
 */
export function postUserOrderPage (data) {
  return service({
    url: '/order/user/page',
    method: 'post',
    data
  })
}
/**
 * 用户订单详情
 * @param {*} data 订单主键
 */
export function getUserOrderInfo (data) {
  return service({
    url: `/order/user/${data.id}/detail`,
    method: 'get'
  })
}
