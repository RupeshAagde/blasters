import EmployeeService from '@/services/employee.service'

import { GET_EMPLOYEE_LIST } from '../getters.type'

import { FETCH_EMPLOYEE_LIST } from '../action.type'

import { SET_EMPLOYEE_LIST } from '../mutation.type'

const getDefaultState = () => {
  return {
    selectedEmployee: {},
    employeesData: [],
    employeeAccessInfo: {}
  }
}

const state = getDefaultState()

const getters = {
  // [GET_EMPLOYEE_LIST](state) {
  //   return state.employeesData
  // }
}

const mutations = {
  // [SET_EMPLOYEE_LIST](state, { data }) {
  //   state.employeesData = data
  // }
}

const actions = {
  // [FETCH_EMPLOYEE_LIST]({ commit }) {
  //   EmployeeService.fetchEmployeeList()
  //     .then((res) => {
  //       commit(SET_EMPLOYEE_LIST, { data: res.data })
  //     })
  //     .catch((err) => {
  //       //Handle error state
  //     })
  // }
}

export function createEmployeeStore() {
  return {
    state: getDefaultState(),
    actions,
    mutations,
    getters
  }
}
