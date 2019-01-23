import axios from 'axios'
import { Message } from 'element-ui'
import qs from 'qs'
import { getToken } from '@/utils/auth'

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
    if (requestMethod === 'post') { // post 方式
      const requestData = config.data
      requestData.sysCode = getToken() // 后台每个请求都追加sysCode参数
      config.data = qs.stringify(requestData)
    } else if (requestMethod === 'get') { // get 方式
      const requestParams = config.params
      requestParams.sysCode = getToken() // 后台每个请求都追加sysCode参数
      config.params = requestParams
    }

    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
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
    if (res.code === 500) {
      Message({
        message: '网络发生点小问题，请稍等',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject()
    } else if (res.code === 1000 || res.code === 3000 || res.code === 5000) {
      return Promise.reject(res.msg)
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
