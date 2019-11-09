import request from '@/utils/request'
import Config from '@/utils/config'

/**
 * 密码登陆
 * @param username 用户名
 * @param password 密码
 */
export function loginByUsername(username, password) {
  const data = {
    username,
    password,
    grant_type: 'password'
  }
  return request({
    auth: {
      username: Config.client_id,
      password: Config.client_secret
    },
    url: '/oauth/token',
    method: 'post',
    params: data
  })
}

export function logout(data) {
  return request({
    url: '/admin/logout',
    method: 'post',
    data
  })
}

export function getUserInfo(sysCode) {
  const data = {
    sysCode
  }
  return request({
    url: '/admin/system/adminInfo',
    method: 'post',
    data
  })
}

