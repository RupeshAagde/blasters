import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

//Components
import BaseviewVue from './../pages/baseview.vue';
import HomeVue from './../pages/home.vue';
import PageNotFoundVue from './../pages/pagenotfound.vue';
import {} from './../pages/company-admin/company-list.vue';

import AdministratorRoutes from './administrator';
export function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            ...AdministratorRoutes,
            {
                path: '/',
                component: BaseviewVue,
                children: [
                    {
                        path: '',
                        component: HomeVue
                    }
                ]
            },

            {
                path: '*',
                component: PageNotFoundVue
            }
        ]
    });
}
