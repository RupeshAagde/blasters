import AdministratorBaseViewVue from './../../pages/administrator/baseview.vue';
import HomeVue from './../../pages/administrator/home.vue';
import PlanCreator from './plan-creator';
import CompanyListVue from './../../pages/company-admin/company-list.vue';
import CbsDetailVue from './../../pages/company-admin/cbs-detail.vue';
import UserManagementVue from './../../pages/super-user/user-access.vue';
import AddSuperUserVue from './../../pages/super-user/add-user.vue';
import Tickets from './../../pages/tickets/index.vue';
import CreateTicket from './../../pages/tickets/create-ticket.vue';
import SettingsVue from './../../pages/settings';
import BasicDetailSettingsVue from './../../pages/settings/basic-details';
import FeaturesSettingsVue from './../../pages/settings/features';
import AddEditDri from './../../pages/company-admin/add-edit-dri.vue';
import ListDepartment from './../../pages/catalogue/list-department.vue';
import CreateUpdateDepartment from './../../pages/catalogue/create-update-department.vue';
import ListVariants from './../../pages/catalogue/list-variants.vue';
import CreateUpdateVariant from './../../pages/catalogue/create-update-variant.vue';

export default [
    {
        path: '/administrator/',
        component: AdministratorBaseViewVue,
        redirect: '/administrator/company-list',
        children: [
            // {
            //     name: 'home',
            //     path: 'home',
            //     component: HomeVue
            // },
            //...PlanCreatorRoutes
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
                name: 'support',
                path: 'support',
                component: Tickets
            },
            {
                name: 'support-edit',
                path: 'support/ticket/edit/:ticket_id',
                component: CreateTicket
            },
            {
                name: 'add-user',
                path: 'add-user',
                component: AddSuperUserVue
            },
            {
                name: 'add-dri',
                path: 'company-details/:companyId/add-dri',
                component: AddEditDri
            },
            {
                name: 'edit-dri',
                path: 'company-details/:companyId/edit-dri/:uid',
                component: AddEditDri
            },
            //Catalog
            {
                name: 'department',
                path: 'product/department',
                component: ListDepartment
            },
            {
                name: 'create-department',
                path: 'product/create-department',
                component: CreateUpdateDepartment
            },
            {
                name: 'edit-department',
                path: 'product/edit-department/:deptId',
                component: CreateUpdateDepartment
            },
            {
                name: 'variants',
                path: 'product/variants',
                component: ListVariants
            },
            {
                name: 'create-variant',
                path: 'product/create-variant',
                component: CreateUpdateVariant
            },
            {
                name: 'edit-variant',
                path: 'product/edit-variant/:uid',
                component: CreateUpdateVariant
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
