import Vue from 'vue'
import Vuex from 'vuex'
import { createAuthStore } from './modules/auth.module'
import { createServerStore } from './modules/server.module'

Vue.use(Vuex)
export function createStore() {
  const auth = createAuthStore()
  const server = createServerStore()

  return new Vuex.Store({
    modules: {
      auth,
      server
    }
  })
}
