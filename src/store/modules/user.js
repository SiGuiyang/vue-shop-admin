import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { removeToken, setAccessToken } from '@/utils/auth'
import Constants from '@/utils/constants'

const user = {
  state: {
    user: '',
    code: '',
    permissions: [], // 所有权限
    name: '',
    username: '',
    router: [],
    avatar: '',
    introduction: ''
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ROUTER: (state, router) => {
      state.router = router
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          setAccessToken(Constants.access_token, response.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data

          if (data.permissions && data.permissions.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_PERMISSIONS', data.permissions)
          } else {
            reject('getInfo: permission must be a non-null array !')
          }
          commit('SET_USERNAME', data.username)
          commit('SET_NAME', data.sysName)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout({}).then(() => {
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_NAME', data.sysName)
          commit('SET_AVATAR', data.avatar)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
