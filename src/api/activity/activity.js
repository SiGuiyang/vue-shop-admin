import service from '@/utils/request'

// 用户优惠券
export function postUserCoupons (data) {
  return service({
    url: '/activity/coupon/list',
    method: 'post',
    data
  })
}

// 获取可用的优惠券模板
export function postEnableCouponTemplate () {
  return service({
    url: '/activity/coupon/template/enable',
    method: 'post'
  })
}

// 修改新增优惠券
export function putModifyUserCoupons (data) {
  return service({
    url: '/activity/coupon/modify',
    method: 'put'
  })
}

// 获取table data
export function fetchList (data) {
  return service({
    url: '/activity/master/page',
    method: 'post',
    data
  })
}

// 新增
export function createActivity (data) {
  return service({
    url: '/activity/master/create',
    method: 'post',
    data
  })
}

// 修改
export function modifyActivity (data) {
  return service({
    url: '/activity/master/modify',
    method: 'put',
    data
  })
}

// 获取主活动
export function getActivity (data) {
  return service({
    url: `/activity/master/${data.activityId}`,
    method: 'get'
  })
}
