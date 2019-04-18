import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getAccessToken } from '@/utils/auth' // getToken from cookie
import Constants from '@/utils/constants'
// import Config from '@/utils/config'
// import Url from '@/utils/url'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/404', '/401', '*', '/dashboard'] // whitelist

// permission judge function
function hasPermission(permissions, to) {
  const perm = to.meta.permission
  if (whiteList.indexOf(to.path) !== -1) {
    return true
  }
  return permissions.some(permission => perm.indexOf(permission) >= 0)
}

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getAccessToken(Constants.access_token)) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.permissions.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          const routers = res.data.routers
          store.dispatch('GenerateRoutes', { routers }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
          store.dispatch('FetchCommonEnumInfo').then(() => {
            console.log('资源初始化完成')
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.permissions, to)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    // if (Url.getParam('code')) {
    //   console.log('33')
    //   store.dispatch('GetAccessToken', Url.getParam('code')).then(() => {
    //     console.log('获取token成功')
    //   })
    // } else {
    //   // 跳转授权地址
    //   window.location.href = Config.auth_url + '/oauth/authorize?response_type=code&client_id=' + Config.client_id + '&redirect_uri=' + Config.redirect_uri
    // }
    /* has no token*/
    if (to.path !== '/dashboard' && whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
