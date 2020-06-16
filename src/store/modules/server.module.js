import { ON_SERVER_DATA } from '../action.type'
import { SET_SERVER_DATA } from '../mutation.type'

const getDefaultState = () => {
  return {
    options: {}
  }
}

const state = getDefaultState()

const mutations = {
  [SET_SERVER_DATA](state, { data }) {
    state.options = data
  }
}

const actions = {
  [ON_SERVER_DATA]({ commit }, data) {
    commit(SET_SERVER_DATA, { data: data })
  }
}
export function createServerStore() {
  return {
    state: getDefaultState(),
    actions,
    mutations
  }
}
