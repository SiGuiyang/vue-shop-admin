import service from '@/utils/request'

// 获取table data
export function postList (data) {
  return service({
    url: '/activity/coupon/page',
    method: 'post',
    data
  })
}

// 新增
export function postAddTemplate (data) {
  return service({
    url: '/activity/coupon/create',
    method: 'post',
    data
  })
}

// 修改
export function putModifyTemplate (data) {
  return service({
    url: '/activity/coupon/modify',
    method: 'put',
    data
  })
}

// 删除
export function deleteTemplate (id) {
  return service({
    url: 'admin/menu/' + id,
    method: 'delete'
  })
}

// 发送优惠券
export function postPublishCoupon (data) {
  return service({
    url: '/admin/publish/coupon',
    method: 'post',
    data
  })
}
