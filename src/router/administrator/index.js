import AdministratorBaseViewVue from './../../pages/administrator/baseview.vue';
import PlanCreator from './plan-creator';
import CompanyListVue from './../../pages/company-admin/company-list.vue';
import CbsDetailVue from './../../pages/company-admin/cbs-detail.vue';
import BillingVue from './../../pages/company-admin/billing.vue';
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
import Product from './../../pages/product/index';
import ProductAttributesList from '@/pages/product/attributes/list';
import ProductAttributesEdit from '@/pages/product/attributes/edit';
import ProductAttributesGroup from '@/pages/product/attributes/group';
import ProductAttributesSequence from '@/pages/product/attributes/sequence';
import ProductTemplatesList from '@/pages/product/templates/list';
import ProductTemplatesEdit from '@/pages/product/templates/edit';
import CategoryList from '@/pages/product/category/list';
import CategoryEdit from '@/pages/product/category/edit';
import IntegrationsListVue from '@/pages/integration/list';
import IntegrationsCreateVue from '@/pages/integration/create';

import { authenticatedUser, checkUserPermission } from './../guards';

export default [
    {
        path: '/administrator/',
        beforeEnter: authenticatedUser,
        component: AdministratorBaseViewVue,
        children: [
            //...PlanCreatorRoutes
            {
                name: 'company-list',
                path: 'company-list',
                component: CompanyListVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['company']);
                }
            },
            {
                name: 'company-details',
                path: 'company-details/:companyId',
                component: CbsDetailVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(
                        to,
                        from,
                        next,
                        ['company'],
                        'companyId'
                    );
                }
            },
            {
                name: 'billing-details',
                path: 'billing-details/:billingNo',
                component: BillingVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(
                        to,
                        from,
                        next,
                        ['company']
                    );
                }
            },
            {
                name: 'user-management',
                path: 'user-management',
                component: UserManagementVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'admin-access'
                    ]);
                }
            },
            {
                name: 'support',
                path: 'support',
                component: Tickets,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['support']);
                }
            },
            {
                name: 'support-edit',
                path: 'support/ticket/edit/:ticket_id',
                component: CreateTicket,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['support']);
                }
            },
            {
                name: 'add-user',
                path: 'add-user',
                component: AddSuperUserVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'admin-access'
                    ]);
                }
            },
            {
                name: 'add-dri',
                path: 'company-details/:companyId/add-dri',
                component: AddEditDri,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(
                        to,
                        from,
                        next,
                        ['company'],
                        'companyId'
                    );
                }
            },
            {
                name: 'edit-dri',
                path: 'company-details/:companyId/edit-dri/:uid',
                component: AddEditDri,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(
                        to,
                        from,
                        next,
                        ['company'],
                        'companyId'
                    );
                }
            },
            //Catalog
            {
                name: 'department',
                path: 'product/department',
                component: ListDepartment
            },
            {
                name: 'create',
                path: 'product/department/create',
                component: CreateUpdateDepartment
            },
            {
                name: 'edit-department',
                path: 'product/department/edit/:deptId',
                component: CreateUpdateDepartment
            },
            {
                name: 'variants',
                path: 'product/variants',
                component: ListVariants
            },
            {
                name: 'create-variant',
                path: 'product/variants/create',
                component: CreateUpdateVariant
            },
            {
                name: 'edit-variant',
                path: 'product/variants/edit/:uid',
                component: CreateUpdateVariant
            },
            // Product
            {
                name: 'product',
                path: 'product',
                component: Product,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            // attributes
            {
                name: 'attributes',
                path: 'product/attributes',
                component: ProductAttributesList,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'attributes-create',
                path: 'product/attributes/create',
                component: ProductAttributesEdit,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'attributes-edit',
                path: 'product/attributes/edit/:slug',
                component: ProductAttributesEdit,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            // group-and-sequence
            {
                name: 'attributes-group',
                path: 'product/attributes/group/:entity',
                component: ProductAttributesGroup,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'attributes-group-settings',
                path: 'product/attributes/group/:entity/:slug',
                component: ProductAttributesGroup,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'attributes-sequence',
                path: 'product/attributes/sequence/:entity',
                component: ProductAttributesSequence,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },

            // templates
            {
                name: 'templates',
                path: 'product/templates',
                component: ProductTemplatesList,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'templates-create',
                path: 'product/templates/create',
                component: ProductTemplatesEdit,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'templates-edit',
                path: 'product/templates/:slug',
                component: ProductTemplatesEdit,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            // Settings
            {
                name: 'settings',
                path: 'settings',
                component: SettingsVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'basic-details-setting',
                path: 'settings/basic',
                component: BasicDetailSettingsVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'features-setting',
                path: 'settings/features',
                component: FeaturesSettingsVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            // Category
            {
                name: 'category',
                path: 'product/category',
                component: CategoryList,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'category-create',
                path: 'product/category/create',
                component: CategoryEdit,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'category-edit',
                path: 'product/category/edit/:id',
                component: CategoryEdit,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'integrations-list',
                path: 'integrations/list',
                component: IntegrationsListVue,
                // beforeEnter: (to, from, next) => {
                //     return checkUserPermission(to, from, next, ['admin-access']);
                // }
            },
            {
                name: 'integration-edit',
                path: 'integration/edit/:integrationId',
                component: IntegrationsCreateVue,
                // beforeEnter: (to, from, next) => {
                //     return checkUserPermission(to, from, next, ['admin-access']);
                // }
            },
            {
                name: 'integration-create',
                path: 'integration/create',
                component: IntegrationsCreateVue,
                // beforeEnter: (to, from, next) => {
                //     return checkUserPermission(to, from, next, ['admin-access']);
                // }
            },
        ]
    }
];
