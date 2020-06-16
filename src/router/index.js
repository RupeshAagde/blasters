import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//Components
import IndexVue from './../pages/index.vue'
import HomeVue from './../pages/home.vue'
import ThemesVue from './../pages/themes.vue'
import OrganizationsVue from './../pages/organizations.vue'
import CreateOrganizationVue from './../pages/create-organization.vue'
import PageNotFoundVue from './../pages/pagenotfound.vue'

import PartnersRoutes from './partners/'

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      ...PartnersRoutes,
      {
        path: '/',
        component: IndexVue,
        children: [
          {
            path: '',
            component: HomeVue
          },
          {
            path: 'themes',
            component: ThemesVue
          }
        ]
      },
      {
        path: '/__private',
        component: () =>
          import(
            /* webpackChunkName: "application" */
            `./../components/private/index.vue`
          ),
        children: [
          {
            path: 'invite',
            component: () =>
              import(
                /* webpackChunkName: "application" */
                './../components/private/invite.vue'
              )
          },
          {
            path: '*',
            redirect: '/__private/invite'
          }
        ]
      },
      {
        name: 'create-organization',
        path: '/create-organization',
        component: CreateOrganizationVue
      },
      {
        path: '/organizations',
        component: OrganizationsVue
      },
      {
        path: '*',
        component: PageNotFoundVue
      }
    ]
  })
}
