import urlJoin from 'url-join'
import { isBrowser, isNode } from 'browser-or-node'
import root from 'window-or-global'

const envVars = root.env || {}

let PLATFORM_COMMON_BASE = isNode
  ? envVars.BROWSER_CONFIG.PLATFORM_COMMON_MAIN_URL
  : envVars.PLATFORM_COMMON_MAIN_URL

//remove later when done from nginx
PLATFORM_COMMON_BASE = urlJoin(PLATFORM_COMMON_BASE, '/partner')

const GRIMLOCK_BASE = isNode
  ? envVars.BROWSER_CONFIG.GRIMLOCK_MAIN_SVC
  : envVars.GRIMLOCK_MAIN_URL

const BLITZKRIEG_BASE = isNode
  ? envVars.BROWSER_CONFIG.BLITZKRIEG_MAIN_SVC
  : envVars.BLITZKRIEG_MAIN_URL

const UNICRON_BASE = isNode
  ? envVars.BROWSER_CONFIG.UNICRON_MAIN_SVC
  : envVars.UNICRON_MAIN_URL

const URLS = {
  // Organizations
  ORGANIZATION: (id = '') => {
    return urlJoin(PLATFORM_COMMON_BASE, '/v1/organization', id)
  },
  ORGANIZATION_FORM: () => {
    return urlJoin(
      PLATFORM_COMMON_BASE,
      '/v1/organization/form/partner-organization-form'
    )
  },
  //TEAM<->Staff<->INVITE
  STAFF: (partnerId) => {
    return urlJoin(
      PLATFORM_COMMON_BASE,
      'v1/organization/',
      partnerId,
      '/team-member'
    )
  },
  STAFF_DETAILS: (partnerId, staffId) => {
    return urlJoin(
      PLATFORM_COMMON_BASE,
      '/v1/organization/',
      partnerId,
      'team-member',
      staffId
    )
  },
  // Staff
  ACL: () => {
    return urlJoin(PLATFORM_COMMON_BASE, '/v1/organization/team/acl')
  },
  // Staff profile
  STAFF_PROFILE: () => {
    return urlJoin(
      PLATFORM_COMMON_BASE,
      '/v1/application/current/staff/profile'
    )
  },

  // GrimLock

  // Search
  SEARCH_USER: () => {
    return urlJoin(GRIMLOCK_BASE, '/user-info/search')
  },
  // Invite
  INVITE_USER: () => {
    return urlJoin(GRIMLOCK_BASE, '/v2/invite/send')
  },
  VERIFY_INVITE: () => {
    return urlJoin(GRIMLOCK_BASE, '/v2/invite/verify')
  },
  // Invite
  REINVITE_USER: () => {
    return urlJoin(GRIMLOCK_BASE, '/v2/invite/resend')
  },
  //Invite Link
  INVITE_LINK: () => {
    return urlJoin(GRIMLOCK_BASE, '/v2/invite/link')
  },
  //List Invites
  INVITES: () => {
    return urlJoin(GRIMLOCK_BASE, '/v2/invite')
  },
  ACCEPT_INVITE: () => {
    return urlJoin(
      PLATFORM_COMMON_BASE,
      '/v1/application/current/invite/accept'
    )
  },
  CURRENT_USER_ACCESS: (orgId) => {
    return urlJoin(
      PLATFORM_COMMON_BASE,
      '/v1/organization/',
      orgId,
      '/team-member/current/access'
    )
  },

  // Application
  APPLICATION: (orgId, appId = '') => {
    return urlJoin(
      PLATFORM_COMMON_BASE,
      '/v1/organization/',
      orgId,
      '/application',
      appId
    )
  },

  // Themes
  THEMES: () => {
    return urlJoin(BLITZKRIEG_BASE, '/theme/v2')
  },
  LIST_THEMES: () => {
    return urlJoin(BLITZKRIEG_BASE, '/theme/v2/list')
  },

  // Slingshot
  // FETCH_EMPLPOYEE_LISTING: () => {
  //   return urlJoin(PLATFORM_COMMON_BASE, '/v1/application/current/staff')
  // },
  // FETCH_EMPLOYEE_ACCESS_DETAILS: () => {
  //   return urlJoin(PLATFORM_COMMON_BASE, '/v1/application/current/access')
  // }

  // Unicron
  FETCH_PLANS_LIST: () => {
    return urlJoin(UNICRON_BASE, 'v1/plan')
  }
}

export default URLS
