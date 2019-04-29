import service from '@/utils/request'

// 用户优惠券
export function fetchUserCoupons(data) {
  return service({
    url: '/admin/activity/coupon/list',
    method: 'post',
    data
  })
}

// 获取可用的优惠券模板
export function fetchEnableCouponTemplate() {
  return service({
    url: '/admin/activity/coupon/template/enable',
    method: 'post'
  })
}

// 修改新增优惠券
export function modifyUserCoupons(data) {
  return service({
    url: '/admin/activity/coupon/modify'
  })
}
