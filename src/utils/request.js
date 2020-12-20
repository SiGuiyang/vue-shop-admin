import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'
import router from '@/router'
import Constants from '@/utils/constants'
import store from '@/store'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 10000 // request timeout
})
// http 500 响应码
const errorCode = [400, 401, 403, 404, 405, 500, 502, 503, 504]
// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    // 添加请求凭证token
    // 添加请求凭证token
    const token = getToken(Constants.access_token)
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + getToken(Constants.access_token)
    }
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
    } else if (res.code === 10000 || res.code === 10001) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      store.dispatch('LogOut').then(() => {
        router.push({ path: '/' })
      })
      return Promise.reject(res.msg)
    } else {
      return response.data
    }
  },
  error => {
    const res = error.response
    console.log(res)
    if (errorCode.indexOf(res.status) !== -1) {
      MessageBox({
        title: '提示',
        message: '服务正在升级中。。。请稍后重试！！！',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {

      })
    }
    return Promise.reject(error)
  }
)

export default service
