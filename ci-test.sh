apk add binutils-gold curl g++ gcc gnupg libgcc linux-headers make python git openssl openssh bash lcms2-dev libpng-dev autoconf automake
curl -s "https://gitlab.com/api/v4/projects/9905046/repository/files/gitlab%2Fsetup_key.sh/raw?ref=master&private_token=FjCQxPFMNXJwmaomMoKi" 2>&1 | sh
ssh-keyscan -t rsa gitlab.com >> ~/.ssh/known_hosts
npm install --only=dev

export NODE_ENV=test
export ENV=test
export PORT=8087

#API's
export FYND_PLATFORM_DOMAIN=xyz.com
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
export HIGHBROW_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/lead/
export HIGHBROW_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/platform/lead/
export SLINGSHOT_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/slingshot/
export SLINGSHOT_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/slingshot/
export APEFACE_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/platform/orders/
export APEFACE_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/platform/orders/
export DAYTRADER_MAIN_URL=https://api.${FYND_PLATFORM_DOMAIN}/daytrader/
export DAYTRADER_MAIN_SVC=https://api.${FYND_PLATFORM_DOMAIN}/daytrader/

#ENV's
export SENTRY_DSN=''
export SENTRY_ENVIRONMENT=test

export NEW_RELIC_APP_NAME=blaster
export NEW_RELIC_LICENSE_KEY=''

npm run test -- -u
node tools/coverage_output.js