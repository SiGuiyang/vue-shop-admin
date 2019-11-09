import service from '@/utils/request'

// 获取table data
export function fetchList(data) {
  return service({
    url: '/admin/activity/coupon/template/list',
    method: 'post',
    data
  })
}
// 新增
export function addTemplate(data) {
  return service({
    url: '/admin/activity/coupon/template/create',
    method: 'post',
    data
  })
}

// 修改
export function modifyTemplate(data) {
  return service({
    url: '/admin/activity/coupon/template/modify',
    method: 'put',
    data
  })
}
