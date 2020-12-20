import service from '@/utils/request'

// table list
export function fetchRoleList (data) {
  return service({
    url: '/admin/role/list',
    method: 'post',
    data
  })
}

// 新增
export function addRole (data) {
  return service({
    url: '/admin/role/create',
    method: 'post',
    data
  })
}

// 修改系统角色
export function modifyRole (data) {
  return service({
    url: '/admin/role/modify',
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole (data) {
  return service({
    url: `/admin/role/delete/${data.id}`,
    method: 'delete'
  })
}

// 获取角色
export function postRoleList (data) {
  return service({
    url: '/admin/role/classification',
    method: 'post',
    data
  })
}

// 查看某个系统角色所具有的权限
export function postRolePermission (data) {
  return service({
    url: '/admin/role/menu/' + data.roleId,
    method: 'post'
  })
}

// 菜单授权
export function grantAuthorization (data) {
  return service({
    url: '/admin/grant',
    method: 'post',
    data
  })
}

// 非路由级权限，按钮级权限
export function getPermission (data) {
  return service({
    url: '/admin/permission/' + data.id,
    method: 'get'
  })
}
