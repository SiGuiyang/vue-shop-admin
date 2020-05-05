import service from '@/utils/request'

/**
 * 属性组列表
 */
export function postPropertyGroupPage (data) {
  return service({
    url: '/goods/property/group/page',
    method: 'post',
    data
  })
}

/**
 * 属性组列表
 */
export function getPropertyGroupList (data) {
  return service({
    url: '/goods/property/group/list',
    method: 'get',
    params: data
  })
}

/**
 * 新增属性组
 */
export function postPropertyGroupCreate (data) {
  return service({
    url: '/goods/property/group/create',
    method: 'post',
    data
  })
}

/**
 * 修改属性组
 */
export function putPropertyGroupModify (data) {
  return service({
    url: '/goods/property/group/modify',
    method: 'put',
    data
  })
}
