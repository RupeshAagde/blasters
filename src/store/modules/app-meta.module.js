import { createAsyncMutation, doAsync } from './../actions.utils'
import { GET_APP_PLATFORM } from '../getters.type'
import { SET_APP_PLATFORM } from '../mutation.type'

const PLATFORM = 'platform'

const getDefaultState = () => {
  return {
    [PLATFORM]: ''
  }
}

const getters = {}

const mutations = {
  [GET_APP_PLATFORM](state) {
    return state[PLATFORM]
  },
  [SET_APP_PLATFORM](state, data) {
    state[PLATFORM] = data
  }
}

const actions = {}

export function createAppMetaStore() {
  return {
    state: getDefaultState(),
    actions,
    mutations,
    getters
  }
}
