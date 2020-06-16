<template>
  <div id="app" ref="app" class="main-app">
    <template>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </template>
  </div>
</template>

<script>
import { detectMobile, randomString } from './helper/utils'
import { isBrowser, isNode } from 'browser-or-node'
import './less/common.less'
import urlJoin from 'url-join'
import root from 'window-or-global'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { ON_USER_LOGGED_IN, ON_USER_LOGGED_OUT } from './store/action.type'
const envVars = root.env || {}

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters({})
  },
  mounted() {
    //register grimlock
    this.registerGrimLock()

    //add sentry
    const { SENTRY_DSN, SENTRY_ENVIRONMENT } = envVars

    if (SENTRY_DSN) {
      window.Raven.config(`${SENTRY_DSN}`, {
        environment: `${SENTRY_ENVIRONMENT}`
      }).install()
    }
  },
  methods: {
    registerGrimLock() {
      window.grimlock.onLogin = this.handleLogin.bind(this)
      window.grimlock.onLogout = this.handleLogout.bind(this)
    },

    handleLogin() {
      this.$store.dispatch(ON_USER_LOGGED_IN)
    },
    handleLogout() {
      this.$store.dispatch(ON_USER_LOGGED_OUT)
    }
  },
  destroyed() {
    window.addEventListener('resize', this.onsizeChange.bind(this))
  }
}
</script>

<style lang="less">
@import './less/text.less';
@import './less/color.less';
</style>
