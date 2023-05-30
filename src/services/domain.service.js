import urlJoin from 'url-join';
import { isNode } from 'browser-or-node';
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

const PLATFORM_LEADS_BASE = isNode ?
    envVars.BROWSER_CONFIG.HIGHBROW_ADMIN_SVC :
    envVars.HIGHBROW_ADMIN_URL;

const PARTNER_LEADS_BASE = isNode ?
    envVars.BROWSER_CONFIG.HIGHBROW_ADMIN_SVC :
    envVars.HIGHBROW_PARTNER_URL;

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

const GRINGOTTS_BASE = isNode
    ? envVars.BROWSER_CONFIG.GRINGOTTS_ADMIN_URL
    : envVars.GRINGOTTS_ADMIN_URL;


const RMA_ADMIN_URL = isNode ? 
    envVars.BROWSER_CONFIG.RMA_ADMIN_URL : 
    envVars.RMA_ADMIN_URL;

const FIREBOLT_ADMIN_URL = isNode ? 
    envVars.BROWSER_CONFIG.FIREBOLT_ADMIN_URL : 
    envVars.FIREBOLT_ADMIN_URL;

const DAYTRADER_ADMIN_URL = isNode ? 
    envVars.BROWSER_CONFIG.DAYTRADER_ADMIN_URL : 
    envVars.DAYTRADER_ADMIN_URL;
const COMPUTRON_ADMIN_BASE = isNode ?
    envVars.BROWSER_CONFIG.COMPUTRON_ADMIN_URL :
    envVars.COMPUTRON_ADMIN_URL;

const AVIS_ADMIN_URL = isNode ?
    envVars.BROWSER_CONFIG.AVIS_ADMIN_URL :
    envVars.AVIS_ADMIN_URL;

const WHEELJACK_PCPR_URL = isNode ?
    envVars.BROWSER_CONFIG.WHEELJACK_PCPR_URL :
    envVars.WHEELJACK_PCPR_URL;

const HEDWIG_ADMIN_SVC = isNode ?
    envVars.BROWSER_CONFIG.HEDWIG_ADMIN_SVC :
    envVars.HEDWIG_ADMIN_SVC;

const HEDWIG_ADMIN_URL = isNode ?
    envVars.BROWSER_CONFIG.HEDWIG_ADMIN_URL :
    envVars.HEDWIG_ADMIN_URL;

const FYND_PLATFORM_DOMAIN = isNode ?
    envVars.BROWSER_CONFIG.FYND_PLATFORM_DOMAIN :
    envVars.FYND_PLATFORM_DOMAIN;


const INTERNAL_MARKETPLACES_ADMIN_URL = isNode ?
    envVars.BROWSER_CONFIG.QUE_ADMIN_URL :
    envVars.QUE_ADMIN_URL;

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
        return urlJoin(SILVERBOLT_ACAT_URL, '/v2.0/hsn/');
    },
    HSN_CODE_RETRIVE_UPDATE_DELETE: (reporting_hsn) => {
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
            '/v1.0/deployment_mapping'
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
    CATEGORY: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/category');
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
        return urlJoin(UNICRON_BASE, 'v1.0//component');
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
    GET_DOWNGRADEPLAN_REQUEST: (company_id) => {
        return urlJoin(UNICRON_BASE, `v1.0/company/${company_id}/company-subscription/downgrade-request`);
    },
    UPDATE_SUBSCRIPTION_ON_REQUEST: (company_id, requestId) => {
        return urlJoin(UNICRON_BASE, `v1.0/company/${company_id}/company-subscription/downgrade-request/${requestId}`);
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

    //for bulk upload
    GET_FILE_TYPE: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, `v1.0/get-data`);
    },

    GET_DOWNLOAD_FORMAT: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, `v1.0/upload-report/sample-file`);
    },

    GET_PRESIGNED_URL: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, `v1.0/get-s3-presigned-url`);
    },

    UPLOAD_TO_S3: (url) => {
        return url;
    },

    GET_UPLOAD_URL: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, `v1.0/upload-report`);
    },
    GET_REPORT_LIST: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, `v1.0/upload-report-info`);
    },

    //For Invoice

    GET_INVOICE_LIST: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, `v1.0/invoice/listing`);
    },
    GET_INVOICE_TYPE: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, `v1.0/get-invoice-list`);
    },
    GET_INVOICE_PAYMENT: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, `v1.0/invoice/listing2`);
    },
    GET_INVOICE_DOWNLOAD_URLS: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, `v1.0/invoice/pdf-view`);
    },
    CREDITLINE_PAYMENTS: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/payment-process');
    },
    VOID_FIN_INVOICE: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/void-invoice');
    },
    GET_COMPANY_LIST_FIN: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, `/v1.0/get-company-list`);
    },
    GET_REASONS_LIST: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, `/v1.0/get-reasons-list`);
    },
    EXTEND_DATE_INVOICE: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, `/v1.0/invoice/extend-due-date`);
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
    GET_GENERAL_CONGIF: (type) => {
        return urlJoin(PLATFORM_LEADS_BASE, `/v1.0/general-config/${type}`);
    },
    SET_GENERAL_CONGIF: () => {
        return urlJoin(PLATFORM_LEADS_BASE, `/v1.0/general-config`);
    },
    CATEGORY_SYNC: (type) => {
        return urlJoin(PLATFORM_LEADS_BASE, `/v1.0/integration-config/${type}/category-sync`);
    },
    TEST_API_KEY: (type) => {
        return urlJoin(PLATFORM_LEADS_BASE, `/v1.0/integration-config/${type}/test`);
    },
    INTEGRATION_DETAILS: (type) => {
        return urlJoin(PLATFORM_LEADS_BASE, `/v1.0/integration-config/${type}`);
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
    GET_ALL_CREDENTIALS: (entity_type) => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/credentials', entity_type)
    },
    GET_CREDENTIAL: (entity_type, slug) => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/credentials', entity_type, slug)
    },
    UPDATE_CREDENTIAL: (id) => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/credentials', id)
    },
    POST_CREDENTIAL: () => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/credentials')
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
    FETCH_COMPANY_LIST: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, 'v1/onboarding/company/info-view');
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
    FETCH_PAYMENT_GATEWAY_LIST: () => {
        return urlJoin(GRINGOTTS_ADMIN_URL,`v1.0/config/aggregators/all`)
    },
    FETCH_BUSINESS_UNIT_DEVICE_LIST: () => {
        return urlJoin(GRINGOTTS_ADMIN_URL,`v1.0/config/aggregators/all-devices`)
    },
    CRUD_PAYMENT_GATEWAY_DETAILS: (id) => {
        return urlJoin(GRINGOTTS_ADMIN_URL,`v1.0/config/aggregators/${id}/`)
    },
    COPY_CONFIGURATION_AGGREGATOR: () => {
        return urlJoin(GRINGOTTS_ADMIN_URL,`/v1.0/config/aggregators/copy-config`)
    },
    CRUD_PAYMENT_MODE: () => {
        return urlJoin(GRINGOTTS_ADMIN_URL,`v1.0/config/payment-modes`)
    },
    COPY_CONFIGURATION: () => {
        return urlJoin(GRINGOTTS_ADMIN_URL,`/v1.0/config/payment-modes/copy-config`)
    },
     //POINTBLANK
     COMMUNICATION_LOG: (params) => {
        return urlJoin(COMMUNICATION_BASE_URL, `v1.0/log`)
    },
    COMMUNICATION_CAMPAIGNS: () => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/campaign`)
    },
    COMMUNICATION_EVENT: () => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/event/events-order`)
    },
    COMMUNICATION_EVENT_SUBSCRIPTION: (id='') => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/event/event-subscriptions/`,id)
    },
    COMMUNICATION_SMS_TEMPLATES: (id='') => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/sms/templates/`,id)
    },
    SUBSCRIBED_SMS_TEMPLATES: (id='') => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/sms/subscribedTemplates`,id)
    },
    SUBSCRIBED_EMAIL_TEMPLATES: (id='') => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/email/subscribedTemplates`,id)
    },
    COMMUNICATION_SMS_S_TEMPLATES: () => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/sms/system-templates`)
    },
    COMMUNICATION_EMAIL_TEMPLATES: (id='') => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/email/templates/`,id)
    },
    COMMUNICATION_EMAIL_S_TEMPLATES: () => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/email/system-templates`)
    },
    SMS_PROVIDER: (id = '') => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/sms/providers/`,id)
    },
    EMAIL_PROVIDER: (id = '') => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/email/providers/`,id)
    },
    COMMS_DEFAULT_EMAIL_PROVIDERS: () => {
        return urlJoin(COMMUNICATION_BASE_URL,`/v1.0/platform/email/default-providers`);
    },
    COMMUNICATION_GLOBAL_PROVIDER: () => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/app-provider/global-providers`)
    },
    COMMUNICATION_APP_PROVIDER: () => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/app-provider/get-provider`)
    },
    COMMUNICATION_SYSTEM_EVENTS: () => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/event/events`)
    },
    COMMUNICATION_SEND_SYNC: () => {
        return urlJoin(COMMUNICATION_BASE_URL, `v1.0/platform/engine/send-sync`)
    },
    EVENT_BULK_UPDATE: () => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/event/event-subscriptions/bulkUpdate`)
    },
    SMS_DEFAULT: () => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/platform/sms/default-providers`)
    },
    GLOBAL_VARIABLES: () => {
        return urlJoin(COMMUNICATION_BASE_URL, `/v1.0/global-variables`)
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
    },

    // OAUTH CLIENT CRUD URLS
    GET_OAUTH_CLIENT_LISTING: () => {
        return urlJoin(SKYWARP_ADMIN_BASE, '/v1.0/oauth/client/');
    },
    GET_OAUTH_CLIENT: (clientId) => {
        return urlJoin(SKYWARP_ADMIN_BASE, `/v1.0/oauth/client/${clientId}/`);
    },
    CREATE_OAUTH_CLIENT: () => {
        return urlJoin(SKYWARP_ADMIN_BASE, '/v1.0/oauth/client/');
    },
    UPDATE_OAUTH_CLIENT: (clientId) => {
        return urlJoin(SKYWARP_ADMIN_BASE, `/v1.0/oauth/client/${clientId}/`);
    },
    DELETE_OAUTH_CLIENT: (clientId) => {
        return urlJoin(SKYWARP_ADMIN_BASE, `/v1.0/oauth/client/${clientId}/`);
    },
    /* changes from jiomarket: cbs configuration */
    INTERNAL_MARKETPLACES_ADMIN_SERVICE: (id = '') => {
        return urlJoin(INTERNAL_MARKETPLACES_ADMIN_URL, '/v1.0/channel/', id);
    },
    ADMIN_PANEL_CONFIG: (id) => {
        return  urlJoin(WHEELJACK_ACPR_URL, '/v1.0/platform-configuration/', id)
    },


    //Panel settings

    GET_PANEL_SETTINGS: () => {
        return urlJoin(INTERNAL_SETTINGS, '/menu')
    },

    SAVE_PANEL_SETTINGS: () => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/menu')
    },

    GET_PERMISSION: () => {
        return urlJoin(SKYWARP_PNL_URL, '/v1.0/permissions')
    },
    //================ Credit Debit Note =================
    GET_LIST_DATA: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/get-data')
    },
    // data for purpose dropdown
    GET_PURPOSE_DATA: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/get-data')
    },
    // save note details
    SAVE_NOTE: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/credit-debit-note')
    },
    // get service invoice details for gst fee invoice and gst service invoice
    GET_SERVICE_INVOICE_DETAILS: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/get-service-invoice-details')
    },
    GET_NOTE_DATA: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/get-credit-debit-note')
    },
    GET_ENTITY: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/credit-debit-note')
    },
    // get user details from user id
    GET_USER_DETAILS: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/seller-info')
    },
    //approver side cn-dn
    UPDATE_NOTE_STATUS: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/update-cn-dn-note-status')
    },
    // SKYWARP  Platform Config
    PLATFORM_CONFIG: () => {
        return urlJoin(SKYWARP_ADMIN_BASE, '/v1.0/admin/platform/config/');
    },
    // get gst service invoice details
    GET_INVOICE_DETAILS: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/get-service-invoice-details')
    },
    // validate invoice number for gst service 
    VALIDATE_INVOICE_NUMBER: () =>{
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/validate-service-invoice-number')
    },
    // download approved credit/debit note
    DOWNLOAD_NOTE: () => {
        return urlJoin(DAYTRADER_ADMIN_URL, '/v1.0/download-credit-debit-note')
    },
    // bulk import export
    DOWNLOAD_SAMPLE_BULK_TEMPLATE: (job_type) => {
        return urlJoin(
            SILVERBOLT_ACAT_URL,
            `v1.0/bulk/${job_type}/import/download`
        );
    },
    BULK_HISTORY_REQUEST: (job_type, action) => {
        return urlJoin(
            SILVERBOLT_ACAT_URL,
            `v1.0/bulk/${job_type}/${action}`
        );
    },
    BULK_TEMPLATE_VALIDATION: (job_type) => {
        return urlJoin(
            SILVERBOLT_ACAT_URL,
            `/v1.0/bulk/${job_type}/import/validation/schema/`
        );
    },
    BULK_SEND: (job_type) => {
        return urlJoin(SILVERBOLT_ACAT_URL, `v1.0/bulk/${job_type}/import`);
    },
    BULK_REQUEST: (job_type, action) => {
        return urlJoin(SILVERBOLT_ACAT_URL, `v1.0/bulk/${job_type}/${action}`);
    },
    //RMA Sales Channel List
    RMA_RULES_LIST: () => {
        return urlJoin(RMA_ADMIN_URL, `/api/v1/rule/list`);
    },
    RMA_DELETE_RULE: (id = '') => {
        return urlJoin(RMA_ADMIN_URL, `/api/v1/rule/${id}`);
    },
    //RMA Sales Channel Opt in List
    GET_OPTED_RMA_SALES_CHANNEL: () =>
        urlJoin(RMA_ADMIN_URL, '/api/v1/channel'),
    //RMA Departments List
    GET_DEPARTMENTS: () => urlJoin(SILVERBOLT_ACAT_URL, 'v1.0/departments'),
    //RMA Categories List
    GET_CATEGORIES: () =>
        urlJoin(FIREBOLT_ADMIN_URL, 'api/v1/category/'),
    //RMA Reasons List
    GET_REASONS: () => urlJoin(RMA_ADMIN_URL, 'api/v1/reason/'),
    //RMA Questions List
    GET_QUESTIONS: () => urlJoin(RMA_ADMIN_URL, 'api/v1/question'),
    GET_PLATFORM_COUNTS: () => urlJoin(RMA_ADMIN_URL, 'api/v1/rule/summary'),
    POST_RMA_RULE: () => urlJoin(RMA_ADMIN_URL, 'api/v1/rule'),
    PUT_RMA_RULE: (id) => urlJoin(RMA_ADMIN_URL, `api/v1/rule/${id}`),
    PUT_RMA_CONFIG_UPDATE: (id = '') => urlJoin(RMA_ADMIN_URL, `api/v1/channel/${id}`),
    // =============== Finance ==========================
    GET_REPORT_TYPE: () => {
        return urlJoin(DAYTRADER_ADMIN_URL,`/v1.0/get-report-list`);
    },
    GET_CHANNEL: () => {
        return urlJoin(DAYTRADER_ADMIN_URL,`/v1.0/get-data`);
    },
    GET_REPORT: () => {
        return urlJoin(DAYTRADER_ADMIN_URL,`/v1.0/download-report`);
    },
    GENERATE_REPORT: () => {
        return urlJoin(DAYTRADER_ADMIN_URL,`/v1.0/generate-report`);
    },
    GET_LOCATION_ID: (companyId) => {
        return urlJoin(FIREBOLT_ADMIN_URL,`/v1.0/oms/stores?company_uids=${companyId}&fulfilment_type=JFC`);
        //`/v1.0/company//?company_ids=${companyId}/&program_type=jfc`
    },
    /** OMSv2.1 */
    CREATE_S3_INVOICE:()=>{
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/generate-single-shipment-invoice-frontend`)
    },
    ORDER_ROLE: function () {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/roles`);
    },
    ORDER_DETAILS_V2:() =>{
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/order-details`);
    },
    ORDER_APPLICATION_DETAILS_V2:() =>{
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/application/${getAppInfo()._id}/order-details`);
    },
    SHIPMENT_V2_LIST: () => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/shipments-listing`);
    },
    SHIPMENT_APPLICATION_V2_LIST: () => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/application/${getAppInfo()._id}/shipments-listing`);
    },
    ORDERS_V2_LISTING: () => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/orders-listing`);
    },
    ORDERS_APPLICATION_V2_LISTING: () => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/application/${getAppInfo()._id}/orders-listing`);
    },
    LANE_CONFIG_V2: () => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/lane-config`);
    },
    LANE_APPLICATION_CONFIG_V2: () => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/application/${getAppInfo()._id}/lane-config`);
    },
    FILTERS_V2: () => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/filter-listing`);
    },
    FILTERS_APPLICATION_V2: () => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/application/${getAppInfo()._id}/filter-listing`);
    },
    GET_FULFILLMENT_CENTER: companyId => {
        return urlJoin(WHEELJACK_ACPR_URL, `/v1.0/company/${companyId}/location`);
    },
    FETCH_MANIFEST_LIST: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/manifest/listing`);
    },
    FETCH_PICKUP_SLOT:()=>{
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/pickup-slots`)
    },
    FETCH_ANNOUNCEMENT_NOTE: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/announcements`);
    },
    PROCESS_MANIFESTS: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/process-manifest`);
    },
    MANIFEST_DISPATCH:()=>{
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/manifest/dispatch`)
    },
    FETCH_MANIFEST_DETAILS: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/manifest/details`);
    },
    UPDATE_SHIPMENT_STATUS: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/shipment/status-internal`);
    },
    FETCH_V2_BULK_GENERATE_EXCEL: () => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/generate/file`);
    },
    POST_V2_LINK_BULK_ACTION: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/bulk-action/upload`);
    },
    UPLOAD_CONSENT:() => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/manifest/uploadConsent`);
    },
    GET_SHIPMENT_ACTIVITY_LOGS: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/shipment/history`);
    },
    GET_DP_ACTIVITY_LOGS: () => {
        return urlJoin(HEDWIG_ADMIN_URL, `/v1.0/tracking`);
    },
    GET_BULK_ACTION_LIST: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/bulk-action/listing`);
    },
    GET_BULK_DOWNLOAD_TEMPLATE_LIST: () => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/bulk-action/get-template-slugs`);
    },
    FETCH_BULK_LIST_DETAILED_DATA: (data) => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/bulk-action/details`);
    },
    FETCH_BULK_ACTION_FAILED_REPORT: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/bulk-action/get-failed-shipment-records`);
    },
    PROCESS_BULK_ACTION_INVOICE: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/bulk-action/invoice`);
    },
    FETCH_BULK_INVOICE_REPORT: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/bulk-action/download/invoice-label`);
    },
    DOWNLOAD_BULK_ACTION_TEMPLATE: () => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/bulk-action/get-template`);
    },
    SAVE_PROCESS_MANIFEST: ()=>{
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/process-manifest`);
    },
    UPDATE_PACKAGE_DIMENSION: ()=>{
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/update-packaging-dimension`);
    },
    POST_V2_SELECTED_DELIVERY_PARTNER: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/oms/manual-place-shipment`);
    },
    FETCH_QC_REASONS: (shipmentId, bagId) => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/shipments/${shipmentId}/bags/${bagId}/state/return_initiated/reasons`);
    },
    FETCH_SUPPORTING_REASONS: (shipmentId, bagId, status) => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/shipments/${shipmentId}/bags/${bagId}/state/${status}/reasons`);
    },
    LOCK_MANAGER_URL : () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/entity/lock-manager`);
    },
    GET_TEMPLATE : () => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/bulk-action/get-template`);
    },
    SEND_SMS: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/ninja/send-sms`);
    },
    CALL: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/ninja/click2call/`);
    },
    FETCH_REASONS: (shipmentId, bagId, state) => {
        return urlJoin(COMPUTRON_ADMIN_BASE, `/v1.0/shipments/${shipmentId}/bags/${bagId}/state/${state}/reasons`);
    },
    GET_STORES: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/store/reassign`);
    },
    CHANGE_STORE: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/store/reassign`);
    },
    HIT_E_INVOICE: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/virtual-invoice-dp-assign`);
    },
    GET_STATES_FOR_TRANSITION: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/bag/state/transition/`);
    },
    UPDATE_ADDRESS: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/delight/update-address/`);
    },
    PLATFORM_DOMAIN: () => {
        return FYND_PLATFORM_DOMAIN
    },
    SEND_OTP: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/company/${getCompInfo()}/user/send/otp/mobile`)
    },
    VERIFY_OTP: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/company/${getCompInfo()}/user/verify/otp`)
    },
    CREATE_USER: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/company/${getCompInfo()}/user/attach`)
    },
    POST_REFUND_CONFIG: () => {
        return urlJoin(AVIS_ADMIN_URL, `/v1.0/company/${getCompInfo()}/refund-mode-config`);
    },
    /** OMSv2.1 -- END */
};

export default URLS;