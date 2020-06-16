import {
  FETCH_ORGANIZATION_LIST,
  FETCH_ORGANIZATION_DETAILS
} from '../action.type'
import {
  SET_ORGANIZATION_LIST,
  SET_ORGANIZATION_DETAILS
} from '../mutation.type'

import {
  GET_ORGANIZATION_DETAILS,
  GET_ORGANIZATION_LIST
} from '../getters.type'
import OrganizationService from '../../services/organization.service'

const getDefaultState = () => {
  return {
    organizations: [],
    organization: null
  }
}

const getters = {
  [GET_ORGANIZATION_LIST](state) {
    return state.organizations
  },
  [GET_ORGANIZATION_DETAILS](state) {
    return state.organization
  }
}

const mutations = {
  [SET_ORGANIZATION_LIST](state, { data }) {
    state.organizations = data.docs
  },

  [SET_ORGANIZATION_DETAILS](state, { data }) {
    state.organization = data
  }
}

const actions = {
  [FETCH_ORGANIZATION_LIST]({ commit }) {
    return OrganizationService.fetchOrganizations().then((data) => {
      commit(SET_ORGANIZATION_LIST, data)
      return data
    })
  },
  [FETCH_ORGANIZATION_DETAILS]({ commit }, data) {
    return OrganizationService.fetchOrganizationDetails(data.slug).then(
      (data) => {
        commit(SET_ORGANIZATION_DETAILS, data)
        return data
      }
    )
  }
}

export function createOrganizationStore() {
  return {
    state: getDefaultState(),
    actions,
    mutations,
    getters
  }
}
