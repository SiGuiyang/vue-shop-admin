import service from '@/utils/request'

// 获取系统用户
export function fetchSystemUser(data) {
  return service({
    url: '/admin/system/user',
    method: 'post',
    data
  })
}

// 修改系统用户
export function modifySystemUser(data) {
  return service({
    url: '/admin/system/user/modify',
    method: 'post',
    data
  })
}

// 删除系统用户
export function deleteSystemUser(data) {
  return service({
    url: '/admin/system/user/delete/' + data.id,
    method: 'post'
  })
}

// 获取系统角色
export function fetchSystemRole(data) {
  return service({
    url: '/admin/system/role',
    method: 'post',
    data
  })
}

// 修改系统角色
export function modifySystemRole(data) {
  return service({
    url: '/admin/system/role/modify',
    method: 'post',
    data
  })
}

// 删除系统角色
export function deleteSystemRole(data) {
  return service({
    url: '/admin/system]/role/delete/' + data.id,
    method: 'post'
  })
}

// 获取系统配置项
export function fetchSystemConfig(data) {
  return service({
    url: '/admin/system/config',
    method: 'post',
    data
  })
}

// 修改配置项
export function modifySystemConfig(data) {
  return service({
    url: '/admin/system/config/modify',
    method: 'post',
    data
  })
}

// 删除配置项
export function deleteSystemConfig(data) {
  return service({
    url: '/admin/system/config/delete/' + data.id,
    method: 'post'
  })
}
