rm -rf public
webpack --config build/webpack.client.config.js --progress --hide-modules --env=production
webpack --config build/webpack.server.config.js --progress --hide-modules --env=production
node server.js --env=production