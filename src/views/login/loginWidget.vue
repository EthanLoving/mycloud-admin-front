<!--原文：https://github.com/bitkylin/ClusterDeviceControlPlatform-Web/blob/8727f60c17/src/views/login/loginWidget.vue-->
<style lang="scss" scoped>
  @import "login.scss";
</style>
<template>
  <div id="login-container">
    <div class="hold-space-div"/>
    <Row class="header">
      <div class="description">M-cloud</div>
    </Row>
    <div id="login-form">
      <Form ref="loginForm" :model="loginForm" :rules="loginRules">
        <FormItem prop="userName">
          <Input
            v-model="loginForm.userName"
            prefix="ios-contact"
            size="large"
            clearable
            placeholder="请输入用户名"
            autocomplete="off"/>
        </FormItem>
        <FormItem prop="password">
          <Input
            v-model="loginForm.password"
            type="password"
            prefix="ios-lock"
            size="large"
            clearable
            placeholder="请输入密码"
            autocomplete="off"
            @keyup.enter.native="handleLogin"/>
        </FormItem>
        <FormItem>
          <Button type="primary" long :loading="loading" @click="handleLogin">登录</Button>
        </FormItem>
        <div id="tips">
          <span v-if="IsNormal==='待获取'">服务器状态：<span :style="{'font-weight':'bold'}">待获取</span></span>
          <span v-else-if="IsNormal">服务器状态：<span :style="{color:'#00ff00', 'font-weight':'bold'}">正常</span></span>
          <span v-else>服务器状态：<span :style="{color:'#ff0000', 'font-weight':'bold'}">异常</span></span>
          <span>延迟：<span :style="{'font-weight':'bold'}">{{ getCommDelay }}</span></span>
        </div>
      </Form>
    </div>
    <div class="hold-space-div"/>
    <div v-if="elegantSentences" id="elegant-sentences">
      <div id="elegant-sentences-content">
        {{ elegantSentences.content }}
      </div>
      <div id="elegant-sentences-inscribe">
        —— {{ elegantSentences.name }}
      </div>
    </div>
  </div>
</template>

<script>
  import { isvalidUsernameOrPassword } from '@/utils/validate'
  import { setTimer, touchError } from '@/utils/timer'
  import { chooseElegantSentencesLogin } from '@/utils/chooseElegantSentences'
  import { serverAttach } from '@/api/index'

  export default {
    name: 'LoginWidget',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsernameOrPassword(value)) {
          callback(new Error('只能输入字母和数字，且长度在 1 - 20 个字符之间'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (!isvalidUsernameOrPassword(value)) {
          callback(new Error('只能输入字母和数字，且长度在 1 - 20 个字符之间'))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        elegantSentences: null,
        commDelay: '待获取',
        dataBeforeTime: 0,
        IsNormal: '待获取',
        loginForm: {
          userName: 'admin',
          password: 'admin'
        },
        loginRules: {
          userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        pwdType: 'password'
      }
    },
    computed: {
      getCommDelay() {
        if (this.commDelay === '待获取') {
          return this.commDelay
        } else {
          return this.commDelay + 'ms'
        }
      }
    },
    mounted: function() {
      this.elegantSentences = chooseElegantSentencesLogin()
      setTimer(this.serverAttachTest, 1000)
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        // this.loading = true;
        this.$router.push({ path: '/' })
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm)
              .then(() => {
                this.$router.push({ path: this.redirect || '/' })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
        // TODO
        // this.$refs.loginForm.validate(valid => {
        //   if (valid) {
        //     this.loading = true
        //     this.$store.dispatch('Login', this.loginForm).then(() => {
        //       this.loading = false
        //       console.log(this.$router.options.routes)
        //       this.$router.push({ path: '/' })
        //     }).catch(() => {
        //       this.loading = false
        //     })
        //   } else {
        //     return false
        //   }
        // })
      },
      // 服务器可接入测试
      serverAttachTest() {
        this.dataBeforeTime = new Date().getTime()
        // 调取HTTP API获取数据
        serverAttach().then(response => {
          const code = response.data.code
          this.IsNormal = code === '5200'
          this.commDelay = new Date().getTime() - this.dataBeforeTime
        }).catch(error => {
          touchError(this, this.serverAttachTest, error)
        })
      }
    }
  }
</script>
