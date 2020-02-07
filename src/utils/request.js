import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import router from '@/router'
import Constants from '@/utils/constants'
import store from '@/store'
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 10000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    // 添加请求凭证token
    let requestParams = config.params
    if (requestParams === undefined || requestParams === null || requestParams === '') {
      requestParams = {}
    }
    requestParams.access_token = getToken(Constants.access_token) // 后台每个请求都追加sysCode参数
    config.params = requestParams
    return config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 1000 || res.code === 3000) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res.msg)
    } else if (res.code === 5000) {
      router.push('/401')
      return Promise.reject(res.msg)
    } else {
      return response.data
    }
  },
  error => {
    const res = error.response
    if (res.status === 401 || res.status === 504 || res.status === 503 || res.status === 502) {
      store.dispatch('LogOut').then(() => {
        router.push({ path: '/' })
      })
    }
    return Promise.reject(error)
  }
)

export default service
