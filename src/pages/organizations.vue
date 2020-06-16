<template>
  <div class="container">
    <no-ssr>
      <div class="stheader">
        <header>
          <router-link to="/">
            <img src="public/assets/pngs/logo.png" alt="Fynd Partners" />
          </router-link>
          <router-link to="/create-organization" class="new-org">
            <nitrozen-button v-flatBtn :theme="'secondary'">
              + Create New Partner Account
            </nitrozen-button>
          </router-link>
        </header>
      </div>
      <div class="card-container">
        <div class="bold-lg cl-Mako title">Your Partner Accounts</div>
        <router-link
          v-for="(it, id) in organizations"
          :key="id"
          class="item"
          :to="'/partner/' + it.slug"
        >
          <text-avatar :text="it.name"></text-avatar>
          <div class="name">{{ it.name }}</div>
        </router-link>

        <div class="user-info regular-xs">
          <span>Logged in as {{ username }}.</span>
          <nitrozen-button @click="signOut" class="regular-xs">
            Log out
          </nitrozen-button>
        </div>
      </div>
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
import { mapGetters } from 'vuex'
import textAvatar from '@/components/common/text-avatar.vue'
import { GET_ORGANIZATION_LIST, GET_USER_INFO } from '../store/getters.type'
import { SIGNOUT_USER, FETCH_ORGANIZATION_LIST } from '../store/action.type'
import NoSSR from 'vue-no-ssr'
export default {
  components: {
    'no-ssr': NoSSR,
    'nitrozen-button': NitrozenButton,
    'text-avatar': textAvatar
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
        appStore
          .dispatch(FETCH_ORGANIZATION_LIST)
          .then(() => {
            const { organizations } = appStore.state.partner

            if (organizations.length > 1) {
              return next()
            } else if (organizations.length === 1) {
              return (window.location.href =
                '/partner/' + organizations[0].slug)
            } else {
              return (window.location.href = '/create-organization')
            }
          })
          .catch(() => {
            return (window.location.href = '/')
          })
      } else {
        return (window.location.href = '/')
      }
    })
  },
  computed: {
    username() {
      const { user } = this.userData
      if (user) {
        return `${user.firstName} ${user.lastName}`
      }
      return ''
    },
    ...mapGetters({
      organizations: GET_ORGANIZATION_LIST,
      userData: GET_USER_INFO
    })
  },
  data() {
    return {
      isMounted: false
    }
  },
  mounted() {
    this.isMounted = true
  },
  methods: {
    signOut() {
      this.$store.dispatch(SIGNOUT_USER)
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
.card-container {
  position: absolute;
  width: 40%;
  margin: 20px auto;
  padding: 20px;
  left: 0px;
  border-radius: 3px;
  right: 0px;
  background-color: @White;
  box-shadow: 1px 1px 1px 1px #eeeeee;
  .title {
    padding: 10px 0px;
  }
  .item {
    margin: 20px 0px;
    padding: 20px;
    border: 1px solid @Iron;
    display: flex;
    justify-content: left;
    align-items: center;
    .name {
      margin-left: 24px;
    }
    &:hover {
      cursor: pointer;
      box-shadow: 0 9px 13px 0 hsla(0, 0%, 86.7%, 0.5);
    }
  }
  .new-org {
    .flex-center();
  }
  .user-info {
    margin: 10px;
  }
}
</style>
