import service from '@/utils/request'

// 下载文件
export function downloadFile(data) {
  return service({
    url: '/admin/download',
    method: 'get',
    params: data
  })
}

// 获取通用枚举服务
export function fetchCommonEnumInfo(data) {
  return service({
    url: '/admin/common/enumInfo',
    method: 'post',
    data
  })
}

// 获取swagger模块地址
export function getServiceUrl(data) {
  return service({
    url: '/admin/monitor/serviceUrl',
    method: 'post',
    data
  })
}
