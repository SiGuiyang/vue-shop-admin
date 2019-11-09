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
export function create(data) {
  return service({
    url: '/admin/activity/banner/create',
    method: 'post',
    data
  })
}

// 修改 Banner
export function modify(data) {
  return service({
    url: '/admin/activity/banner/modify',
    method: 'put',
    data
  })
}

/**
 * 根据banner 类型获取banner列表
 */
export function bannerListAll(data) {
  return service({
    url: '/admin/activity/banner/listAll',
    method: 'post',
    data
  })
}
