import request from '@/utils/request'

// 获取订单状态
export function fetchOrderStatus() {
  return request({
    url: '/admin/order/status',
    method: 'post'
  })
}

// 获取用户订单列表
export function fetchOrderList(data) {
  return request({
    url: '/admin/order/list',
    method: 'post',
    data
  })
}
