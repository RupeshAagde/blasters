'use strict';
const convict = require('convict');

const platformDomain = process.env['FYND_PLATFORM_DOMAIN'] || "";

const conf = convict({
    env: {
        doc: 'Env',
        default: '',
        env: 'ENV',
        arg: 'env'
    },
    PORT: {
        doc: 'The port to bind',
        format: 'port',
        default: 8086,
        env: 'PORT',
        arg: 'port'
    },
    BROWSER_CONFIG: {
        FYND_PLATFORM_DOMAIN: {
            doc: 'Fynd Platform Domain',
            format: String,
            default: '',
            env: 'FYND_PLATFORM_DOMAIN',
            arg: 'fynd_platform_domain'
        },
        MIRAGE_MAIN_DOMAIN: {
            doc: "Mirage Main Domain",
            format: String,
            default: `https://platform.${platformDomain}`,
            env: "MIRAGE_MAIN_DOMAIN",
            arg: "mirage_main_domain"
        },
        BRAINSTORM_EXTENSION_DOMAIN: {
            doc: "Brainstorm Extension Domain",
            format: String,
            default: `https://extensions.${platformDomain}`,
            env: "BRAINSTORM_EXTENSION_DOMAIN",
            arg: "brainstorm_extension_domain"
        },
        BRAINSTORM_THEME_DOMAIN: {
            doc: "Brainstorm Theme Domain",
            format: String,
            default: `https://themes.${platformDomain}`,
            env: "BRAINSTORM_THEME_DOMAIN",
            arg: "brainstorm_theme_domain"
        },
        BOMBSHELL_MAIN_DOMAIN: {
            doc: "Bombshell Main Domain",
            format: String,
            default: `https://partners.${platformDomain}`,
            env: "BOMBSHELL_MAIN_DOMAIN",
            arg: "bombshell_main_domain"
        },
        BLASTER_MAIN_DOMAIN: {
            doc: "Blaster Main Domain",
            format: String,
            default: ``,
            env: "BLASTER_MAIN_DOMAIN",
            arg: "blaster_main_domain"
        },
        SLINGSHOT_ADMIN_URL: {
            doc: 'Slingshot Admin URL',
            format: String,
            default: '',
            env: 'SLINGSHOT_ADMIN_URL',
            arg: 'slingshot_admin_url'
        },
        SLINGSHOT_ADMIN_SVC: {
            doc: 'Slingshot Admin Service',
            format: String,
            default: '',
            env: 'SLINGSHOT_ADMIN_SVC',
            arg: 'slingshot_admin_svc'
        },
        SLINGSHOT_PUBLIC_URL: {
            doc: 'Slingshot Public Service',
            format: String,
            default: '',
            env: 'SLINGSHOT_PUBLIC_URL',
            arg: 'slingshot_public_url'
        },
        SLINGSHOT_PUBLIC_SVC: {
            doc: 'Slingshot Public Service',
            format: String,
            default: '',
            env: 'SLINGSHOT_PUBLIC_SVC',
            arg: 'slingshot_public_svc'
        },
        BLITZKRIEG_MAIN_URL: {
            doc: 'Themes API',
            format: String,
            default: '',
            env: 'BLITZKRIEG_MAIN_URL',
            arg: 'BLITZKRIEG_MAIN_URL'
        },
        BLITZKRIEG_MAIN_SVC: {
            doc: 'Themes API private',
            format: String,
            default: '',
            env: 'BLITZKRIEG_MAIN_SVC',
            arg: 'BLITZKRIEG_MAIN_SVC'
        },
        ULTRAMAGNUS_PUBLIC_URL: {
            doc: 'Internal Settings API',
            format: String,
            default: '',
            env: 'ULTRAMAGNUS_PUBLIC_URL',
            arg: 'ULTRAMAGNUS_PUBLIC_URL'
        },
        ULTRAMAGNUS_PUBLIC_SVC: {
            doc: 'Internal Settings API public',
            format: String,
            default: '',
            env: 'ULTRAMAGNUS_PUBLIC_SVC',
            arg: 'ULTRAMAGNUS_PUBLIC_SVC'
        },
        ULTRAMAGNUS_ADMIN_URL: {
            doc: 'Internal Settings API',
            format: String,
            default: '',
            env: 'ULTRAMAGNUS_ADMIN_URL',
            arg: 'ULTRAMAGNUS_ADMIN_URL'
        },
        ULTRAMAGNUS_ADMIN_SVC: {
            doc: 'Internal Settings API administrator',
            format: String,
            default: '',
            env: 'ULTRAMAGNUS_ADMIN_SVC',
            arg: 'ULTRAMAGNUS_ADMIN_SVC'
        },
        HIGHBROW_ADMIN_URL: {
            doc: 'Platform Custom Main Public URL to hit',
            format: String,
            default: '',
            env: 'HIGHBROW_ADMIN_URL',
            arg: 'highbrow_admin_url'
        },
        HIGHBROW_ADMIN_SVC: {
            doc: 'Platform Custom Main Public URL to hit',
            format: String,
            default: '',
            env: 'HIGHBROW_ADMIN_SVC',
            arg: 'highbrow_admin_svc'
        },
        APEFACE_ADMIN_URL: {
            doc: 'Admin Orders URL',
            format: String,
            default: '',
            env: 'APEFACE_ADMIN_URL',
            arg: 'apeface_admin_url'
        },
        APEFACE_ADMIN_SVC: {
            doc: 'Admin Orders Service',
            format: String,
            default: '',
            env: 'APEFACE_ADMIN_SVC',
            arg: 'apeface_admin_svc'
        },
        SEARCHLIGHT_MAIN_DOMAIN: {
            doc: 'SEARCHLIGTH URL FOR HELP DATA',
            format: String,
            default: '',
            env: 'SEARCHLIGHT_MAIN_DOMAIN',
            arg: 'searchlight_main_domain'
        },
        SEARCHLIGHT_MAIN_SVC: {
            doc: 'SEARCHLIGTH URL FOR HELP DATA',
            format: String,
            default: '',
            env: 'SEARCHLIGHT_MAIN_SVC',
            arg: 'searchlight_main_svc'
        },
        PLATFORM_COMMON_MAIN_URL: {
            doc: 'Platform Common  Public URL to hit',
            format: String,
            default: '',
            env: 'PLATFORM_COMMON_MAIN_URL',
            arg: 'platform_common_main_url'
        },
        PLATFORM_COMMON_MAIN_SVC: {
            doc: 'Platform Common Service',
            format: String,
            default: '',
            env: 'PLATFORM_COMMON_MAIN_SVC',
            arg: 'platform_common_main_svc'
        },
        GRINDOR_ADMIN_URL: {
            doc: 'Grindor file upload service URL',
            format: String,
            default: '',
            env: 'GRINDOR_ADMIN_URL',
            arg: 'GRINDOR_ADMIN_URL'
        },
        GRINDOR_MAIN_SVC: {
            doc: 'Grindor file upload service',
            format: String,
            default: '',
            env: 'GRINDOR_MAIN_SVC',
            arg: 'GRINDOR_MAIN_SVC'
        },
        GRINGOTTS_MAIN_URL: {
            doc: 'Gringgotts Public URL',
            format: String,
            default: '',
            env: 'GRINGOTTS_MAIN_URL',
            arg: 'gringotts_main_url'
        },
        GRINGOTTS_ADMIN_URL: {
            doc: 'Gringotts admin url',
            format: String,
            default: '',
            env: 'GRINGOTTS_ADMIN_URL',
            arg: 'gringotts_admin_url'
        },
        GRIMLOCK_MAIN_URL: {
            doc: 'GrimlockWeb Main URL',
            format: String,
            default: '',
            env: 'GRIMLOCK_MAIN_URL',
            arg: 'grimlock_main_url'
        },
        GRIMLOCK_MAIN_SVC: {
            doc: 'GrimlockWeb Main SVC',
            format: String,
            default: '',
            env: 'GRIMLOCK_MAIN_SVC',
            arg: 'grimlock_main_svc'
        },
        GRIMLOCKWEB_MAIN_DOMAIN: {
            doc: 'GrimlockWeb Main Domain',
            format: String,
            default: '',
            env: 'GRIMLOCKWEB_MAIN_DOMAIN',
            arg: 'grimlockweb_main_domain'
        },
        SILVERBOLT_MAIN_SVC: {
            doc: 'Seller Kube Service',
            format: String,
            default: '',
            env: 'SILVERBOLT_MAIN_SVC',
            arg: 'silverbolt_main_svc'
        },
        SILVERBOLT_MAIN_URL: {
            doc: 'Seller Kube Service',
            format: String,
            default: '',
            env: 'SILVERBOLT_MAIN_URL',
            arg: 'silverbolt_main_url'
        },
        WHEELJACK_ACPR_URL: {
            doc: 'Seller Kube Service',
            format: String,
            default: '',
            env: 'WHEELJACK_ACPR_URL',
            arg: 'wheeljack_acpr_url'
        },
        SILVERBOLT_ACAT_URL: {
            doc: 'Seller Kube Service',
            format: String,
            default: '',
            env: 'SILVERBOLT_ACAT_URL',
            arg: 'silverbolt_acat_url'
        },
        WHEELJACK_PCPR_URL: {
            doc: 'Platform Company profile Kube Service',
            format: String,
            default: '',
            env: 'WHEELJACK_PCPR_URL',
            arg: 'wheeljack_pcpr_url'
        },
        WHEELJACK_PNLCPR_URL: {
            doc: 'Panel Company profile Kube Service',
            format: String,
            default: '',
            env: 'WHEELJACK_PNLCPR_URL',
            arg: 'wheeljack_pnlcpr_url'
        },
        SKYWARP_MAIN_SVC: {
            doc: 'Skywrap Kube Service',
            format: String,
            default: '',
            env: 'SKYWARP_MAIN_SVC',
            arg: 'skywarp_main_svc'
        },
        SKYWARP_MAIN_URL: {
            doc: 'Skywrap Kube Service',
            format: String,
            default: '',
            env: 'SKYWARP_MAIN_URL',
            arg: 'skywarp_main_url'
        },
        SKYWARP_PNL_URL: {
            doc: 'Skywrap Panel Kube Service',
            format: String,
            default: '',
            env: 'SKYWARP_PNL_URL',
            arg: 'skywarp_pnl_url'
        },
        SKYWARP_ADMIN_URL: {
            doc: 'Skywrap Administrator Kube Service',
            format: String,
            default: '',
            env: 'SKYWARP_ADMIN_URL',
            arg: 'SKYWARP_ADMIN_URL'
        },
        UNICRON_ADMIN_URL: {
            doc: 'Billing service API',
            format: String,
            default: '',
            env: 'UNICRON_ADMIN_URL',
            arg: 'UNICRON_ADMIN_URL'
        },
        UNICRON_ADMIN_SVC: {
            doc: 'Billing service API private',
            format: String,
            default: '',
            env: 'UNICRON_ADMIN_SVC',
            arg: 'UNICRON_ADMIN_SVC'
        },
        UNICRON_PUBLIC_URL: {
            doc: 'Billing service API',
            format: String,
            default: 'https://api.fyndx0.de/service/public/billing',
            env: 'UNICRON_PUBLIC_URL',
            arg: 'UNICRON_PUBLIC_URL'
        },
        UNICRON_PUBLIC_SVC: {
            doc: 'Billing service API',
            format: String,
            default: 'https://api.fyndx0.de/service/public/billing',
            env: 'UNICRON_PUBLIC_SVC',
            arg: 'UNICRON_PUBLIC_SVC'
        },
        DAYTRADER_MAIN_URL: {
            doc: 'Daytrader Public URL',
            format: String,
            default: '',
            env: 'DAYTRADER_MAIN_URL',
            arg: 'daytrader_main_url'
        },
        DAYTRADER_MAIN_SVC: {
            doc: 'Daytrader Kube Service',
            format: String,
            default: '',
            env: 'DAYTRADER_MAIN_SVC',
            arg: 'daytrader_main_svc'
        },
        FIREBOLT_ADMIN_URL: {
            doc: "Firebolt Admin URL",
            format: String,
            default: '',
            env: "FIREBOLT_ADMIN_URL",
            arg: "firebolt_admin_url"
        },
        DAYTRADER_ADMIN_URL: {
            doc: "Daytrader Admin URL",
            format: String,
            default: '',
            env: "DAYTRADER_ADMIN_URL",
            arg: "daytrader_admin_url"
        },
        MARKETPLACES_ADMIN_URL: {
            doc: 'Marketpalces Admin URL',
            format: String,
            default: 'https://api.fyndx0.de/service/___/administrator/marketplaces/',
            env: 'MARKETPLACES_ADMIN_URL',
            arg: 'marketplaces_admin_url'
        },
        MARKETPLACES_ADMIN_SVC: {
            doc: 'Marketpalces Kube Service',
            format: String,
            default: 'https://api.fyndx0.de/service/___/administrator/marketplaces/',
            env: 'MARKETPLACES_ADMIN_SVC',
            arg: 'marketplaces_admin_svc'
        },
        MIXMASTER_ADMIN_URL: {
            doc: 'Mixmaster Admin URL',
            format: String,
            default: 'https://api.fyndx0.de/service/___/administrator/partners/',
            env: 'MIXMASTER_ADMIN_URL',
            arg: 'mixmaster_admin_url'
        },
        SURESHOT_ADMIN_URL: {
            doc: 'Sureshot Admin URL',
            format: String,
            default: 'https://api.fyndx0.de/service/___/administrator/webhook/',
            env: 'SURESHOT_ADMIN_URL',
            arg: 'sureshot_admin_url'
        },
        MIXMASTER_PNL_URL: {
            doc: 'Mixmaster Panel URL',
            format: String,
            default: 'https://api.fyndx0.de/service/panel/partners/',
            env: 'MIXMASTER_PNL_URL',
            arg: 'MIXMASTER_PNL_URL'
        },
        MIXMASTER_ADMIN_SVC: {
            doc: 'Mixmaster Kube Service',
            format: String,
            default: 'https://api.fyndx0.de/service/___/administrator/partners/',
            env: 'MIXMASTER_ADMIN_SVC',
            arg: 'mixmaster_admin_svc'
        },
        POINTBLANK_ADMIN_URL: {
            doc: 'Communication Custom Main Public URL to hit',
            format: String,
            default: '',
            env: 'POINTBLANK_ADMIN_URL',
            arg: 'POINTBLANK_ADMIN_URL'
        },
        PINPOINTER_ADMIN_URL: {
            doc: 'Pinpointer Admin Url',
            format: String,
            default: '',
            env: 'PINPOINTER_ADMIN_URL',
            arg: 'PINPOINTER_ADMIN_URL'
        },
        WEIRDWOLF_ADMIN_URL: {
            doc: 'Packaging admin service',
            format: String,
            default: 'https://api.fyndx0.de/service/___/administrator/packaging',
            env: 'WEIRDWOLF_ADMIN_URL',
            arg: 'weirdwolf_admin_url'
        },
        PACKAGING_COMPANY_ID: {
            doc: 'packaging company id',
            format: String,
            default:'84',
            env: 'PACKAGING_COMPANY_ID',
            arg: 'packaging_company_id'
        },
        PACKAGING_APPLICATION_ID: {
            doc: 'packaging application id',
            format: String,
            default:'629616a1d7c74d3915f8f4e8',
            env: 'PACKAGING_APPLICATION_ID',
            arg: 'packaging_application_id'
        },
        EXTENSION_PAGE_URL: {
            doc: 'Extension Page URLS',
            format: String,
            default: '',
            env: 'EXTENSION_PAGE_URL',
            arg: 'EXTENSION_PAGE_URL'
        },
        FIREBOLT_ADMIN_URL: {
            doc: 'Firebolt logistics',
            format: String,
            default: 'https://api.fyndx0.de/service/___/administrator/logistics',
            env: 'FIREBOLT_ADMIN_URL',
            arg: 'FIREBOLT_ADMIN_URL'
        },
        RMA_ADMIN_URL: {
            doc: 'RMA Admin',
            format: String,
            default: 'https://api.fyndx0.de/service/___/administrator/rma',
            env: 'RMA_ADMIN_URL',
            arg: 'RMA_ADMIN_URL'
        },
        FRENZY_ADMIN_URL: {
            doc: 'url to get analytics api for sales channel',
            format: String,
            default: '',
            env: 'FRENZY_ADMIN_URL',
            args: 'frenzy_admin_url'
        },
        /** OMS v2.1 */
        ARK_MAIN_URL: {
            doc: 'Platform Feedback URL',
            format: String,
            default: '',
            env: 'ARK_MAIN_URL',
            arg: 'ark_main_url'
        },
        ARK_MAIN_SVC: {
            doc: 'Platform Feedback Service',
            format: String,
            default: '',
            env: 'ARK_MAIN_SVC',
            arg: 'ark_main_svc'
        },
        ARK_PLTM_URL: {
            doc: 'Platform Platform Feedback URL',
            format: String,
            default: '',
            env: 'ARK_PLTM_URL',
            arg: 'ark_pltm_url'
        },
        ARK_PLTM_SVC: {
            doc: 'Platform Platform Feedback Service',
            format: String,
            default: '',
            env: 'ARK_PLTM_SVC',
            arg: 'ark_pltm_svc'
        },
        AVIS_ADMIN_URL: {
            doc: 'Platform Order Management URL',
            format: String,
            default: '',
            env: 'AVIS_ADMIN_URL',
            arg: 'avis_admin_url'
        },
        AVIS_ADMIN_SVC: {
            doc: 'Platform Order Management Service',
            format: String,
            default: '',
            env: 'AVIS_ADMIN_SVC',
            arg: 'avis_admin_svc'
        },
        COMPUTRON_ADMIN_SVC: {
            doc: 'Service Platform Orders Service',
            format: String,
            default: '',
            env: 'COMPUTRON_ADMIN_SVC',
            arg: 'computron_admin_svc'
        },
        COMPUTRON_ADMIN_URL: {
            doc: 'Service Platform Orders Service',
            format: String,
            default: '',
            env: 'COMPUTRON_ADMIN_URL',
            arg: 'computron_admin_url'
        },
        HEDWIG_ADMIN_SVC: {
            doc: 'Shipment DP Tracking API Service',
            format: String,
            default: '',
            env: 'HEDWIG_ADMIN_SVC',
            arg: 'hedwig_admin_svc'
        }
        /** OMS v2.1 -- END */
    },

    // Sentry
    SENTRY_DSN: {
        doc: 'Sentry DSN',
        format: String,
        default: '',
        env: 'SENTRY_DSN',
        arg: 'sentry_dsn'
    },
    SENTRY_ENVIRONMENT: {
        doc: 'Sentry Environment',
        format: String,
        default: '',
        env: 'SENTRY_ENVIRONMENT',
        arg: 'sentry_environment'
    },
    CDN_ITEM_DOMAINS: {
        doc: 'CDN host url',
        format: String,
        default: 'hdn-1.addsale.com',
        env: 'CDN_ITEM_DOMAINS',
        arg: 'cdn_item_domains'
      },
      CDN_ITEM_BASE_PATH: {
        doc: 'CDN item base path url',
        format: String,
        default: "cdn.pixelbin.io/v2/falling-surf-7c8bb8/fyndnp/wrkr/",
        env: 'CDN_ITEM_BASE_PATH',
        arg: 'cdn_item_base_path'
    },
    // New Relic
    NEW_RELIC_APP_NAME: {
        doc: 'newrelic app name.',
        format: String,
        default: '',
        env: 'NEW_RELIC_APP_NAME',
        arg: 'newrelic_app'
    },
    NEW_RELIC_LICENSE_KEY: {
        doc: 'Newrelic License Key',
        format: String,
        default: '',
        env: 'NEW_RELIC_LICENSE_KEY',
        arg: 'newrelic_license_key'
    },
    BEEFREE_CLIENT_ID: {
        doc: 'BEEFREE_CLIENT_ID',
        format: String,
        default: 'dcce640f-abc1-4c0c-8398-84488e8c4cd7',
        env: 'BEEFREE_CLIENT_ID',
        arg: 'beefree_client_id'
    },
    BEEFREE_CLIENT_SECRET: {
        doc: 'BEEFREE_CLIENT_SECRET',
        format: String,
        default: '0A8vfzg4DI2jB6aRiydrWprtio6lAeCCesjC4iaflrk75vGWkV5',
        env: 'BEEFREE_CLIENT_SECRET',
        arg: 'beefree_client_secret'
    }
});

// Perform validation
conf.validate({
    allowed: 'strict'
});

module.exports = conf;