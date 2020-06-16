import ApiService from './api.service'
import URLS from './domain.service'
import urlJoin from 'url-join'

const TeamService = {
  // Search
  searchUser(params) {
    const axiosOption = Object.assign({
      params: params
    })
    return ApiService.get(URLS.SEARCH_USER(), axiosOption)
  },
  // Invite user
  inviteUser(options) {
    const axiosOption = Object.assign(
      {
        data: {
          ...options.data,
          registrationUrl: urlJoin(window.location.origin, '__private/invite')
        }
      },
      { params: options.params }
    )
    return ApiService.post(URLS.INVITE_USER(), axiosOption)
  },
  reinviteUser(options) {
    const axiosOption = Object.assign(
      {
        data: options.data
      },
      { params: options.params }
    )
    return ApiService.post(URLS.REINVITE_USER(), axiosOption)
  },
  acceptInvite(options) {
    const axiosOption = Object.assign(
      {
        data: options.data
      },
      { params: options.params }
    )
    return ApiService.post(URLS.ACCEPT_INVITE(), axiosOption)
  },
  getAccess(orgId) {
    const axiosOption = Object.assign({})
    return ApiService.get(URLS.CURRENT_USER_ACCESS(orgId), axiosOption)
  },
  listInvites(params) {
    const axiosOption = Object.assign({ params })
    return ApiService.get(URLS.INVITES(), axiosOption).then((r) => r.data)
  },
  verifyInvite(inviteId) {
    const axiosOption = Object.assign({ data: { inviteId } })
    return ApiService.post(URLS.VERIFY_INVITE(), axiosOption).then(
      (r) => r.data
    )
  },
  deleteInvite(params) {
    const axiosOption = Object.assign({ params })
    return ApiService.del(URLS.INVITE(), axiosOption).then((r) => r.data)
  },
  getInviteLink(options) {
    const axiosOption = Object.assign(
      {
        data: {
          ...options.data,
          registrationUrl: urlJoin(window.location.origin, '__private/invite')
        }
      },
      { params: options.params }
    )
    return ApiService.post(URLS.INVITE_LINK(), axiosOption)
  },

  // Staff
  fetchStaff(partnerId) {
    return ApiService.get(URLS.STAFF(partnerId))
  },
  // Acl
  fetchAcl() {
    return ApiService.get(URLS.ACL())
  },
  // update self info
  updateSelfStaff(data) {
    const axiosOption = Object.assign({
      data: data
    })
    return ApiService.put(URLS.STAFF_PROFILE(), axiosOption)
  },
  addStaff(data, partnerId) {
    const axiosOption = Object.assign({
      data: data
    })
    return ApiService.post(URLS.STAFF_DETAILS(partnerId, ''), axiosOption)
  },
  updateStaff(data, partnerId, staffId) {
    const axiosOption = Object.assign({
      data: data
    })
    return ApiService.put(URLS.STAFF_DETAILS(partnerId, staffId), axiosOption)
  },
  removeStaff(partnerId, staffId) {
    return ApiService.del(URLS.STAFF_DETAILS(partnerId, staffId))
  },
  fetchStaffDetail(partnerId, staffId) {
    return ApiService.get(URLS.STAFF_DETAILS(partnerId, staffId))
  }
}
export default TeamService
