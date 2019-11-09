import service from '@/utils/request'

// 获取table data
export function fetchList(data) {
  return service({
    url: '/admin/activity/assemble/list',
    method: 'post',
    data
  })
}

// 新增
export function create(data) {
  return service({
    url: 'admin/activity/assemble/create',
    method: 'post',
    data
  })
}

// 修改
export function modify(data) {
  return service({
    url: 'admin/activity/assemble/modify',
    method: 'put',
    data
  })
}

// 活动规则详情
export function ruleInfo(data) {
  return service({
    url: '/admin/activity/assemble/rule/' + data,
    method: 'post'
  })
}

// 活动规则修改
export function modifyRule(data) {
  return service({
    url: '/admin/activity/assemble/rule/modify',
    method: 'post',
    data
  })
}

// 成团记录
export function members(data) {
  return service({
    url: '/admin/activity/assemble/members',
    method: 'post',
    data
  })
}

// 拼团商品
export function getAssembleGoods(data) {
  return service({
    url: '/admin/activity/assemble/goods/' + data.activityId,
    method: 'post'
  })
}

// 修改拼团商品
export function modifyAssembleGoods(data) {
  return service({
    url: '/admin/activity/assemble/goods/modify',
    method: 'put',
    data
  })
}
