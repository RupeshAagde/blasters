import ApiService from './api.service'
import URLS from './domain.service'

import { getCommonHeaderOptions } from './utils.service.js'

const UserService = {
  getConsent(params) {
    let axiosOption = Object.assign({}, getCommonHeaderOptions(), {
      params: params
    })
    return ApiService.get(URLS.COMM_CONSENT(), axiosOption)
  },
  saveConsent(data) {
    let axiosOption = Object.assign(
      {},
      { data: data },
      getCommonHeaderOptions()
    )
    return ApiService.post(URLS.COMM_CONSENT(), axiosOption)
  }
}
export default UserService
