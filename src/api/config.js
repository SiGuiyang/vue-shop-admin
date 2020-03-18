import service from '@/utils/request'

// 获取系统配置项
export function fetchList (data) {
  return service({
    url: '/admin/config/page',
    method: 'post',
    data
  })
}

// 新增配置项
export function addConfig (data) {
  return service({
    url: '/admin/config',
    method: 'post',
    data
  })
}

// 修改配置项
export function modifyConfig (data) {
  return service({
    url: '/admin/config',
    method: 'put',
    data
  })
}

// 修改配置项
export function delConfig (id) {
  return service({
    url: '/admin/config/' + id,
    method: 'delete'
  })
}
