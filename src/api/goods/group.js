import service from '@/utils/request'

/**
 * 商品品牌列表
 */
export function postList (data) {
  return service({
    url: '/goods/brand/group/page',
    method: 'post',
    data
  })
}

/**
 * 新增商品品牌组
 */
export function postCreate (data) {
  return service({
    url: '/goods/brand/group/create',
    method: 'post',
    data
  })
}

/**
 * 修改商品品牌组
 */
export function putModify (data) {
  return service({
    url: '/goods/brand/group/modify',
    method: 'put',
    data
  })
}

/**
 * 获取所有的品牌组
 */
export function getBrandGroupList (data) {
  return service({
    url: '/goods/brand/group/list',
    method: 'get',
    params: data
  })
}
