import service from '@/utils/request'

// 获取table data
export function fetchList (data) {
  return service({
    url: '/admin/blackList/list',
    method: 'post',
    data
  })
}

// 新增
export function add (data) {
  return service({
    url: 'admin/blackList',
    method: 'post',
    data
  })
}

// 修改
export function modify (data) {
  return service({
    url: 'admin/blackList',
    method: 'put',
    data
  })
}

// 删除
export function del (id) {
  return service({
    url: 'admin/blackList/' + id,
    method: 'delete'
  })
}
