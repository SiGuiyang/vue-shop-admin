import { constantRouterMap } from '@/router'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { routers } = data
        const accessedRouters = filterAsyncRouter(routers)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 */
function filterAsyncRouter (routes) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.component && tmp.component === 'Layout') {
      tmp.component = () => import('@/views/layout/Layout')
    } else {
      const component = tmp.component
      tmp.component = () => import(`@/views/${component}`)
    }
    // 迭代子组件
    if (tmp.children && tmp.children.length > 0) {
      tmp.children = filterAsyncRouter(tmp.children)
    }
    res.push(tmp)
  })

  return res
}

export default permission
