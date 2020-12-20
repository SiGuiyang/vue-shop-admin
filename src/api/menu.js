import service from '@/utils/request'

// 获取table data
export function fetchList (data) {
  return service({
    url: '/admin/menu/list',
    method: 'post',
    data
  })
}

// 新增
export function add (data) {
  return service({
    url: 'admin/menu/create',
    method: 'post',
    data
  })
}

// 修改
export function modify (data) {
  return service({
    url: 'admin/menu/modify',
    method: 'put',
    data
  })
}

// 删除
export function del (data) {
  return service({
    url: `admin/menu/${data.id}`,
    method: 'delete'
  })
}
