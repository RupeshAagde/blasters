# server
export NODE_ENV=development
export ENV=development
export PORT=8087


#API's
export FYND_PLATFORM_DOMAIN=fyndx0.de
export PLATFORM_COMMON_MAIN_URL=https://api.fyndx0.de/platform/common/
export PLATFORM_COMMON_MAIN_SVC=https://api.fyndx0.de/platform/common/
export BLITZKRIEG_MAIN_URL=https://api.fyndx0.de/platform/theme/
export UNICRON_MAIN_URL=https://api.fyndx0.de/platform/billing/
export SEARCHLIGHT_MAIN_DOMAIN=https://platform.fyndx0.de/
export SEARCHLIGHT_MAIN_SVC=https://platform.fyndx0.de/
export GRINGOTTS_MAIN_URL=https://api.fyndx0.de/gringotts/
export GRIMLOCK_MAIN_URL=https://api.fyndx0.de/auth/
export GRIMLOCK_MAIN_SVC=https://api.fyndx0.de/auth/
export GRIMLOCKWEB_MAIN_DOMAIN=https://auth.fyndx0.de/
export SILVERBOLT_MAIN_SVC=https://api.fyndx0.de/seller/
export SILVERBOLT_MAIN_URL=https://api.fyndx0.de/seller/
export SKYWARP_MAIN_URL=https://api.fyndx0.de/platform/authorization/
export SKYWARP_MAIN_SVC=https://api.fyndx0.de/platform/authorization/
export SLINGSHOT_MAIN_URL=https://api.fyndx0.de/slingshot/
export SLINGSHOT_MAIN_SVC=https://api.fyndx0.de/slingshot/



#ENV's
export SENTRY_DSN=''
export SENTRY_ENVIRONMENT=development

export NEW_RELIC_APP_NAME=bombshell
export NEW_RELIC_LICENSE_KEY=''
npm run start
#node --inspect-brk server/index.js --env production