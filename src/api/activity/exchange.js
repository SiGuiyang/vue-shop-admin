import service from '@/utils/request'

// 获取table data
export function fetchList (data) {
  return service({
    url: '/activity/exchange/page',
    method: 'post',
    data
  })
}

// 新增
export function createExchange (data) {
  return service({
    url: '/activity/exchange/create',
    method: 'post',
    data
  })
}

// 修改
export function modifyExchange (data) {
  return service({
    url: '/activity/exchange/modify',
    method: 'put',
    data
  })
}

// 获取满赠换购活动
export function getExchangeActivity (data) {
  return service({
    url: '/activity/exchange/' + data.activityId,
    method: 'get'
  })
}

// 获取规则table data
export function getRuleList (data) {
  return service({
    url: '/activity/exchange/rule/' + data.activityId,
    method: 'get'
  })
}

// 新增规则
export function addRule (data) {
  return service({
    url: 'admin/activity/exchange/rule/create',
    method: 'post',
    data
  })
}

// 修改规则
export function modifyRule (data) {
  return service({
    url: 'admin/activity/exchange/rule/modify',
    method: 'put',
    data
  })
}

// 设置换购商品的规则
export function modifyGoodsRule (data) {
  return service({
    url: '/admin/activity/exchange/goods/rule',
    method: 'put',
    data
  })
}

// 查看商品的规则详情
export function queryGoodsRuleInfo (data) {
  return service({
    url: '/admin/activity/exchange/goods/rule/' + data.activityId + '/' + data.goodsId,
    method: 'get'
  })
}

// 满赠换购记录
export function fetchExchangeRecordList (data) {
  return service({
    url: 'admin/activity/exchange/purchase/history',
    method: 'post',
    data
  })
}
