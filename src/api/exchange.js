import service from '@/utils/request'

// 获取table data
export function fetchList(data) {
  return service({
    url: '/admin/exchangeActivity/list',
    method: 'post',
    data
  })
}
// 新增
export function addExchangeActivity(data) {
  return service({
    url: 'admin/exchangeActivity',
    method: 'post',
    data
  })
}

// 修改
export function modifyExchangeActivity(data) {
  return service({
    url: 'admin/exchangeActivity',
    method: 'put',
    data
  })
}

// 获取满赠换购活动
export function getExchangeActivity(data) {
  return service({
    url: 'admin/exchange/' + data.activityId,
    method: 'get'
  })
}

// 获取规则table data
export function fetchRuleList(data) {
  return service({
    url: '/admin/exchange/rule/list',
    method: 'post',
    data
  })
}
// 新增规则
export function addRule(data) {
  return service({
    url: 'admin/exchange/rule',
    method: 'post',
    data
  })
}

// 修改规则
export function modifyRule(data) {
  return service({
    url: 'admin/exchange/rule',
    method: 'put',
    data
  })
}

// 设置换购商品的规则
export function modifyGoodsRule(data) {
  return service({
    url: '/admin/exchange/goods/rule',
    method: 'put',
    data
  })
}

// 查看商品的规则详情
export function queryGoodsRuleInfo(data) {
  return service({
    url: '/admin/exchange/goods/rule/' + data.activityId + '/' + data.goodsId,
    method: 'get'
  })
}

// 满赠换购记录
export function fetchExchangeRecordList(data) {
  return service({
    url: 'admin/exchange/purchase/history',
    method: 'post',
    data
  })
}
