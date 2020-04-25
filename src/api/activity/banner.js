import service from '@/utils/request'

// 获取Banner table
export function fetchList (data) {
  return service({
    url: '/activity/banner/page',
    method: 'post',
    data
  })
}

// 新增Banner
export function create (data) {
  return service({
    url: '/activity/banner/create',
    method: 'post',
    data
  })
}

// 修改 Banner
export function modify (data) {
  return service({
    url: '/activity/banner/modify',
    method: 'put',
    data
  })
}

/**
 * 根据banner 类型获取banner列表
 */
export function postBannerList (data) {
  return service({
    url: '/activity/banner/list',
    method: 'post',
    data
  })
}
