import { getRemoteAccessToken, checkRemoteAccessToken } from '@/api/token'
import { setToken, getToken, removeToken } from '@/utils/auth'
import Constants from '@/utils/constants'
import Config from '@/utils/config'

const token = {
  access_token: '',
  refresh_token: '',
  expires_in: '',
  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
    },
    SET_REFRESH_TOKEN: (state, refresh_token) => {
      state.refresh_token = refresh_token
    },
    SET_EXPIRES_IN: (state, expires_in) => {
      state.expires_in = expires_in
    }
  },
  actions: {
    GetAccessToken ({ commit, state }, code) {
      return new Promise((resolve, reject) => {
        console.log(code)
        const params = {}
        params.grant_type = Config.grant_type
        params.code = code
        params.client_id = Config.client_id
        params.client_secret = Config.client_secret
        params.redirect_uri = Config.redirect_uri
        params.scope = 'app'
        getRemoteAccessToken(params).then(response => {
          console.log(response)
          commit('SET_ACCESS_TOKEN', response.access_token)
          commit('SET_EXPIRES_IN', response.expires_in)
          setToken(Constants.access_token, response.access_token)
          resolve()
        })
      })
    },
    GetCheckAccessToken ({ commit, state }) {
      return new Promise(resolve => {
        const params = {}
        params.token = getToken(Constants.access_token)
        checkRemoteAccessToken(params).then(response => {
          if (response.code === '204') {
            removeToken(Constants.access_token)
            removeToken(Constants.j_session_id)
          }
          resolve()
        })
      })
    }
  }
}
export default token
