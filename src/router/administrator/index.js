import AdministratorBaseViewVue from './../../pages/administrator/baseview.vue';
import PlanCreatorRoutes from './plan-creator';
import ExtensionRoutes from './extension';
import FinanceRoutes from './finance';
import CompanyListVue from './../../pages/company-admin/company-list.vue';
import OauthClientsVue from './../../pages/oauth-clients/index.vue';
import OauthClientsDetails from './../../pages/oauth-clients/clients/details.vue';
import CbsApplicationDetailsVue from './../../pages/company-admin/cbs-application-details.vue';
import CbsDetailVue from './../../pages/company-admin/cbs-detail.vue';
import BillingVue from './../../pages/company-admin/billing.vue';
import InvoiceListingMain from './../../pages/company-admin/invoice-listing-main.vue';
import CouponListingMain from './../../pages/company-admin/coupon-listing-main.vue';
import CouponCreateUpdate from './../../pages/company-admin/coupon-create-update.vue';
import EventSubscription from './../../pages/communication/event_subscription.vue';
import GlobalVariables from './../../pages/communication/global-variables.vue';
import Provider from './../../pages/communication/provider/listing.vue';
import ProviderDefault from './../../pages/communication/provider/set-default.vue';
import ProviderMain from './../../pages/communication/provider/provider-main.vue';
import SmsTemplateMain from './../../pages/communication/sms/sms-templates.vue';
import SmsTemplateForm from './../../pages/communication/sms/sms-template-form.vue';
import EmailTemplateForm from './../../pages/communication/email/email-template-form.vue';
import EmailTemplateMain from './../../pages/communication/email/email-templates.vue';
import ReportListingMain from './../../pages/communication/reports.vue';
import UserManagementVue from './../../pages/super-user/user-access.vue';
import AddSuperUserVue from './../../pages/super-user/add-user.vue';
import Tickets from './../../pages/tickets/index.vue';
import CreateTicket from './../../pages/tickets/create-ticket.vue';
import VideoRoom from './../../pages/tickets/video-call/video-room.vue';
import AddCategory from '../../pages/tickets/configuration/add-category.vue';
import Configuration from './../../pages/tickets/configuration/configuration.vue';
import kaptureIndex from './../../pages/tickets/configuration/kapture-integration/index.vue';
import freshdeskIndex from './../../pages/tickets/configuration/freshdesk-integration/index.vue';
import fyndPlatformIndex from './../../pages/tickets/configuration/fynd-platform-integration/index.vue';
import freshchatVue from '@/pages/tickets/configuration/freshchat-integration/index.vue'
import SettingsVue from './../../pages/settings';
import SettingsPartnerVue from './../../pages/settings/partner.vue';
import BasicDetailSettingsVue from './../../pages/settings/basic-details.vue';
import FeaturesSettingsVue from './../../pages/settings/features.vue';
import PagesSettingsVue from './../../pages/settings/custompage.vue';
import TagsInjectVue from './../../pages/settings/tags-inject.vue';
import TagsCreateUpdateVue from '../../pages/settings/tags-create-update.vue';
import CreateCustomVue from './../../pages/settings/page-editor/create.vue';
import NavbarSettingsVue from './../../pages/settings/navbar';
import SellerPanelSettingsVue from './../../pages/settings/seller-panel.vue';
import FooterSettingsVue from './../../pages/settings/footer';
import PricingBannerVue from './../../pages/settings/pricing_banner.vue';
import ExtensionsListingVue from './../../pages/settings/extensions-listing/index.vue';
import SupportConfiguration from './../../pages/settings/support-configuration/index.vue'
import CategoryList from '@/pages/product/category/list';
import BusinessRegistration from './../../pages/settings/onboarding/business-registration.vue';
import BusinessDetails from './../../pages/settings/onboarding/business-details.vue';
import Brands from './../../pages/settings/onboarding/brands.vue';
import ProductConfig from './../../pages/settings/onboarding/product.vue';
import LocationConfig from './../../pages/settings/onboarding/location.vue';
import UpdateMarketplace from '../../pages/settings/onboarding/update-marketplace.vue';
import ListMarketplace from './../../pages/settings/onboarding/list-marketplace.vue';
import AuditLogs from './../../pages/audit-trail/index.vue';
import AuditLogsDetails from './../../pages/audit-trail/log-detail.vue';
import AddEditDri from './../../pages/company-admin/add-edit-dri.vue';
import ListDepartment from './../../pages/catalogue/list-department.vue';
import CreateUpdateDepartment from './../../pages/catalogue/create-update-department.vue';
import ListVariants from './../../pages/product/variants/list.vue';
import CreateUpdateVariant from '@/pages/product/variants/edit.vue';
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
import ListWebhooks from './../../pages/webhook/list_webhooks.vue';
import CreateWebhooks from './../../pages/webhook/index.vue';
import EditWebhooks from './../../pages/webhook/edit_webhooks.vue';
import WebhookReport from './../../pages/webhook/webhook_report.vue';
import CreditDebitHome from './../../pages/finance/credit-debit-note/index.vue';
import CreditDebitNote from './../../pages/finance/credit-debit-note/create-cn-dn.vue';
import BulkUpload from './../../pages/finance/bulk-upload/bulk-upload.vue';
import UploadHistoryFin from '@/pages/finance/bulk-upload/upload-history/index.vue';
import SettlementRule from '@/pages/finance/settlement-rule/index.vue';
import CreateRule from '@/pages/finance/settlement-rule/create-rule/index.vue';
import ReportHistory from './../../pages/webhook/report-history/components/report-history.vue'
import Invoices from './../../pages/finance/invoice/index.vue';

import RMAPage from '@/pages/rma';
import RMARulesListing from '@/pages/rma/rules-listing';
import RMASetup from '@/pages/rma/rma-setup.vue';
import Rules from '@/pages/rma/rules';
const OrdersNinjaPage = () => import('@/pages/orders/ninja')
import PackagingHome from '@/pages/packaging/packaging-home.vue'
import CategoryConfig from '@/pages/packaging/category-config.vue'
import PackagingCreate from '@/pages/packaging/create-packaging.vue'
import CreateCategory from '@/pages/packaging/create-category-home.vue'
import BulkExport from '@/pages/product/bulk/export/bulk-export';
import BulkImport from '@/pages/product/bulk/import/bulk-import';
import UploadHistory from '@/pages/product/bulk/import/upload-history.vue';
import PaymentGateways from '../../pages/payments/list-gateways.vue';
import PaymentMode from '../../pages/payments/payment-mode.vue';

/** OMSv2.1 */
const Orders = () => import('@/pages/oms/index.vue');
const OrderDetailsV2 = () => import('@/pages/oms/order-details/index.vue');
const OrdersBulk = () => import('@/pages/oms/bulk-actions/index.vue');
const OrdersManifest = () => import('@/pages/oms/manifest/index.vue');
const OrdersManifestDetails = () => import('@/pages/oms/manifest/manifest-details/manifest-details.vue');
const OrdersManifestGenerate = () => import('@/pages/oms/manifest/manifest-generate.vue');
/** OMSv2.1 --END */

import { authenticatedUser, checkUserPermission } from './../guards';

export default [
    {
        path: '/administrator/',
        beforeEnter: authenticatedUser,
        component: AdministratorBaseViewVue,
        children: [
            ...PlanCreatorRoutes,
            ...ExtensionRoutes,
            ...FinanceRoutes,
            {
                name: 'company-list',
                path: 'company-list',
                component: CompanyListVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['company']);
                }
            },
            {
                name: 'webhook',
                path: 'webhook',
                component: ListWebhooks,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['webhook']);
                },
            },
            {
                name: 'create-webhook',
                path: 'create-webhook',
                component: CreateWebhooks,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['webhook']);
                }
            },
            {
                name: 'edit-webhook',
                path: 'edit-webhook/:id',
                component: EditWebhooks,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['webhook']);
                }
            },
            {
                name: 'report-history',
                path: 'report-history',
                component: ReportHistory,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }

            },
            {
                name: 'report-history',
                path: 'report-history/:subscriberId',
                component: ReportHistory,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }

            },
            {
                name: 'webhook-report',
                path: 'webhook-report',
                component: WebhookReport,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['webhook']);
                }
            },
            {
                name: 'webhook-report',
                path: 'webhook-report/:subscriberId',
                component: WebhookReport,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
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
                    return checkUserPermission(to, from, next, ['plans']);
                }
            },
            {
                name: 'coupons',
                path: 'subscription/coupons',
                component: CouponListingMain,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['plans']);
                }
            },
            {
                name: 'couponType',
                path: 'subscription/coupons/create/:couponType',
                component: CouponCreateUpdate,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['plans']);
                }
            },
            {
                name: 'couponType',
                path: 'subscription/coupons/edit/:couponType/:couponId',
                component: CouponCreateUpdate,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['plans']);
                }
            },
            // Payments
            {
                name: 'payment-gateway',
                path: 'payments/gateways',
                component: PaymentGateways,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['payments']);
                }
            },
            {
                name: 'mode-of-payment-gateway',
                path: 'payments/gateways/edit/:id',
                component: PaymentMode,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['payments']);
                },
                meta: {
                    name: 'Edit Payment Gateway',
                    action: 'edit'
                }
            },
            {
                name: 'mode-of-payment',
                path: 'payments/mop',
                component: PaymentMode,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['payments']);
                },
                meta: {
                    name: 'Edit Payment Mode',
                }
            },
            {
                name: 'reports',
                path: 'communication/reports',
                component: ReportListingMain,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'communication'
                    ]);
                }
            },
            {
                name: 'events',
                path: 'communication/events',
                component: EventSubscription,
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
                name: 'variables',
                path: 'communication/global-variables',
                component: GlobalVariables,
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
                name: 'providerList',
                path: 'communication/provider',
                component: Provider,
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
                name: 'providerDefault',
                path: 'communication/provider/default',
                component: ProviderDefault,
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
                name: 'providerMain',
                path: 'communication/provider/:providerType/:mode',
                component: ProviderMain,
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
                name: 'providerMain',
                path: 'communication/provider/:providerType/:mode/:providerId',
                component: ProviderMain,
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
                name: 'smstemplateMain',
                path: 'communication/sms/templates',
                component: SmsTemplateMain,
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
                name: 'smstemplateCreate',
                path: 'communication/sms/templates/create',
                component: SmsTemplateForm,
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
                name: 'smstemplateCreate',
                path: 'communication/sms/templates/edit/:templateId',
                component: SmsTemplateForm,
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
                name: 'emailtemplateMain',
                path: 'communication/email/templates',
                component: EmailTemplateMain,
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
                name: 'emailtemplateCreate',
                path: 'communication/email/templates/create',
                component: EmailTemplateForm,
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
                name: 'emailtemplateEdit',
                path: 'communication/email/templates/edit/:templateId',
                component: EmailTemplateForm,
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
                    return checkUserPermission(to, from, next, ['plans']);
                }
            },
            {
                name: 'billing-details',
                path: 'company-details/:companyId/billing-details/:billingNo',
                component: BillingVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['company']);
                }
            },
            {
                name: 'company-application-details',
                path: 'company-details/:companyId/application/:appId',
                component: CbsApplicationDetailsVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['company']);
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
                path: 'support/ticket-listing',
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
                name: 'system-category',
                path: 'support/configuration/category/default',
                component: AddCategory,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['support']);
                }
            },
            {
                name: 'support-configuration',
                path: 'support/configuration',
                component: Configuration,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['support']);
                }
            },
            {
                name: 'support-configuration-kapture',
                path: 'support/configuration/integration/kapture',
                component: kaptureIndex,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['support']);
                }
            },
            {
                name: 'support-configuration-freshdesk',
                path: 'support/configuration/integration/freshdesk',
                component: freshdeskIndex,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['support']);
                }
            },
            {
                name: 'support-configuration-default',
                path: 'support/configuration/integration/default',
                component: fyndPlatformIndex,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['support']);
                }
            },
            {
                name: 'support-configuration-freshchat',
                path: 'support/configuration/integration/freshchat',
                component: freshchatVue,
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
                    return checkUserPermission(to, from, next, ['audit-trail']);
                }
            },
            {
                name: 'audit-trail-detail',
                path: 'audit-trail/logs/:id',
                component: AuditLogsDetails,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['audit-trail']);
                }
            },
            //Catalog
            {
                name: 'department',
                path: 'product/department',
                component: ListDepartment,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'create',
                path: 'product/department/create',
                component: CreateUpdateDepartment,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'edit-department',
                path: 'product/department/edit/:deptId',
                component: CreateUpdateDepartment,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'variants',
                path: 'product/variants',
                component: ListVariants,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'create-variant',
                path: 'product/variants/create',
                component: CreateUpdateVariant,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
            },
            {
                name: 'edit-variant',
                path: 'product/variants/edit/:uid',
                component: CreateUpdateVariant,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['product']);
                }
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
             //bulk import export
             {
                name: 'export',
                path: 'product/:type/export',
                component: BulkExport,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(
                        to,
                        from,
                        next,
                        ['product']
                    );
                }
            },
            {
                name: 'import',
                path: 'product/:type/import',
                component: BulkImport,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(
                        to,
                        from,
                        next,
                        ['product']
                    );
                }
            },
            {
                name: 'upload-history',
                path: 'product/:type/import/upload-history',
                component: UploadHistory,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(
                        to,
                        from,
                        next,
                        ['product']
                    );
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
                path: 'settings/platform',
                component: SettingsVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'basic-details-setting',
                path: 'settings/platform/basic',
                component: BasicDetailSettingsVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'features-setting',
                path: 'settings/platform/features',
                component: FeaturesSettingsVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'pages-setting',
                path: 'settings/platform/pages',
                component: PagesSettingsVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'list-tags',
                path: 'settings/platform/list-tags',
                component: TagsInjectVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'create-tag',
                path: 'settings/platform/create-tag',
                component: TagsCreateUpdateVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'update-tag',
                path: 'settings/platform/update-tag/:tagId',
                component: TagsCreateUpdateVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'create-custom',
                path: 'settings/platform/pages/:pagetype/create',
                component: CreateCustomVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'navbar-setting',
                path: 'settings/platform/navbar',
                component: NavbarSettingsVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'seller-panel',
                path: 'settings/platform/seller-panel',
                component: SellerPanelSettingsVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'edit-custom',
                path: 'settings/platform/pages/:pagetype/:slug/edit',
                component: CreateCustomVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'footer-setting',
                path: 'settings/platform/footer',
                component: FooterSettingsVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'pricing-banner',
                path: 'settings/platform/pricing-banner',
                component: PricingBannerVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            /* changes from jiomarket: cbs configuration */
            {
                name: 'business-registration',
                path: 'settings/platform/business-registration',
                component: BusinessRegistration,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },

            {
                name: 'business-details',
                path: 'settings/platform/business-details',
                component: BusinessDetails,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'brand-settings',
                path: 'settings/platform/brand',
                component: Brands,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'product-settings',
                path: 'settings/platform/product',
                component: ProductConfig,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            
            {
                name: 'location',
                path: 'settings/platform/location',
                component: LocationConfig,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'add-marketplace',
                path: 'settings/platform/marketplace/add',
                component: UpdateMarketplace,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'list-marketplace',
                path: 'settings/platform/marketplace/list',
                component: ListMarketplace,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'edit-marketplace',
                path: 'settings/platform/marketplace/edit/:applicationId',
                component: UpdateMarketplace,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'partners',
                path: 'settings/partners',
                component: SettingsPartnerVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'rma-global-rule-setup',
                path: 'orders/rma/rules/global/setup',
                component: RMASetup,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['order']);
                }
            },
            {
                name: 'rma-global-rule-edit',
                path: 'orders/rma/rules/global/edit',
                component: RMASetup,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['order']);
                }
            },
            {
                name: 'rma-custom-rule-setup',
                path: 'orders/rma/rules/custom/:sales_channel/setup',
                component: RMASetup,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['order']);
                }
            },
            {
                name: 'rma-custom-rule-edit',
                path: 'orders/rma/rules/custom/:sales_channel/edit',
                component: RMASetup,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['order']);
                }
            },
            {
                name: 'rma',
                path: 'orders/rma',
                component: RMAPage,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['order']);
                },
                children: [
                    {
                        name: 'rma-rules',
                        path: 'rules',
                        components: { 'rma-view': Rules },
                        beforeEnter: (to, from, next) => {
                            return checkUserPermission(to, from, next, [
                                'order'
                            ]);
                        }
                    },
                    {
                        name: 'rma-global-rules',
                        path: 'rules/global',
                        components: { 'rma-view': RMARulesListing },
                        beforeEnter: (to, from, next) => {
                            return checkUserPermission(to, from, next, [
                                'order'
                            ]);
                        }
                    },
                    {
                        name: 'rma-global-channel-rules',
                        path: 'rules/global/:sales_channel',
                        components: { 'rma-view': RMARulesListing },
                        beforeEnter: (to, from, next) => {
                            return checkUserPermission(to, from, next, [
                                'order'
                            ]);
                        }
                    },
                    {
                        name: 'rma-custom-channel-rules',
                        path: 'rules/custom/:sales_channel',
                        components: { 'rma-view': RMARulesListing },
                        beforeEnter: (to, from, next) => {
                            return checkUserPermission(to, from, next, [
                                'order'
                            ]);
                        }
                    }
                ]
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
                name: 'orders-hyperlocal-tracking',
                path: 'orders/hyperlocal-tracking',
                component: OrdersNinjaPage,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['order']);
                }
            },
            // =============================================================
            /** OMSv2.1 */
            {
                name: 'company-orders-v2',
                path: 'orders-list/', 
                permissions: ['order'],
                beforeEnter: (to, from, next) => {
                    checkUserPermission(to, from, next, 'company', ['order']);
                },
                component: Orders,
                meta: {
                    name: 'Company Orders'
                }
            },
            {
                name: 'company-order-details-v2',
                path: 'orders/:orderId/details',
                permissions: ['order'],
                beforeEnter: (to, from, next) => {
                    checkUserPermission(to, from, next, 'company', ['order']);
                },
                component: OrderDetailsV2,
                meta: {
                    name: 'Company Order Details'
                }
            },
            {
                name: 'company-order-bulk-v2',
                path: 'orders-bulk',
                permissions: ['order'],
                beforeEnter: (to, from, next) => {
                    checkUserPermission(to, from, next, 'company', ['order']);
                    // checkOrderRole(to, from, next);
                },
                component: OrdersBulk,
                meta: {
                    name: 'Company Order Bulk Actions'
                }
            },
            {
                name: 'company-order-manifest',
                path: 'orders-manifest/',
                permissions: ['order'],
                beforeEnter: (to, from, next) => {
                    checkUserPermission(to, from, next, 'company', ['order']);
                    // checkOrderRole(to, from, next);
                },
                component: OrdersManifest,
                meta: {
                    name: 'Company Order manifest'
                }
            },
            {
                name: 'company-manifest-detail',
                path: 'orders-manifest/:manifestId/',  //need at aadd a storng 
                permissions: ['order'],
                beforeEnter: (to, from, next) => {
                    checkUserPermission(to, from, next, 'company', ['order']);
                    // checkOrderRole(to, from, next);
                },
                component: OrdersManifestDetails,
                meta: {
                    name: 'Manifest Detail'
                }
            },
            {
                name: 'company-manifest-generate',
                path: 'orders-manifest/generate/',
                permissions: ['order'],
                beforeEnter: (to, from, next) => {
                    checkUserPermission(to, from, next, 'company', ['order']);
                    // checkOrderRole(to, from, next);
                },
                component: OrdersManifestGenerate,
                meta: {
                    name: 'Company Manifest Grenerate'
                }
            },

            // =============================================================

            {
                name: 'integrations-list',
                path: 'integrations/list',
                component: IntegrationsListVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['integration']);
                }
            },
            {
                name: 'integration-edit',
                path: 'integration/edit/:integrationId',
                component: IntegrationsCreateVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['integration']);
                }
            },
            {
                name: 'integration-create',
                path: 'integration/create',
                component: IntegrationsCreateVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['integration']);
                }
            },
            /**
             * packaging related routes
             */
            {
                name: 'packaging-home',
                path: 'packaging/items',
                component: PackagingHome,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'admin-access'
                    ]);
                }
            },
            {
                name: 'packaging-create',
                path: 'packaging/create',
                alias: 'packaging/edit',
                component: PackagingCreate,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'admin-access'
                    ]);
                }
            },
            {
                name: 'category-config',
                path: 'packaging/category-configuration',
                component: CategoryConfig,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'admin-access'
                    ]);
                }
            },
            /**
             * Finance Upload Portal Routes
             */
            {
                name: 'bulk-upload',
                path: 'finance/bulk-upload',
                component: BulkUpload,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'finance'
                    ]);
                }
            },
            {
                name: 'upload-history-fin',
                path: 'finance/bulk-upload/upload-history',
                component: UploadHistoryFin,               
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'finance'
                    ]);
                }
            },
            {             
                name: 'invoices',
                path: 'finance/invoices',
                component: Invoices,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'finance'
                    ]);
                }
            },
            {
                name: 'settlement-rule',
                path: 'finance/settlement-rule',
                component: SettlementRule,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'finance'
                    ]);
                }
            },
            {
                name: 'create-rule',
                path: 'finance/settlement-rule/create-rule/:ruleId?/:preview?',
                component: CreateRule,               
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'finance'
                    ]);
                }
            },
            {
                name: 'category-config-create',
                path: 'packaging/category-configuration/create',
                alias: 'packaging/category-configuration/edit',
                component: CreateCategory,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'admin-access'
                    ]);
                }
            },
            {
                name: 'oauth-clients',
                path: 'oauthclient',
                component: OauthClientsVue,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'create-oauth-client',
                path: 'oauthclient/create',
                component: OauthClientsDetails,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            {
                name: 'edit-oauth-client',
                path: 'oauthclient/edit/:client_id',
                component: OauthClientsDetails,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            },
            //======================== CN DN ========================
            {
                name: 'credit-debit-note',
                path: 'finance/credit-debit-note',
                component: CreditDebitHome,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'finance'
                    ]);
                },
            },
            {
                name: 'credit-note',
                path: 'finance/credit-debit-note/credit-note/:noteType/:noteId?/:preview?/:isApprover?/:documentNo?',
                component: CreditDebitNote,
                props: true,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, [
                        'finance'
                    ]);
                } 
            },
            {
                name: 'Partners-Support-Configuration',
                path: '/administrator/settings/partners/contact-configuration',
                component: SupportConfiguration,
                beforeEnter: (to, from, next) => {
                    return checkUserPermission(to, from, next, ['settings']);
                }
            }
        ]
    },
    {
        name: 'extension-listing',
        path: '/administrator/settings/partners/extensions-listing',
        component: ExtensionsListingVue,
        beforeEnter: (to, from, next) => {
            return checkUserPermission(to, from, next, ['settings']);
        }
    }

];
