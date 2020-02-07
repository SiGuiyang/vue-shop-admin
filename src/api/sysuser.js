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
export function postCreate(data) {
  return service({
    url: '/admin/system/user/create',
    method: 'post',
    data
  })
}

// 新增系统用户
export function putModify(data) {
  return service({
    url: '/admin/system/user/modify',
    method: 'put',
    data
  })
}

// 修改系统用户
export function del(data) {
  return service({
    url: '/admin/system/user/' + data.id,
    method: 'post',
    data
  })
}
