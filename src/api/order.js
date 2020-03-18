import service from '@/utils/request'

// 获取用户订单列表
export function fetchOrderList (data) {
  return service({
    url: '/admin/order/user',
    method: 'post',
    data
  })
}

// 获取用户订单详情
export function getOrderInfo (data) {
  return service({
    url: '/admin/order/user/info',
    method: 'post',
    data
  })
}

// 获取商户订单列表
export function fetchSellerOrder (data) {
  return service({
    url: '/admin/order/seller',
    method: 'post',
    data
  })
}

// 获取商户订单详情
export function getSellerOrderInfo (data) {
  return service({
    url: '/admin/order/seller/info',
    method: 'post',
    data
  })
}
