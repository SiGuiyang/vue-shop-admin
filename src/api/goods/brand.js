import service from '@/utils/request'

/**
 * 商品品牌列表
 */
export function getList(data) {
  return service({
    url: '/admin/goods/brand/list',
    method: 'post',
    data
  })
}

/**
 * 新增品牌
 */
export function create(data) {
  return service({
    url: '/admin/goods/brand/create',
    method: 'post',
    data
  })
}

/**
 * 修改品牌
 */
export function modify(data) {
  return service({
    url: '/admin/goods/brand/modify',
    method: 'put',
    data
  })
}
