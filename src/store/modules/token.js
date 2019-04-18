import { getRemoteAccessToken, checkRemoteAccessToken } from '@/api/token'
import { setAccessToken, getAccessToken, removeAccessToken } from '@/utils/auth'
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
    GetAccessToken({ commit, state }, code) {
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
          commit('SET_ACCESS_TOKEN', response.value)
          commit('SET_EXPIRES_IN', response.expiresIn)
          setAccessToken(Constants.access_token, response)
          resolve()
          window.location.href = Config.redirect_uri
        })
      })
    },
    GetCheckAccessToken({ commit, state }) {
      return new Promise(resolve => {
        const params = {}
        params.token = getAccessToken(Constants.access_token)
        checkRemoteAccessToken(params).then(response => {
          if (response.code === '204') {
            removeAccessToken(Constants.access_token)
            removeAccessToken(Constants.j_session_id)
          }
          resolve()
        })
      })
    }
  }
}
export default token
