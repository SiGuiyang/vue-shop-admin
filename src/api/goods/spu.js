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
 * spu列表，无分页
 * @param {*} data 
 */
export function postSpuList (data) {
  return service({
    url: '/goods/spu/list',
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
 * 修改spu
 */
export function deleteSpu (data) {
  return service({
    url: `/goods/spu/delete/${data.id}`,
    method: 'delete'
  })
}

//spu分类树形结构
export function postSpuTree (data) {
  return service({
    url: '/goods/spu/tree',
    method: 'post',
    data
  })
}
