import Vue from 'vue'
import { isBrowser, isNode } from 'browser-or-node'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'

import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad)

import root from 'window-or-global'
import urlJoin from 'url-join'
import { FETCH_USER_DATA } from './store/action.type'
const envVars = root.env || {}

export function createApp() {
  if (envVars.CDN_URL) {
    __webpack_public_path__ = urlJoin(envVars.CDN_URL, '/public/')
  }

  // create store and router instances
  const store = createStore()
  const router = createRouter()

  sync(store, router)

  router.beforeEach((to, from, next) => {
    /* must call `next` */
    if (isNode) {
      return next()
    }
    store.dispatch(FETCH_USER_DATA).then(() => {
      next()
    })
  })

  const app = new Vue({
    router,
    store,
    render: (h) => h(App)
  })
  return { app, router, store }
}
