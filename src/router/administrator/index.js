import AdministratorBaseViewVue from './../../pages/administrator/baseview.vue';
import PlanCreator from './plan-creator';
import ExtensionRoutes from './extension';
import CompanyListVue from './../../pages/company-admin/company-list.vue';
import CbsApplicationDetailsVue from './../../pages/company-admin/cbs-application-details.vue';
import CbsDetailVue from './../../pages/company-admin/cbs-detail.vue';
import BillingVue from './../../pages/company-admin/billing.vue';
import InvoiceListingMain from './../../pages/company-admin/invoice-listing-main.vue';
import CouponListingMain from './../../pages/company-admin/coupon-listing-main.vue';
import CouponCreateUpdate from './../../pages/company-admin/coupon-create-update.vue';
import ReportListingMain from './../../pages/communication/reports.vue';
import UserManagementVue from './../../pages/super-user/user-access.vue';
import AddSuperUserVue from './../../pages/super-user/add-user.vue';
import Tickets from './../../pages/tickets/index.vue';
import CreateTicket from './../../pages/tickets/create-ticket.vue';
import VideoRoom from './../../pages/tickets/video-call/video-room.vue';
import AddCategory from './../../pages/tickets/add-category.vue';
import SettingsVue from './../../pages/settings';
import BasicDetailSettingsVue from './../../pages/settings/basic-details.vue';
import FeaturesSettingsVue from './../../pages/settings/features.vue';
import PagesSettingsVue from './../../pages/settings/custompage.vue';
import TagsInjectVue from './../../pages/settings/tags-inject.vue';
import TagsCreateUpdateVue from '../../pages/settings/tags-create-update.vue'
import CreateCustomVue from './../../pages/settings/page-editor/create.vue';
import NavbarSettingsVue from './../../pages/settings/navbar';
import FooterSettingsVue from './../../pages/settings/footer';
import PricingBannerVue from './../../pages/settings/pricing_banner.vue';
import CategoryList from '@/pages/product/category/list';
import AuditLogs from './../../pages/audit-trail/index.vue';
import AuditLogsDetails from './../../pages/audit-trail/log-detail.vue';
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
import CategoryEdit from '@/pages/product/category/edit';
import ProductVerificationCompanyList from '@/pages/product/verification/list';
import ProductVerificationEdit from '@/pages/product/verification/edit';
import ProductVerificationList from '@/pages/product/verification/productList';
import ProductTaxationList from '@/pages/product/taxation/list';
import ProductTaxationEdit from '@/pages/product/taxation/edit';
import IntegrationsListVue from '@/pages/integration/list';
import IntegrationsCreateVue from '@/pages/integration/create';
const OrdersPage =()=>import('@/pages/orders');
const OrderDetails = () => import('@/pages/orders/order-details.vue');

import { authenticatedUser, checkUserPermission } from './../guards';

export default [
    {
        path: '/administrator/',
        beforeEnter: authenticatedUser,
        component: AdministratorBaseViewVue,
        children: [
            //...PlanCreatorRoutes,
            ...ExtensionRoutes,
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
                name: 'invoices',
                path: 'subscription/invoices',
                component: InvoiceListingMain,
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
                name: 'coupons',
                path: 'subscription/coupons',
                component: CouponListingMain,
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
                name: 'couponType',
                path: 'subscription/coupons/create/:couponType',
                component: CouponCreateUpdate,
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
                name: 'couponType',
                path: 'subscription/coupons/edit/:couponType/:couponId',
                component: CouponCreateUpdate,
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
                name: 'reports',
                path: 'communication/reports',
                component: ReportListingMain,
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
                name: 'invoices details',
                path: 'subscription/invoices/:billingNo',
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
                name: 'billing-details',
                path: 'company-details/:companyId/billing-details/:billingNo',
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
                name: 'company-application-details',
                path: 'company-details/:companyId/application/:appId',
                component: CbsApplicationDetailsVue ,
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
                path: 'support/ticket/:ticket_id/edit',
                component: CreateTicket,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['support']);
                }
            },
            {
                name: 'support-video',
                path: 'support/ticket/:ticket_id/video-room',
                component: VideoRoom,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['support']);
                }
            },
            {
                name: 'support-category',
                path: 'support/add-category',
                component: AddCategory,
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
            //Audit Trail
            {
                name: 'audit-trail',
                path: 'audit-trail',
                component: AuditLogs,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(
                        to,
                        from,
                        next,
                        ['company'],
                        ['audit-trail']
                    );
                }
            },
            {
                name: 'audit-trail-detail',
                path: 'audit-trail/logs/:id',
                component: AuditLogsDetails,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(
                        to,
                        from,
                        next,
                        ['company'],
                        ['audit-trail']
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

        //Taxation
        {
            name: 'taxation',
            path: 'product/taxation',
            component: ProductTaxationList,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['product']);
            }
        },
        {
            name: 'taxation-add',
            path: 'product/taxation/add',
            component: ProductTaxationEdit,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['product']);
            }
        },
        {
            name: 'taxation-edit',
            path: 'product/taxation/:reporting_hsn/edit',
            component: ProductTaxationEdit,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['product']);
            }
        },

        // Product Verification
        {
            name: 'verification',
            path: 'product/verification',
            component: ProductVerificationCompanyList,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['product']);
            }
        },
        {
            name: 'verification-edit',
            path: 'product/verification/edit/:id',
            component: ProductVerificationEdit,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['product']);
            }
        },
        {
            name: 'verification-edit',
            path: 'product/verification/:id/products/edit/:productId',
            component: ProductVerificationEdit,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['product']);
            }
        },
        {
            name: 'verification',
            path: 'product/verification/:companyId/products',
            component: ProductVerificationList,
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
        {
            name: 'pages-setting',
            path: 'settings/pages',
            component: PagesSettingsVue,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['settings']);
            }
        },
        {
            name: 'list-tags',
            path: 'settings/list-tags',
            component: TagsInjectVue,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['settings']);
            }
        },
        {
            name: 'create-tag',
            path: 'settings/create-tag',
            component: TagsCreateUpdateVue,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['settings']);
            }
        },
        {
            name: 'update-tag',
            path: 'settings/update-tag/:tagId',
            component: TagsCreateUpdateVue,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['settings']);
            }
        },
        {
            name: 'create-custom',
            path: 'settings/pages/:pagetype/create',
            component: CreateCustomVue,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['settings']);
            }
        },
        {
            name: 'navbar-setting',
            path: 'settings/navbar',
            component: NavbarSettingsVue,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['settings']);
            }
        },
        {
            name: 'edit-custom',
            path: 'settings/pages/:pagetype/:slug/edit',
            component: CreateCustomVue,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['settings']);
            }
        },
        {
            name: 'footer-setting',
            path: 'settings/footer',
            component: FooterSettingsVue,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['settings']);
            }
        },
        {
            name: 'pricing-banner',
            path: 'settings/pricing-banner',
            component: PricingBannerVue,
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

        // ========================== Orders ==========================
        {
            name: 'orders',
            path: 'orders/list',
            component: OrdersPage,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['product']);
            }
        },
        {
            name: 'application-order-details',
            path: '/order/:orderId/shipments',
            component: OrderDetails,
            beforeEnter: (to, from, next) => {
                return checkUserPermission(to, from, next, ['product']);
            },
            meta: {
                name: 'Application Order Details'
            }
        },
        // =============================================================

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
}];