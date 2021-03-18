# server
export NODE_ENV=development
export ENV=development
export PORT=8086


#API's
export FYND_PLATFORM_DOMAIN=fyndx0.de
export BLITZKRIEG_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/theme/
export GRINDOR_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/common/assets/
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
export SILVERBOLT_ACPR_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/company-profile/
export SILVERBOLT_ACAT_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/catalog/
export SKYWARP_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/authorization/
export SKYWARP_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/platform/authorization/
export ULTRAMAGNUS_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/internal/settings
export ULTRAMAGNUS_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/internal/settings
export ULTRAMAGNUS_PUBLIC_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/common/internal/settings
export ULTRAMAGNUS_PUBLIC_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/common/internal/settings
export ULTRAMAGNUS_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/internal/settings
export ULTRAMAGNUS_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/internal/settings
export UNICRON_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/billing/
export HIGHBROW_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/lead/
export HIGHBROW_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/platform/lead/
export SLINGSHOT_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/slingshot/
export SLINGSHOT_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/slingshot/
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
#ENV's
export SENTRY_DSN=''
export SENTRY_ENVIRONMENT=development

export NEW_RELIC_APP_NAME=blaster
export NEW_RELIC_LICENSE_KEY=''
npm run start
#node --inspect-brk server/index.js --env production