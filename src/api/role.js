import service from '@/utils/request'

// table list
export function fetchRoleList(data) {
  return service({
    url: '/admin/role/list',
    method: 'post',
    data
  })
}

// 新增
export function addRole(data) {
  return service({
    url: '/admin/role',
    method: 'post',
    data
  })
}

// 修改系统角色
export function modifyRole(data) {
  return service({
    url: '/admin/role',
    method: 'put',
    data
  })
}

// 获取角色
export function fetchRoleClassification(data) {
  return service({
    url: '/admin/role/classification',
    method: 'post',
    data
  })
}

// 获取系统所欲菜单
export function fetchPermissions(data) {
  return service({
    url: '/admin/permission',
    method: 'post',
    data
  })
}

// 查看某个系统角色所具有的权限
export function fetchRolePermission(data) {
  return service({
    url: '/admin/role/menu/' + data.roleId,
    method: 'post'
  })
}

// 菜单授权
export function grantAuthorization(data) {
  return service({
    url: '/admin/permission',
    method: 'post',
    data
  })
}
