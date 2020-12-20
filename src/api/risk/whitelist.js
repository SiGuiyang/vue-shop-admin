import service from '@/utils/request'

// 获取table data
export function postWhitelistPage (data) {
  return service({
    url: '/risk/whitelist/page',
    method: 'post',
    data
  })
}

// 新增
export function postWhitelist (data) {
  return service({
    url: '/risk/whitelist',
    method: 'post',
    data
  })
}

// 修改
export function putWhitelist (data) {
  return service({
    url: '/risk/whitelist',
    method: 'put',
    data
  })
}

// 删除
export function deleteWhitelist (data) {
  return service({
    url: `/risk/whitelist/${data.id}`,
    method: 'delete'
  })
}
