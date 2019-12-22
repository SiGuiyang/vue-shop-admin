import service from '@/utils/request'

/**
 * 商品品牌列表
 */
export function postList(data) {
  return service({
    url: '/admin/goods/brand/list',
    method: 'post',
    data
  })
}

/**
 * 新增品牌
 */
export function postCreate(data) {
  return service({
    url: '/admin/goods/brand/create',
    method: 'post',
    data
  })
}

/**
 * 修改品牌
 */
export function putModify(data) {
  return service({
    url: '/admin/goods/brand/modify',
    method: 'put',
    data
  })
}
