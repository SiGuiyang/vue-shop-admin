import service from '@/utils/request'

// 分类列表
export function fetchList(data) {
  return service({
    url: '/admin/goods/classification/list',
    method: 'post',
    data
  })
}

// 修改商品分类
export function create(data) {
  return service({
    url: '/admin/goods/classification/create',
    method: 'post',
    data
  })
}

// 修改商品分类
export function modify(data) {
  return service({
    url: '/admin/goods/classification/modify',
    method: 'put',
    data
  })
}

// 商品分类树形结构
export function tree(data) {
  return service({
    url: '/admin/goods/classification/tree',
    method: 'post',
    data
  })
}
