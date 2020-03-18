import service from '@/utils/request'

/**
 * spu列表
 */
export function postList (data) {
  return service({
    url: '/goods/property/page',
    method: 'post',
    data
  })
}

/**
 * 新增spu
 */
export function postCreate (data) {
  return service({
    url: '/goods/property/create',
    method: 'post',
    data
  })
}

/**
 * 修改spu
 */
export function putModify (data) {
  return service({
    url: '/goods/property/modify',
    method: 'put',
    data
  })
}
