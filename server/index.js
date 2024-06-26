'use strict'

const config = require('./../config')
const packageJson = require('./../package.json');
const fs = require("fs");

if (config.get('NEW_RELIC_LICENSE_KEY')) {
  require('newrelic')
}
const { BROWSER_CONFIG, SENTRY_DSN, SENTRY_ENVIRONMENT } = config.get()
const path = require('path')
const express = require('express')
const Sentry = require('@sentry/node')


let releaseSHA = packageJson.version;

if(fs.existsSync("gitsha"))
{
    releaseSHA = fs.readFileSync("gitsha").toString();
}


//Add sentry
if (SENTRY_DSN) {
  const sentryOptions = {
    dsn: SENTRY_DSN,
    release: releaseSHA,
    environment: SENTRY_ENVIRONMENT
  }
  Sentry.init(sentryOptions)
}
const aRoot = require('window-or-global')
const axios = require('axios')
const bodyParser = require('body-parser')
const urlJoin = require('url-join')

const { renderApp, initdevServer } = require('./app.server')
aRoot.env = config.get()

const logger = require('./utils/winston')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json({ limit: '5mb' }))

//Add sentry
if (SENTRY_DSN) {
  app.use(Sentry.Handlers.requestHandler())
}

//Handle uncaught exception
process.on('uncaughtException', function(err) {
  logger.info('Caught exception: ')
  logger.info(err)
  if (SENTRY_DSN) {
    Sentry.captureException(err)
  }
})

if (!(config.get('env') !== 'development')) {
  initdevServer(app)
}

app.use('/public', express.static('public', { maxAge: 30 * 86400000 }))

app.get('/montserrat', (req, res) => {
  res.sendFile(path.join(__dirname, './montserrat.json'));
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/assets/favicon.png'))
})

app.get('/_healthz', (req, res) => {
  res.json({ ok: 'ok' })
})

app.get('/_readyz', (req, res) => {
  res.json({ ok: 'ok' })
})

app.get('/grafana.json', (req, res) => {
  res.status(404).json({
    message: 'not found'
  })
})

app.get('/swagger.json', (req, res) => {
  res.status(404).json({
    message: 'not found'
  })
})

app.get('/admin/getBeeFreeToken', (req, res) => {
  return axios({
      method: 'POST',
      url: 'https://auth.getbee.io/apiauth',
      data: {
          client_id: config.get('BEEFREE_CLIENT_ID'), // Enter your client id
          client_secret: config.get('BEEFREE_CLIENT_SECRET'), // Enter your secret key
          grant_type: 'password', // Do not change
      },
  })
      .then((response) => response.data)
      .then((data) => {
          return res.json(data);
      })
      .catch((err) => {
          if (err && err.response && err.response.data) {
              return res.status(400).json(err.response.data);
          } else {
              return res.status(400).json(err);
          }
      });
});

app.get('/swagger-public.json', async (req, res) => {
  try {
    const swaggerJson = await axios.get(
      urlJoin(BROWSER_CONFIG.BULKHEAD_MAIN_SVC, '/swagger-public.json')
    )
    res.status(200).json(swaggerJson.data)
  } catch (err) {
    logger.info(err)
    res.status(400).json(err)
  }
})

//To avoid cache of static resources in cdn of file which are not found i.e having 404
// below middleware will send 404 for all public/* static files.
app.get('/public/*', (req, res) => {
  return res.status(404).send('<h2>Not Found</h2>')
})

app.get('*', async (req, res) => {
  const context = {
    url: req.url,
    title: '[PROJECT_NAME]',
    is_ssr: req.query.__ssr === 'true'
  }

  renderApp(app, req, res, context)
})

process.on('exit', function() {
  // clearTimeout(aggregationConfigTimer);
})

const port = config.get('PORT')
app.listen(port, async () => {
  logger.info(`Server started at localhost:${port}`)
})

module.exports = app
