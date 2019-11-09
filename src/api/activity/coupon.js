import service from '@/utils/request'

// 获取table data
export function fetchList(data) {
  return service({
    url: '/admin/menu/list',
    method: 'post',
    data
  })
}
// 新增
export function addTemplate(data) {
  return service({
    url: 'admin/menu',
    method: 'post',
    data
  })
}

// 修改
export function modifyTemplate(data) {
  return service({
    url: 'admin/menu',
    method: 'put',
    data
  })
}

// 删除
export function delTemplate(id) {
  return service({
    url: 'admin/menu/' + id,
    method: 'delete'
  })
}

// 发送优惠券
export function publishCoupon(data) {
  return service({
    url: '/admin/publish/coupon',
    method: 'post',
    data
  })
}
