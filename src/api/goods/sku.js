import service from '@/utils/request'

/**
 * sku列表
 */
export function postSkuPage (data) {
  return service({
    url: '/goods/sku/page',
    method: 'post',
    data
  })
}

/**
 * 新增sku
 */
export function postSkuCreate (data) {
  return service({
    url: '/goods/sku/create',
    method: 'post',
    data
  })
}

/**
 * 修改sku
 */
export function putSkuModify (data) {
  return service({
    url: '/goods/spu/modify',
    method: 'put',
    data
  })
}

