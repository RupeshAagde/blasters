'use strict';

import PlansListVue from './../../pages/plan-creator/plans-list.vue';
import PlansFormVue from '../../pages/plan-creator/plans-form.vue';
import ComponentsListVue from './../../pages/plan-creator/component-list.vue';
import { checkUserPermission } from '../guards';

export default [
    {
        path: 'subscription-plans/',
        component: PlansListVue,
        beforeEnter: (to, from, next) => {
            return checkUserPermission(to, from, next, ['plans']);
        }
    },
    {
        path: 'subscription-plans/create/',
        component: PlansFormVue,
        beforeEnter: (to, from, next) => {
            return checkUserPermission(to, from, next, ['plans']);
        }
    },
    {
        path: 'subscription-plans/edit/:planId',
        component: PlansFormVue,
        beforeEnter: (to, from, next) => {
            return checkUserPermission(to, from, next, ['plans']);
        }
    },
    {
        path: 'subscription-components/',
        component: ComponentsListVue,
        beforeEnter: (to, from, next) => {
            return checkUserPermission(to, from, next, ['plans']);
        }
    } //,
];
