import service from '@/utils/request'

// 分类列表
export function postClassificationList (data) {
  return service({
    url: `/goods/classification/${data.spuId}`,
    method: 'post'
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

// 修改商品分类
export function deleteClassification (data) {
  return service({
    url: `/goods/classification/delete/${data.id}`,
    method: 'delete'
  })
}
