import service from '@/utils/request'

/**
 * 获取访问的token
 */
export function getRemoteAccessToken(data) {
  return service({
    auth: {
      username: 'client4',
      password: '111111'
    },
    url: '/oauth/token',
    method: 'post',
    data
  })
}

/**
 * 检验token是否过期
 */
export function checkRemoteAccessToken(data) {
  return service({
    auth: {
      username: 'client4',
      password: '111111'
    },
    url: '/oauth/check_token',
    method: 'post',
    data
  })
}
