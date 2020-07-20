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
export SKYWARP_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/authorization/
export SKYWARP_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/platform/authorization/
export ULTRAMAGNUS_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/internal/settings
export ULTRAMAGNUS_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/internal/settings
export UNICRON_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/billing/


#ENV's
export SENTRY_DSN=''
export SENTRY_ENVIRONMENT=development

export NEW_RELIC_APP_NAME=blaster
export NEW_RELIC_LICENSE_KEY=''
npm run start
#node --inspect-brk server/index.js --env production