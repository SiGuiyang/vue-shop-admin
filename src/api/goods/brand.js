import service from '@/utils/request'

/**
 * 商品品牌列表
 */
export function getList(data) {
  return service({
    url: '/admin/brand/list',
    method: 'post',
    data
  })
}

/**
 * 新增或者修改品牌
 */
export function createOrModify(data) {
  return service({
    url: '/admin/brand/create',
    method: 'post',
    data
  })
}
