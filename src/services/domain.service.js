import urlJoin from 'url-join';
import { isBrowser, isNode } from 'browser-or-node';
import root from 'window-or-global';

const envVars = root.env || {};

if (root && root.process && root.process.env && root.process.env.NODE_ENV == 'test') {
    envVars['BROWSER_CONFIG'] = root.process.env;
}

let PLATFORM_COMMON_BASE = isNode ?
    envVars.BROWSER_CONFIG.PLATFORM_COMMON_MAIN_URL :
    envVars.PLATFORM_COMMON_MAIN_URL;

//remove later when done from nginx
// PLATFORM_COMMON_BASE = urlJoin(PLATFORM_COMMON_BASE, '/partner');

const GRIMLOCK_BASE = isNode ?
    envVars.BROWSER_CONFIG.GRIMLOCK_MAIN_SVC :
    envVars.GRIMLOCK_MAIN_URL;

const BLITZKRIEG_BASE = isNode ?
    envVars.BROWSER_CONFIG.BLITZKRIEG_MAIN_SVC :
    envVars.BLITZKRIEG_MAIN_URL;

const SILVERBOLT_MAIN_URL = isNode ?
    envVars.BROWSER_CONFIG.SILVERBOLT_MAIN_URL :
    envVars.SILVERBOLT_MAIN_URL;

const SKYWARP_MAIN_URL = isNode ?
    envVars.BROWSER_CONFIG.SKYWARP_MAIN_URL :
    envVars.SKYWARP_MAIN_URL;

const UNICRON_BASE = isNode ?
    envVars.BROWSER_CONFIG.UNICRON_MAIN_SVC :
    envVars.UNICRON_MAIN_URL;

const DAYTRADER_BASE = isNode ?
    envVars.BROWSER_CONFIG.DAYTRADER_MAIN_SVC :
    envVars.DAYTRADER_MAIN_URL;

const PLATFORM_LEADS_BASE = isNode ?
    envVars.BROWSER_CONFIG.HIGHBROW_MAIN_SVC :
    envVars.HIGHBROW_MAIN_URL;

const PLATFORM_ORDERS_BASE = isNode ?
    envVars.BROWSER_CONFIG.APEFACE_MAIN_SVC :
    envVars.APEFACE_MAIN_URL;

const INTERNAL_SETTINGS = isNode ?
    envVars.BROWSER_CONFIG.ULTRAMAGNUS_PUBLIC_SVC :
    envVars.ULTRAMAGNUS_PUBLIC_URL;

const INTERNAL_SETTINGS_ADMIN = isNode ?
    envVars.BROWSER_CONFIG.ULTRAMAGNUS_ADMIN_SVC :
    envVars.ULTRAMAGNUS_ADMIN_URL;

const PLATFORM_ASSETS_BASE = isNode ?
    envVars.BROWSER_CONFIG.GRINDOR_MAIN_URL :
    envVars.GRINDOR_MAIN_URL;

const SLINGSHOT_MAIN_URL = isNode ?
    envVars.BROWSER_CONFIG.SLINGSHOT_MAIN_URL :
    envVars.SLINGSHOT_MAIN_URL;

const MARKETPLACES_MAIN_URL = isNode ?
    envVars.BROWSER_CONFIG.MARKETPLACES_MAIN_URL :
    envVars.MARKETPLACES_MAIN_URL;

const URLS = {
    //fetch attributes
    FETCH_ATTRIBUTE: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/attribute-master/');
    },
    //fetchVariant
    FETCH_VARIANT: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/variants/');
    },
    //fetchDeparment
    FETCH_DEPARTMENT: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/department');
    },
    //Company Metrics
    FETCH_METRICS: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/onboarding/company/metrics');
    },

    //search dri
    SEARCH_DRI: () => {
        return urlJoin(GRIMLOCK_BASE, '/user-info/search/');
    },

    //fetch dri
    FETCH_DRI: (uid) => {
        return urlJoin(
            SILVERBOLT_MAIN_URL,
            '/v1/onboarding/company-brand-dri/'
        );
    },

    // fetch applications
    FETCH_APPLICATIONS: (uid) => {
        return urlJoin(SLINGSHOT_MAIN_URL, `/company/${uid}/applications`);
    },

    //archive unarchive sales channel
    ACTION_APPLICATIONS: (uid, appId) => {
        return urlJoin(
            SLINGSHOT_MAIN_URL,
            `/company/${uid}/applications/${appId}`
        );
    },

    // validate user
    VALIDATE_USER: () => {
        return urlJoin(SKYWARP_MAIN_URL, '/v1/admin/staff/current/access');
    },
    ADMIN_PERMISSIONS: () => {
        return urlJoin(SKYWARP_MAIN_URL, '/v1/admin/permissions');
    },
    //company details
    GET_COMPANY_LIST: () => {
        return urlJoin(
            SILVERBOLT_MAIN_URL,
            '/v1/admin/onboarding/company/verification/'
        );
    },
    BRAND_ADMIN_ACTION: () => {
        return urlJoin(
            SILVERBOLT_MAIN_URL,
            '/v1/admin/onboarding/company/brand/verification/'
        );
    },
    STORE_ADMIN_ACTION: () => {
        return urlJoin(
            SILVERBOLT_MAIN_URL,
            '/v1/admin/onboarding/store/verification/'
        );
    },
    GET_COMPANY_BRANDS: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/onboarding/company/brand/');
    },
    GET_CHOICE_TYPES: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/onboarding/choices/');
    },
    COMPANY_STORES: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/onboarding/company/store/');
    },
    COMPANY_PROFILE: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/onboarding/company/profile');
    },
    ATTRIBUTES_MASTER: (slug = '') => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/attribute-master', slug);
    },
    PRODUCT_TEMPLATES: (slug = '') => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/product-templates', slug);
    },
    PRODUCT_TEMPLATE_DOWNLOAD: (slug = '') => {
        return urlJoin(
            SILVERBOLT_MAIN_URL,
            '/v1/product-templates',
            slug,
            'download'
        );
    },
    ATTRIBUTE_GROUPS: (slug = '') => {
        return urlJoin(
            SILVERBOLT_MAIN_URL,
            '/v1/attribute-master/groups',
            slug
        );
    },
    ATTRIBUTE_SHUFFLE: (entity) => {
        return urlJoin(
            SILVERBOLT_MAIN_URL,
            `/v1/attribute-master/${entity}/shuffle`
        );
    },
    ATTRIBUTE_GROUPS_SHUFFLE: (entity) => {
        return urlJoin(
            SILVERBOLT_MAIN_URL,
            `/v1/attribute-master/groups/${entity}/shuffle`
        );
    },
    DEPARTMENT: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/department');
    },
    CATEGORY: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/category');
    },
    CATEGORY_v2: (id = '') => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v2/category', id);
    },
    UNITS: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/units');
    },

    //SKYWRAP
    LIST_USERS: (userId = '') => {
        return urlJoin(SKYWARP_MAIN_URL, `/v1/admin/staff/${userId}`);
    },

    DELETE_USERS: (uid) => {
        return urlJoin(SKYWARP_MAIN_URL, `/v1/admin/staff/${uid}`);
    },
    ADD_USERS: (uid) => {
        return urlJoin(SKYWARP_MAIN_URL, '/v1/admin/staff/');
    },

    // GrimLock

    // Search
    SEARCH_USER: () => {
        return urlJoin(GRIMLOCK_BASE, '/user-info/search');
    },

    LOCATIONS: () => {
        return urlJoin(PLATFORM_COMMON_BASE, '/locations');
    },

    // Unicron/Daytrader - Plan creator
    FETCH_PLANS_LIST: (planId = '') => {
        return urlJoin(UNICRON_BASE, `v1/plan/${planId}`);
    },
    FETCH_SINGLE_PLAN: (planId) => {
        return urlJoin(UNICRON_BASE, `v1/plan-editor/${planId}`);
    },
    FETCH_SUBSCRIPTION_COMPONENTS: () => {
        return urlJoin(UNICRON_BASE, 'v1/component');
    },
    FETCH_COMPONENT_PRICES: (componentId) => {
        return urlJoin(UNICRON_BASE, `v1/component/${componentId}/prices`);
    },
    FETCH_PLAN_COMPONENTS: () => {
        return urlJoin(UNICRON_BASE, 'v1/plan-component');
    },
    FETCH_COMPONENT_WITH_PRICES: () => {
        return urlJoin(UNICRON_BASE, 'v1/component-prices');
    },
    FETCH_DAYTRADER_COMPONENT: () => {
        return urlJoin(UNICRON_BASE, 'v1/daytrader-component');
    },
    FETCH_DAYTRADER_CONFIG: () => {
        return urlJoin(DAYTRADER_BASE, 'api/v1/get-output-fields_v2');
    },
    FETCH_DAYTRADER_FILTERS: () => {
        return urlJoin(DAYTRADER_BASE, 'api/v1/get-data');
    },
    CURRENT_SUBSCRIPTION_DETAILS: () => {
        return urlJoin(UNICRON_BASE, 'v1/subscription/current');
    },
    SUBSCRIPTION_DAYTRADER_RULES: (subscriptionId) => {
        return urlJoin(
            UNICRON_BASE,
            `v1/daytrader-rule/subscription/${subscriptionId}`
        );
    },
    PLAN_DETAILS: (planId) => {
        return urlJoin(UNICRON_BASE, `v1/plan/details/${planId}`);
    },
    AGREEMENT_PDF: () => {
        return urlJoin(UNICRON_BASE, `v1/plan-pdf/generate-pdf/`);
    },

    //#########Tickets########
    FETCH_TICKETS: () => {
        return urlJoin(PLATFORM_LEADS_BASE, `admin/v1/ticket`);
    },

    FETCH_HISTORY: (ticket_id) => {
        return urlJoin(
            PLATFORM_LEADS_BASE,
            `admin/v1/ticket/${ticket_id}/history`
        );
    },

    ADD_COMMENT: (ticket_id) => {
        return urlJoin(
            PLATFORM_LEADS_BASE,
            `admin/v1/ticket/${ticket_id}/comment`
        );
    },

    CREATE_VIDEO_ROOM: () => {
        return urlJoin(PLATFORM_LEADS_BASE, `video/v1/room`);
    },

    GET_VIDEO_ROOM_TOKEN: (unique_name) => {
        return urlJoin(
            PLATFORM_LEADS_BASE,
            `video/v1/room/${unique_name}/token`
        );
    },

    FETCH_TICKET: (ticket_id) => {
        return urlJoin(PLATFORM_LEADS_BASE, `admin/v1/ticket/${ticket_id}`);
    },

    FETCH_TICKETS_OPTIONS: (company_id = '') => {
        return urlJoin(PLATFORM_LEADS_BASE, `admin/v1/ticket/options`);
    },

    FETCH_SHIPMENT_INFO: (slug, company_id) => {
        return urlJoin(
            PLATFORM_ORDERS_BASE,
            `/v1/seller/${company_id}?q=${slug}`
        );
    },

    FETCH_PRODUCT_INFO: (slug) => {
        return urlJoin(PLATFORM_CONTENT_BASE, `v1/products/${slug}`);
    },

    // Ultra Magnus
    PLATFORM_BASIC_DETAILS: () => {
        return urlJoin(INTERNAL_SETTINGS, '/basic-details');
    },

    PLATFORM_BASIC_DETAILS_UPDATE: () => {
        return urlJoin(INTERNAL_SETTINGS_ADMIN, '/basic-details');
    },

    //Grindor
    GRINDOR_EXPLORER: (namespace) => {
        return urlJoin(
            PLATFORM_ASSETS_BASE,
            'v1/asset/explorer/namespaces/',
            namespace
        );
    },
    GRINDOR_UPLOAD_START: (namespace) => {
        return urlJoin(
            PLATFORM_ASSETS_BASE,
            'v1/asset/uploads/start/',
            namespace
        );
    },
    GRINDOR_UPLOAD_COMPLETE: (namespace) => {
        return urlJoin(
            PLATFORM_ASSETS_BASE,
            'v1/asset/uploads/complete/',
            namespace
        );
    },
    GRINDOR_COPY_FILE: () => {
        return urlJoin(
            PLATFORM_ASSETS_BASE,
            'v1/asset/uploads/bulk/copy-files?sync=true'
        );
    },
    GRINDOR_PROXY: () => {
        return urlJoin(PLATFORM_ASSETS_BASE, 'v1/proxy/fetch');
    },

    // Marketplaces
    MARKETPLACE_WORKERS: (compId) => {
        return urlJoin(MARKETPLACES_MAIN_URL, '/company/', compId, '/worker/');
    },
    UPDATE_MARKETPLACE_WORKERS: (compId, marketplace) => {
        return urlJoin(MARKETPLACES_MAIN_URL, '/company/', compId, '/marketplaces/', marketplace, '/worker/');
    },
    // integration list
    INTEGRATIONS_LIST: () => {
        return urlJoin(PLATFORM_COMMON_BASE, 'integration');
    },
    INTEGRATION_BY_ID: (id = '') => {
        return urlJoin(PLATFORM_COMMON_BASE, 'integration', id);
    },
    SAVE_INTEGRATION: (id = '') => {
        return urlJoin(PLATFORM_COMMON_BASE, 'integration', id);
    },
    ADD_INTEGRATION: () => {
        return urlJoin(PLATFORM_COMMON_BASE, 'integration');
    },
    FETCH_COMPANY_LIST: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, 'v1/onboarding/company/info-view');
    }
};

export default URLS;