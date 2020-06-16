<template>
  <div class="container">
    <no-ssr>
      <div class="stheader">
        <header>
          <router-link to="/">
            <img src="public/assets/pngs/logo.png" alt="Fynd Partners" />
          </router-link>
          <nitrozen-button :theme="'secondary'" v-flatBtn @click="$submitForm">
            View Your Dashboard
          </nitrozen-button>
        </header>
      </div>
      <settings-form ref="settings"></settings-form>
    </no-ssr>
  </div>
</template>

<script>
import { isBrowser, isNode } from 'browser-or-node'
import {
  NitrozenButton,
  NitrozenInput,
  strokeBtn,
  flatBtn
} from '@gofynd/nitrozen-vue'
import settingsform from './partner/settings/index.vue'
import OrganizationService from '../services/organization.service'
import NoSSR from 'vue-no-ssr'
import { scrollToTop } from '././../helper/animate'

export default {
  components: {
    'no-ssr': NoSSR,
    'settings-form': settingsform,
    'nitrozen-button': NitrozenButton,
    'nitrozen-input': NitrozenInput
    // 'form-gen': formGenVue
  },
  directives: {
    flatBtn,
    strokeBtn
  },
  beforeRouteEnter(to, from, next) {
    if (isNode) {
      return next()
    }
    import('./../entry-client').then((appModule) => {
      const appStore = appModule.getAppStore()
      const { isLoggedIn } = appStore.state.auth
      if (isLoggedIn) {
        next()
      } else {
        return (window.location.href = '/')
      }
    })
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    $submitForm() {
      this.$refs.settings.submitForm()
    }
  }
}
</script>

<style lang="less" scoped>
.stheader {
  height: 100px;
  top: 0px;
  width: 100%;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
  header {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: space-between;
    background: #fff;
    padding: 0 24px;
    a {
      .flex-center();
    }
    img {
      margin: 0px 10px;
    }
  }
}
</style>
