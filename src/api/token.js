import service from '@/utils/request'
import Config from '@/utils/config'

/**
 * 获取访问的token
 */
export function getRemoteAccessToken (data) {
  return service({
    auth: {
      username: Config.client_id,
      password: Config.client_secret
    },
    url: '/oauth/token',
    method: 'get',
    params: data
  })
}

/**
 * 检验token是否过期
 */
export function checkRemoteAccessToken (data) {
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
