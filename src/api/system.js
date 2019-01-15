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

// 获取权限列表
export function fetchMenuList(data) {
  return service({
    url: '/admin/system/menu',
    method: 'post',
    data
  })
}

// 查看某个系统角色所具有的权限
export function fetchRolePermission(data) {
  return service({
    url: '/admin/system/menu/role',
    method: 'post',
    data
  })
}

// 角色授权
export function permissionAuthorization(data) {
  return service({
    url: '/admin/system/permission',
    method: 'post',
    data
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

// 获取角色
export function fetchRoleClassification(data) {
  return service({
    url: '/admin/system/role/classification',
    method: 'post',
    data
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
