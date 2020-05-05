import service from '@/utils/request'

// 分类列表
export function postClassificationList (data) {
  return service({
    url: '/goods/classification/page',
    method: 'post',
    data
  })
}

// 创建商品分类
export function postClassificationCreate (data) {
  return service({
    url: '/goods/classification/create',
    method: 'post',
    data
  })
}

// 修改商品分类
export function putClassificationModify (data) {
  return service({
    url: '/goods/classification/modify',
    method: 'put',
    data
  })
}

// 商品分类树形结构
export function postClassificationTree (data) {
  return service({
    url: '/goods/classification/tree',
    method: 'post',
    data
  })
}
