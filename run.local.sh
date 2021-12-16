# server
export NODE_ENV=development
export ENV=development
export PORT=8086


#API's
export FYND_PLATFORM_DOMAIN=fyndx0.de
export BLITZKRIEG_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/theme/
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
export SILVERBOLT_ACPR_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/company-profile/
export SILVERBOLT_ACAT_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/catalog/
export SILVERBOLT_PCPR_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/platform/company-profile/
export SILVERBOLT_PNLCPR_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/panel/company-profile/
export SKYWARP_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/authorization/
export SKYWARP_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/platform/authorization/
export SKYWARP_PNL_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/panel/authentication/
export SKYWARP_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/authorization
export ULTRAMAGNUS_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/internal/settings
export ULTRAMAGNUS_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/internal/settings
export ULTRAMAGNUS_PUBLIC_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/common/internal/settings
export ULTRAMAGNUS_PUBLIC_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/common/internal/settings
export ULTRAMAGNUS_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/internal/settings
export ULTRAMAGNUS_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/internal/settings
export UNICRON_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/billing
export UNICRON_PUBLIC_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/public/billing
export UNICRON_PUBLIC_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/public/billing
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
export MARKETPLACES_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/marketplaces/
export MARKETPLACES_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/marketplaces/
export MIXMASTER_ADMIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/partners/
export MIXMASTER_ADMIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/service/___/administrator/partners/

#ENV's
export SENTRY_DSN=''
export SENTRY_ENVIRONMENT=development

export NEW_RELIC_APP_NAME=blaster
export NEW_RELIC_LICENSE_KEY=''
npm run start
#node --inspect-brk server/index.js --env production