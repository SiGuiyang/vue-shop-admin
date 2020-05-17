<template>
  <div class="login-container">
    <vue-particles color="#fff"
                   shape-type="circle"
                   lines-color="#fff"
                   hover-mode="grab"
                   click-mode="push"
                   class="star" />
    <el-form ref="loginForm"
             :model="loginForm"
             :rules="loginRules"
             class="login-form"
             auto-complete="on"
             label-position="top">

      <div class="title-container">
        <h3 class="title">Pager 电商平台</h3>
        <div class="title-change">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              其它登陆方式
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,index) in loginTypeOptions"
                                :key="index"
                                :command="item.type">
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.phone"
                  placeholder="手机号码"
                  name="phone"
                  type="text"
                  auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <template v-if="loginType === 'sms'">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input v-model="loginForm.smsCode"
                    placeholder="短信验证码"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin" />
          <el-button type="default"
                     :disabled="smsCodeBtnDisabled"
                     class="sms-btn"
                     @click="handleSendSms">{{ smsCodeText }}</el-button>
        </template>
        <template v-else>
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="密码"
                    name="password"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin" />
          <span class="show-pwd"
                @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </template>
      </el-form-item>
      <el-button :loading="loading"
                 :disabled="loginBtnDisabled"
                 type="primary"
                 style="width: 100%;"
                 @click.native.prevent="handleLogin">
        登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;陆
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import Constants from '@/utils/constants'
import Config from '@/utils/config'
import { postSendSMS } from '@/api/platform/sms'
import Cookie from 'js-cookie'

export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('用户名只能是字母与数字的组合'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      placeholder: {
        phone: '手机号码',
        password: '密码'
      },
      loginForm: {
        phone: '13813145021',
        password: '111111',
        smsCode: ''
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loginTypeOptions: [
        { type: 'password', name: '密码登陆' },
        { type: 'authorization_code', name: '授权码登陆' },
        { type: 'sms', name: '短信登陆' }
      ],
      passwordType: 'password',
      loginType: 'password',
      smsCodeText: '获取验证码',
      smsCodeBtnDisabled: false,
      loginBtnDisabled: false,
      count: 60,
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }

  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin () { // 密码登陆
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginType === 'password') {
            this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '登陆成功'
              })
              this.$router.push({ path: this.redirect || '/' })
            }).catch(() => {
              this.loading = false
            })
          } else if (this.loginType === 'authorization_code') {
            debugger
            Cookie.set(Constants.auth_login, true)
            window.location.href = Config.auth_url + '/oauth/authorize?response_type=code&client_id=' + Config.client_id + '&redirect_uri=' + Config.redirect_uri
          } else if (this.loginType === 'sms') {
            this.$store.dispatch('LoginSMS', this.loginForm).then(() => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '登陆成功'
              })
              this.$router.push({ path: this.redirect || '/' })
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    handleCommand (command) {
      this.loginType = command
      // 密码模式，授权码模式，登陆按钮可用
      if (command === 'password' || command === 'authorization_code') {
        this.loginBtnDisabled = false
      } else {
        // 短信模式，默认进来短信不可用
        this.loginBtnDisabled = true
      }
      this.$message('已切换' + this.loginTypeOptions.filter(item => item.type === command)[0].name)
    },
    handleSendSms () {
      var countDown = setInterval(() => {
        if (this.count < 1) {
          this.isGeting = false
          this.disable = false
          // 获取验证码按钮不可用
          this.smsCodeBtnDisabled = false
          // 登陆按钮不可用
          this.loginBtnDisabled = true
          this.smsCodeText = '获取验证码'
          this.count = 60
          clearInterval(countDown)
        } else {
          // 获取验证码按钮不可用
          this.smsCodeBtnDisabled = true
          // 登陆按钮不可用
          this.loginBtnDisabled = false
          this.isGeting = true
          this.disable = true
          this.smsCodeText = this.count-- + 's后重发'
        }
      }, 1000)
      const param = {
        phone: this.loginForm.phone,
        event: 'LOGIN_SMS'
      }
      postSendSMS(param).then(response => {
        this.loginBtnDisabled = false
        this.$message({
          type: 'success',
          message: response.data
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #283443;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;

    &::first-line {
      color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .sms-btn {
    right: 0;
    position: absolute;
    margin: 6px;
  }
  .star {
    width: 100%;
    height: 100%;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;

  .login-form {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 35%;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .title-change {
    color: #fff;
    position: absolute;
    top: 3px;
    font-size: 18px;
    right: 0;
    cursor: pointer;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
