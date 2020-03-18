import service from '@/utils/request'

// 首页统计周期数据
export function getCycleStatistics (data) {
  return service({
    url: '/admin/dashboard/cycle/statistics',
    method: 'post',
    data
  })
}

// 首页统计数据
export function getStatistics (data) {
  return service({
    url: '/admin/dashboard/statistics',
    method: 'post',
    data
  })
}
