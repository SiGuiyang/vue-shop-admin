import service from '@/utils/request'

// 下载文件
export function downloadFile (data) {
  return service({
    url: '/admin/download',
    method: 'get',
    params: data
  })
}

// 上床文件
export function uploadFile (data) {
  return service({
    url: '/admin/upload',
    method: 'post',
    data
  })
}

// 获取通用枚举服务
export function fetchCommonEnumInfo (data) {
  return service({
    url: '/admin/common/enumInfo',
    method: 'post',
    data
  })
}

// 获取swagger模块地址
export function getServiceUrl (data) {
  return service({
    url: '/admin/monitor/serviceUrl',
    method: 'post',
    data
  })
}

// 获取动态表单
export function getForm (data) {
  return service({
    url: '/admin/dynamic/form/get',
    method: 'get',
    params: data
  })
}
