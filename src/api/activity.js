import request from '@/utils/request'

// Banner列表
export function fetchBannerList(data) {
  return request({
    url: '/admin/banner/list',
    method: 'post'
  })
}

// 新增修改banner
export function modifyBanner(data) {
  return request({
    url: '/admin/banner/modify',
    method: 'post',
    data
  })
}
