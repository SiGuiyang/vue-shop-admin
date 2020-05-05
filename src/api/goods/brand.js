import service from '@/utils/request'

/**
 * 商品品牌列表
 */
export function postBrandList (data) {
  return service({
    url: '/goods/brand/page',
    method: 'post',
    data
  })
}

/**
 * 新增品牌
 */
export function postBrandCreate (data) {
  return service({
    url: '/goods/brand/create',
    method: 'post',
    data
  })
}

/**
 * 修改品牌
 */
export function putBrandModify (data) {
  return service({
    url: '/goods/brand/modify',
    method: 'put',
    data
  })
}
