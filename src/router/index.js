import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//Components
import BaseviewVue from './../pages/baseview.vue'
import HomeVue from './../pages/home.vue'
import ManageVue from './../pages/manage.vue'
import PageNotFoundVue from './../pages/pagenotfound.vue'
import { authenticatedUser } from './guards'

import CloudRoutes from './cloud'
export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      ...CloudRoutes,
      {
        path: '/',
        component: BaseviewVue,
        children: [
          {
            path: '',
            component: HomeVue
          },

          {
            path: '/manage',
            beforeEnter: authenticatedUser,
            component: ManageVue
          }
        ]
      },

      {
        path: '*',
        component: PageNotFoundVue
      }
    ]
  })
}
