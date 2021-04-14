export NODE_ENV=test
export ENV=test
export PORT=8087

#API's
export FYND_PLATFORM_DOMAIN=xyz.com
export BLITZKRIEG_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/theme/
export GRINDOR_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/assets/
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
export ULTRAMAGNUS_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/internal/settings
export ULTRAMAGNUS_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/internal/settings
export ULTRAMAGNUS_PUBLIC_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/common/internal/settings
export ULTRAMAGNUS_PUBLIC_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/common/internal/settings
export ULTRAMAGNUS_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/internal/settings
export ULTRAMAGNUS_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/internal/settings
export UNICRON_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/billing/
export UNICRON_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/platform/billing/
export HIGHBROW_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/lead
export HIGHBROW_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/lead
export SLINGSHOT_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/slingshot/
export SLINGSHOT_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/slingshot/
export SLINGSHOT_PUBLIC_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/common/configuration/
export SLINGSHOT_PUBLIC_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/common/configuration/
export SLINGSHOT_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/configuration
export SLINGSHOT_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/configuration
export APEFACE_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/orders/
export APEFACE_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/platform/orders/
export APEFACE_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/order/
export APEFACE_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/order/
export DAYTRADER_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/daytrader/
export DAYTRADER_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/daytrader/
export MARKETPLACES_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/marketplaces/
export MARKETPLACES_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/marketplaces/
export SILVERBOLT_ACPR_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/company-profile/
export SILVERBOLT_ACAT_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/catalog/
export SILVERBOLT_PCPR_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/platform/company-profile/
export SILVERBOLT_PNLCPR_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/panel/company-profile/

#ENV's
export SENTRY_DSN=''
export SENTRY_ENVIRONMENT=test

export NEW_RELIC_APP_NAME=blaster
export NEW_RELIC_LICENSE_KEY=''

npm run test -- -u
