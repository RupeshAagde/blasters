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
        default: 8087,
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
        SLINGSHOT_MAIN_URL: {
            doc: 'Slingshot Public URL',
            format: String,
            default: '',
            env: 'SLINGSHOT_MAIN_URL',
            arg: 'slingshot_main_url'
        },
        SLINGSHOT_MAIN_SVC: {
            doc: 'Slingshot Kube Service',
            format: String,
            default: '',
            env: 'SLINGSHOT_MAIN_SVC',
            arg: 'slingshot_main_svc'
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
        UNICRON_MAIN_URL: {
            doc: 'Billing service API',
            format: String,
            default: '',
            env: 'UNICRON_MAIN_URL',
            arg: 'UNICRON_MAIN_URL'
        },
        UNICRON_MAIN_SVC: {
            doc: 'Billing service API private',
            format: String,
            default: '',
            env: 'UNICRON_MAIN_SVC',
            arg: 'UNICRON_MAIN_SVC'
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
        GRINGOTTS_MAIN_URL: {
            doc: 'Gringgotts Public URL',
            format: String,
            default: '',
            env: 'GRINGOTTS_MAIN_URL',
            arg: 'gringotts_main_url'
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
