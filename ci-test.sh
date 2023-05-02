if test "$DEBUG" == "true"
then
    echo "Running in local debug mode"
else
    apk add binutils-gold curl g++ gcc gnupg libgcc linux-headers make python3-dev git openssl openssh bash lcms2-dev libpng-dev autoconf automake
    curl -s "https://gitlab.com/api/v4/projects/9905046/repository/files/gitlab%2Fsetup_key.sh/raw?ref=master&private_token=FjCQxPFMNXJwmaomMoKi" 2>&1 | sh
    ssh-keyscan -t rsa gitlab.com >> ~/.ssh/known_hosts
    npm install npm@6.14.16 -g
    npm install --only=dev
fi

export NODE_ENV=test
export ENV=test
export PORT=8086

#API's
export FYND_PLATFORM_DOMAIN=fyndx0.com
export PINPOINTER_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/audit-trail/
export POINTBLANK_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/communication/
export BLITZKRIEG_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/theme/
export BLITZKRIEG_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/theme/ \
export BLITZKRIEG_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/theme/ \
export GRINDOR_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/assets/
export GRINGOTTS_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/payment/
export GRINGOTTS_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/gringotts/
export GRIMLOCK_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/auth/
export GRIMLOCK_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/auth/
export GRIMLOCKWEB_MAIN_DOMAIN=https://auth.${FYND_PLATFORM_DOMAIN}/
export PLATFORM_COMMON_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/common/
export PLATFORM_COMMON_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/platform/common/
export SEARCHLIGHT_MAIN_DOMAIN=https://platform.${FYND_PLATFORM_DOMAIN}/
export SEARCHLIGHT_MAIN_SVC=https://platform.${FYND_PLATFORM_DOMAIN}/
export SILVERBOLT_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/seller/
export SILVERBOLT_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/seller/
export SKYWARP_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/authorization/
export SKYWARP_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/platform/authorization/
export SKYWARP_PNL_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/panel/authentication/
export SKYWARP_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/authorization
export ULTRAMAGNUS_PUBLIC_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/common/internal/settings
export ULTRAMAGNUS_PUBLIC_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/common/internal/settings
export ULTRAMAGNUS_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/internal/settings
export ULTRAMAGNUS_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/internal/settings
export UNICRON_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/billing
export UNICRON_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/billing
export UNICRON_PUBLIC_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/public/billing
export UNICRON_PUBLIC_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/public/billing
export HIGHBROW_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/lead
export HIGHBROW_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/lead
export SLINGSHOT_PUBLIC_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/common/configuration/
export SLINGSHOT_PUBLIC_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/common/configuration/
export SLINGSHOT_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/configuration
export SLINGSHOT_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/configuration
export APEFACE_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/order/
export APEFACE_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/order/
export DAYTRADER_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/daytrader/
export DAYTRADER_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/daytrader/
export MARKETPLACES_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/marketplaces/
export MARKETPLACES_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/marketplaces/
export MIXMASTER_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/partners/
export SURESHOT_ADMIN_URL=https://api.fyndx0.de/service/___/administrator/webhook/
export MIXMASTER_PNL_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/panel/partners/
export MIXMASTER_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/partners/
export SILVERBOLT_ACPR_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/company-profile/
export WHEELJACK_ACPR_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/company-profile/
export SILVERBOLT_ACAT_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/catalog/
export WHEELJACK_PCPR_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/platform/company-profile/
export WHEELJACK_PNLCPR_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/panel/company-profile/
export SILVERBOLT_PCAT_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/platform/catalog
export BLASTER_MAIN_DOMAIN=https://administrator.${FYND_PLATFORM_DOMAIN}
export BOMBSHELL_MAIN_DOMAIN=https://partners.${FYND_PLATFORM_DOMAIN}
export BRAINSTORM_EXTENSION_DOMAIN=https://extensions.${FYND_PLATFORM_DOMAIN}
export BRAINSTORM_THEME_DOMAIN=https://themes.${FYND_PLATFORM_DOMAIN}
export MIRAGE_MAIN_DOMAIN=https://platform.${FYND_PLATFORM_DOMAIN}
export QUE_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/marketplace/
export RMA_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/rma
export FRENZY_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/insights/
export DAYTRADER_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/finance
export FIREBOLT_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/logistics
export AVIS_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/order-manage/
export AVIS_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/order-manage/
export COMPUTRON_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/orders/
export COMPUTRON_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/orders/
export HEDWIG_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/dp/
export HEDWIG_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/dp/

#ENV's
export SENTRY_DSN=''
export SENTRY_ENVIRONMENT=test
export CDN_ITEM_DOMAINS=https://hdn-1.addsale.com
export NEW_RELIC_APP_NAME=blaster
export NEW_RELIC_LICENSE_KEY=''
export CDN_ITEM_BASE_PATH=https://cdn.pixelbin.io/v2/falling-surf-7c8bb8/fyndnp/wrkr/

npm run test -- -u
ls -la ./coverage
if test "$DEBUG" == "true"
then
    echo "Running testcases in local debug mode"
else
    node tools/coverage_output.js
fi
