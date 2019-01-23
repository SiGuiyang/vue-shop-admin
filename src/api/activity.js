import service from '@/utils/request'

// Banner列表
export function fetchBannerList(data) {
  return service({
    url: '/admin/activity/banner/list',
    method: 'post',
    data
  })
}

// 新增修改banner
export function modifyBanner(data) {
  return service({
    url: '/admin/activity/banner/modify',
    method: 'post',
    data
  })
}

// 优惠券模板列表
export function fetchCouponTemplateList(data) {
  return service({
    url: '/admin/activity/coupon/template',
    method: 'post',
    data
  })
}

// 新增修改优惠券模版
export function modifyCouponTemplate(data) {
  return service({
    url: '/admin/activity/coupon/template/modify',
    method: 'post',
    data
  })
}

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

// 发送优惠券
export function publishCoupon(data) {
  return service({
    url: '/admin/publish/coupon',
    method: 'post',
    data
  })
}

// 站内信列表
export function fetchStationList(data) {
  return service({
    url: '/admin/activity/station/list',
    method: 'post',
    data
  })
}

// 拼团活动列表
export function fetchFightGroup(data) {
  return service({
    url: '/admin/activity/fightGroup/list',
    method: 'post',
    data
  })
}

// 修改拼团活动
export function modifyFightGroup(data) {
  return service({
    url: '/admin/activity/fightGroup/modify',
    method: 'post',
    data
  })
}

// 活动规则详情
export function fightGroupRuleInfo(data) {
  return service({
    url: '/admin/activity/fightGroup/rule/info',
    method: 'post',
    data
  })
}

// 活动规则修改
export function modifyFightGroupRule(data) {
  return service({
    url: '/admin/activity/fightGroup/rule/modify',
    method: 'post',
    data
  })
}

// 成团记录
export function fetchFightGroupRecord(data) {
  return service({
    url: '/admin/activity/fightGroup/record',
    method: 'post',
    data
  })
}

// 开团成员
export function fetchFightGroupMembers(data) {
  return service({
    url: '/admin/activity/fightGroup/members',
    method: 'post',
    data
  })
}
