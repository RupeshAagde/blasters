import Vue from 'vue'
import './directives'
import './pipes'
import { createApp } from './app'
import { FETCH_USER_DATA } from './store/action.type'
import dirtyFormDialog from '@/components/common/dialogs/dirty-form.vue'

// global form dirty check
const dirtyCheck = (Vue.prototype.$__dirtyFormDialog = new Vue(
  dirtyFormDialog
).$mount())
document.body.appendChild(dirtyCheck.$el)

const { app, router, store } = createApp()

if (window && window.__INITIAL_STATE__) {
  console.log('Initial State')
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  //If not server side rendered
  let matchedComponents = router.getMatchedComponents()
  preLoadAsyncData(matchedComponents)
})

/**
 * Fetch Async data of matched component for reload
 * @param {*} matchedComponents
 */
function preLoadAsyncData(matchedComponents) {
  // no matched routes,
  if (!matchedComponents.length) {
    return
  }

  let arrPromises = []
  matchedComponents.filter(Boolean).map(({ asyncData }) => {
    let arr =
      (!store.state.server.options &&
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
  // Call fetchData hooks on components matched by the route.
  // A preFetch hook dispatches a store action and returns a Promise,
  // which is resolved when the action is complete and store state has been
  // updated.
  Promise.all(arrPromises)
    .then(() => {
      // After all preFetch hooks are resolved, our store is now
      // filled with the state needed to render the app.
      // Expose the state on the render context, and let the request handler
      // inline the state in the HTML response. This allows the client-side
      // store to pick-up the server-side state without having to duplicate
      // the initial data fetching on the client.
      //  context.state = store.state;
      console.log(`Client data pre-fetch:`)
    })
    .catch(() => {
      console.log('Error')
    })
  addRouteHooks()
  app.$mount('#app')
}

/**
 * Add route hooks before and after
 */
function addRouteHooks() {
  router.afterEach((to, from, next) => {
    const matchedComponents = router.getMatchedComponents(to)
    //TODO:Make a function return bool
    //only query change and passed in meta
    if (
      to.path === from.path &&
      from.meta.scroll_policy &&
      !from.meta.scroll_policy.on_query
    ) {
      //don't scroll
    } else {
      window.scrollTo(0, 0)
    }
    console.log('In route transition')

    const asyncDataHooks = matchedComponents
      .map((c) => c.asyncData)
      .filter((_) => _)

    if (!asyncDataHooks.length) {
      return
    }

    Promise.all(
      asyncDataHooks.map((hook) => hook({ store, route: to, from: from }))
    )
      .then(() => {
        //next();
      })
      .catch(next)
  })
}

export const getAppStore = () => {
  return store
}
export const getAppRouter = () => {
  return router
}
