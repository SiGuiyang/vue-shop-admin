import service from '@/utils/request'

/**
 * 商品品牌列表
 */
export function getList(data) {
  return service({
    url: '/admin/brand/group/list',
    method: 'post',
    data
  })
}

/**
 * 新增或者修改商品品牌组
 */
export function createOrModify(data) {
  return service({
    url: '/admin/brand/group/create',
    method: 'post',
    data
  })
}

/**
 * 获取所有的品牌组
 */
export function listAll() {
  return service({
    url: '/admin/brand/group/listAll',
    method: 'post'
  })
}
