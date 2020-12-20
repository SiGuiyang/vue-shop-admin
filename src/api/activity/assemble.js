import service from '@/utils/request'

// 活动规则详情
export function getRuleInfo (data) {
  return service({
    url: `/activity/assemble/rule/${data.ruleId}`,
    method: 'get'
  })
}

// 活动规则修改
export function putModifyRule (data) {
  return service({
    url: '/activity/assemble/rule/modify',
    method: 'put',
    data
  })
}

// 成团记录
export function members (data) {
  return service({
    url: '/activity/assemble/members',
    method: 'post',
    data
  })
}

// 拼团商品
export function getAssembleGoods (data) {
  return service({
    url: `/activity/assemble/goods/${data.activityId}`,
    method: 'post'
  })
}

// 修改拼团商品
export function modifyAssembleGoods (data) {
  return service({
    method: 'put',
    data
  })
}
