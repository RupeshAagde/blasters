import urlJoin from 'url-join';
import { isBrowser, isNode } from 'browser-or-node';
import root from 'window-or-global';

const envVars = root.env || {};

let PLATFORM_COMMON_BASE = isNode
    ? envVars.BROWSER_CONFIG.PLATFORM_COMMON_MAIN_URL
    : envVars.PLATFORM_COMMON_MAIN_URL;

//remove later when done from nginx
// PLATFORM_COMMON_BASE = urlJoin(PLATFORM_COMMON_BASE, '/partner');

const GRIMLOCK_BASE = isNode
    ? envVars.BROWSER_CONFIG.GRIMLOCK_MAIN_SVC
    : envVars.GRIMLOCK_MAIN_URL;

const BLITZKRIEG_BASE = isNode
    ? envVars.BROWSER_CONFIG.BLITZKRIEG_MAIN_SVC
    : envVars.BLITZKRIEG_MAIN_URL;

const SILVERBOLT_MAIN_URL = isNode
    ? envVars.BROWSER_CONFIG.SILVERBOLT_MAIN_URL
    : envVars.SILVERBOLT_MAIN_URL;

const SKYWARP_MAIN_URL = isNode
    ? envVars.BROWSER_CONFIG.SKYWARP_MAIN_URL
    : envVars.SKYWARP_MAIN_URL;

const UNICRON_BASE = isNode
    ? envVars.BROWSER_CONFIG.UNICRON_MAIN_SVC
    : envVars.UNICRON_MAIN_URL;

const PLATFORM_LEADS_BASE = isNode
    ? envVars.BROWSER_CONFIG.HIGHBROW_MAIN_SVC
    : envVars.HIGHBROW_MAIN_URL;

const PLATFORM_ORDERS_BASE = isNode
    ? envVars.BROWSER_CONFIG.APEFACE_MAIN_SVC
    : envVars.APEFACE_MAIN_URL;

const INTERNAL_SETTINGS = isNode
    ? envVars.BROWSER_CONFIG.ULTRAMAGNUS_MAIN_SVC
    : envVars.ULTRAMAGNUS_MAIN_URL;

const PLATFORM_ASSETS_BASE = isNode
    ? envVars.BROWSER_CONFIG.GRINDOR_MAIN_URL
    : envVars.GRINDOR_MAIN_URL;

const SLINGSHOT_MAIN_URL = isNode
    ? envVars.BROWSER_CONFIG.SLINGSHOT_MAIN_URL
    : envVars.SLINGSHOT_MAIN_URL;

const URLS = {
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
    UNITS: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/units');
    },
    // Organizations
    ORGANIZATION: (id = '') => {
        return urlJoin(PLATFORM_COMMON_BASE, '/v1/organization', id);
    },
    ORGANIZATION_FORM: () => {
        return urlJoin(
            PLATFORM_COMMON_BASE,
            '/v1/organization/form/partner-organization-form'
        );
    },
    //TEAM<->Staff<->INVITE
    STAFF: (partnerId) => {
        return urlJoin(
            PLATFORM_COMMON_BASE,
            'v1/organization/',
            partnerId,
            '/team-member'
        );
    },
    STAFF_DETAILS: (partnerId, staffId) => {
        return urlJoin(
            PLATFORM_COMMON_BASE,
            '/v1/organization/',
            partnerId,
            'team-member',
            staffId
        );
    },
    // Staff
    ACL: () => {
        return urlJoin(PLATFORM_COMMON_BASE, '/v1/organization/team/acl');
    },
    // Staff profile
    STAFF_PROFILE: () => {
        return urlJoin(
            PLATFORM_COMMON_BASE,
            '/v1/application/current/staff/profile'
        );
    },

    //SKYWRAP
    LIST_USERS: () => {
        return urlJoin(SKYWARP_MAIN_URL, '/v1/admin/staff');
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
    // Invite
    INVITE_USER: () => {
        return urlJoin(GRIMLOCK_BASE, '/v2/invite/send');
    },
    VERIFY_INVITE: () => {
        return urlJoin(GRIMLOCK_BASE, '/v2/invite/verify');
    },
    // Invite
    REINVITE_USER: () => {
        return urlJoin(GRIMLOCK_BASE, '/v2/invite/resend');
    },
    //Invite Link
    INVITE_LINK: () => {
        return urlJoin(GRIMLOCK_BASE, '/v2/invite/link');
    },
    //List Invites
    INVITES: () => {
        return urlJoin(GRIMLOCK_BASE, '/v2/invite');
    },
    ACCEPT_INVITE: () => {
        return urlJoin(
            PLATFORM_COMMON_BASE,
            '/v1/application/current/invite/accept'
        );
    },
    LOCATIONS: () => {
        return urlJoin(PLATFORM_COMMON_BASE, '/locations');
    },
    CURRENT_USER_ACCESS: (orgId) => {
        return urlJoin(
            PLATFORM_COMMON_BASE,
            '/v1/organization/',
            orgId,
            '/team-member/current/access'
        );
    },

    // Application
    APPLICATION: (orgId, appId = '') => {
        return urlJoin(
            PLATFORM_COMMON_BASE,
            '/v1/organization/',
            orgId,
            '/application',
            appId
        );
    },

    // Themes
    THEMES: () => {
        return urlJoin(BLITZKRIEG_BASE, '/theme/v2');
    },
    LIST_THEMES: () => {
        return urlJoin(BLITZKRIEG_BASE, '/theme/v2/list');
    },

    // Slingshot
    // FETCH_EMPLPOYEE_LISTING: () => {
    //   return urlJoin(PLATFORM_COMMON_BASE, '/v1/application/current/staff')
    // },
    // FETCH_EMPLOYEE_ACCESS_DETAILS: () => {
    //   return urlJoin(PLATFORM_COMMON_BASE, '/v1/application/current/access')
    // }

    // Unicron
    FETCH_PLANS_LIST: (planId = '') => {
        return urlJoin(UNICRON_BASE, `v1/plan/${planId}`);
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

    //#########Tickets########
    FETCH_TICKETS: () => {
        return urlJoin(PLATFORM_LEADS_BASE, `admin/v1/ticket`);
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
        return urlJoin(INTERNAL_SETTINGS, 'v1/basic-details');
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
    }
};

export default URLS;
