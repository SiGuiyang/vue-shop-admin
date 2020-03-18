import service from '@/utils/request'

// 获取权限列表
export function fetchMenuList (data) {
  return service({
    url: '/admin/system/menu',
    method: 'post',
    data
  })
}

// 角色授权
export function permissionAuthorization (data) {
  return service({
    url: '/admin/system/permission',
    method: 'post',
    data
  })
}
