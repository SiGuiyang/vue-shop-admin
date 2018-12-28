import request from '@/utils/request'

// 获取商品状态
export function fetchGoodsStatus() {
  return request({
    url: '/admin/goods/status',
    method: 'post'
  })
}

// 获取商品列表
export function fetchGoodsList(data) {
  return request({
    url: '/admin/goods/list',
    method: 'post',
    data
  })
}

// 分类列表
export function fetchClassificationList() {
  return request({
    url: '/admin/classification/list',
    method: 'post'
  })
}
