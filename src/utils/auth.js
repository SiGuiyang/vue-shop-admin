import Cookies from 'js-cookie'

const TokenKey = 'sysCode'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getAccessToken(tokenKey) {
  return Cookies.get(tokenKey)
}

export function setAccessToken(tokenKey, tokenValue) {
  return Cookies.set(tokenKey, tokenValue)
}

export function removeAccessToken(tokenKey) {
  return Cookies.remove(tokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
