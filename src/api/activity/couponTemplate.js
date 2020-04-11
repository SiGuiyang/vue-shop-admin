import service from '@/utils/request'

// 获取table data
export function postList (data) {
  return service({
    url: '/activity/coupon/template/page',
    method: 'post',
    data
  })
}

// 新增
export function postAddTemplate (data) {
  return service({
    url: '/activity/coupon/template/create',
    method: 'post',
    data
  })
}

// 修改
export function putModifyTemplate (data) {
  return service({
    url: '/activity/coupon/template/modify',
    method: 'put',
    data
  })
}
