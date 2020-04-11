import service from '@/utils/request'

// 获取系统配置项
export function fetchList (data) {
  return service({
    url: '/platform/config/page',
    method: 'post',
    data
  })
}

// 新增配置项
export function addConfig (data) {
  return service({
    url: '/platform/config/create',
    method: 'post',
    data
  })
}

// 修改配置项
export function modifyConfig (data) {
  return service({
    url: '/platform/config/modify',
    method: 'put',
    data
  })
}

// 修改配置项
export function delConfig (id) {
  return service({
    url: '/platform/config/' + id,
    method: 'delete'
  })
}

// 修改配置项
export function getRefreshConfig () {
  return service({
    url: '/platform/config/refresh',
    method: 'get'
  })
}

// 配置项明细列表
export function getConfigDetailList (data) {
  return service({
    url: '/platform/config/detail/list',
    method: 'get',
    params: data
  })
}
// 新增配置明细
export function postConfigDetailCreate (data) {
  return service({
    url: '/platform/config/detail/create',
    method: 'post',
    data
  })
}

// 修改配置明细
export function putConfigDetailModify (data) {
  return service({
    url: '/platform/config/detail/modify',
    method: 'put',
    data
  })
}
