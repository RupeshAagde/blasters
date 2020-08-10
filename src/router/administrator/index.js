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
import Product from './../../pages/product/index';
import ProductAttributesList from './../../pages/product/attributes/list';
import ProductAttributesEdit from './../../pages/product/attributes/edit';
import ProductTemplatesList from './../../pages/product/templates/list';
import ProductTemplatesEdit from './../../pages/product/templates/edit';

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
            // Product
            {
                name: 'product',
                path: 'product',
                component: Product
            },
            {
                name: 'attributes',
                path: 'product/attributes',
                component: ProductAttributesList
            },
            {
                name: 'attributes-add',
                path: 'product/attributes/add',
                component: ProductAttributesEdit
            },
            {
                name: 'attributes-edit',
                path: 'product/attributes/:slug',
                component: ProductAttributesEdit
            },
            {
                name: 'templates',
                path: 'product/templates',
                component: ProductTemplatesList
            },
            {
                name: 'templates-add',
                path: 'product/templates/add',
                component: ProductTemplatesEdit
            },
            {
                name: 'templates-edit',
                path: 'product/templates/:slug',
                component: ProductTemplatesEdit
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
