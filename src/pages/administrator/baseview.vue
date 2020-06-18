<template>
  <div class="baseview">
    <administrator-header></administrator-header>
    <div class="content">
      <sidebar></sidebar>
      <div class="section-content">
        <no-ssr>
          <transition name="fade" mode="out-in">
            <router-view class="view"></router-view>
          </transition>
        </no-ssr>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.section-content {
  width: calc(100% - 250px);
  min-width: 1000px;
  background-color: #f8f8f8;
  margin-left: 250px;
  position: absolute;
  border-left: 1px solId #e4e5e6;
  box-sizing: border-box;
  transition: all 0.25s ease-in-out;
  display: flex;
}
</style>

<script>
import NoSSR from 'vue-no-ssr'
import { isBrowser, isNode } from 'browser-or-node'
import AdministratorHeaderVue from './../../components/header/administrator.vue'
import SideBarVue from './../../components/administrator/sidebar.vue'
import Vue from 'vue'

export default {
  name: 'base-view',
  components: {
    'administrator-header': AdministratorHeaderVue,
    sidebar: SideBarVue,
    'no-ssr': NoSSR
  },

  mounted() {
    import(
      /*webpackChunkName:"nitrozen-snackbar" */ '@gofynd/nitrozen-vue/src/components/NSnackbar'
    ).then((NitrozenSnackbar) => {
      Vue.use(NitrozenSnackbar.default)
      Vue.snackbar.register('show', (message) => message, {
        position: 'top-center',
        duration: 2000
      })
      Vue.snackbar.register('showSuccess', (message) => message, {
        position: 'top-center',
        duration: 2000,
        type: 'success'
      })
      Vue.snackbar.register('showError', (message) => message, {
        position: 'top-center',
        duration: 2000,
        type: 'error'
      })
      Vue.snackbar.register('showWarning', (message) => message, {
        position: 'top-center',
        duration: 2000,
        type: 'warning'
      })
      Vue.snackbar.register('showInfo', (message) => message, {
        position: 'top-center',
        duration: 2000,
        type: 'infor'
      })
    })
  }
}
</script>
