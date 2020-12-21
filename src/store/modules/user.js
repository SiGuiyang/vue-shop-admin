import { loginByUsername, getUserInfo } from '@/api/login'
import { removeToken, setToken } from '@/utils/auth'
import Constants from '@/utils/constants'

const user = {
  state: {
    user: '',
    code: '',
    permissions: [], // 所有权限
    username: '',
    phone: '',
    router: [],
    avatar: '',
    introduction: ''
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_USERNAME: (state, username) => {
      state.username = username
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
    LoginByUsername ({ commit }, userInfo) {
      const username = userInfo.phone.trim()
      const password = userInfo.password.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, password).then(response => {
          setToken(Constants.access_token, response.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo ({ commit }) {
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
          commit('SET_PHONE', data.phone)
          commit('SET_USERNAME', data.username)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut ({ commit }) {
      return new Promise((resolve) => {
        commit('SET_PERMISSIONS', [])
        removeToken(Constants.access_token)
        removeToken(Constants.auth_login)
        resolve()
      })
    }
  }
}

export default user
