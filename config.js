'use strict';
const convict = require('convict');

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
        }
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
    }
});

// Perform validation
conf.validate({
    allowed: 'strict'
});

module.exports = conf;