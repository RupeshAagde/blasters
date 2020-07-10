import AdministratorBaseViewVue from './../../pages/administrator/baseview.vue';
import HomeVue from './../../pages/administrator/home.vue';
import PlanCreator from './plan-creator';
import CompanyListVue from './../../pages/company-admin/company-list.vue';
import CbsDetailVue from './../../pages/company-admin/cbs-detail.vue';
import UserManagementVue from './../../pages/super-user/user-access.vue';
import AddSuperUserVue from './../../pages/super-user/add-user.vue';

export default [
    {
        path: '/administrator/',
        component: AdministratorBaseViewVue,
        redirect: '/administrator/home',
        children: [
            {
                path: 'home',
                component: HomeVue
            },
            ...PlanCreator,
            {
                path: 'company-list',
                component: CompanyListVue
            },
            {
                path: 'company-details/:companyId',
                component: CbsDetailVue
            },
            {
                path: 'user-management',
                component: UserManagementVue
            },
            {
                path: 'add-user',
                component: AddSuperUserVue
            }
        ]
    }
];
