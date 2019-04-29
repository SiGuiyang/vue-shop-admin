import service from '@/utils/request'

// 获取Banner table
export function fetchList(data) {
  return service({
    url: '/admin/activity/banner/list',
    method: 'post',
    data
  })
}

// 新增Banner
export function addBanner(data) {
  return service({
    url: '/admin/activity/banner/modify',
    method: 'post',
    data
  })
}

// 修改 Banner
export function modifyBanner(data) {
  return service({
    url: '/admin/activity/banner/modify',
    method: 'put',
    data
  })
}
