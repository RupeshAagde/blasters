import * as _ from 'lodash'
import TeamService from '@/services/team.service'

import {
  SEARCH_USER,
  FETCH_ACL,
  ADD_STAFF_USER,
  REMOVE_STAFF_USER,
  FETCH_STAFF,
  UPDATE_STAFF_USER,
  FETCH_USER_ACCESS
} from './../action.type'

import {
  SEARCHED_RESULT,
  SET_STAFF,
  SET_ACL,
  SET_USER_ACCESS
} from './../mutation.type'

import {
  GET_SEARCHED_USER,
  GET_STAFF,
  GET_ACL,
  GET_USER_ACCESS
} from './../getters.type'

const getDefaultState = () => {
  return {
    userSeachResults: [],
    staffList: {
      docs: []
    },
    aclList: {},
    userAccess: []
  }
}

const state = getDefaultState()

const getters = {
  [GET_SEARCHED_USER](state) {
    return state.userSeachResults
  },
  [GET_STAFF](state) {
    return state.staffList.docs
  },
  [GET_ACL](state) {
    return state.aclList
  },
  [GET_USER_ACCESS](state) {
    return state.userAccess
  }
}

const mutations = {
  [SET_STAFF](state, { data }) {
    state.staffList = data
  },
  [SEARCHED_RESULT](state, { data }) {
    state.userSeachResults = data
  },
  [SET_ACL](state, { data }) {
    state.aclList = data
  },
  [SET_USER_ACCESS](state, { data }) {
    state.userAccess = data
  }
}

const actions = {
  [FETCH_STAFF]({ commit }, data) {
    return TeamService.fetchStaff(data.partnerId).then((res) => {
      commit(SET_STAFF, { data: res.data })
      return res.data
    })
  },
  [SEARCH_USER]({ commit }, queries) {
    commit(SEARCHED_RESULT, { data: [] })
    return TeamService.searchUser(queries).then((res) => {
      commit(SEARCHED_RESULT, { data: res.data })
      return res.data
    })
  },
  [ADD_STAFF_USER]({ commit }, data) {
    return TeamService.addStaff(data.body, data.params.partnerId).then(
      (res) => {
        return res.data
      }
    )
  },
  [REMOVE_STAFF_USER]({ commit }, data) {
    return TeamService.removeStaff(data.partnerId, data.staffId).then((res) => {
      return res.data
    })
  },
  [UPDATE_STAFF_USER]({ commit }, data) {
    return TeamService.updateStaff(
      data.body,
      data.params.partnerId,
      data.params.staffId
    ).then((res) => {
      return res.data
    })
  },
  [FETCH_ACL]({ commit }) {
    return TeamService.fetchAcl().then((res) => {
      commit(SET_ACL, { data: res.data })
      return res.data
    })
  },
  [FETCH_USER_ACCESS]({ commit }) {
    return TeamService.getAccess().then((res) => {
      commit(SET_USER_ACCESS, { data: res.data })
      return res.data
    })
  }
}

export function createTeamStore() {
  return {
    state: getDefaultState(),
    actions,
    mutations,
    getters
  }
}
