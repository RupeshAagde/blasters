import AdministratorBaseViewVue from './../../pages/administrator/baseview.vue';
import HomeVue from './../../pages/administrator/home.vue';
import PlanCreator from './plan-creator';
import CompanyListVue from './../../pages/company-admin/company-list.vue';

export default [
    {
        path: '/administrator/',
        component: AdministratorBaseViewVue,
        children: [
            {
                path: 'home',
                component: HomeVue
            },
            ...PlanCreator,
            {
                path: 'company-list',
                component: CompanyListVue
            }
        ]
    }
];
