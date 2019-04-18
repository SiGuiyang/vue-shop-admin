import service from '@/utils/request'

// 获取商品状态
export function fetchGoodsStatus() {
  return service({
    url: '/admin/goods/status',
    method: 'post'
  })
}

// 获取商品列表
export function fetchGoodsList(data) {
  return service({
    url: '/admin/goods/list',
    method: 'post',
    data
  })
}

// 新增修改商品
export function modifyGoods(data) {
  return service({
    url: '/admin/goods/modify',
    method: 'post',
    data
  })
}

// 查看商品详情
export function getGoodsInfo(data) {
  return service({
    url: '/admin/goods/info',
    method: 'post',
    data
  })
}
