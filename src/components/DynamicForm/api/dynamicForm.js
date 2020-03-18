import service from '@/utils/request'

// 获取表单远程数据
export function getDynamicData (requestUrl, data) {
  return service({
    url: requestUrl,
    method: 'get',
    params: data
  })
}

// 提交表单数据
export function postDynamicData (data) {
  return service({
    url: '/admin/dynamic/form/create',
    method: 'post',
    data
  })
}
