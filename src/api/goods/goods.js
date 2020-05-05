import service from '@/utils/request'

// 获取商品状态
export function postGoodsStatus () {
  return service({
    url: '/goods/product/status',
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

// 查看商品详情
export function getGoodsInfo (data) {
  return service({
    url: '/goods/product/' + data.goodsId,
    method: 'get'
  })
}
