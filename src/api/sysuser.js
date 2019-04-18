import service from '@/utils/request'

// 获取系统用户
export function fetchList(data) {
  return service({
    url: '/admin/system/user',
    method: 'post',
    data
  })
}

// 修改系统用户
export function modify(data) {
  return service({
    url: '/admin/system/user/modify',
    method: 'post',
    data
  })
}

// 修改系统用户
export function del(id) {
  return service({
    url: '/admin/system/user/' + id,
    method: 'delete'
  })
}
