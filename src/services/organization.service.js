import ApiService from './api.service'
import URLS from './domain.service'

const OrganizationService = {
  fetchOrganizations() {
    let axiosOption = Object.assign({})
    return ApiService.get(URLS.ORGANIZATION(), axiosOption)
  },
  fetchOrganizationDetails(id) {
    let axiosOption = Object.assign({})
    return ApiService.get(URLS.ORGANIZATION(id), axiosOption)
  },
  updateOrganization(id, data) {
    let axiosOption = Object.assign({}, { data })
    return ApiService.put(URLS.ORGANIZATION(id), axiosOption)
  },
  fetchOrganizationForm() {
    return ApiService.get(URLS.ORGANIZATION_FORM())
  },
  createOrganization(data) {
    let axiosOption = Object.assign({}, { data })
    return ApiService.post(URLS.ORGANIZATION(), axiosOption)
  }
}
export default OrganizationService
