import ApiService from './api.service'
import URLS from './domain.service'

const AppService = {
  listApplications(orgId, params) {
    let axiosOption = Object.assign({}, { params })
    return ApiService.get(URLS.APPLICATION(orgId), axiosOption)
  },
  getApplication(orgId, appId) {
    let axiosOption = Object.assign({})
    return ApiService.get(URLS.APPLICATION(orgId, appId), axiosOption)
  },
  createApplication(orgId, data) {
    let axiosOption = Object.assign({}, { data })
    return ApiService.post(URLS.APPLICATION(orgId), axiosOption)
  },
  deleteApplication(orgId, appId) {
    let axiosOption = Object.assign({})
    return ApiService.del(URLS.APPLICATION(orgId, appId), axiosOption)
  }
}
export default AppService
