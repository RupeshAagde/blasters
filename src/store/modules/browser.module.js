import { SET_BROWSER_META } from '../mutation.type'

import { UPDATE_BROWSER_META } from '../action.type'

import { GET_BROWSER_META } from '../getters.type'

const getDefaultState = () => {
  return {
    meta: {}
  }
}

const state = getDefaultState()

const getters = {
  [GET_BROWSER_META](state) {
    return state.meta
  }
}

const actions = {
  [UPDATE_BROWSER_META]({ commit }) {
    commit(SET_BROWSER_META, {
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth
    })
  }
}

const mutations = {
  [SET_BROWSER_META](state, payload) {
    state.meta = payload
  }
}

export function createBrowserMeta() {
  return {
    state,
    getters,
    mutations,
    actions
  }
}
