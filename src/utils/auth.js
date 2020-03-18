import Cookies from 'js-cookie'

export function getToken (tokenKey) {
  return Cookies.get(tokenKey)
}

export function setToken (tokenKey, tokenValue) {
  return Cookies.set(tokenKey, tokenValue)
}

export function removeToken (tokenKey) {
  return Cookies.remove(tokenKey)
}

