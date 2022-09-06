import urlJoin from 'url-join';
import { isBrowser, isNode } from 'browser-or-node';
import root, { console } from 'window-or-global';
import _ from 'lodash';
import {  } from '@/services/utils.service';
const getCompInfo = () => 1;

let envVars = root.env || {};
if (root && root.process && root.process.env && root.process.env.NODE_ENV == 'test') {
    envVars['BROWSER_CONFIG'] = root.process.env;
}

const PLATFORM_COMMON_BASE = isNode
    ? envVars.BROWSER_CONFIG.PLATFORM_COMMON_MAIN_SVC
    : envVars.PLATFORM_COMMON_MAIN_URL;

const PLATFORM_CONFIGURATION_BASE = isNode
    ? envVars.BROWSER_CONFIG.SLINGSHOT_PLTM_SVC
    : envVars.SLINGSHOT_PLTM_URL;

const SLINGSHOT_PNL_URL = isNode
    ? envVars.BROWSER_CONFIG.SLINGSHOT_PNL_URL
    : envVars.SLINGSHOT_PNL_URL;

const PLATFORM_CONTENT_BASE = isNode
    ? envVars.BROWSER_CONFIG.PLATFORM_CONTENT_MAIN_URL
    : envVars.PLATFORM_CONTENT_MAIN_URL;

const PLATFORM_CUSTOM_BASE = isNode
    ? envVars.BROWSER_CONFIG.FREEWAY_MAIN_URL
    : envVars.FREEWAY_MAIN_URL;

const PLATFORM_ANALYTICS_BASE = isNode
    ? envVars.BROWSER_CONFIG.PERCEPTOR_PLTM_URL
    : envVars.PERCEPTOR_PLTM_URL;

const PLATFORM_COMMUNICATION_BASE = isNode
    ? envVars.BROWSER_CONFIG.POINTBLANK_PLTM_URL
    : envVars.POINTBLANK_PLTM_URL;
const PLATFORM_COMMUNICATION_BASE_URL = isNode
    ? envVars.BROWSER_CONFIG.POINTBLANK_MAIN_URL
    : envVars.POINTBLANK_MAIN_URL;

const PLATFORM_AUDIT_TRAIL_BASE = isNode
    ? envVars.BROWSER_CONFIG.PINPOINTER_PLTM_URL
    : envVars.PINPOINTER_PLTM_URL;

const PLATFORM_ASSETS_BASE = isNode
    ? envVars.BROWSER_CONFIG.GRINDOR_PLTM_URL
    : envVars.GRINDOR_PLTM_URL;

const PLATFORM_LEADS_BASE = isNode
    ? envVars.BROWSER_CONFIG.HIGHBROW_PLTM_URL
    : envVars.HIGHBROW_PLTM_URL;

const PLATFORM_FEEDBACK_BASE = isNode
    ? envVars.BROWSER_CONFIG.ARK_PLTM_SVC
    : envVars.ARK_PLTM_URL;

const PLATFORM_SENTINEL_BASE = isNode
    ? envVars.BROWSER_CONFIG.SENTINEL_PLTM_SVC
    : envVars.SENTINEL_PLTM_URL;

const PLATFORM_REWARDS_BASE = isNode
    ? envVars.BROWSER_CONFIG.LIGHTSPEED_PLTM_SVC
    : envVars.LIGHTSPEED_PLTM_URL;

const PLATFORM_BONECRUSHER_BASE = isNode
    ? envVars.BROWSER_CONFIG.BONECRUSHER_MAIN_URL
    : envVars.BONECRUSHER_MAIN_URL;

const PLATFORM_GRINGOTTS_BASE = isNode
    ? envVars.BROWSER_CONFIG.GRINGOTTS_PLTM_URL
    : envVars.GRINGOTTS_PLTM_URL;


const SLINGSHOT_MAIN_URL = isNode
    ? envVars.BROWSER_CONFIG.SLINGSHOT_MAIN_URL
    : envVars.SLINGSHOT_MAIN_URL;

const SILVERBOLT_MAIN_URL = isNode
    ? envVars.BROWSER_CONFIG.SILVERBOLT_MAIN_URL
    : envVars.SILVERBOLT_MAIN_URL;

const SILVERBOLT_PCAT_SVC = isNode
    ? envVars.BROWSER_CONFIG.SILVERBOLT_PCAT_SVC
    : envVars.SILVERBOLT_PCAT_SVC;

const WHEELJACK_PCPR_URL = isNode
    ? envVars.BROWSER_CONFIG.WHEELJACK_PCPR_URL
    : envVars.WHEELJACK_PCPR_URL;

const SILVERBOLT_PCAT_URL = isNode
    ? envVars.BROWSER_CONFIG.SILVERBOLT_PCAT_URL
    : envVars.SILVERBOLT_PCAT_URL;

const WHEELJACK_PNLCPR_URL = isNode
    ? envVars.BROWSER_CONFIG.WHEELJACK_PNLCPR_URL
    : envVars.WHEELJACK_PNLCPR_URL;

const MARKETPLACES_PLTM_URL = isNode
    ? envVars.BROWSER_CONFIG.MARKETPLACES_PLTM_URL
    : envVars.MARKETPLACES_PLTM_URL;

const PRISM_URL = isNode
    ? envVars.BROWSER_CONFIG.PRISM_MAIN_SVC
    : envVars.PRISM_MAIN_URL;

const SKYWARP_MAIN_URL = isNode
    ? envVars.BROWSER_CONFIG.SKYWARP_MAIN_URL
    : envVars.SKYWARP_MAIN_URL;

const SKYWARP_PLTM_BASE = isNode
    ? envVars.BROWSER_CONFIG.SKYWARP_PLTM_URL
    : envVars.SKYWARP_PLTM_URL;

const SKYWARP_PNL_BASE = isNode
    ? envVars.BROWSER_CONFIG.SKYWARP_PNL_URL
    : envVars.SKYWARP_PNL_URL;

const AVIS_MAIN_URL = isNode
    ? envVars.BROWSER_CONFIG.AVIS_MAIN_SVC
    : envVars.AVIS_MAIN_URL;

const GALVATRON_MAIN_URL = isNode
    ? envVars.BROWSER_CONFIG.GALVATRON_MAIN_URL
    : envVars.GALVATRON_MAIN_URL;

const SWOOP_BASE = isNode
    ? envVars.BROWSER_CONFIG.SWOOP_PLTM_URL
    : envVars.SWOOP_PLTM_URL;

const CONVEX_PLTM_URL = isNode
    ? envVars.BROWSER_CONFIG.CONVEX_PLTM_URL
    : envVars.CONVEX_PLTM_URL;

const SURESHOT_PLTM_URL= isNode
    ? envVars.BROWSER_CONFIG.SURESHOT_PLTM_URL
    : envVars.SURESHOT_PLTM_URL;

const BLASTER_MAIN_DOMAIN= isNode
    ? envVars.BROWSER_CONFIG.BLASTER_MAIN_DOMAIN
    : envVars.BLASTER_MAIN_DOMAIN;

const MIXMASTER_PLTM_URL = isNode
    ? envVars.BROWSER_CONFIG.MIXMASTER_PLTM_URL
        : envVars.MIXMASTER_PLTM_URL;

const ADMIN_URLS = {
    GET_BIG_QUERY_N_RECORDS: () => {
        return urlJoin(PLATFORM_COMMUNICATION_BASE, '/v1.0/sources/bigquery-n-records');
    },
    GET_BIG_QUERY_RECORDS_COUNT: () => {
        return urlJoin(PLATFORM_COMMUNICATION_BASE, '/v1.0/sources/bigquery-row-count');
    },
    GET_BIG_QUERY_HEADERS: () => {
        return urlJoin(PLATFORM_COMMUNICATION_BASE, '/v1.0/sources/bigquery-headers');
    },
    GET_AUDIT_TRAIL_LOGS: () => {
        return urlJoin(PLATFORM_AUDIT_TRAIL_BASE, `/v1.0/company/${getCompInfo()}/logs/`);
    },
    GET_AUDIT_TRAIL_LOGS_BY_ID: id => {
        return urlJoin(PLATFORM_AUDIT_TRAIL_BASE, `/v1.0/company/${getCompInfo()}/logs/`, id);
    },
    //Grindor
    // GRINDOR_EXPLORER: namespace => {
    //     let urlPath = `v1.0/company/${getCompInfo()}/namespaces/${namespace}/browse`

    //     let appInfo = getAppInfo();
    //     if (!_.isEmpty(appInfo)) {
    //         urlPath = `v1.0/company/${getCompInfo()}/application/${appInfo.id}/namespaces/${namespace}/browse`
    //     }

    //     return urlJoin(
    //         PLATFORM_ASSETS_BASE,
    //         urlPath,
    //     );
    // },
    // GRINDOR_UPLOAD_START: namespace => {
    //     let urlPath = `v1.0/company/${getCompInfo()}/namespaces/${namespace}/upload/start/`

    //     let appInfo = getAppInfo();
    //     if (!_.isEmpty(appInfo)) {
    //         urlPath = `v1.0/company/${getCompInfo()}/application/${appInfo.id}/namespaces/${namespace}/upload/start/`
    //     }

    //     return urlJoin(
    //         PLATFORM_ASSETS_BASE,
    //         urlPath,
    //     );
    // },
    // GRINDOR_UPLOAD_COMPLETE: namespace => {
    //     let urlPath = `v1.0/company/${getCompInfo()}/namespaces/${namespace}/upload/complete/`

    //     let appInfo = getAppInfo();
    //     if (!_.isEmpty(appInfo)) {
    //         urlPath = `v1.0/company/${getCompInfo()}/application/${appInfo.id}/namespaces/${namespace}/upload/complete/`
    //     }

    //     return urlJoin(
    //         PLATFORM_ASSETS_BASE,
    //         urlPath,
    //     );
    // },

    // GRINDOR_COPY_FILE: () => {
    //     let urlPath = `v1.0/company/${getCompInfo()}/uploads/copy/?sync=true`

    //     let appInfo = getAppInfo();
    //     if (!_.isEmpty(appInfo)) {
    //         urlPath = `v1.0/company/${getCompInfo()}/application/${appInfo.id}/uploads/copy/?sync=true`
    //     }

    //     return urlJoin(
    //         PLATFORM_ASSETS_BASE,
    //         urlPath
    //     );
    // },
    GRINDOR_PROXY: () => {
        let urlPath = `v1.0/company/${getCompInfo()}/proxy/`
        return urlJoin(PLATFORM_ASSETS_BASE, urlPath);
    },

    // Search Platform user
    PLATFORM_SEARCH_USER: () => {
        return urlJoin(SKYWARP_PNL_BASE, '/v1.0/users/search');
    },

    // APPLICATION CONFIGURATION
    APP_CONFIG: (company_id, application_id) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `v1.0/company/${company_id}/application/${application_id}/configuration`
        );
    },

    //MARKETPLACE CATALOG API'S for applications/company
    CONFIG: (catalogFor, companyId) => {
        return urlJoin(
            PLATFORM_CONTENT_BASE,
            '/v1/',
            catalogFor,
            companyId ? companyId : '',
            '/admin/config'
        );
    },

    // Invite
    INVITE_USER: (company_id) => {
        return urlJoin(SKYWARP_PLTM_BASE, `/v1.0/company/${company_id}/invite/send`);
    },
    VERIFY_INVITE: () => {
        console.log(SKYWARP_PNL_BASE)
        return urlJoin(SKYWARP_PNL_BASE, `/v1.0/invite/verify`);
    },
    // Invite
    REINVITE_USER: (company_id) => {
        return urlJoin(SKYWARP_PLTM_BASE, `/v1.0/company/${company_id}/invite/resend`);
    },
    //Invite Link
    INVITE_LINK: (company_id) => {
        return urlJoin(SKYWARP_PLTM_BASE, `/v1.0/company/${company_id}/invite`);
    },
    //List Invites
    LIST_INVITES: (company_id) => {
        return urlJoin(SKYWARP_PLTM_BASE, `/v1.0/company/${company_id}/invite`);
    },
    //Delete Invites
    DELETE_INVITE: (company_id) => {
        return urlJoin(SKYWARP_PLTM_BASE, `/v1.0/company/${company_id}/invite`);
    },
    ACCEPT_INVITE: (id) => {
        return urlJoin(SKYWARP_PNL_BASE, `/v1.0/company/${id}/invite/accept`);
    },
    // Currencies
    GET_CURRENCIES: (company_id) => {
        return urlJoin(PLATFORM_CONFIGURATION_BASE, `/v1.0/company/${company_id}/currencies`);
    },
    APP_CURRENCY: (company_id, application_id) => {
        return urlJoin(PLATFORM_CONFIGURATION_BASE, `/v1.0/company/${company_id}/application/${application_id}/currency`);
    },
    // Detail
    GET_DETAIL: (company_id, application_id) => {
        return urlJoin(PLATFORM_CONFIGURATION_BASE, `/v1.0/company/${company_id}/application/${application_id}/detail`);
    },
    UPDATE_DETAIL: (company_id, application_id) => {
        return urlJoin(PLATFORM_CONFIGURATION_BASE, `/v1.0/company/${company_id}/application/${application_id}/detail`);
    },
    GET_OWNER_INFO: (company_id, application_id) => {
        return urlJoin(PLATFORM_CONFIGURATION_BASE, `/v1.0/company/${company_id}/application/${application_id}/about`);
    },

    // SLIDESHOW
    GET_SCREENSAVER: () => {
        return urlJoin(
            PLATFORM_CUSTOM_BASE,
            '/v1/application/current/slideshows'
        );
    },

    GET_SCREENSAVER_BY_SLUG: slug => {
        return urlJoin(
            PLATFORM_CUSTOM_BASE,
            '/v1/application/current/slideshows',
            slug
        );
    },

    GET_SCREENSAVER_BY_ID: id => {
        return urlJoin(
            PLATFORM_CUSTOM_BASE,
            '/v1/application/current/slideshows',
            id
        );
    },

    // Information
    GET_INFORMATION: (company_id, application_id) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `/v1.0/company/${company_id}/application/${application_id}/information`
        );
    },
    UPDATE_INFORMATION: (company_id, application_id) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `/v1.0/company/${company_id}/application/${application_id}/information`
        );
    },
    // Staff
    STAFF: data => {
        return urlJoin(
            SKYWARP_PLTM_BASE,
            `/v1.0/company/${data.company_id}/staff/${data.user_id || ''}`
        );
    },
    STAFF_LIST: (company_id) => {
        return urlJoin(
            SKYWARP_PNL_BASE,
            `/v1.0/company/${company_id}/staff/`
        );
    },
    STAFF_COUNT: company_id => {
        return urlJoin(SKYWARP_PLTM_BASE, `/v1.0/company/${company_id}/staff/count`);
    },
    FETCH_STAFF_DETAILS: params => {
        return urlJoin(
            SKYWARP_PLTM_BASE,
            `/v1.0/company/${params.company_id}/staff/details/${params.user_id}`
        );
    },
    UPDATE_EMPLOYEE_CODE: companyId => {
        return urlJoin(
            SKYWARP_PLTM_BASE,
            `/v1.0/company/${companyId}/staff/user-profile`
        );
    },
    // Staff
    ACL: (company_id) => {
        // return urlJoin(SLINGSHOT_MAIN_URL, '/v1/application/acl');
        return urlJoin(SKYWARP_PLTM_BASE, `/v1.0/company/${company_id}/staff/permissions`);
    },

    //Cloudinary
    CLOUDINARY_URL(cloudName) {
        return urlJoin(
            'https://api.cloudinary.com/v1_1/',
            cloudName,
            '/image/upload'
        );
    },

    //Collections
    // COLLECTION_LISTING: () => {
    //     return urlJoin(
    //         SILVERBOLT_PCAT_URL,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/`,
    //         '/collections/');
    // },
    // COLLECTION: slug => {
    //     return urlJoin(
    //         SILVERBOLT_PCAT_URL,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/`,
    //         '/collections/',
    //         slug,
    //         '/'
    //     );
    // },
    // COLLECTION_ALL_QUERY_OPTIONS: () => {
    //     return urlJoin(
    //         SILVERBOLT_PCAT_URL,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/`,
    //         '/collections/query-options/'
    //     );
    // },
    // COLLECTIONS_ITEMS: slug => {
    //     return urlJoin(
    //         SILVERBOLT_PCAT_URL,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/collections/`,
    //         slug,
    //         '/items/'
    //     );
    // },
    // PRODUCT_LISTING: () => {
    //     return urlJoin(PLATFORM_CONTENT_BASE, '/v1/products/');
    // },
    // PRODUCTS_LISTING: () => {
    //     return urlJoin(SILVERBOLT_PCAT_URL, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/products/`);
    // },
    //Apps:
    APP_BUILD_CONFIG: (company_id, application_id, platform) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `/v1.0/company/${company_id}/application/${application_id}/build/${platform}/configuration`
        );
    },
    APP_BUILD_VERSIONS: (company_id, application_id, platform) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `/v1.0/company/${company_id}/application/${application_id}/build/${platform}/versions`
        );
    },
    APP_BUILD_RUN: (company_id, application_id, platform) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `/v1.0/company/${company_id}/application/${application_id}/build/${platform}/run`
        );
    },
    //DEPLOYMENT STORES
    DEPLOYMENT_STORES: (company_id, application_id) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `/v1.0/company/${company_id}/application/${application_id}/ordering-store/stores`
        );
    },
    //APP TOKENS
    APP_TOKENS: (company_id, application_id) => {
        return urlJoin(PLATFORM_CONFIGURATION_BASE, `/v1.0/company/${company_id}/application/${application_id}/token/`);
    },

    //RED EXECUTORS
    // RED_EXECUTORS: () => {
    //     return urlJoin(
    //         PLATFORM_CONFIGURATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/red-executor`
    //     );
    // },

    // RED_EXECUTOR_ITEM: id => {
    //     return urlJoin(
    //         PLATFORM_CONFIGURATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/red-executor`,
    //         id
    //     );
    // },

    // //communications
    // COMMS_DUMMY_DATA_SOURCES: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sources/datasource/dummy-data-sources`);
    // },
    // COMMS_DUMMY_DATA_SOURCE_META: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sources/datasource/dummy-data-source-meta`);
    // },
    // COMMS_APP_INVENTORY: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/event/app-inventory`);
    // },
    // COMMS_SYSTEM_EVENTS: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/event/events`);
    // },
    // COMMS_DATASOURCE_N_RECORDS: () => {
    //     return urlJoin(
    //         PLATFORM_COMMUNICATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sources/get-n-records`
    //     );
    // },
    // COMMS_DATASOURCES: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sources/datasources`);
    // },
    // COMMS_DATASOURCE: (id) => {
    //     if (id) {
    //         return urlJoin(
    //             PLATFORM_COMMUNICATION_BASE,
    //             `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sources/datasources`,
    //             id
    //         );
    //     } else {
    //         return urlJoin(
    //             PLATFORM_COMMUNICATION_BASE,
    //             `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sources/datasources`
    //         );
    //     }
    // },
    // COMMS_CAMPAIGNS_OVERALL_STATS: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/campaigns/get-stats`);
    // },
    // COMMS_CAMPAIGNS: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/campaigns/campaigns`);
    // },
    // COMMS_CAMPAIGN: (id) => {
    //     if (id) {
    //         return urlJoin(
    //             PLATFORM_COMMUNICATION_BASE,
    //             `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/campaigns/campaigns`,
    //             id
    //         );
    //     } else {
    //         return urlJoin(
    //             PLATFORM_COMMUNICATION_BASE,
    //             `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/campaigns/campaigns`
    //         );
    //     }
    // },
    COMMS_CAMPAIGN_SCHEDULE: id => {
        if (id) {
            return urlJoin(
                PLATFORM_COMMUNICATION_BASE_URL,
                '/v1/campaigns/campaigns/schedule',
                id
            );
        } else {
            return urlJoin(
                PLATFORM_COMMUNICATION_BASE_URL,
                '/v1/campaigns/campaigns/schedule'
            );
        }
    },
    // COMMS_JOBS: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/jobs/jobs`);
    // },
    // COMMS_JOB: (id) => {
    //     if (id) {
    //         return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/jobs/jobs`, id);
    //     } else {
    //         return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/jobs/jobs`);
    //     }
    // },
    // COMMS_JOB_TRIGGER: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/jobs/`, `trigger-job`);
    // },
    // COMMS_JOB_LOGS: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/jobs/logs`);
    // },
    // COMMS_DEFAULT_EMAIL_PROVIDERS: () => {
    //     return urlJoin(
    //         PLATFORM_COMMUNICATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/email/default-providers`
    //     );
    // },
    // COMMS_DEFAULT_SMS_PROVIDERS: () => {
    //     return urlJoin(
    //         PLATFORM_COMMUNICATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sms/default-providers`
    //     );
    // },
    // COMMS_EMAIL_PROVIDERS: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/email/providers`);
    // },
    // COMMS_SMS_PROVIDERS: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sms/providers`);
    // },
    // COMMS_GET_APP_PROVIDER: () => {
    //     return urlJoin(
    //         PLATFORM_COMMUNICATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/app-provider/get-provider`
    //     );
    // },
    // COMMS_UPDATE_APP_PROVIDER: () => {
    //     return urlJoin(
    //         PLATFORM_COMMUNICATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/app-provider/update-provider`
    //     );
    // },
    // COMMS_GLOBAL_PROVIDERS: () => {
    //     return urlJoin(
    //         PLATFORM_COMMUNICATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/app-provider/global-providers`
    //     );
    // },
    // COMMS_EMAIL_PROVIDER: (id) => {
    //     if (id) {
    //         return urlJoin(
    //             PLATFORM_COMMUNICATION_BASE,
    //             `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/email/providers`,
    //             id
    //         );
    //     } else {
    //         return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/email/providers`);
    //     }
    // },
    // COMMS_SMS_PROVIDER: (id) => {
    //     if (id) {
    //         return urlJoin(
    //             PLATFORM_COMMUNICATION_BASE,
    //             `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sms/providers`,
    //             id
    //         );
    //     } else {
    //         return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sms/providers`);
    //     }
    // },
    // COMMS_EMAIL_TEMPLATES: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/email/templates`);
    // },
    // COMMS_SYSTEM_EMAIL_TEMPLATES: () => {
    //     return urlJoin(
    //         PLATFORM_COMMUNICATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/email/system-templates`
    //     );
    // },
    // COMMS_EMAIL_TEMPLATE: (id) => {
    //     if (id) {
    //         return urlJoin(
    //             PLATFORM_COMMUNICATION_BASE,
    //             `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/email/templates`,
    //             id
    //         );
    //     } else {
    //         return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/email/templates`);
    //     }
    // },
    // COMMS_SUBSCRIBED_EMAIL_TEMPLATES: () => {
    //     return urlJoin(
    //         PLATFORM_COMMUNICATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/email/subscribedTemplates`
    //     );
    // },
    // COMS_SEND_SYNC: () => {
    //     return urlJoin(
    //         PLATFORM_COMMUNICATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/engine/send-sync`,
    //     );
    // },
    // COMMS_SUBSCRIBED_SMS_TEMPLATES: () => {
    //     return urlJoin(
    //         PLATFORM_COMMUNICATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sms/subscribedTemplates`
    //     );
    // },
    // COMMS_SMS_TEMPLATES: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sms/templates`);
    // },
    // COMMS_SYSTEM_SMS_TEMPLATES: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sms/system-templates`);
    // },
    // COMMS_SMS_TEMPLATE: (id) => {
    //     if (id) {
    //         return urlJoin(
    //             PLATFORM_COMMUNICATION_BASE,
    //             `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sms/templates`,
    //             id
    //         );
    //     } else {
    //         return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/sms/templates`);
    //     }
    // },
    // COMMS_EVENTS_ORDER: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/event/events-order`);
    // },
    // COMMS_APP_EVENT_SUBSCRIPTIONS: (id) => {
    //     if (id) {
    //         return urlJoin(
    //             PLATFORM_COMMUNICATION_BASE,
    //             `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/event/event-subscriptions`,
    //             id
    //         );
    //     } else {
    //         return urlJoin(
    //             PLATFORM_COMMUNICATION_BASE,
    //             `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/event/event-subscriptions`
    //         );
    //     }
    // },
    // COMMS_APP_EVENT_SUBSCRIPTIONS_BULK_WRITE: () => {
    //     return urlJoin(
    //         PLATFORM_COMMUNICATION_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/event/event-subscriptions/bulkUpdate`
    //     );
    // },
    // COMMS_LOGS: () => {
    //     return urlJoin(PLATFORM_COMMUNICATION_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/log`);
    // },

    // #region Pages
    CUSTOM_PAGES: () => {
        return urlJoin(PLATFORM_CUSTOM_BASE, 'v1/application/current/pages');
    },
    GET_CUSTOM_PAGE: slug => {
        return urlJoin(
            PLATFORM_CUSTOM_BASE,
            'v1/application/current/pages',
            slug
        );
    },
    UPDATE_CUSTOM_PAGES: pageId => {
        return urlJoin(
            PLATFORM_CUSTOM_BASE,
            'v1/application/current/pages/',
            pageId
        );
    },

    FETCH_LANDING_PAGE: () => {
        return urlJoin(
            PLATFORM_CUSTOM_BASE,
            // 'v1/application/current/page/landing/meta'
            '/admin/v1/application/current/page/landing/meta'
        );
    },
    CREATE_LANDING_PAGE: () => {
        return urlJoin(
            PLATFORM_CUSTOM_BASE,
            // 'v1/application/current/page/landing/meta'
            '/v1/application/current/page/landing/meta'
        );
    },
    UPDATE_LANDING_PAGE: id => {
        return urlJoin(
            PLATFORM_CUSTOM_BASE,
            // '/admin/v1/application/current/page/landing/meta',
            'v1/application/current/page/landing/meta',
            id
        );
    },

    GET_PAGE_TYPE_SPEC: () => {
        return urlJoin(
            PLATFORM_CUSTOM_BASE,
            '/v1/application/current/specification/pagetype'
        );
    },


    PARTNER_PAGES_BASE: () => {
        return urlJoin(
            PLATFORM_CUSTOM_BASE,
            '/v1/application/current/partner/pages'
        );
    },
    GET_PARTNER_PAGE: slug => {
        return urlJoin(ADMIN_URLS.PARTNER_PAGES_BASE(), slug);
    },

    // //payments
    // GET_PAYMENT_AGGREGATORS: appId => {
    //     return urlJoin(PLATFORM_GRINGOTTS_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/aggregator/request`);
    // },
    // CREATE_PAYMENT_AGGREGATORS: appId => {
    //     return urlJoin(PLATFORM_GRINGOTTS_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/aggregator/request`);
    // },
    // UPDATE_PAYMENT_AGGREGATORS: appId => {
    //     return urlJoin(PLATFORM_GRINGOTTS_BASE, `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}/aggregator/request`);
    // },

    // #endregion


    // DASHBOARD_GROUPS: (appId) => {
    //     return urlJoin(PLATFORM_ANALYTICS_BASE, `/v1.0/company/${getCompInfo()}/${appId ? ('application/' + appId) : ''}`, '/stats/group/');
    // },
    // GET_GROUP: (groupName, appId) => {
    //     return urlJoin(PLATFORM_ANALYTICS_BASE, `/v1.0/company/${getCompInfo()}/${appId ? ('application/' + appId) : ''}`, '/stats/group/', groupName);
    // },
    // GET_GRAPH_DATA: (relativeUrl, appId) => {
    //     return urlJoin(PLATFORM_ANALYTICS_BASE, `/v1.0/company/${getCompInfo()}/${appId ? ('application/' + appId) : ''}`, relativeUrl);
    // },
    // // Home Sales Data
    // GET_HOME_SALES_DATA: data => {
    //     return urlJoin(
    //         PLATFORM_ANALYTICS_BASE,
    //         `/v1/company-stats/company-analytics/${data.component_name}`
    //     );
    // },
    // //ADMIN product config
    // APP_CATALOGUE: (slug, compId, appId) => {
    //     return urlJoin(
    //         SILVERBOLT_PCAT_URL,
    //         `/v1.0/company/${compId}/application/${appId}/product-configuration/metadata`,
    //         slug,
    //     );
    // },
    // APP_CATALOGUE_DATA: (slug, compId, appId) => {
    //     return urlJoin(
    //         SILVERBOLT_PCAT_URL,
    //         `/v1.0/company/${compId}/application/${appId}/product-configuration`,
    //         slug,
    //     );
    // },
    // APP_CATALOGUE_COMARISONS_DATA: (compId, appId) => {
    //     return urlJoin(
    //         SILVERBOLT_PCAT_URL,
    //         `/v1.0/company/${compId}/application/${appId}/product-configuration`,
    //         '/comparisons_groups/'
    //     );
    // },
    // APP_CATALOGUE_DETAILS_DATA: (compId, appId) => {
    //     return urlJoin(
    //         SILVERBOLT_PCAT_URL,
    //         `/v1.0/company/${compId}/application/${appId}/product-configuration`,
    //         '/details_groups/'
    //     );
    // },

    // // review & ratings
    // PRODUCT_REVIEWS: () => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(
    //         PLATFORM_FEEDBACK_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/reviews/`,
    //     );
    // },
    // UPDATE_REVIEW_STATUS: (reviewId) => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(
    //         PLATFORM_FEEDBACK_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/reviews/${reviewId}/approve/`,
    //     );
    // },
    // REVIEW_HISTORY: () => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(
    //         PLATFORM_FEEDBACK_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/reviews/history/`,
    //     );
    // },
    // FEEDBACK_TEMPLATE: () => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(
    //         PLATFORM_FEEDBACK_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/templates/`,
    //     );
    // },
    // FEEDBACK_ATTRIBUTE: () => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(
    //         PLATFORM_FEEDBACK_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/attributes/`,
    //     );
    // },
    // // sentinel - shortlinks
    // SHORTLINK: (companyId, applicationId) => {
    //     return urlJoin(PLATFORM_SENTINEL_BASE, '/v1.0/company/', companyId, '/application/', applicationId, '/links/short-link');
    // },
    // SHORTLINK_STATS: () => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(
    //         PLATFORM_ANALYTICS_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/stats/component/shortlink-basic`
    //     );
    // },
    // // Rewards
    // GET_USER_POINTS: userID => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(
    //         PLATFORM_REWARDS_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/users/`,
    //         userID,
    //         '/'
    //     );
    // },
    // GET_POINTS_HISTORY: userID => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(
    //         PLATFORM_REWARDS_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/users/`,
    //         userID,
    //         '/points/history/'
    //     );
    // },
    // GET_OFFERS: () => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(PLATFORM_REWARDS_BASE, `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/offers/`);
    // },
    // GET_OFFER: name => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(
    //         PLATFORM_REWARDS_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/offers/`,
    //         name,
    //         '/'
    //     );
    // },
    // UPDATE_OFFER: name => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(
    //         PLATFORM_REWARDS_BASE,
    //         `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/offers/`,
    //         name,
    //         '/'
    //     );
    // },
    // GET_GIVEAWAYS: () => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(PLATFORM_REWARDS_BASE, `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/giveaways/`);
    // },
    // GET_GIVEAWAY: id => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(PLATFORM_REWARDS_BASE, `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/giveaways/`, id, '/');
    // },
    // GET_GIVEAWAY_STATUS: () => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(PLATFORM_REWARDS_BASE, `/v1.0/company/${getCompInfo()}/application/${appInfo.id}/giveaways/`, id, '/audience/', audienceId, '/status/')
    // },

    // // Revenue
    // GET_RE_FROMULA: () => {
    //     return urlJoin(PLATFORM_BONECRUSHER_BASE, '/api/v1/re-formula/');
    // },
    // FR_STRATEGY: () => {
    //     return urlJoin(PLATFORM_BONECRUSHER_BASE, '/api/v1/fr-strategy/');
    // },
    // POST_FR_FILEMGR: () => {
    //     return urlJoin(PLATFORM_BONECRUSHER_BASE, '/api/v1/fr-filemgr/');
    // },
    // IGNORE_RE: () => {
    //     return urlJoin(PLATFORM_BONECRUSHER_BASE, '/api/v1/ignore-re/');
    // },
    // end revenue



    //Get Auto Search List Data
    // AUTO_SEARCH_DATA: (params = {}) => {
    //     let id = params.uid || '';
    //     return urlJoin(
    //         SILVERBOLT_PCAT_URL,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}`,
    //         '/search/autocomplete/',
    //         id
    //     );
    // },

    // // Unique Search
    // UNIQUE_SEARCH_DATA: (params = {}) => {
    //     let id = params.uid || '';
    //     return urlJoin(
    //         SILVERBOLT_PCAT_URL,
    //         `/v1.0/company/${getCompInfo()}/application/${getAppInfo()._id}`,
    //         '/search/keyword/',
    //         id
    //     );
    // },

    // Multidomain API's
    GET_APP_DOMAINS: (company_id, application_id, domain_name = '') => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `/v1.0/company/${company_id}/application/${application_id}/domain/`,
            domain_name
        );
    },

    GET_DOMAIN_OPTIONS: () => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `v1.0/company/${getCompInfo()}/domain/options/`
        );
    },

    FETCH_DOMAIN_OPTIONS: () => {
        return urlJoin(
            SLINGSHOT_PNL_URL,
            `v1.0/domain/options`
        )
    },

    FETCH_DOMAIN_SUGGESTIONS: () => {
        return urlJoin(
            SLINGSHOT_PNL_URL,
            `v1.0/domain/suggestions`
        )
    },

    GET_DOMAIN_SUGGESTIONS: (company_id, application_id) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `v1.0/company/${company_id}/domain/suggestions/`
        );
    },

    GET_DOMAIN_STATUS: (company_id, application_id) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `v1.0/company/${company_id}/application/${application_id}/domain/domain-status/`
        );
    },

    CHANGE_DOMAIN_TYPE: (company_id, application_id) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `v1.0/company/${company_id}/application/${application_id}/domain/set-domain/`
        );
    },

    PURCHASE_LINK_DOMAIN: (company_id, application_id) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `v1.0/company/${company_id}/application/${application_id}/domain/purchase/`
        );
    },

    DOMAIN_STATUS: (company_id, application_id) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `v1.0/company/${company_id}/application/${application_id}/domain/domain-status/`
        );
    },

    // Redirection domain API's
    GET_APP_REDIRECTION_DOMAINS: (company_id, application_id, domain_name = '') => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `/v1.0/company/${company_id}/application/${application_id}/url-redirection/`,
            domain_name
        );
    },

    GET_APP_URL_REDIRECTION_PATHS: (company_id, application_id, domain_name = '') => {
        return urlJoin(
            CONVEX_PLTM_URL,
            `/v1.0/company/${company_id}/application/${application_id}/path-mappings/`,
            domain_name
        );
    },

    APP_CONFIGURATION: (company_id, application_id) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `v1.0/company/${company_id}/application/${application_id}/configuration/`
        );
    },

    GET_COMPANY_BRANDS: () => {
        return urlJoin(WHEELJACK_PCPR_URL, `/v1.0/company/${getCompInfo()}/company-brand/`);
    },
    COMPANY_FRANCHISE: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, 'v1/onboarding/company/franchise/');
    },
    ADD_BRAND: () => {
        return urlJoin(WHEELJACK_PCPR_URL, `/v1.0/company/${getCompInfo()}/brand/`);
    },
    COMPANY_BRAND_BY_ID: params => {
        return urlJoin(WHEELJACK_PCPR_URL, `/v1.0/company/${getCompInfo()}/brand/${params.brandId}`);
    },
    COMPANY_BRAND_TO_PROFILE: () => {
        return urlJoin(WHEELJACK_PCPR_URL, `/v1.0/company/${getCompInfo()}/company-brand/`);
    },
    GET_CHOICE_TYPES: () => {
        return urlJoin(WHEELJACK_PNLCPR_URL, '/v1.0/choices/');
    },
    COMPANY_STORES: () => {
        return urlJoin(WHEELJACK_PCPR_URL, `/v1.0/company/${getCompInfo()}/location/`);
    },
    ONE_STORE: params => {
        return urlJoin(
            WHEELJACK_PCPR_URL,
            `/v1.0/company/${getCompInfo()}/location/${params.locationId}`);
    },
    GET_COMPANY_LIST: () => {
        return urlJoin(WHEELJACK_PNLCPR_URL, '/v1.0/companies');
    },
    INVENTORY: (item_id, size) => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/${item_id}/sizes/${size}`);
    },
    GET_INVENTORY: (item_id, size) => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/${item_id}/sizes/${size}`);
    },
    GET_COMPANY_BRANDS_BY_COMPANY: (company_id) => {
        return urlJoin(PLATFORM_CONFIGURATION_BASE, `v1.0/company/${company_id}/inventory/brands-by-companies`);
    },
    COMPANY_BY_BRANDS: (company_id) => {
        return urlJoin(PLATFORM_CONFIGURATION_BASE, `v1.0/company/${company_id}/inventory/companies-by-brands`);
    },
    STORES_BY_BRANDS: (company_id) => {
        return urlJoin(PLATFORM_CONFIGURATION_BASE, `v1.0/company/${company_id}/inventory/stores-by-brands`);
    },
    GET_APPLICATION_LIST: (params = {}) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `/v1.0/company/${params.company_id}/application`
        );
    },
    GET_USER_PIN_ROUTES: (params = {}) => {
        return urlJoin(SKYWARP_PLTM_BASE, `v1.0/company/${params.company_id}/user-pin`);
    },
    UPDATE_USER_PIN_ROUTES: (params = {}) => {
        return urlJoin(SKYWARP_PLTM_BASE, `v1.0/company/${params.company_id}/user-pin`);
    },
    SAVE_APPLICATION_CONFIG: (params = {}) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `v1.0/company/${params.company_id}/application/${params.app_id}/configuration`
        );
    },
    SAVE_CREATE_APPLICATION: (params = {}) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            'v1.0/company',
            params.company_id,
            'application'
        );
    },
    GET_OTHER_SELLERS: (company_id, channel_id = '') => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `v1.0/company/${company_id}/other-seller-applications/${channel_id}`
        );
    },
    GET_OTHER_SELLER_CHANNEL_STATS: (companyId, channelId) => {
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `/v1.0/company/${companyId}/`,
            `/cross-selling/${channelId}/analytics/insights/`
        )
    },
    OPT_OUT_OTHER_SELLERS: (company_id, channel_id) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `v1.0/company/${company_id}/other-seller-applications/${channel_id}/opt_out`
        );
    },

    PRODUCT: (item_id) => {
        let url = `v1.0/company/${getCompInfo()}/products/`
        if (item_id) {
            url += item_id
        }
        return urlJoin(SILVERBOLT_PCAT_URL, url);
    },
    GET_PRODUCT: (item_id) => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/${item_id}`);
    },
    DELETE_PRODUCT: (item_id) => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/${item_id}`)
    },
    // product-bundle
    PRODUCT_GROUPING: params => {
        const { bundleId, company_id } = params;
        // const requestUrl = bundleId
        //     ? `/v1/seller/${company_id}/admin/product-grouping/${bundleId}`
        //     : `/v1/seller/${company_id}/admin/product-grouping/`;
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `/v1.0/company/${getCompInfo()}/product-bundle/`,
            bundleId || ''
        );
    },
    GET_PRODUCT_SIZES: (item_id) => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/${item_id}/sizes`);
    },

    GET_PRODUCT_REQUEST_LIST: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, `v1/product-request/`);
    },
    GET_PRODUCT_REQUEST: id => {
        return urlJoin(SILVERBOLT_MAIN_URL, `v1/product-request/${id}`);
    },
    ARCHIVE_PRODUCT_SIZE: (item_id, size) => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/${item_id}/sizes/${size}`);
    },
    ARCHIVE_PRODUCT_INVENTORY: (item_id, size, store_id) => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/${item_id}/sizes/${size}/location/${store_id}`);
    },

    GET_DEPARTMENTS: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/departments/`);
    },
    GET_CATEGORIES: () => {
        return urlJoin(SILVERBOLT_PCAT_URL,
            `/v1.0/company/${getCompInfo()}/products/templates/categories/`);
    },
    // remove and and new api from
    HSN_COUNTRY_CODES: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `/v1.0/company/${getCompInfo()}/products/hsn`);
    },
    GET_COMPANY_TAGS: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/tags`)
    },
    // FETCH_ITEM_TYPES: () => {
    //     return urlJoin(SILVERBOLT_MAIN_URL, 'v1/onboarding/choices/');
    // },
    // GET_TEMPLATE_BY_CATEGORY: () => {
    //     return urlJoin(SILVERBOLT_MAIN_URL, 'v1/product-templates/')
    // },
    GET_PRODUCT_TEMPLATES: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/templates/`);
    },
    // GET_PRODUCT_TEMPLATES_DETAILS: templateSlug => {
    //     return urlJoin(
    //         SILVERBOLT_MAIN_URL,
    //         'v1/product-templates/',
    //         templateSlug,
    //         '/details/'
    //     );
    // },
    PRODUCT_TEMPLATE_VALIDATION: slug => {
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `/v1.0/company/${getCompInfo()}/products/templates/${slug}/validation/schema`
        );
    },
    INVENTORY_TEMPLATE_VALIDATION: () => {
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `/v1.0/company/${getCompInfo()}/inventory/templates/validation/schema`
        );
    },

    // export product templates
    PRODUCT_TEMPLATE_EXPORT: () => {
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `/v1.0/company/${getCompInfo()}/products/downloads`
        );
    },
    PRODUCT_TEMPLATE_FILTER_LIST: () => {
        return urlJoin(
            SILVERBOLT_MAIN_URL,
            `/v1/product-templates/filter-list`
        );
    },
    PRODUCT_TEMPLATE_FILTERS: companyId => {
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `/v1.0/company/${getCompInfo()}/downloads/configuration/`
        );
    },
    // export inventory
    PRODUCT_INVENTORY_EXPORT: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/inventory/download/`);
    },
    PRODUCT_INVENTORY_FILTER_LIST: () => {
        // remove it and hardcode it on UI
        // reponse = {"data": ["store", "brand", "type"]}
        return urlJoin(SILVERBOLT_MAIN_URL, `/v1/inventory/filter-list`);
    },
    PRODUCT_INVENTORY_FILTERS: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/inventory/download/configuration/`);
    },

    INVENTORY_VALIDATION_SCHEMA: () => {
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `/v1.0/company/${getCompInfo()}/inventory/templates/validation/schema`
        );
    },
    VALIDATE_ATTRIBUTES: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/validation/`);
    },
    VARIANT_TYPES: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/variant-types/`);
    },
    GET_L3_CATEGORIES: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/category/`);
    },
    COMPANY_PROFILE: () => {
        return urlJoin(WHEELJACK_PCPR_URL, `/v1.0/company/${getCompInfo()}`);
    },
    GET_BUSINESS_COUNTRIES: () => {
        return urlJoin(WHEELJACK_PNLCPR_URL, '/v1.0/countries');
    },
    GET_METRICS_API: () => {
        return urlJoin(WHEELJACK_PCPR_URL, `/v1.0/company/${getCompInfo()}/metrics`);
    },
    GET_COMPANY_METRICS_API: (params = null) => {
        return urlJoin(
            PRISM_URL,
            'api/v1/inventory/company-metrics',
            params.company
        );
    },
    VALIDATE_DOCUMENT: () => {
        return urlJoin(WHEELJACK_PNLCPR_URL, '/v1.0/documents/verification/config');
    },
    SAVE_DOCUMENT: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, '/v1/onboarding/edit-documents');
    },
    GET_PUBLIC_URL: () => {
        let urlPath = `/v1.0/company/${getCompInfo()}/sign-urls/`
        return urlJoin(PLATFORM_ASSETS_BASE, urlPath);
    },
    DOWNLOAD_SAMPLE_PRODUCT_TEMPLATE: slug => {
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `v1.0/company/${getCompInfo()}/products/templates/${slug}/download`
        );
    },
    DOWNLOAD_SAMPLE_INVENTORY_TEMPLATE: () => {
        return urlJoin(SILVERBOLT_MAIN_URL, `/v1/inventory-templates/download`);
    },
    BULK_PRODUCT_REQUEST: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/bulk/`);
    },
    BULK_PRODUCT_SEND: (batch_id) => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/bulk/${batch_id}`);
    },
    BULK_ASSETS: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/assets/bulk/`);
    },
    BULK_INVENTORY_REQUEST: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/inventory/bulk/`);
    },
    BULK_INVENTORY_SEND: (batch_id) => {
        return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/inventory/bulk/${batch_id}`);
    },

    //marketplaces
    MARKETPLACES: companyId => {
        return urlJoin(
            MARKETPLACES_PLTM_URL,
            '/v1.0/company',
            companyId,
            '/channels'
        );
    },
    MARKETPLACES_ACCESS: companyId => {
        return urlJoin(
            MARKETPLACES_PLTM_URL,
            `/v1.0/company/${companyId}/all-channels`
        );
    },
    MARKETPLACE_CONFIG: (companyId, marketplace) => {
        return urlJoin(
            MARKETPLACES_PLTM_URL,
            '/v1.0/company',
            companyId,
            '/channels/',
            marketplace
        );
    },
    MARKETPLACE_SYNC_CONFIG: (companyId, marketplace) => {
        return urlJoin(
            MARKETPLACES_PLTM_URL,
            '/v1.0/company',
            companyId,
            '/channels/',
            marketplace,
            'inventory/config'
        );
    },
    MARKETPLACE_STORES: (companyId, marketplace) => {
        return urlJoin(
            MARKETPLACES_PLTM_URL,
            '/v1.0/company',
            companyId,
            '/channels/',
            marketplace,
            'location/config'
        );
    },
    MARKETPLACE_STORES_MAPPING: (companyId, marketplace) => {
        return urlJoin(
            MARKETPLACES_PLTM_URL,
            '/v1.0/company',
            companyId,
            '/channels/',
            marketplace,
            'location/config'
        );
    },
    MARKETPLACE_LOGS: () => {
        return urlJoin(PLATFORM_ANALYTICS_BASE, `/v1.0/company/${getCompInfo()}/logs/marketplaces`);
    },
    SEARCH_MARKETPLACE_LOGS: () => {
        return urlJoin(PLATFORM_ANALYTICS_BASE, `/v1.0/company/${getCompInfo()}/logs/marketplaces/search`);
    },
    EXPORT_CSV: () => {
        return urlJoin(PLATFORM_ANALYTICS_BASE, `/v1.0/company/${getCompInfo()}/export/csv`);
    },
    EXPORT_JOB_STATUS: (jobId) => {
        return urlJoin(PLATFORM_ANALYTICS_BASE, `/v1.0/company/${getCompInfo()}/export/csv/job/${jobId}`);
    },
    ABANDONED_CHECKOUT: (appId, from, to) => {
        return urlJoin(PLATFORM_ANALYTICS_BASE, `/v1.0/company/${getCompInfo()}/application/${appId}/`, `/cart/from/${from}/to/${to}/abandon-cart`);
    },
    CART_DETAILS: (id, appId) => {
        return urlJoin(PLATFORM_ANALYTICS_BASE, `/v1.0/company/${getCompInfo()}/application/${appId}/`, '/cart/', id);
    },
    INVENTORY_UPDATES: (updateType, companyId, marketplace) => {
        return urlJoin(
            MARKETPLACES_PLTM_URL,
            '/v1.0/company/',
            companyId,
            '/channels/',
            marketplace,
            '/inventory/',
            updateType,
            '/sync'
        );
    },
    MARKETPLACE_STATUS: (companyId, marketplace) => {
        return urlJoin(
            MARKETPLACES_PLTM_URL,
            '/v1.0/company',
            companyId,
            '/channels/',
            marketplace,
            'status'
        );
    },
    AUTO_MAP_PRODUCTS: (companyId, marketplace) => {
        return urlJoin(
            MARKETPLACES_PLTM_URL,
            '/v1.0/company',
            companyId,
            '/channels/',
            marketplace,
            '/products/map'
        );
    },
    MARKETPLACES_ID_MAP: (companyId) => {
        // return urlJoin(PRISM_URL, '/api/v1/inventory-sync/marketplace-id-map');
        return urlJoin(MARKETPLACES_PLTM_URL, '/v1.0/company', companyId, 'inventory-sync/marketplace-id-map');
    },
    DOWNLOAD_MAPPING: (companyId) => {
        // return urlJoin(
        //     PRISM_URL,
        //     '/api/v1/inventory-sync/marketplace-id-map/generate'
        // );
        return urlJoin(MARKETPLACES_PLTM_URL, '/v1.0/company', companyId, 'inventory-sync/marketplace-id-map/generate');
    },
    DOWNLOAD_JOB_STATUS: (companyId) => {
        // return urlJoin(
        //     PRISM_URL,
        //     '/api/v1/inventory-sync/marketplace-id-map/generate/status'
        // );
        return urlJoin(MARKETPLACES_PLTM_URL, '/v1.0/company', companyId, 'inventory-sync/marketplace-id-map/generate/status');
    },
    MARKETPLACE_IDENTIFIERS: (companyId) => {
        // return urlJoin(PRISM_URL, '/api/v1/inventory-sync/marketplaces');
        return urlJoin(MARKETPLACES_PLTM_URL, '/v1.0/company', companyId, 'inventory-sync/channels');
    },
    ARTICLE_IDENTIFIERS: (companyId) => {
        // return urlJoin(PRISM_URL, '/api/v1/inventory-sync/article-identifiers');
        return urlJoin(MARKETPLACES_PLTM_URL, '/v1.0/company', companyId, 'inventory-sync/article-identifiers');
    },
    SKU_LIST: (marketplace, companyId) => {
        // return urlJoin(
        //     PRISM_URL,
        //     '/api/v1/inventory-sync/platform-marketplace-id-map',
        //     companyId,
        //     marketplace
        // );
        return urlJoin(MARKETPLACES_PLTM_URL, '/v1.0/company', companyId, 'inventory-sync/platform-marketplace-id-map', marketplace);
    },
    ITEM_MAPPINGS: (itemId, marketplace, companyId) => {
        return urlJoin(
            PRISM_URL,
            '/api/v1/inventory-sync/fetch-article-identifiers',
            companyId,
            marketplace,
            itemId
        );
    },
    PRODUCTS: urlSearchParams => {
        if (!urlSearchParams) {
            return urlJoin(SILVERBOLT_PCAT_URL, `v1.0/company/${getCompInfo()}/products/`);
        }
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `v1.0/company/${getCompInfo()}/products/?${urlSearchParams.toString()}`
        );
    },
    BRANDS: () => {
        return urlJoin(PRISM_URL, '/api/v1/admin/brands/');
    },
    STORES: () => {
        return urlJoin(PRISM_URL, '/api/v1/admin/stores/');
    },
    PLATFORM_OPT_IN: () => {
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `/v1.0/company/${getCompInfo()}/marketplaces/`);
    },
    PLATFORM_OPT_IN_MARKETPLACE: (marketplace) => {
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `/v1.0/company/${getCompInfo()}/marketplaces/${marketplace}/optin`);
    },
    STORE_DETAILS: () => {
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `/v1.0/company/${getCompInfo()}/marketplaces/location-details`);
        // return urlJoin(PRISM_URL, '/api/v1/inventory/store-details');
    },
    BRAND_DETAILS: () => {
        return urlJoin(
            SILVERBOLT_PCAT_URL,
            `/v1.0/company/${getCompInfo()}/marketplaces/company-brand-details`
        );
        // return urlJoin(PRISM_URL, '/api/v1/inventory/company-brand-details');
    },

    // SEO URLs
    // GET_SEO: () => {
    //     let appInfo = getAppInfo();
    //     return urlJoin(
    //         CONVEX_PLTM_URL,
    //         `v1.0/company/${getCompInfo()}/application/${appInfo.id}/seo`
    //     );
    // },

    // integration URLs
    INTEGRATIONS: (company_id = '') => {
        return urlJoin(PLATFORM_CONFIGURATION_BASE, `v1.0/company/${company_id}`, 'integration-opt-in/available');
    },
    INTEGRATION: integrationId => {
        return urlJoin(PLATFORM_CONFIGURATION_BASE, `v1.0/company/${getCompInfo()}`, `integration/${integrationId}`);
    },
    STORES_BY_COMPANY: (uid) => {
        return urlJoin(PLATFORM_CONFIGURATION_BASE, `v1.0/company/${uid}/inventory/company/${uid}`);
    },
    OPTED_INTEGRATIONS: params => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE, `v1.0/company/${getCompInfo()}`,
            `integration-opt-in/selected/${params.level}/${params.uid}`
        );
    },
    INTEGRATION_CONFIGURATIONS: (paramsCompanyId, integrationId, level) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE, `v1.0/company/${paramsCompanyId}`,
            `integration-opt-in/configuration/${integrationId}/${level}`
        );

        // temporary to MAIN SERVER
        // return urlJoin(
        //     PLATFORM_COMMON_BASE,
        //     `integration-opt-in/companies/${paramsCompanyId}/configuration/${integrationId}/${level}`
        // );
    },
    GET_INTEGRATION_CONFIGURATIONS: (integrationId, level) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE, `v1.0/company/${getCompInfo()}`,
            `integration-opt-in/configuration/${integrationId}/${level}`
        );
    },
    INTEGRATION_CONFIGURATION: (paramsCompanyId, integrationId, level, uid) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE, `v1.0/company/${paramsCompanyId}`,
            `integration-opt-in/configuration/${integrationId}/${level}/${uid}`
        );

        // temporary to MAIN SERVER
        // return urlJoin(
        //     PLATFORM_COMMON_BASE,
        //     `integration-opt-in/companies/${paramsCompanyId}/configuration/${integrationId}/${level}/${uid}`
        // );
    },
    GET_INTEGRATION_CONFIGURATION: (integrationId, level, uid) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE, `v1.0/company/${getCompInfo()}`,
            `integration-opt-in/configuration/${integrationId}/${level}/${uid}`
        );
    },
    INTEGRATION_CONFIGURATION_CHECK: (integrationId, uid) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE, `v1.0/company/${getCompInfo()}`,
            `integration-opt-in/check/configuration/${integrationId}/store/${uid}`
        );
    },
    INTEGRATION_CONFIGURATIONS_CHECK: integrationId => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE, `v1.0/company/${getCompInfo()}`,
            `integration-opt-in/check/configuration/${integrationId}/store`
        );
    },

    FETCH_APPLICATION_CONFIG: (params = null) => {
        return urlJoin(
            PLATFORM_CONFIGURATION_BASE,
            `v1.0/company/${params.company_id}/application/${params.application}/configuration`
        );
    },
    GET_PLATFORM_NOTIFICATIONS: () => {
        return urlJoin(
            PLATFORM_COMMUNICATION_BASE,
            `/v1.0/company/${getCompInfo()}/notification/system-notifications`
        );
    },

    TICKET_FEEDBACK: (company_id, applicationId = '', ticket_id) => {
        if (applicationId && applicationId != '') {
            return urlJoin(PLATFORM_LEADS_BASE, `v1.0/company/${company_id}/application/${applicationId}/ticket/${ticket_id}/feedback`);
        } else {
            return urlJoin(PLATFORM_LEADS_BASE, `v1.0/company/${company_id}/ticket/${ticket_id}/feedback`);
        }
    },

    CREATE_VIDEO_ROOM: (company_id, applicationId = '') => {
        if (applicationId && applicationId != '') {
            return urlJoin(PLATFORM_LEADS_BASE, `v1.0/company/${company_id}/application/${applicationId}/video/room`);
        } else {
            return urlJoin(PLATFORM_LEADS_BASE, `v1.0/company/${company_id}/video/room`);
        }
    },

    GET_VIDEO_ROOM_TOKEN: (company_id, applicationId = '', unique_name) => {
        if (applicationId && applicationId != '') {
            return urlJoin(PLATFORM_LEADS_BASE, `v1.0/company/${company_id}/application/${applicationId}/video/room/${unique_name}/token`);
        } else {
            return urlJoin(PLATFORM_LEADS_BASE, `v1.0/company/${company_id}/video/room/${unique_name}/token`);
        }
    },

    GET_VIDEO_ROOM_PARTICIPANTS: (company_id, applicationId = '', unique_name) => {
        if (applicationId && applicationId != '') {
            return urlJoin(PLATFORM_LEADS_BASE, `v1.0/company/${company_id}/application/${applicationId}/video/room/${unique_name}/participants`);
        } else {
            return urlJoin(PLATFORM_LEADS_BASE, `v1.0/company/${company_id}/video/room/${unique_name}/participants`);
        }
    },

    FETCH_FORM: (company_id, applicationId, slug = '') => {
        if (slug && slug != '') {
            return urlJoin(PLATFORM_LEADS_BASE, `v1.0/company/${company_id}/application/${applicationId}/form/${slug}`);
        } else {
            return urlJoin(PLATFORM_LEADS_BASE, `v1.0/company/${company_id}/application/${applicationId}/form`);
        }
    },

    FETCH_DRIs: (company_id = '') => {
        return urlJoin(
            WHEELJACK_PCPR_URL,
            `/v1.0/company/${company_id}/poc/?status=true`
        );
    },

    FETCH_PRODUCT_INFO: slug => {
        return urlJoin(PLATFORM_CONTENT_BASE, `v1/products/${slug}`);
    },

    // sales channels stores
    SALES_CHANNEL_STORES: () => {
        return urlJoin(PLATFORM_CONTENT_BASE, '/v1/admin/analytics/store-list');
    },

    HSN_CODE_MAPPINGS: () => {
        return urlJoin(AVIS_MAIN_URL, `/api/v1/oms/hsn-code-mappings`);
    },

    SIZE_GUIDE_URL: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `/v1.0/company/${getCompInfo()}/sizeguide/`);
    },
    ONE_SIZEGUIDE_URL: slug => {
        return urlJoin(SILVERBOLT_PCAT_URL, `/v1.0/company/${getCompInfo()}/sizeguide/${slug}`);
    },
    GALVATRON_URL: companyId => {
        return urlJoin(GALVATRON_MAIN_URL, `/v1.0/company/${companyId}`);
    },

    SAVE_JOB_CONFIG_DETAILS: () => {
        return urlJoin(SWOOP_BASE, `/v1.0/company/${getCompInfo()}/jobs`)
    }, // update existing job

    GET_INTEGRATION_JOBS: (company_id = '', integration_id = '') => {
        return urlJoin(SWOOP_BASE, `/v1.0/company/${getCompInfo()}/jobs/code/integration/${integration_id}`)
    }, // list all job codes

    GET_JOB_BY_CODE: (job_code = '') => {
        return urlJoin(SWOOP_BASE, `/v1.0/company/${getCompInfo()}/jobs/code/${job_code}`)
    }, // get job by code

    GET_DEFAULT_JOB_CONFIG: () => {
        return urlJoin(SWOOP_BASE, `/v1.0/company/${getCompInfo()}/jobs/defaults`)
    }, // get default job config

    //roles
    // ROLE_TITLE: function (role_title) {
    //     return urlJoin(getUrlWithCompanyId('v1.0', SKYWARP_PLTM_BASE), `/role/${role_title}`);
    // },
    // ROLE: function () {
    //     return urlJoin(getUrlWithCompanyId('v1.0', SKYWARP_PLTM_BASE), `/role`);
    // },

    HSN_CODE_LIST_CREATE: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `/v1.0/company/${getCompInfo()}/hsn`)
    },

    HSN_CODE_RETRIVE_UPDATE_DELETE: (uid) => {
        return urlJoin(SILVERBOLT_PCAT_URL, `/v1.0/company/${getCompInfo()}/hsn/${uid}`)
    },

    GET_PRODUCT_ATTRIBUTE_BY_SLUG: (slug) => {
        return urlJoin(SILVERBOLT_PCAT_URL, `/v1.0/company/${getCompInfo()}/product-attributes/${slug}`)
    },
    FETCH_VERIFICATION_COMPANY: () => {
        return urlJoin(SILVERBOLT_PCAT_URL, `/v1.0/company/${getCompInfo()}/verification/company`);
    },

    FETCH_VERIFICATION_PRODUCT: (itemId) => {
        return urlJoin(SILVERBOLT_PCAT_URL, `/v1.0/company/${getCompInfo()}/verification/products/${itemId}`);
    },
    PARTNER_INVITES(id = ''){
        return urlJoin(MIXMASTER_PLTM_URL, `/v1.0/company/${getCompInfo()}/partner-request/${id}`);
    }
};

export default ADMIN_URLS;
