'use strict';

import PlansListVue from './../../pages/plan-creator/plans-list.vue';
import PlansFormVue from '../../pages/plan-creator/plans-form.vue';
import ComponentsListVue from './../../pages/plan-creator/component-list.vue';

export default [
    {
        path: 'subscription-plans/',
        component: PlansListVue
    },
    {
        path: 'subscription-plans/create/',
        component: PlansFormVue
    },
    {
        path: 'subscription-plans/edit/:planId',
        component: PlansFormVue
    },
    {
        path: 'subscription-components/',
        component: ComponentsListVue
    } //,
];
