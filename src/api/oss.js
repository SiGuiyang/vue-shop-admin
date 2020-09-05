import service from '@/utils/request'

// 下载文件
export function downloadFile (data) {
  return service({
    url: '/oss/download',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}
