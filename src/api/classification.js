import service from '@/utils/request'

// 分类列表
export function fetchList(data) {
  return service({
    url: '/admin/classification/list',
    method: 'post',
    data
  })
}

// 修改商品分类
export function modify(data) {
  return service({
    url: '/admin/classification',
    method: 'put',
    data
  })
}
