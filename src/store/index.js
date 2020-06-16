import Vue from 'vue'
import Vuex from 'vuex'
import { createAppMetaStore } from './modules/app-meta.module'
import { createAppCustomStore } from './modules/app-custom.module'
import { createServerStore } from './modules/server.module'
import { createAuthStore } from './modules/auth.module'
import { createBrowserMeta } from './modules/browser.module'
import { createOrganizationStore } from './modules/organization.module'
import { createTeamStore } from './modules/team.module'
import { createEmployeeStore } from './modules/employee.module'

Vue.use(Vuex)
export function createStore() {
  const appmeta = createAppMetaStore()
  const server = createServerStore()
  const auth = createAuthStore()

  const appcustom = createAppCustomStore()
  const browserMeta = createBrowserMeta()
  const partner = createOrganizationStore()
  const team = createTeamStore()
  const emp = createEmployeeStore()

  return new Vuex.Store({
    modules: {
      auth,
      server,
      partner,
      team,
      browserMeta,
      emp
    }
  })
}
