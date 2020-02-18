import service from '@/utils/request'

/**
 * 属性组列表
 */
export function postList(data) {
  return service({
    url: '/goods/property/group/page',
    method: 'post',
    data
  })
}

/**
 * 属性组列表
 */
export function getList(data) {
  return service({
    url: '/goods/property/group/list',
    method: 'get',
    params: data
  })
}

/**
 * 新增属性组
 */
export function postCreate(data) {
  return service({
    url: '/goods/property/group/create',
    method: 'post',
    data
  })
}

/**
 * 修改属性组
 */
export function putModify(data) {
  return service({
    url: '/goods/property/group/modify',
    method: 'put',
    data
  })
}
