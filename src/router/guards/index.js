import { isBrowser, isNode } from 'browser-or-node'
import {
  FETCH_USER_DATA,
  FETCH_ORGANIZATION_LIST
} from '../../store/action.type'

export function authenticatedUser(to, from, next) {
  if (isNode) {
    return next()
  }
  import('./../../entry-client').then((appModule) => {
    const appStore = appModule.getAppStore()
    window.loadGrimlock
      .then(() => {
        return appStore.dispatch(FETCH_USER_DATA)
      })
      .then((data) => {
        if (data.isLoggedIn) {
          next()
          return
        }
        next('/')
      })
      .catch(() => {
        next('/')
      })
  })
}

export function resolveGrimlock(to, from, next) {
  if (isNode) {
    return next()
  }
  import('./../../entry-client').then((appModule) => {
    const appStore = appModule.getAppStore()

    window.loadGrimlock
      .then(() => {
        return appStore.dispatch(FETCH_USER_DATA)
      })
      .then((data) => {
        return next()
      })
      .catch(() => {
        return next()
      })
  })
}
