set -x

docker build . -t bombshell
docker rm bombshell
docker run --net=host -p 8086:8086 --name=bombshell \
-e NODE_ENV=development \
-e ENV=development \
-e PORT=8086 \
-e CDN_URL='' \
-e BLITZKRIEG_MAIN_URL=https://api.fynd.com/platform/theme \
-e UNICRON_ADMIN_URL=https://api.fyndx0.de/service/___/administrator/billing \
-e UNICRON_PUBLIC_URL=https://api.fyndx0.de/service/public/billing \
-e UNICRON_PUBLIC_SVC=https://api.fyndx0.de/service/public/billing \
-e PLATFORM_CONTENT_MAIN_URL=https://api.fynd.com/platform/content/ \
-e PLATFORM_MARTELL_CONTENT_MAIN_URL=https://api.fynd.com/martell/platform/content/ \
-e PLATFORM_CART_MAIN_URL=https://api.fynd.com/platform/cart/ \
-e PLATFORM_CART_MAIN_SVC=https://api.fynd.com/platform/cart/ \
-e PLATFORM_COMMON_MAIN_URL=https://api.fynd.com/platform/common/ \
-e PLATFORM_COMMON_MAIN_SVC=https://api.fynd.com/platform/common/ \
-e SEARCHLIGHT_MAIN_DOMAIN=https://platform.fynd.com/ \
-e SEARCHLIGHT_MAIN_SVC=https://platform.fynd.com/ \
-e LIGHTSPEED_MAIN_URL=https://api.fynd.com/platform/rewards \
-e LIGHTSPEED_MAIN_SVC=https://api.fynd.com/platform/rewards \
-e FREEWAY_MAIN_URL=https://api.fynd.com/platform/custom/ \
-e BONECRUSHER_MAIN_URL=https://api.fynd.com/platform/promotion/ \
-e POINTBLANK_MAIN_URL=https://api.fynd.com/platform/comms \
-e POINTBLANK_MAIN_URL=http://localdev.fynd.com:7070 \
-e ORBIS_AFFILIATE_URL=https://api.fynd.com/affiliate/ \
-e ORBIS_AFFILIATE_SVC=https://api.fynd.com/affiliate/ \
-e MEGATRON_MAIN_URL=https://api.fynd.com/megatron/ \
-e MEGATRON_MAIN_SVC=https://api.fynd.com/megatron/ \
-e COMPUTRON_MAIN_URL=https://api.fynd.com/computron/ \
-e COMPUTRON_MAIN_SVC=https://api.fynd.com/computron/ \
-e AVIS_MAIN_URL=https://api.fynd.com/avis/ \
-e SLINGSHOT_PUBLIC_URL=https://api.fynd.com/service/common/configuration/ \
-e SLINGSHOT_PUBLIC_SVC=https://api.fynd.com/service/common/configuration/ \
-e DAYTRADER_MAIN_URL=https://api.fynd.com/daytrader/ \
-e DAYTRADER_MAIN_SVC=https://api.fynd.com/daytrader/ \
-e GRINGOTTS_MAIN_URL=https://api.fynd.com/gringotts/ \
-e GRIMLOCK_MAIN_URL=https://api.fynd.com/auth/ \
-e GRIMLOCK_MAIN_SVC=https://api.fynd.com/auth/ \
-e GRIMLOCKWEB_MAIN_DOMAIN=https://auth.fynd.com/ \
-e STORMBREAKER_MAIN_URL=https://api.fynd.com/stormbreaker \
-e STORMBREAKER_MAIN_SVC=https://api.fynd.com/stormbreaker \
-e PRISM_MAIN_URL=https://api.fynd.com/prism \
-e PRISM_MAIN_SVC=https://api.fynd.com/prism \
-e PERCEPTOR_MAIN_URL=https://api.fynd.com/platform/analytics/ \
-e PERCEPTOR_MAIN_SVC=https://api.fynd.com/platform/analytics/ \
-e ARK_MAIN_SVC=https://api.fynd.com/platform/feedback/ \
-e ARK_MAIN_URL=https://api.fynd.com/platform/feedback/ \
-e SENTINEL_MAIN_SVC=https://api.fynd.com/platform/qr/ \
-e SENTINEL_MAIN_URL=https://api.fynd.com/platform/qr/ \
-e BULKHEAD_MAIN_SVC=https://swagger-u1.core.fynd.com \
-e SENTRY_DSN='' \
-e SENTRY_ENVIRONMENT=development \
-e NEW_RELIC_APP_NAME=bombshell \
-e NEW_RELIC_LICENSE_KEY='' \
-e BEEFREE_CLIENT_ID=dcce640f-abc1-4c0c-8398-84488e8c4cd7 \
-e BEEFREE_CLIENT_SECRET=0A8vfzg4DI2jB6aRiydrWprtio6lAeCCesjC4iaflrk75vGWkV5 \
-e BLASTER_MAIN_DOMAIN=https://administrator.fynd.com \
-e BOMBSHELL_MAIN_DOMAIN=https://partners.fynd.com \
-e BRAINSTORM_EXTENSION_DOMAIN=https://extensions.fynd.com \
-e BRAINSTORM_THEME_DOMAIN=https://themes.fynd.com \
-e MIRAGE_MAIN_DOMAIN=https://platform.fynd.com \
-e CDN_ITEM_BASE_PATH=https://cdn.pixelbin.io/v2/falling-surf-7c8bb8/fyndnp/wrkr/
-e OLD_CDN_BASE_URLS=hdn-1.addsale.com
 bombshell:latest
