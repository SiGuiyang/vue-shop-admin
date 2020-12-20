import service from '@/utils/request'

// 获取规则table data
export function getRuleList (data) {
  return service({
    url: `/activity/exchange/rule/${data.activityId}`,
    method: 'get'
  })
}

// 新增规则
export function addRule (data) {
  return service({
    url: '/activity/exchange/rule/create',
    method: 'post',
    data
  })
}

// 修改规则
export function modifyRule (data) {
  return service({
    url: '/activity/exchange/rule/modify',
    method: 'put',
    data
  })
}

// 删除规则
export function deleteRule (data) {
  return service({
    url: `/activity/exchange/rule/${data.id}/${data.activityId}`,
    method: 'delete'
  })
}

// 设置换购商品的规则
export function putModifyGoodsRule (data) {
  return service({
    url: '/activity/exchange/goods/rule',
    method: 'put',
    data
  })
}

// 查看商品的规则详情
export function getGoodsRuleInfo (data) {
  return service({
    url: `/activity/exchange/goods/rule/${data.activityId}/${data.goodsId}`,
    method: 'get'
  })
}

// 满赠换购记录
export function postExchangeRecordList (data) {
  return service({
    url: '/activity/exchange/record',
    method: 'post',
    data
  })
}
