import axios from 'axios'
import { Message } from 'element-ui'
import qs from 'qs'
import { getAccessToken } from '@/utils/auth'
import router from '@/router'
import Constants from '@/utils/constants'
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    const requestMethod = config.method
    if (requestMethod === 'post' || requestMethod === 'put') { // post 方式
      let requestData = config.data
      if (requestData === undefined || requestData === null || requestData === '') {
        requestData = {}
      }
      requestData.access_token = getAccessToken(Constants.access_token) // 后台每个请求都追加sysCode参数
      config.data = qs.stringify(requestData)
    } else if (requestMethod === 'get' || requestMethod === 'delete') { // get 方式
      let requestParams = config.params
      if (requestParams === undefined || requestParams === null || requestParams === '') {
        requestParams = {}
      }
      requestParams.access_token = getAccessToken(Constants.access_token) // 后台每个请求都追加sysCode参数
      config.params = requestParams
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
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
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
    if (res.status === 504 || res.status === 503) {
      Message({
        message: '服务器开小差，请稍等！',
        type: 'error',
        duration: 5 * 1000
      })
      router.push({ path: '/401' })
    }
    return Promise.reject(error)
  }
)

export default service
