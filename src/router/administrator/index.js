import AdministratorBaseViewVue from './../../pages/administrator/baseview.vue';
import HomeVue from './../../pages/administrator/home.vue';
import PlanCreatorRoutes from './plan-creator';

export default [
    {
        path: '/administrator/',
        component: AdministratorBaseViewVue,
        children: [
            {
                path: 'home',
                component: HomeVue
            },
            ...PlanCreatorRoutes
        ]
    }
];
