import service from '@/utils/request'

// 获取商品状态
export function postGoodsState (data) {
  return service({
    url: `/goods/product/state/${data.skuId}`,
    method: 'post'
  })
}

// 获取商品列表
export function postGoodsPage (data) {
  return service({
    url: '/goods/product/page',
    method: 'post',
    data
  })
}

// 新增商品
export function postCreateGoods (data) {
  return service({
    url: '/goods/product/create',
    method: 'post',
    data
  })
}

// 修改商品
export function putModifyGoods (data) {
  return service({
    url: '/goods/product/modify',
    method: 'put',
    data
  })
}

// 商品详情
export function getGoods (data) {
  return service({
    url: `/goods/product/${data.id}`,
    method: 'get'
  })
}

// 删除商品
export function deleteGoods (data) {
  return service({
    url: `/goods/product/${data.id}`,
    method: 'delete'
  })
}

/**
 * 商品审核信息
 * @param {*} data 
 */
export function getApproveDetail (data) {
  return service({
    url: `/goods/sku/approve/${data.skuId}/detail/${data.goodsId}`,
    method: 'get'
  })
}

/**
 * 提交审核
 * @param {*} data 
 */
export function postApprove (data) {
  return service({
    url: `/goods/sku/approve/create`,
    method: 'post',
    data
  })
}
