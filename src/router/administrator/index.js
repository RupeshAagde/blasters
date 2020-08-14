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
import ProductAttributesList from '@/pages/product/attributes/list';
import ProductAttributesEdit from '@/pages/product/attributes/edit';
import ProductAttributesGroup from '@/pages/product/attributes/group';
import ProductAttributesSequence from '@/pages/product/attributes/sequence';
import ProductTemplatesList from '@/pages/product/templates/list';
import ProductTemplatesEdit from '@/pages/product/templates/edit';

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
            // attributes
            {
                name: 'attributes',
                path: 'product/attributes',
                component: ProductAttributesList
            },
            {
                name: 'attributes-create',
                path: 'product/attributes/create',
                component: ProductAttributesEdit
            },
            {
                name: 'attributes-edit',
                path: 'product/attributes/edit/:slug',
                component: ProductAttributesEdit
            },
            // group-and-sequence
            {
                name: 'attributes-group',
                path: 'product/attributes/group/:entity',
                component: ProductAttributesGroup
            },
            {
                name: 'attributes-group-settings',
                path: 'product/attributes/group/:entity/:slug',
                component: ProductAttributesGroup
            },
            {
                name: 'attributes-sequence',
                path: 'product/attributes/sequence/:entity',
                component: ProductAttributesSequence
            },

            // templates
            {
                name: 'templates',
                path: 'product/templates',
                component: ProductTemplatesList
            },
            {
                name: 'templates-create',
                path: 'product/templates/create',
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
