set -x

docker build . -t bombshell
docker rm bombshell
docker run --net=host -p 8087:8087 --name=bombshell \
-e NODE_ENV=development \
-e ENV=development \
-e PORT=8087 \
-e CDN_URL='' \
-e BLITZKRIEG_MAIN_URL=https://api.fynd.com/platform/theme \
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
-e SLINGSHOT_MAIN_URL=https://api.fynd.com/slingshot/ \
-e SLINGSHOT_MAIN_SVC=https://api.fynd.com/slingshot/ \
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
-e CLOUDINARY_CLOUD_NAME=dwzm9bysq \
-e CLOUDINARY_API_KEY=195473416834119 \
-e CLOUDINARY_API_SECRET=Y4poyTXWTRkp5wKik8IAHbmb-U0 \
-e BEEFREE_CLIENT_ID=dcce640f-abc1-4c0c-8398-84488e8c4cd7 \
-e BEEFREE_CLIENT_SECRET=0A8vfzg4DI2jB6aRiydrWprtio6lAeCCesjC4iaflrk75vGWkV5 \
 bombshell:latest
