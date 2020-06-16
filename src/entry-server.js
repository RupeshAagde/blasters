import urlJoin from 'url-join'
import { isBrowser, isNode } from 'browser-or-node'
import root from 'window-or-global'

const envVars = root.env || {}

const GRIMLOCKWEB_BASE = isNode
  ? envVars.BROWSER_CONFIG.GRIMLOCKWEB_MAIN_DOMAIN
  : envVars.GRIMLOCKWEB_MAIN_DOMAIN

const {
  BROWSER_CONFIG,
  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
  CLOUDINARY_CLOUD_NAME
} = envVars

// entry-server.js
import { createApp } from './app'
import { ON_SERVER_DATA } from './store/action.type'
import { SET_APP_PLATFORM } from './store/mutation.type'

export default (context) => {
  console.log('Routes:', context.url)

  //asynchronous component
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    const s = Date.now()

    //Fetch App level  req. for SSR
    const appStatePromises = []

    Promise.all(appStatePromises)
      .then((data) => {
        //add app styles and fonts
        console.log('All promised')

        //App grimlock JS
        //TODO
        const PLATFORM = 'partner'
        context.appAuthJs = ''
        if (PLATFORM) {
          context.appAuthJs = getAppAuthJs(PLATFORM)
          // store.commit(SET_APP_PLATFORM, PLATFORM)
        }

        //Attach App Env
        context.appEnv = getAppEnv()

        //set server Data ( if any )
        store.dispatch(ON_SERVER_DATA, context.is_ssr)

        // set server-side router's location
        router.push(context.url)
      })
      .catch((err) => {
        console.log('error:', err)
      })

    // wait until router has resolved possible async components and hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      // no matched routes, reject with 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      // Call fetchData hooks on components matched by the route.
      // A preFetch hook dispatches a store action and returns a Promise,
      // which is resolved when the action is complete and store state has been
      // updated.
      let arrPromises = []
      matchedComponents.filter(Boolean).map(({ asyncData }) => {
        let arr =
          (context.is_ssr &&
            asyncData &&
            asyncData({ store, route: router.currentRoute })) ||
          []
        if (!Array.isArray(arr)) {
          arr = [arr]
        }
        if (arr.length > 0) {
          arrPromises = arrPromises.concat(arr)
        }
      })

      Promise.all(arrPromises)
        .then(() => {
          // After all preFetch hooks are resolved, our store is now
          // filled with the state needed to render the app.
          // Expose the state on the render context, and let the request handler
          // inline the state in the HTML response. This allows the client-side
          // store to pick-up the server-side state without having to duplicate
          // the initial data fetching on the client.

          context.state = store.state
          console.log(`Server data pre-fetch: ${Date.now() - s}ms`)

          // the Promise should resolve to the app instance so it can be rendered
          resolve(app)
        })
        .catch(reject)
    }, reject)
  })
}
const getAppAuthJs = (platform) => {
  let strJs = ''
  if (platform) {
    strJs += `<script type="text/javascript">window.grimlock={ platform:"${platform}"}</script> `
    strJs += `<script type="text/javascript">window.loadGrimlock= new Promise(function(resolve,reject){ 
            window.grimlock.onLibraryLoad=function(data){
                resolve(data);
            }
         })  
        </script>`

    //add grimlock
    let scriptSrc = urlJoin(GRIMLOCKWEB_BASE, '/library_init.js')
    strJs += `<script type="text/javascript" src="${scriptSrc}"></script> `
  }
  return strJs
}

const getAppEnv = () => {
  let strEnvs = ''
  if (envVars) {
    const commonEnvs = {
      CLOUDINARY_CLOUD_NAME: CLOUDINARY_CLOUD_NAME,
      SENTRY_DSN: SENTRY_DSN,
      SENTRY_ENVIRONMENT: SENTRY_ENVIRONMENT,
      INVITE: {
        PLATFORM: 'partners'
      }
    }
    strEnvs += `<script>window.env = ${JSON.stringify(
      { ...BROWSER_CONFIG, ...commonEnvs },
      null,
      4
    )}</script>`
  }
  return strEnvs
}
