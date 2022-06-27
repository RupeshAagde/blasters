import urlJoin from 'url-join';
import { isBrowser, isNode } from 'browser-or-node';
import root from 'window-or-global';

const getCompInfo = () => 1;

const envVars = root.env || {};

if (root && root.process && root.process.env && root.process.env.NODE_ENV == 'test') {
    envVars['BROWSER_CONFIG'] = root.process.env;
}

let SLINGSHOT_PUBLIC_URL = isNode ?
    envVars.BROWSER_CONFIG.SLINGSHOT_PUBLIC_URL :
    envVars.SLINGSHOT_PUBLIC_URL;

const SILVERBOLT_MAIN_URL = isNode ?
    envVars.BROWSER_CONFIG.SILVERBOLT_MAIN_URL :
    envVars.SILVERBOLT_MAIN_URL;

const WHEELJACK_ACPR_URL = isNode ?
    envVars.BROWSER_CONFIG.WHEELJACK_ACPR_URL :
    envVars.WHEELJACK_ACPR_URL;

const SILVERBOLT_ACAT_URL = isNode ?
    envVars.BROWSER_CONFIG.SILVERBOLT_ACAT_URL :
    envVars.SILVERBOLT_ACAT_URL;

const WHEELJACK_PNLCPR_URL = isNode ?
    envVars.BROWSER_CONFIG.WHEELJACK_PNLCPR_URL :
    envVars.WHEELJACK_PNLCPR_URL;

const SKYWARP_PNL_URL = isNode ?
    envVars.BROWSER_CONFIG.SKYWARP_PNL_URL :
    envVars.SKYWARP_PNL_URL;

const UNICRON_BASE = isNode ?
    envVars.BROWSER_CONFIG.UNICRON_ADMIN_SVC :
    envVars.UNICRON_ADMIN_URL;
const UNICRON_PUBLIC_URL = isNode ?
    envVars.BROWSER_CONFIG.UNICRON_PUBLIC_SVC :
    envVars.UNICRON_PUBLIC_URL;
    const DAYTRADER_BASE = isNode
    ? envVars.BROWSER_CONFIG.DAYTRADER_MAIN_SVC
    : envVars.DAYTRADER_MAIN_URL;

const PLATFORM_LEADS_BASE = isNode ?
    envVars.BROWSER_CONFIG.HIGHBROW_ADMIN_SVC :
    envVars.HIGHBROW_ADMIN_URL;

const ADMIN_ORDERS_BASE = isNode ?
    envVars.BROWSER_CONFIG.APEFACE_ADMIN_URL :
    envVars.APEFACE_ADMIN_URL;

const INTERNAL_SETTINGS = isNode ?
    envVars.BROWSER_CONFIG.ULTRAMAGNUS_PUBLIC_SVC :
    envVars.ULTRAMAGNUS_PUBLIC_URL;

const INTERNAL_SETTINGS_ADMIN = isNode ?
    envVars.BROWSER_CONFIG.ULTRAMAGNUS_ADMIN_SVC :
    envVars.ULTRAMAGNUS_ADMIN_URL;

const PLATFORM_ASSETS_ADMIN = isNode ?
    envVars.BROWSER_CONFIG.GRINDOR_ADMIN_URL :
    envVars.GRINDOR_ADMIN_URL;

const SLINGSHOT_ADMIN_URL = isNode ?
    envVars.BROWSER_CONFIG.SLINGSHOT_ADMIN_URL :
    envVars.SLINGSHOT_ADMIN_URL;

const MARKETPLACES_ADMIN_URL = isNode ?
    envVars.BROWSER_CONFIG.MARKETPLACES_ADMIN_URL :
    envVars.MARKETPLACES_ADMIN_URL;

const SKYWARP_PNL_BASE = isNode ?
    envVars.BROWSER_CONFIG.SKYWARP_PNL_URL :
    envVars.SKYWARP_PNL_URL;

const SKYWARP_ADMIN_BASE = isNode ?
    envVars.BROWSER_CONFIG.SKYWARP_ADMIN_URL :
    envVars.SKYWARP_ADMIN_URL;

const GRINGOTTS_ADMIN_URL = isNode ?
    envVars.BROWSER_CONFIG.GRINGOTTS_ADMIN_URL :
    envVars.GRINGOTTS_ADMIN_URL;

const COMMUNICATION_BASE_URL = isNode ?
    envVars.BROWSER_CONFIG.POINTBLANK_ADMIN_URL :
    envVars.POINTBLANK_ADMIN_URL;

const PINPOINTER_ADMIN_URL = isNode ?
    envVars.BROWSER_CONFIG.PINPOINTER_ADMIN_URL :
    envVars.PINPOINTER_ADMIN_URL;


const ADMIN_ORDER_BASE = isNode ?
    envVars.BROWSER_CONFIG.APEFACE_ADMIN_URL :
    envVars.APEFACE_ADMIN_URL;

const URLS = {
    // User Profile API's
    USER_PROFILE: () => {
        return urlJoin(SKYWARP_PNL_BASE, '/v1.0/profile');
    },
    //fetch attributes
    FETCH_ATTRIBUTE: () => {
        return urlJoin(SILVERBOLT_ACAT_URL, '/v1.0/product-attributes/');
    },
    //fetch all hsn codes
    FETCH_HSNCODES: () => {
        return urlJoin(SILVERBOLT_ACAT_URL, '/v2.0/hsn/');
    },
    //fetch single hsn code
    FETCH_SINGLEHSN: (reporting_hsn) => {
        return urlJoin(SILVERBOLT_ACAT_URL, `/v2.0/hsn/${reporting_hsn}`);
    },

    //Create Hsn codes
    HSN_CODE_LIST_CREATE: () => {
        console.log(SILVERBOLT_ACAT_URL)
        return urlJoin(SILVERBOLT_ACAT_URL, '/v2.0/hsn/');
    },
    HSN_CODE_RETRIVE_UPDATE_DELETE: (reporting_hsn) => {
        console.log(SILVERBOLT_ACAT_URL)
        return urlJoin(SILVERBOLT_ACAT_URL, `/v2.0/hsn/${reporting_hsn}`);
    },
    //fetchVariant
    FETCH_VARIANT: (uid) => {
        if (uid) {
            return urlJoin(SILVERBOLT_ACAT_URL, `/v1.0/variants/${uid}`);
        }
        return urlJoin(SILVERBOLT_ACAT_URL, '/v1.0/variants/');
    },
    //fetchDeparment
    FETCH_DEPARTMENT: (uid) => {
        if (uid) {
            return urlJoin(SILVERBOLT_ACAT_URL, `/v1.0/departments/${uid}`);
        }
        return urlJoin(SILVERBOLT_ACAT_URL, '/v1.0/departments');
    },
    //Company Metrics
    FETCH_METRICS: (params) => {
        return urlJoin(WHEELJACK_ACPR_URL, `/v1.0/company/${params.company}/metrics/`);
    },

    //search dri
    SEARCH_DRI: () => {
        return urlJoin(SKYWARP_PNL_URL, '/v1.0/users/search/');
    },

    //fetch dri
    FETCH_DRI: (params) => {
        return urlJoin(
            WHEELJACK_ACPR_URL,
            `/v1.0/company/${params.company_id}/poc/`
        );
    },

    FETCH_ONE_DRI: (params) => {
        return urlJoin(
            WHEELJACK_ACPR_URL,
            `/v1.0/company/${params.company_id}/poc/${params.uid}`
        );
    },

    // fetch applications
    FETCH_APPLICATIONS: (uid) => {
        return urlJoin(SLINGSHOT_ADMIN_URL, `/v1.0/company/${uid}/application`);
    },
    GET_APPLICATIONS: (appId = '') => {
        return urlJoin(SLINGSHOT_ADMIN_URL, `/v1.0/application/${appId}`);
    },

    //archive unarchive sales channel
    ACTION_APPLICATIONS: (uid, appId) => {
        return urlJoin(
            SLINGSHOT_ADMIN_URL,
            `/v1.0/company/${uid}/application/${appId}`
        );
    },

    // validate user
    VALIDATE_USER: () => {
        return urlJoin(SKYWARP_ADMIN_BASE, '/v1.0/admin/staff/current/access');
    },
    USER_LOGOUT: () => {
        return urlJoin(SKYWARP_PNL_BASE, '/v1.0/auth/logout');
    },
    ADMIN_PERMISSIONS: () => {
        return urlJoin(SKYWARP_ADMIN_BASE, '/v1.0/admin/permissions');
    },
    //company details
    GET_COMPANY_LIST: () => {
        return urlJoin(
            WHEELJACK_ACPR_URL,
            '/v1.0/companies/'
        );
    },
    GET_DEPLOYMENT_MAPPING: () => {
        return urlJoin(
            SLINGSHOT_ADMIN_URL,
            '/v1.0/deployment_mapping/'
        );
    },
    GET_DEPLOYMENT_LIST: () => {
        return urlJoin(
            SLINGSHOT_ADMIN_URL,
            '/v1.0/deployment_mapping/repeat_servers'
        );
    },
    CREATE_NEW_DEPLOYMENT_MAPPING: () => {
        return urlJoin(
            SLINGSHOT_ADMIN_URL,
            '/v1.0/deployment_mapping/'
        );
    },
        FETCH_DAYTRADER_FILTERS: () => {
        return urlJoin(DAYTRADER_BASE, 'api/v1/get-data');
    },
    DELETE_DEPLOYMENT_MAPPING_BY_ID: (id) => {
        return urlJoin(
            SLINGSHOT_ADMIN_URL,
            `/v1.0/deployment_mapping/${id}`
        );
    },
    VERIFY_COMPANY: (query_param) => {
        return urlJoin(
            WHEELJACK_ACPR_URL,
            `/v1.0/company/${query_param.uid}/verify`
        )
    },
    BRAND_ADMIN_ACTION: (params) => {
        return urlJoin(
            WHEELJACK_ACPR_URL,
            `/v1.0/company/${params.company}/brand/${params.brand}/verify/`
        );
    },
    STORE_ADMIN_ACTION: (params) => {
        return urlJoin(
            WHEELJACK_ACPR_URL,
            `/v1.0/company/${params.company}/location/${params.uid}/verify/`
        );
    },
    GET_COMPANY_BRANDS: (params) => {
        return urlJoin(WHEELJACK_ACPR_URL, `/v1.0/company/${params.company_id}/company-brand/`);
    },
    GET_CHOICE_TYPES: () => {
        return urlJoin(WHEELJACK_PNLCPR_URL, '/v1.0/choices/');
    },
    COMPANY_STORES: (params) => {
        return urlJoin(WHEELJACK_ACPR_URL, `/v1.0/company/${params.company_id}/location`);
    },
    COMPANY_PROFILE: (params) => {
        return urlJoin(WHEELJACK_ACPR_URL, `/v1.0/company/${params.uid}`);
    },
    ATTRIBUTES_MASTER: (slug = '') => {
        return urlJoin(SILVERBOLT_ACAT_URL, '/v1.0/product-attributes', slug);
    },
    PRODUCT_TEMPLATES: (slug = '') => {
        return urlJoin(SILVERBOLT_ACAT_URL, '/v1.0/products/templates', slug);
    },
    PRODUCT_TEMPLATE_DOWNLOAD: (slug = '', company_id = 1) => {
        return urlJoin(
            SILVERBOLT_ACAT_URL,
            `/v1.0/products/${company_id}/templates/${slug}/download/?company_id=1&set=false&type=excel`
        );
    },
    ATTRIBUTE_GROUPS: (slug = '') => {
        return urlJoin(
            SILVERBOLT_ACAT_URL,
            '/v1.0/product-attributes/groups',
            slug
        );
    },
    ATTRIBUTE_SHUFFLE: (entity) => {
        return urlJoin(
            SILVERBOLT_ACAT_URL,
            `/v1.0/product-attributes/${entity}/shuffle`
        );
    },
    ATTRIBUTE_GROUPS_SHUFFLE: (entity) => {
        return urlJoin(
            SILVERBOLT_ACAT_URL,
            `/v1.0/product-attributes/groups/${entity}/shuffle`
        );
    },
    DEPARTMENT: () => {
        return urlJoin(SILVERBOLT_ACAT_URL, '/v1.0/departments');
    },
    CATEGORY_v2: (id = '') => {
        return urlJoin(SILVERBOLT_ACAT_URL, '/v1.0/category', id);
    },
    UNITS: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/units');
    },

    //SKYWRAP
    LIST_USERS: (userId = '') => {
        return urlJoin(SKYWARP_ADMIN_BASE, `/v1.0/admin/staff/${userId}`);
    },
    CHECK_USER: () => {
        return urlJoin(SKYWARP_ADMIN_BASE, '/v1.0/admin/user-info/search')
    },

    DELETE_USERS: (uid) => {
        return urlJoin(SKYWARP_ADMIN_BASE, `/v1.0/admin/staff/${uid}`);
    },
    ADD_USERS: (uid) => {
        return urlJoin(SKYWARP_ADMIN_BASE, '/v1.0/admin/staff/');
    },

    // Search
    SEARCH_USER: () => {
        return urlJoin(SKYWARP_ADMIN_BASE, '/v1.0/admin/user-info/search');
    },

    LOCATIONS: () => {
        return urlJoin(SLINGSHOT_PUBLIC_URL, `v1.0/location`);
    },

    // Unicron/Daytrader - Plan creator
    FETCH_PLANS_LIST: (planId = '') => {
        return urlJoin(UNICRON_BASE, `v1.0/plan/${planId}`);
    },
    FETCH_SINGLE_PLAN: (planId) => {
        return urlJoin(UNICRON_BASE, `v1.0/plan-editor/${planId}`);
    },
    FETCH_SUBSCRIPTION_COMPONENTS: () => {
        return urlJoin(UNICRON_BASE, 'v1.0/component');
    },
    FETCH_COMPONENT_PRICES: (componentId) => {
        return urlJoin(UNICRON_BASE, `v1.0//component/${componentId}/prices`);
    },
    FETCH_PLAN_COMPONENTS: () => {
        return urlJoin(UNICRON_BASE, 'v1.0//plan-component');
    },
    FETCH_COMPONENT_WITH_PRICES: () => {
        return urlJoin(UNICRON_BASE, 'v1.0//component-prices');
    },
    FETCH_DAYTRADER_COMPONENT: () => {
        return urlJoin(UNICRON_BASE, 'v1.0/daytrader-component');
    },
    CURRENT_SUBSCRIPTION_DETAILS: () => {
        return urlJoin(UNICRON_BASE, 'v1.0/subscription/current');
    },
    SUBSCRIPTION_DAYTRADER_RULES: (subscriptionId) => {
        return urlJoin(
            UNICRON_BASE,
            `v1.0/daytrader-rule/subscription/${subscriptionId}`
        );
    },
    PLAN_DETAILS: (planId) => {
        return urlJoin(UNICRON_BASE, `v1.0/plan/details/${planId}`);
    },
    AGREEMENT_PDF: () => {
        return urlJoin(UNICRON_BASE, `v1.0/plan-pdf/generate-pdf/`);
    },
    FETCH_INVOICE_LISTING: () => {
        return urlJoin(UNICRON_BASE, `/v1.0/company-invoice/listing`)
    },
    EXPORT_INVOICE_LISTING: () => {
        return urlJoin(UNICRON_BASE, `/v1.0/company-invoice/export`)
    },
    CHARGE_INVOICE: () => {
        return urlJoin(UNICRON_BASE, `/v1.0/company-invoice/charge-invoice`);
    },
    FETCH_INVOICE_DETAILS: (id) => {
        return urlJoin(UNICRON_BASE, `/v1.0/company-invoice/${id}`);
    },
    UPDATE_OFFLINE_PAYMENT: (id) => {
        return urlJoin(UNICRON_BASE, `/v1.0/company-invoice/mark-offline-paid/${id}`);
    },
    BULK_UPDATE_OFFLINE_PAYMENT: () => {
        return urlJoin(UNICRON_BASE, `/v1.0/company-invoice/bulk/update`);
    },
    VOID_INVOICE: () => {
        return urlJoin(UNICRON_BASE, `/v1.0/company-invoice/void-invoice`);
    },
    SUBSCRIPTION_DOWNLOAD_INVOICE: (id, company_id = '') => {
        return urlJoin(UNICRON_BASE, `/v1.0/company-invoice`, id, 'pdf');
    },
    SUBSCRIPTION_DOWNLOAD_INVOICE_SIGNED: (params) => {
        return urlJoin(UNICRON_BASE) + params.path;
    },

    SUBSCRIPTION_GET_AVAILABLE_PLANS_DETAILED: () => {
        return urlJoin(UNICRON_PUBLIC_URL, '/v1.0/plan/detailed-list');
    },
    SUBSCRIPTION_GET_ACTIVE_PLAN: (company_id) => {
        return urlJoin(UNICRON_BASE, `/v1.0/company/${company_id}/subscription/current`);
    },
    GET_CUSTOMER_DETAILS: (company_id) => {
        return urlJoin(UNICRON_BASE, `/v1.0/company/${company_id}/customer`);
    },
    CREDIT_ADJUSTMENT: (company_id) => {
        return urlJoin(UNICRON_BASE, `/v1.0/company/${company_id}/customer/credit-adjustment`);
    },
    GET_CREDIT_TRANSACTIONS: (company_id) => {
        return urlJoin(UNICRON_BASE, `/v1.0/company/${company_id}/credit-transaction`);
    },
    SUBSCRIPTION_MAX_APPLICATION_LIMIT: (company_id) => {
        return urlJoin(UNICRON_BASE, `/v1.0/company/${company_id}/subscription/current-limit`);
    },
    SUBSCRIPTION_GET_PLAN_DETAILS_BY_ID: (plan_id) => {
        return urlJoin(UNICRON_PUBLIC_URL, '/v1.0/plan/details', plan_id);
    },
    SUBSCRIPTION_UPDATE_BY_ID: (company_id, subscription_id) => {
        return urlJoin(UNICRON_BASE, `/v1.0/company/${company_id}/company-subscription/${subscription_id}`)
    },
    SUBSCRIPTION_CANCEL: (company_id) => {
        return urlJoin(UNICRON_BASE, `/v1.0/company/${company_id}/company-subscription/cancel`)
    },
    SUBSCRIPTION_COUPON: (id='') => {
        return urlJoin(UNICRON_BASE, `/v1.0/coupon/`,id)
    },
    SUBSCRIPTION_VALIDITY_COUPON: () => {
        return urlJoin(UNICRON_BASE, `/v1.0/coupon/check-validity`)
    },
    SUBSCRIPTION_COUPON_UNIQUE: (code) => {
        return urlJoin(UNICRON_BASE, `/v1.0/coupon/code_uniqueness/`,code)
    },
    SUBSCRIBER_LIST: () => {
        return urlJoin(UNICRON_BASE, `/v1.0/customer`)},
    SUBSCRIPTION_ACTIVATE: (company_id) => {
        return urlJoin(UNICRON_BASE, `/v1.0/company/${company_id}/company-subscription/activate`)
    },
    FETCH_DAYTRADER_CONFIG: () => {
        return urlJoin(DAYTRADER_BASE, 'api/v1/get-output-fields_v2');
    },

    //#########Tickets########
    FETCH_TICKETS: () => {
        return urlJoin(PLATFORM_LEADS_BASE, `v1.0/ticket`);
    },

    FETCH_HISTORY: (ticket_id) => {
        return urlJoin(
            PLATFORM_LEADS_BASE,
            `v1.0/ticket/${ticket_id}/history`
        );
    },

    FETCH_FEEDBACK: (ticket_id) => {
        return urlJoin(
            PLATFORM_LEADS_BASE,
            `v1.0/ticket/${ticket_id}/feedback`
        );
    },

    ADD_COMMENT: (ticket_id) => {
        return urlJoin(
            PLATFORM_LEADS_BASE,
            `v1.0/ticket/${ticket_id}/history`
        );
    },

    CREATE_VIDEO_ROOM: () => {
        return urlJoin(PLATFORM_LEADS_BASE, `v1.0/video/room`);
    },

    GET_VIDEO_ROOM_TOKEN: (unique_name) => {
        return urlJoin(
            PLATFORM_LEADS_BASE,
            `v1.0/video/room/${unique_name}/token`
        );
    },
    GET_VIDEO_PARTICIPANTS: (ticket_id) => {
        return urlJoin(PLATFORM_LEADS_BASE, `v1.0/video/room/${ticket_id}/participants`);
    },
    FETCH_TICKET: (ticket_id) => {
        return urlJoin(PLATFORM_LEADS_BASE, `v1.0/ticket/${ticket_id}`);
    },

    FETCH_TICKETS_OPTIONS: () => {
        return urlJoin(PLATFORM_LEADS_BASE, `v1.0/ticket?items=false`);
    },

    FETCH_CATEGORIES: () => {
        return urlJoin(PLATFORM_LEADS_BASE, 'v1.0/category')
    },

    FETCH_SHIPMENT_INFO: (slug, company_id) => {
        return urlJoin(
            ADMIN_ORDERS_BASE,
            `/v1.0/${company_id}?q=${slug}&filter_type=auto`
        );
    },
    GET_GENERAL_CONGIF: () => {
        return urlJoin(PLATFORM_LEADS_BASE, `/v1.0/general-config`);
    },
    GENERAL_CONGIF: () => {
        return urlJoin(PLATFORM_LEADS_BASE, `/v1.0/general-config`);
    },
    PRODUCT: ({ companyId, itemId }) => {
        let url = `v1.0/company/${companyId}/products/`
        if (itemId) {
            url += itemId
        }
        return urlJoin(SILVERBOLT_ACAT_URL, url); //FIX
    },
    // Ultra Magnus
    PLATFORM_BASIC_DETAILS: () => {
        return urlJoin(INTERNAL_SETTINGS, '/basic-details');
    },

    PLATFORM_BASIC_DETAILS_UPDATE: () => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/basic-details');
    },

    PLATFORM_NAVBAR: () => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/navbar');
    },

    PLATFORM_DEFAULT_NAVBAR: () => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/navbar/default');
    },

    PLATFORM_CUSTOM_PAGES: () => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/custom-pages');
    },
    PLATFORM_EDIT_CUSTOM_PAGES: (slug) => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/custom-pages/', slug);
    },
    PLATFORM_PUBLISHED: (slug) => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/custom-pages/publish/', slug);
    },
    PLATFORM_HOME_PAGE: () => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/home-page');
    },
    PLATFORM_CUSTOM_FOOTER: (id = '') => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/footer', id);
    },
    PLATFORM_PRICING_BANNER: () =>{
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/pricing-banner');
    },
    PLATFORM_CUSTOM_TAGS:(id='') =>{
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/tags/',id);
    },

    PLATFORM_CUSTOM_TAGS: (id = '') => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/tags/', id);
    },

    PLATFORM_PRICING_BANNER: () => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/pricing-banner');
    },
    PLATFORM_CUSTOM_TAGS: (id = '') => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/tags/', id);
    },


    //Grindor
    GRINDOR_EXPLORER: (namespace) => {
        return urlJoin(
            PLATFORM_ASSETS_ADMIN,
            `v1.0/namespaces/${namespace}/browse/`
        );
    },
    GET_PUBLIC_URL: (companyId) => {
        let urlPath = `/v1.0/sign-urls/`
        return urlJoin(PLATFORM_ASSETS_ADMIN, urlPath);
    },
    GRINDOR_UPLOAD_START: (namespace) => {
        return urlJoin(
            PLATFORM_ASSETS_ADMIN,
            `v1.0/namespaces/${namespace}/upload/start/`
        );
    },
    GRINDOR_UPLOAD_COMPLETE: (namespace) => {
        return urlJoin(
            PLATFORM_ASSETS_ADMIN,
            `v1.0/namespaces/${namespace}/upload/complete/`
        );
    },
    GRINDOR_COPY_FILE: () => {
        return urlJoin(
            PLATFORM_ASSETS_ADMIN,
            'v1.0/uploads/copy/?sync=true'
        );
    },
    GRINDOR_PROXY: () => {
        return urlJoin(PLATFORM_ASSETS_ADMIN, 'v1.0/proxy/');
    },

    // Marketplaces
    MARKETPLACE_WORKERS: (compId) => {
        return urlJoin(MARKETPLACES_ADMIN_URL, '/v1.0/company/', compId, '/worker/');
    },
    UPDATE_MARKETPLACE_WORKERS: (compId, marketplace) => {
        return urlJoin(MARKETPLACES_ADMIN_URL, '/v1.0/company/', compId, '/channels/', marketplace, '/worker/');
    },
    // integration list
    INTEGRATIONS_LIST: () => {
        return urlJoin(SLINGSHOT_ADMIN_URL, '/v1.0/integration');
    },
    INTEGRATION_BY_ID: (id = '') => {
        return urlJoin(SLINGSHOT_ADMIN_URL, '/v1.0/integration', id);
    },
    SAVE_INTEGRATION: (id = '') => {
        return urlJoin(SLINGSHOT_ADMIN_URL, '/v1.0/integration', id);
    },
    ADD_INTEGRATION: () => {
        return urlJoin(SLINGSHOT_ADMIN_URL, '/v1.0/integration');
    },
    // Product Verification
    FETCH_VERIFICATION_COMPANY_LIST: (companyId) => {
        return urlJoin(SILVERBOLT_ACAT_URL, `/v1.0/company/0/verification/`);
    },
    FETCH_VERIFICATION_PRODUCT_LIST: (companyId) => {
        return urlJoin(SILVERBOLT_ACAT_URL, `/v1.0/company/${companyId}/verification/products/`);
    },
    FETCH_VERIFICATION_PRODUCT_DATA: ({ companyId, itemId }) => {
        return urlJoin(SILVERBOLT_ACAT_URL, `/v1.0/company/${companyId}/verification/products/${itemId}/`);
    },
    PRODUCT_TEMPLATE_VALIDATION: ({ companyId, slug }) => {
        return urlJoin(
            SILVERBOLT_ACAT_URL,
            `/v1.0/products/company/${companyId}/templates/${slug}/validation/schema/`
        );
    },
    SIZE_GUIDE_URL: (companyId) => {
        return urlJoin(SILVERBOLT_ACAT_URL, `/v1.0/company/${companyId}/sizeguide/`);
    },
    //GRINGOTTS
    FETCH_REVIEW_LIST: (params,status) => {
        return urlJoin(GRINGOTTS_ADMIN_URL, `/v1.0/config/company/${params.companyId}/application/${params.app_id}/aggregators/review/?action=reviewed&is_reviewed=${status}`)
    },
    PG_REVIEWED: (params)=>{
     return urlJoin(GRINGOTTS_ADMIN_URL, `/v1.0/config/company/${params.companyId}/application/${params.app_id}/aggregators/review/${params.paymentId}/?action=reviewed&email=${params.email}`)
    },
    FETCH_COD_CONFIG: (params)=>{
        return urlJoin(GRINGOTTS_ADMIN_URL,`v1.0/config/company/${params.companyId}/application/${params.app_id}/cod/delivery/`)
    },
     //POINTBLANK
     COMMUNICATION_LOG: (params) => {
        return urlJoin(COMMUNICATION_BASE_URL, `v1.0/log`)
    },
    COMMUNICATION_CAMPAIGNS: () => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/campaign`)
    },


    // ============= Order Service Endpoints ============
    ORDERS_LIST: () => {
        return urlJoin(ADMIN_ORDER_BASE, '/v1.0/orders');
    },
    ORDER_LANES_COUNT: () => {
        return urlJoin(ADMIN_ORDER_BASE, '/v1.0/orders/lane-count');
    },
    ORDER_DETAILS: () => {
        return urlJoin(ADMIN_ORDER_BASE, '/v1.0/orders/details');
    },
    ORDERS_PICKLIST: () => {
        return urlJoin(ADMIN_ORDER_BASE, '/v1.0/orders/picklist');
    },
    ORDER_SHIPMENTS_STATUS_UPDATE: () => {
        return urlJoin(
            ADMIN_ORDER_BASE,
            `/v1.0/actions/status`
        );
    },
    ORDER_SHIPMENTS_ADDRESS: (shipment_id, address_type) => {
        return urlJoin(
            ADMIN_ORDER_BASE,
            `/v1.0/orders/shipments/${shipment_id}/address/${address_type}`
        );
    },
    BAG_ACTIVITY_STATUS: () => {
        // return urlJoin(ADMIN_ORDER_BASE, `/v1.0/company/${getCompInfo()}/actions/activity/status`);
        // return urlJoin(ADMIN_ORDER_BASE, `/v1.0/orders/actions/activity/status`);
        return urlJoin(ADMIN_ORDER_BASE, `/v1.0/orders/activity/status`);
    },
    STORE_PROCESS_SHIPMENTS: () => {
        return urlJoin(
            ADMIN_ORDER_BASE,
            `/v1.0/actions/store/process-shipments`
        );
    },

    //shipment breakable
    SHIPMENT_CAN_BREAK_OR_NOT: () => {
        return urlJoin(ADMIN_ORDER_BASE, `/v1.0/actions/can-break`)
    },

    // shipment check refund
    SHIPMENT_CHECK_REFUND: (shipmentId) => {
        return urlJoin(ADMIN_ORDER_BASE, `/v1.0/actions/check-refund/${shipmentId}`);
    },

    // shipment dp tracking
    SHIPMENT_DP_TRACKING: (shipmentId) => {
        return urlJoin(ADMIN_ORDER_BASE, `/v1.0/orders/shipments/${shipmentId}/track`);
    },
    // shipment save bank details
    SAVE_BANK_DETAILS: (appId) => {
        return urlJoin(GRINGOTTS_BASE, `/v1.0/company/${getCompInfo()}/application/${appId}/refund/account`);
    },
    // shipment get bank details
    GET_BANK_DETAILS: (appId) => {
        return urlJoin(GRINGOTTS_BASE, `/v1.0/company/${getCompInfo()}/application/${appId}/refund/accounts/order`);
    },
    // ==================================================
    //PINPOINTER
    AUDIT_TRAIL: (id='') => {
        return urlJoin(PINPOINTER_ADMIN_URL, 'v1.0/logs/',id)
    },
    GET_AUDIT_TRAIL_ENTITY_TYPES:()=>{
        return urlJoin(PINPOINTER_ADMIN_URL, `/v1.0/entity-types`);
    }
};

export default URLS;