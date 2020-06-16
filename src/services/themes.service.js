import ApiService from './api.service'
import URLS from './domain.service'

const ThemesService = {
  getOrganizationThemes(xOrganisationId, params) {
    let axiosOption = Object.assign(
      {},
      {
        params: { 'x-organisation-id': xOrganisationId, ...params }
      }
    )
    return ApiService.get(URLS.THEMES(), axiosOption)
  },
  listThemes(params) {
    let axiosOption = Object.assign({}, { params })
    return ApiService.get(URLS.LIST_THEMES(), axiosOption)
  }
}
export default ThemesService
