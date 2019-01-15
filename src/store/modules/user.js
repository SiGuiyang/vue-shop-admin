import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    code: '',
    name: '',
    sysCode: getToken(),
    avatar: '',
    introduction: '',
    permission: []
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_SYSCODE: (state, sysCode) => {
      state.sysCode = sysCode
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSION: (state, permission) => {
      state.permission = permission
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      console.log(userInfo)
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data
          commit('SET_SYSCODE', data.sysCode)
          setToken(data.sysCode)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.sysCode).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data

          if (data.permission && data.permission.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_PERMISSION', data.permission)
          } else {
            reject('getInfo: permission must be a non-null array !')
          }

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
          commit('SET_SYSCODE', '')
          commit('SET_PERMISSION', [])
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
        commit('SET_SYSCODE', '')
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
