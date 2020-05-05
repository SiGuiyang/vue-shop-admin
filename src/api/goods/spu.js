import service from '@/utils/request'

/**
 * spu列表
 */
export function postSpuPage (data) {
  return service({
    url: '/goods/spu/page',
    method: 'post',
    data
  })
}

/**
 * 新增spu
 */
export function postSpuCreate (data) {
  return service({
    url: '/goods/spu/create',
    method: 'post',
    data
  })
}

/**
 * 修改spu
 */
export function putSpuModify (data) {
  return service({
    url: '/goods/spu/modify',
    method: 'put',
    data
  })
}

/**
 * 获取所有的品牌组
 */
export function postListAll () {
  return service({
    url: '/goods/brand/group/listAll',
    method: 'post'
  })
}
