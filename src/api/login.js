import service from '@/utils/request'
import Config from '@/utils/config'

/**
 * 密码登陆
 * @param username 用户名
 * @param password 密码
 */
export function loginByUsername (username, password) {
  const data = {
    username,
    password,
    grant_type: 'password'
  }
  return service({
    auth: {
      username: Config.client_id,
      password: Config.client_secret
    },
    url: '/oauth/token',
    method: 'post',
    params: data
  })
}

/**
 * 授权码登陆
 */
export function loginAuthorizationCode (data) {
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
 * 短信验证码登陆
 * @param {*} phone 手机号码
 * @param {*} smsCode 短信验证码 
 */
export function loginSMS (phone, smsCode) {
  const data = {
    phone,
    smsCode,
    grant_type: 'sms'
  }
  return service({
    auth: {
      username: Config.client_id,
      password: Config.client_secret
    },
    url: '/oauth/token',
    method: 'post',
    params: data
  })
}

export function logout (data) {
  return service({
    url: '/admin/logout',
    method: 'post',
    data
  })
}

export function getUserInfo (sysCode) {
  const data = {
    sysCode
  }
  return service({
    url: '/admin/system/adminInfo',
    method: 'post',
    data
  })
}

