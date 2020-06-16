const getDefaultState = () => {
  return {}
}

const getters = {}

const mutations = {}

const actions = {}

export function createAppCustomStore() {
  return {
    state: getDefaultState(),
    actions,
    mutations,
    getters
  }
}
