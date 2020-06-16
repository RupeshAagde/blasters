<template>
  <div class="panel">
    <div class="header-position">
      <page-header
        class="header"
        @backClick="redirectListing"
        title="Invite Users"
      >
        <div class="button-box">
          <nitrozen-button
            class="pad-left"
            :theme="'secondary'"
            v-flat-btn
            @click="goToSentInvites"
          >
            Sent Invites
          </nitrozen-button>
        </div>
      </page-header>
    </div>
    <div class="main-container">
      <div class="page-container">
        <!-- <nitrozen-tab
          class="tabs"
          :tabItem="menus"
          :label="'display'"
          @tab-change="selectIndex($event)"
        ></nitrozen-tab> -->
        <invite-modal
          v-if="openInviteModal"
          @close="openInviteModal = false"
          @invite="inviteAllUnregistered"
        ></invite-modal>

        <h3 class="page-heading">Search</h3>
        <loader v-if="inProgress" class="loading"></loader>
        <div class="form left-container">
          <!-- invite link -->
          <div
            class="invite-container mt24"
            v-if="copyLinkText"
            @click="copy(copyLinkText)"
            title="Click to copy"
          >
            <nitrozen-input
              class="invite-link"
              label="Invite Link"
              :value="copyLinkText"
              :disabled="true"
            ></nitrozen-input>
            <inline-svg class="copy-icon" src="copy"></inline-svg>
          </div>

          <div class="desc mt24 form-row">
            <label class="dark-xxxs cl-DustyGray2 label">
              Invite via Mobile Number or Email Address* (Use commas to add
              more)
            </label>
            <label class="dark-xxxs cl-DustyGray2 char-count">
              <span v-if="searchTextArray.length">
                {{
                  searchTextArray.toString().length + searchText.value.length
                }}
              </span>
              <span v-else>{{ searchText.value.length }}</span>
              /{{ MAX_DESCRIPTION_CHAR_LIMIT }}
            </label>
          </div>
          <div class="input-text tags" @click="$refs.searchText.focus()">
            <nitrozen-chips
              v-for="(item, index) in searchTextArray"
              :key="'searchText_' + index"
            >
              {{ item }}
              <nitrozen-inline
                :icon="'cross'"
                class="nitrozen-icon"
                v-on:click="removeSearchInput(index)"
              ></nitrozen-inline>
            </nitrozen-chips>
            <input
              type="text"
              class="chip-input cl-Mako light-xs"
              v-model="searchText.value"
              @keydown="getSearchText()"
              @focusout="addSearchText()"
              ref="searchText"
              :maxLength="MAX_DESCRIPTION_CHAR_LIMIT"
            />
          </div>

          <nitrozen-button
            v-strokeBtn
            :theme="'secondary'"
            @click="searchStaff"
          >
            Search
          </nitrozen-button>
          <div class="staff-data" v-if="this.showSearchResult">
            <nitrozen-tab
              :tabItem="tabmenus"
              :label="'display'"
              @tab-change="selectTabIndex($event)"
            ></nitrozen-tab>
            <div class="tab-contents">
              <div v-if="searchResultTabIndex === 0">
                <span
                  class="invite-all-btn-container"
                  v-if="unregisteredUserItems.length"
                >
                  <nitrozen-button
                    v-flatBtn
                    :theme="'secondary'"
                    @click="openRoleModal(unregisteredUserItems, false)"
                  >
                    Invite All
                  </nitrozen-button>
                </span>
                <staff-add-invite
                  v-for="(item, index) in unregisteredUserItems"
                  :key="'unregistered_' + index"
                  :staffData="item"
                  :getInviteBody="getInviteBody"
                  @inviteAction="searchStaff(), fetchMainTabsData()"
                ></staff-add-invite>
                <page-empty
                  v-if="unregisteredUserItems.length == 0"
                  text="No unregistered user found"
                ></page-empty>
              </div>
              <div v-if="searchResultTabIndex === 1">
                <span
                  class="invite-all-btn-container"
                  v-if="pendingUserItems.length"
                >
                  <nitrozen-button
                    class="button"
                    v-flatBtn
                    :theme="'secondary'"
                    @click="resendAllPendingInvites(pendingUserItems)"
                  >
                    Resend All
                  </nitrozen-button>

                  <nitrozen-button
                    class="button del-btn"
                    v-strokeBtn
                    :theme="'secondary'"
                    @click="deleteAllPendingInvites(pendingUserItems)"
                  >
                    Delete All
                  </nitrozen-button>
                </span>
                <staff-add-invite
                  v-for="(item, index) in pendingUserItems"
                  :key="'pending_' + index"
                  :staffData="item"
                  :getInviteBody="getInviteBody"
                  @inviteAction="searchStaff(), fetchMainTabsData()"
                ></staff-add-invite>

                <page-empty
                  v-if="pendingUserItems.length == 0"
                  text="No pending user found"
                ></page-empty>
              </div>
              <div v-if="searchResultTabIndex === 2">
                <span
                  class="invite-all-btn-container"
                  v-if="registeredUserItems.length"
                >
                  <nitrozen-button
                    v-flatBtn
                    :theme="'secondary'"
                    @click="openRoleModal(registeredUserItems, true)"
                  >
                    Add All As Staff
                  </nitrozen-button>
                </span>
                <staff-add-invite
                  v-for="(item, index) in registeredUserItems"
                  :key="'registered_' + index"
                  :staffData="item"
                  :getInviteBody="getInviteBody"
                ></staff-add-invite>

                <page-empty
                  v-if="registeredUserItems.length == 0"
                  text="No register user found"
                ></page-empty>
              </div>
              <div v-if="searchResultTabIndex === 3">
                <staff-add-invite
                  v-for="(item, index) in staffUserItems"
                  :key="'staff_' + index"
                  :staffData="item"
                  :getInviteBody="getInviteBody"
                ></staff-add-invite>
                <page-empty
                  v-if="staffUserItems.length == 0"
                  text="No staff found"
                ></page-empty>
              </div>
            </div>
          </div>
          <!-- <div v-if="mainTabIndex === 1">
            <span
              class="invite-all-btn-container"
              v-if="mainPendingUserItems.length"
            >
              <nitrozen-button
                class="button"
                v-flatBtn
                :theme="'secondary'"
                @click="resendAllPendingInvites(mainPendingUserItems)"
                >Resend All</nitrozen-button
              >

              <nitrozen-button
                class="button del-btn"
                v-strokeBtn
                :theme="'secondary'"
                @click="deleteAllPendingInvites(mainPendingUserItems)"
                >Delete All</nitrozen-button
              >
            </span>
            <staff-add-invite
              v-for="(item, index) in mainPendingUserItems"
              :key="'mainpending_' + index"
              :staffData="item"
              :getInviteBody="getInviteBody"
              @inviteAction="searchStaff(), fetchMainTabsData()"
            ></staff-add-invite>
          </div>
          <div v-if="mainTabIndex === 2">
            <staff-add-invite
              v-for="(item, index) in mainAcceptedUserItems"
              :key="'mainaccepted_' + index"
              :staffData="item"
              :getInviteBody="getInviteBody"
            ></staff-add-invite>
          </div> -->
        </div>
      </div>
    </div>

    <role-modal
      ref="role-modal"
      @close="hideMessagebox = false"
      :hideMessage="hideMessagebox"
      @invite="addAllAsStaff"
    ></role-modal>
  </div>
</template>

<style lang="less" scoped>
body .panel {
  font-family: Poppins;
  .header-position {
    height: 58.5px;
  }
  .header {
    .button-box {
      display: flex;
      align-items: center;
      .menu {
        margin-left: 24px;
      }
    }
  }
}
.page-heading {
  font-size: 32px;
  color: #41434c;
  font-weight: 700;
}
.left-container {
  width: 100%;
}
.invite-container {
  display: flex;
  line-height: 16px;
  cursor: pointer;
  button {
    margin-left: 10px;
    padding: 0px 10px;
  }
}
.del-btn {
  margin-left: 20px;
}
.mt24 {
  margin-top: 24px;
  padding-bottom: 10px;
}
.main-container {
  // padding: 20px 0px;
  display: block;
  .page-container {
    width: auto;
  }
  .main-content {
    border-radius: 8px;
  }
  .desc {
    display: flex;
    align-items: center;
    .char-count {
      margin-left: auto;
    }
  }
  .staff-data {
    margin: 25px 0px;
  }
  .btn {
    margin-top: 0px;
    margin-right: 10px;
  }
  .tags {
    padding: 8px 0 5px 10px;
    border: 1px solid @Iron;
    border-radius: 3px;
    width: calc(100% - 12px);
    min-height: 100px;
    margin-bottom: 24px;
    cursor: text;
    .chip-input {
      border: none;
      outline: none;
    }
  }
  .loading {
    display: flex;
  }
}
.tabs {
  border-bottom: 1px solid @Iron;
}
.invite-link {
  width: 100%;
}
.copy-icon {
  ::v-deep svg {
    cursor: pointer;
    width: 16px;
    height: 16px;
    margin-left: 16px;
    margin-top: 20px;
  }
}
.tab {
  margin-right: 10px;
  padding: 10px 15px;
  font-size: 14px;
  line-height: 19px;
  display: inline-block;
  cursor: pointer;
  &.selected {
    color: #5c6bdd;
    font-weight: bold;
    border-bottom: 2px solid #5c6bdd;
  }
}
.invite-all-btn-container {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0px;
}
.push-right {
  float: right;
}
.additional-info-box {
  margin-top: 15px;
  border-width: 1px;
  border-color: @Gray;
  border-style: solid;
  text-align: center;
  padding: 10px;
  border-radius: @BorderRadius;
  .disable-click {
    pointer-events: none;
  }
  .info {
    padding: 10px 10px;
    background-color: @Alabaster;
    border-radius: @BorderRadius;
    .input-text {
      margin: 0px 10px 20px 2px;
      input {
        padding: 8px 0px 5px 10px;
        border: 1px solid @LightGray;
        border-radius: @BorderRadius;
      }
    }
    .label {
      text-align: start;
      padding: 5px;
    }
    .access-container {
      text-align: start;
      margin-bottom: 20px;
      .btn {
        text-transform: capitalize;
        font-weight: 700;
      }
      .label-btn {
        display: inline-flex;
        margin: 5px;
        color: #5c6bdd;
        box-sizing: content-box;
        background-color: @White;
        border: 1px solid #5c6bdd;
      }
      input[type='checkbox'] {
        display: none;
      }
      input[type='radio'] {
        display: none;
      }
      .selected {
        background-color: #5c6bdd;
        color: @White;
      }
    }
  }
  .buttons {
    justify-content: start;
    align-items: center;
    display: flex;
    margin-left: 10px;
    .delete-btn {
      margin-top: 10px;
      margin-left: auto;
      margin-right: 10px;
      cursor: pointer;
    }
    .disabled-button {
      opacity: 0.4;
    }
  }
}
</style>

<script>
import {
  NitrozenButton,
  NitrozenInput,
  flatBtn,
  strokeBtn,
  NitrozenChips,
  NitrozenInline,
  NitrozenTab,
  NitrozenMenu,
  NitrozenMenuItem
} from '@gofynd/nitrozen-vue'
import { mapGetters } from 'vuex'
import root from 'window-or-global'
import loader from '@/components/common/loader.vue'
import pageHeaderVue from './../../../components/common/layout/page-header.vue'
import inlinesvg from '@/components/common/inline-svg.vue'
import pageEmpty from '@/components/common/page-empty.vue'
import { GET_ORGANIZATION_DETAILS, GET_STAFF } from '@/store/getters.type'
import { FETCH_STAFF, ADD_STAFF_USER } from '@/store/action.type'
import { copyToClipboard, normalizeAPIError } from '@/helper/utils.js'
import emailValidator from 'email-validator'
import TeamService from '../../../services/team.service'

import { SEARCH_USER } from '@/store/action.type'
import staffinviteadd from '@/components/partner/invite/staff-add-invite.vue'
import rolemodal from '@/components/partner/invite/role-modal.vue'

const env = root.env || {}
const MENUS = [
  {
    title: 'Search & Invite',
    display: 'Search & Invite'
  },
  {
    title: 'Pending Invites',
    display: 'Pending Invites'
  },
  {
    title: 'Accepted Invites',
    display: 'Accepted Invites'
  }
]
const TABMENUS = [
  {
    title: 'Unregistered',
    display: 'Unregistered'
  },
  {
    title: 'Pending',
    display: 'Pending'
  },
  {
    title: 'Registered',
    display: 'Registered'
  },
  {
    title: 'Staff',
    display: 'Staff'
  }
]
export default {
  components: {
    'page-header': pageHeaderVue,
    'nitrozen-input': NitrozenInput,
    'nitrozen-button': NitrozenButton,
    'nitrozen-chips': NitrozenChips,
    'nitrozen-inline': NitrozenInline,
    'nitrozen-tab': NitrozenTab,
    'inline-svg': inlinesvg,
    'staff-add-invite': staffinviteadd,
    'role-modal': rolemodal,
    'page-empty': pageEmpty,
    loader
  },
  directives: {
    flatBtn,
    strokeBtn
  },
  watch: {},

  data() {
    return {
      inProgress: false,
      searchText: {
        value: '',
        showerror: false,
        errortext: ''
      },
      openInviteModal: false,
      currentCharCount: 0,
      addInviteStaff: [],
      registeredUsers: [],
      staffUsers: [],
      invites: [],
      /* search tab */
      pendingUserItems: [],
      staffUserItems: [],
      registeredUserItems: [],
      unregisteredUserItems: [],
      searchResultTabIndex: 0,
      showSearchResult: false,
      showAdvanced: false,

      meta: {
        designation: 'Staff',
        title: 'Staff',
        permissions: [],
        roles: ['public']
      },
      permissions: [
        'settings',
        'marketing',
        'communication',
        'developer',
        'team',
        'catalogue'
      ],
      /* search tab end */
      pendingInvites: [],
      acceptedInvites: [],
      /* main tab end */
      copyLinkText: '',
      MAX_DESCRIPTION_CHAR_LIMIT: 1000,
      searchTextArray: [],
      allUserData: [],
      hideMessagebox: false,
      menus: [],
      tabmenus: []
    }
  },
  computed: {
    mainPendingUserItems() {
      return this.pendingInvites.map((i) => {
        return {
          registered: false,
          invited: true,
          meta: {
            invite: i,
            search: i.email || (i.phoneNumber && i.phoneNumber.phone),
            inviteId: i._id,
            message: i.message
          }
        }
      })
    },
    mainAcceptedUserItems() {
      let userMap = this.staffUsers.reduce((a, user) => {
        user.emails = user.emails || []
        user.phoneNumbers = user.phoneNumbers || []

        let emails = user.emails.filter((e) => e.verified)
        let phoneNumbers = user.phoneNumbers.filter((p) => p.verified)

        emails.forEach((e) => {
          a[e.email] = user
        })
        phoneNumbers.forEach((p) => {
          a[p.phone] = user
        })
        a[user._id] = user
        return a
      }, {})
      return this.acceptedInvites.map((i) => {
        return {
          registered: true,
          isStaff: true,
          ...userMap[i.email || (i.phoneNumber || i.phoneNumber.phone)]
        }
      })
    },
    ...mapGetters({
      organization: GET_ORGANIZATION_DETAILS,

      employeeList: GET_STAFF
    })
  },
  mounted() {
    this.fetchMainTabsData()
    this.updateMenu()
    this.updateTabMenu()
  },
  methods: {
    updateMenu() {
      this.menus = MENUS
    },
    updateTabMenu() {
      this.tabmenus = TABMENUS
      this.tabmenus[0].display = `${this.tabmenus[0].title} (${this.unregisteredUserItems.length})`
      this.tabmenus[1].display = `${this.tabmenus[1].title} (${this.pendingUserItems.length})`
      this.tabmenus[2].display = `${this.tabmenus[2].title} (${this.registeredUserItems.length})`
      this.tabmenus[3].display = `${this.tabmenus[3].title} (${this.staffUserItems.length})`
    },
    redirectListing() {
      this.$router.push(`/partner/${this.$route.params.partnerId}/team`)
    },
    selectTabIndex(item) {
      this.searchResultTabIndex = item.index
    },

    isPermissionPresent(permission) {
      return this.meta.permissions.indexOf(permission) !== -1
    },
    hideErrors() {
      this.searchText.showerror = false
    },

    addAllAsStaff(event) {
      if (this.hideMessagebox) {
        this.inProgress = true
        let pArr = this.allUserData.map((item) => {
          let data = {
            user: item._id,
            title: this.meta.designation,
            permissions: event.permissions || this.meta.permissions,
            roles: event.roles || this.meta.roles
          }
          return this.$store.dispatch(ADD_STAFF_USER, {
            body: data,
            params: {
              partnerId: this.organization._id
            }
          })
        })
        return Promise.all(pArr)
          .then((data) => {
            this.inProgress = false
            this.hideMessagebox = false
            this.$snackbar.global.showSuccess('Added as staff')
            this.searchStaff()
            this.fetchMainTabsData()
          })
          .catch((err) => {
            this.inProgress = false
            this.$snackbar.global.showError(normalizeAPIError(err).message)
          })
      } else {
        this.inviteAllUnregistered(event)
        console.log(event)
      }
    },
    fetchMainTabsData() {
      const data = {
        meta: {
          organization_id: this.organization._id,
          permissions: [],
          roles: ['public'],
          title: 'Team'
        },
        platform: window.grimlock.platform,
        redirectUrl: window.location.origin,
        platformId: this.organization._id
      }

      TeamService.getInviteLink({
        data
      })
        .then(({ data }) => {
          this.copyLinkText = data.link
        })
        .catch((err) => {})

      TeamService.listInvites({
        status: 'pending',
        platform: window.grimlock.platform,
        platformId: this.organization._id
      })
        .then((data) => {
          this.pendingInvites = data.invites || []
        })
        .catch((err) => {})
      TeamService.listInvites({
        status: 'done',
        platform: window.grimlock.platform,
        platformId: this.organization._id
      })
        .then((data) => {
          this.acceptedInvites = data.invites
          let query = []
          data.invites.forEach((i) => {
            query.push(i.email || (i.phoneNumber && i.phoneNumber.phone))
          })
          this.$store
            .dispatch(SEARCH_USER, {
              query,
              platform: window.grimlock.platform
            })
            .then((data) => {
              this.staffUsers = data
            })
            .catch((err) => {})
        })
        .catch((err) => {})
    },
    getInviteBody(message, emails, phoneNumbers, roles, permissions) {
      const body = {
        message: message || 'You are invited to access Fynd Partners',
        emails: emails || [],
        phoneNumbers: (phoneNumbers || []).map((p) =>
          p.length == 10 ? `91${p}` : p
        ),
        platform: window.grimlock.platform,
        platformId: this.organization._id,
        redirectUrl: window.location.origin,
        ttl: 800000,
        meta: {
          organization_id: this.organization._id,
          title: this.meta.designation,
          permissions: permissions || this.meta.permissions,
          roles: roles || this.meta.roles
        }
      }
      return body
    },
    sendInvites(message, emails, phoneNumbers, roles, permissions) {
      const body = this.getInviteBody(
        message,
        emails,
        phoneNumbers,
        roles,
        permissions
      )
      this.inProgress = true
      this.openInviteModal = false
      return TeamService.inviteUser({
        data: body
      })
        .then((res) => {
          this.inProgress = false
          this.$snackbar.global.showSuccess('Invites Sent')
        })
        .catch((err) => {
          this.inProgress = false
          this.$snackbar.global.showError(normalizeAPIError(err).message)
        })
    },
    inviteAllUnregistered(event) {
      this.inProgress = true
      this.openInviteModal = false
      let emails = []
      let phoneNumbers = []
      this.unregisteredUserItems.forEach((i) => {
        let {
          meta: { search }
        } = i
        if (emailValidator.validate(search.trim())) {
          emails.push(search.trim())
        } else {
          phoneNumbers.push(search.trim())
        }
      })
      this.sendInvites(
        event.message,
        emails,
        phoneNumbers,
        event.roles,
        event.permissions
      ).then((res) => {
        this.searchStaff()
        this.fetchMainTabsData()
      })
    },
    resendAllPendingInvites(items) {
      this.inProgress = true
      let pArr = []
      items.forEach((i) => {
        let {
          meta: { inviteId }
        } = i
        pArr.push(
          TeamService.reinviteUser({
            data: { inviteId }
          })
        )
      })
      return Promise.all(pArr).then(() => {
        this.inProgress = false
        this.$snackbar.global.showSuccess('Invites Sent')
      })
    },
    deleteAllPendingInvites(items) {
      this.inProgress = true
      let pArr = []
      items.forEach((i) => {
        let {
          meta: { inviteId }
        } = i
        pArr.push(TeamService.deleteInvite({ inviteId }))
      })
      return Promise.all(pArr).then(() => {
        this.inProgress = false
        this.searchStaff()
        this.fetchMainTabsData()
        this.$snackbar.global.showSuccess('Invites Deleted')
      })
    },
    isInviteExpired(invite) {
      if (invite.ttl == -1) {
        return false
      }
      return new Date(invite.createdAt).getTime() + invite.ttl < Date.now()
    },
    searchStaff() {
      this.hideErrors()
      // const arrQueries = this.getValidData();
      const arrQueries = this.searchTextArray
      if (arrQueries.length === 0) {
        this.searchText.showerror = true
        this.searchText.errortext = 'No Results found'
        return
      }
      this.inProgress = true

      let userPromise = this.$store.dispatch(SEARCH_USER, {
        query: arrQueries,
        platform: window.grimlock.platform
      })
      let invitePromise = TeamService.listInvites({
        platform: window.grimlock.platform,
        platformId: this.organization._id
      })
      let staffPromise = this.$store.dispatch(FETCH_STAFF, {
        partnerId: this.$route.params.partnerId
      })

      Promise.all([userPromise, invitePromise, staffPromise]).then((data) => {
        let [users, { invites }] = data
        this.inProgress = false
        this.registeredUsers = users
        this.invites = invites
        this.filterSearchResults(arrQueries)
        this.showSearchResult = true
      })
      return false
    },
    openRoleModal(data, hide) {
      if (data) {
        this.allUserData = data
      }
      this.hideMessagebox = hide
      this.$nextTick(() => {
        this.$refs['role-modal'].open()
      })
    },
    copy(text) {
      copyToClipboard(text)
      this.$snackbar.global.show('Copied to clipboard')
    },
    getValidData() {
      let arrData = this.searchText.value.split(/[ ,]+/)
      arrData = arrData.filter((it) => it.length > 8)
      return arrData
    },
    filterSearchResults(arrQueries) {
      let queryMap = arrQueries.reduce((a, q) => {
        a[q] = q
        return a
      }, {})

      let inviteMap = this.invites.reduce((a, invite) => {
        if (invite.email) {
          a[invite.email] = invite
        } else if (invite.phoneNumber) {
          a[invite.phoneNumber.phone] = invite
        }
        return a
      }, {})

      let userMap = this.registeredUsers.reduce((a, user) => {
        user.emails = user.emails || []
        user.phoneNumbers = user.phoneNumbers || []

        let emails = user.emails.filter((e) => e.verified)
        let phoneNumbers = user.phoneNumbers.filter((p) => p.verified)

        emails.forEach((e) => {
          a[e.email] = user
        })
        phoneNumbers.forEach((p) => {
          a[p.phone] = user
        })
        a[user._id] = user
        return a
      }, {})

      this.pendingUserItems = this.invites
        .filter(
          (i) =>
            i.status !== 'done' &&
            (queryMap[i.email] ||
              queryMap[i.phoneNumber && i.phoneNumber.phone]) &&
            !(userMap[i.email] || userMap[i.phoneNumber && i.phoneNumber.phone])
        )
        .map((i) => {
          return {
            registered: false,
            invited: true,
            meta: {
              invite: i,
              search: i.email || (i.phoneNumber && i.phoneNumber.phone),
              inviteId: i._id,
              message: i.message
            }
          }
        })

      this.staffUserItems = this.registeredUsers
        .filter((u) => this.isAlreadyStaff(u))
        .map((u) => {
          return {
            registered: true,
            isStaff: true,
            ...u
          }
        })

      this.registeredUserItems = this.registeredUsers
        .filter((u) => !this.isAlreadyStaff(u))
        .map((u) => {
          return {
            registered: true,
            ...u
          }
        })

      this.unregisteredUserItems = arrQueries
        .filter((q) => !inviteMap[q] && !userMap[q])
        .map((q) => {
          return {
            registered: false,
            meta: {
              search: q
            }
          }
        })

      this.updateTabMenu()

      // this.addInviteStaff = [...this.pendingUserItems];
      // this.addInviteStaff = this.addInviteStaff.map(it => {
      //     it.registered = true;
      //     it.isStaff = this.isAlreadyStaff(it);
      //     return it;
      // });

      // for (let i = 0; i < arrQueries.length; i++) {
      //     const isUserRegistered = this.checkIfAlreadyRegistered(
      //         arrQueries[i].trim()
      //     );
      //     if (!isUserRegistered) {
      //         const obj = {
      //             registered: false,
      //             meta: {
      //                 search: arrQueries[i]
      //             }
      //         };
      //         this.addInviteStaff.push(obj);
      //     }
      // }
    },
    isAlreadyStaff(item) {
      item.emails = item.emails || []
      item.phoneNumbers = item.phoneNumbers || []
      let empMap =
        this.employeeList &&
        this.employeeList.reduce((a, e) => {
          e.emails = e.emails || []
          e.phone_numbers = e.phone_numbers || []
          e.emails.forEach((it) => {
            if (it.verified) {
              a[it.email] = e
            }
          })
          e.phone_numbers.forEach((it) => {
            if (it.verified) {
              a[it.phone] = e
            }
          })
          return a
        }, {})

      let verifiedEmails = item.emails.filter((e) => e.verified)
      for (let i = 0; i < verifiedEmails.length; i++) {
        let { email } = verifiedEmails[i]
        if (empMap[email]) {
          return true
        }
      }

      let verifiedPhones = item.phoneNumbers.filter((e) => e.verified)
      for (let i = 0; i < verifiedPhones.length; i++) {
        let { phone } = verifiedPhones[i]
        if (empMap[phone]) {
          return true
        }
      }
      return false
    },
    checkIfAlreadyRegistered(item) {
      for (let i = 0; i < this.searchResults.length; i++) {
        if (Array.isArray(this.searchResults[i].emails)) {
          if (
            this.searchResults[i].emails.filter((it) => it.email === item)
              .length > 0
          ) {
            return true
          }
        }
        if (Array.isArray(this.searchResults[i].phoneNumbers)) {
          if (
            this.searchResults[i].phoneNumbers.filter((it) => it.phone === item)
              .length > 0
          ) {
            return true
          }
        }
      }
      return false
    },
    getSearchText() {
      if (
        event.keyCode == 32 ||
        event.keyCode == 13 ||
        event.keyCode == 44 ||
        event.keyCode == 9 ||
        event.keyCode == 188
      ) {
        this.addSearchText(event)
        event.target.value = ''
      }
      if (event.keyCode == 8 && !this.searchText.value) {
        if (this.searchTextArray.length) {
          this.searchTextArray.pop()
        }
      }
    },
    addSearchText(event) {
      if (this.searchText.value) {
        if (
          this.searchTextArray.filter((it) => it === this.searchText.value)
            .length === 0
        )
          this.searchTextArray.push(this.searchText.value)
        this.searchText.value = ''
      }
    },
    removeSearchInput(index) {
      this.searchTextArray.splice(index, 1)
    },
    goToSentInvites() {
      this.$router.push(`/partner/${this.$route.params.partnerId}/invite/sent`)
    }
  }
}
</script>
