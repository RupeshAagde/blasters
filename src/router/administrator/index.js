import AdministratorBaseViewVue from './../../pages/administrator/baseview.vue';
import HomeVue from './../../pages/administrator/home.vue';
import PlanCreator from './plan-creator';
import CompanyListVue from './../../pages/company-admin/company-list.vue';
import CbsDetailVue from './../../pages/company-admin/cbs-detail.vue';
import UserManagementVue from './../../pages/super-user/user-access.vue';
import AddSuperUserVue from './../../pages/super-user/add-user.vue';
import SettingsVue from './../../pages/settings';
import BasicDetailSettingsVue from './../../pages/settings/basic-details';
import FeaturesSettingsVue from './../../pages/settings/features';

export default [
    {
        path: '/administrator/',
        component: AdministratorBaseViewVue,
        redirect: '/administrator/home',
        children: [
            {
                name: 'home',
                path: 'home',
                component: HomeVue
            },
            ...PlanCreatorRoutes,
            {
                name: 'company-list',
                path: 'company-list',
                component: CompanyListVue
            },
            {
                name: 'company-details',
                path: 'company-details/:companyId',
                component: CbsDetailVue
            },
            {
                name: 'user-management',
                path: 'user-management',
                component: UserManagementVue
            },
            {
                name: 'add-user',
                path: 'add-user',
                component: AddSuperUserVue
            },
            // Settings
            {
                name: 'settings',
                path: 'settings',
                component: SettingsVue
            },
            {
                name: 'basic-details-setting',
                path: 'settings/basic',
                component: BasicDetailSettingsVue
            },
            {
                name: 'features-setting',
                path: 'settings/features',
                component: FeaturesSettingsVue
            }
        ]
    }
];
