const fs = require('fs')
const path = require('path')
const config = require('./../config')
const LRU = require('lru-cache')
const resolvePath = (file) => path.resolve(__dirname, file)
const urlJoin = require('url-join')
const { BROWSER_CONFIG, env } = config.get()
const isProduction = env !== 'development'

const template = fs.readFileSync(resolvePath('./../src/index.html'), 'utf-8')
const { createBundleRenderer } = require('vue-server-renderer')
const Sentry = require('@sentry/node')
const logger = require('./utils/winston')
let serverReady
let renderer
const initdevServer = (app) => {
  //In development
  const devServer = require('./../build/setup-dev-server')
  serverReady = devServer(app, async (bundle, options) => {
    try {
      renderer = createRenderer(bundle, options)
    } catch (err) {
      logger.info(err)
    }
  })
}

const createRenderer = (bundle, options) => {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      // for component caching
      cache: new LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15
      }),
      template,
      inject: false,
      runInNewContext: false
    })
  )
}

/**
 * Renders the request application using renderer
 * @param {*} renderer
 * @param {*} req
 * @param {*} res
 * @param {*} context
 */
const render = (renderer, req, res, context) => {
  const s = Date.now()

  logger.info(`Rendering: ${req.url}`)

  res.setHeader('Content-Type', 'text/html')

  const errorHandler = (err) => {
    // TODO: Render Error Page
    logger.info(`Fatal error when rendering : ${req.url}`)
    logger.info(err)
    Sentry.captureException(err)

    const statusCode = err.code || 500
    res.status(statusCode)
    res.end(`<h1>${statusCode}</h1>`)

    logger.info(`Whole request: ${Date.now() - s}ms`)
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      logger.info(err)
      return errorHandler(err)
    }

    res.status(200)
    res.end(html)

    logger.info(`Whole request: ${Date.now() - s}ms`)
  })
}

/**
 * Renders app dynamically
 * @param {*} req
 * @param {*} res
 * @param {*} context
 */
const renderApp = (app, req, res, context) => {
  if (isProduction) {
    if (!renderer) {
      const bundle = require('./../public/vue-ssr-server-bundle.json')
      const clientManifest = require('./../public/vue-ssr-client-manifest.json')
      if (BROWSER_CONFIG.CDN_URL) {
        clientManifest.publicPath = urlJoin(BROWSER_CONFIG.CDN_URL, '/public/')
      }

      renderer = createRenderer(bundle, {
        clientManifest
      })
    }

    render(renderer, req, res, context)
  } else {
    //In development
    serverReady.then(() => {
      render(renderer, req, res, context)
    })
  }
}

module.exports.renderApp = renderApp
module.exports.initdevServer = initdevServer
