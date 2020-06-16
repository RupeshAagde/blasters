<template>
  <div class="szheader cl-Mako">
    <header class="header">
      <router-link to="/">
        <img src="/public/assets/pngs/logo.png" alt="Fynd Partners" />
      </router-link>
      <search-bar></search-bar>
      <profile-menu></profile-menu>
    </header>
  </div>
</template>

<style lang="less" scoped>
.szheader {
  height: 64px;
}
.header {
  display: flex;
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 4;
  align-items: center;
  height: 64px;
  background: #fff;
  box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
  img {
    margin: 0px 30px;
    height: 55px;
  }
}
</style>

<script>
import { NitrozenButton, NitrozenInput, strokeBtn } from '@gofynd/nitrozen-vue'
import root from 'window-or-global'
import { mapGetters } from 'vuex'
import partnerRoutes from './../../router/partners/'
import inlineSvgVue from '../common/inline-svg.vue'
import searchVue from './components/search.vue'
import profileMenu from './components/profile-menu.vue'

export default {
  name: 'partner-header',
  components: {
    'nitrozen-button': NitrozenButton,
    'nitrozen-input': NitrozenInput,
    'search-bar': searchVue,
    'profile-menu': profileMenu,
    'inline-svg': inlineSvgVue
  },
  directives: {
    strokeBtn
  },
  computed: {
    ...mapGetters({})
  }
}
</script>
