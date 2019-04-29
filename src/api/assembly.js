import service from '@/utils/request'

// 获取table data
export function fetchList(data) {
  return service({
    url: '/admin/activity/fightGroup/list',
    method: 'post',
    data
  })
}

// 新增
export function addAssembly(data) {
  return service({
    url: 'admin/activity/fightGroup/modify',
    method: 'post',
    data
  })
}

// 修改
export function modifyAssembly(data) {
  return service({
    url: 'admin/activity/fightGroup/modify',
    method: 'put',
    data
  })
}

// 活动规则详情
export function fightGroupRuleInfo(data) {
  return service({
    url: '/admin/activity/fightGroup/rule/' + data.id,
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
    url: '/admin/activity/fightGroup/members',
    method: 'post',
    data
  })
}

// 拼团商品
export function getFightGroupGoods(data) {
  return service({
    url: '/admin/activity/fightGroup/goods/' + data.activityId,
    method: 'post',
    data
  })
}

// 修改拼团商品
export function modifyFightGroupGoods(data) {
  return service({
    url: '/admin/activity/fightGroup/goods/modify',
    method: 'put',
    data
  })
}
