import service from '@/utils/request'

// 获取商品状态
export function postGoodsStatus() {
  return service({
    url: '/admin/goods/status',
    method: 'post'
  })
}

// 获取商品列表
export function postGoodsList(data) {
  return service({
    url: '/admin/goods/list',
    method: 'post',
    data
  })
}

// 新增商品
export function postAddGoods(data) {
  return service({
    url: '/admin/goods/modify',
    method: 'post',
    data
  })
}

// 修改商品
export function putModifyGoods(data) {
  return service({
    url: '/admin/goods/modify',
    method: 'put',
    data
  })
}

// 查看商品详情
export function postGoodsInfo(data) {
  return service({
    url: '/admin/goods/' + data.goodsId,
    method: 'post',
    data
  })
}
