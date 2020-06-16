<template>
  <div class="panel">
    <div class="header-position">
      <page-header class="header" @backClick="onCancel" title="Sent Invites">
      </page-header>
    </div>
    <div class="main-container">
      <div class="page-container">
        <div class="left-container">
          <nitrozen-tab
            class="tabs"
            :tabItem="menus"
            :label="'display'"
            @tab-change="selectIndex($event)"
          ></nitrozen-tab>
          <div v-if="mainTabIndex === 0">
            <span
              class="invite-all-btn-container"
              v-if="mainPendingUserItems.length"
            >
              <!-- <button
                                class="btn cl-White bold-sm"
                            @click="
                                    resendAllPendingInvites(
                                        mainPendingUserItems
                                    )
                                "
                            >
                                Resend All
                            </button>-->
              <nitrozen-button
                class="mr24"
                v-flatBtn
                :theme="'secondary'"
                @click="resendAllPendingInvites(mainPendingUserItems)"
                >Resend All</nitrozen-button
              >
              <!-- <button
                                class="btn cl-White bold-sm"
                                @click="
                                    deleteAllPendingInvites(
                                        mainPendingUserItems
                                    )
                                "
                            >
                                Delete All
                            </button>-->
              <nitrozen-button
                class="button del-btn"
                v-strokeBtn
                :theme="'secondary'"
                @click="deleteAllPendingInvites(mainPendingUserItems)"
                >Delete All</nitrozen-button
              >
            </span>

            <page-empty v-else text="No invites found"></page-empty>

            <staff-add-invite
              v-for="(item, index) in mainPendingUserItems"
              :key="'mainpending_' + index"
              :staffData="item"
              :getInviteBody="getInviteBody"
              @inviteAction="fetchTabsData()"
            ></staff-add-invite>
          </div>
          <div v-if="mainTabIndex === 1">
            <page-empty
              v-if="!mainAcceptedUserItems.length"
              text="No invites found"
            ></page-empty>

            <staff-add-invite
              v-for="(item, index) in mainAcceptedUserItems"
              :key="'mainaccepted_' + index"
              :staffData="item"
              :getInviteBody="getInviteBody"
            ></staff-add-invite>
          </div>
        </div>
        <loader class="loading" v-if="inProgress"></loader>
      </div>
    </div>
  </div>
</template>

<script>
import loader from '@/components/common/loader'
import pageerror from '@/components/common/page-error.vue'
import pageempty from '@/components/common/page-empty.vue'
import admpageheader from '@/components/common/layout/page-header'
import admstaffinviteadd from '@/components/partner/invite/staff-add-invite.vue'
import TeamService from '@/services/team.service'

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
import root from 'window-or-global'

const config = root.config || {}
const env = root.env || {}
const MENUS = [
  {
    title: 'Pending Invites',
    display: ''
  },
  {
    title: 'Accepted Invites',
    display: ''
  }
]
export default {
  name: 'staff-previous-invites',
  components: {
    'page-header': admpageheader,
    loader: loader,
    'page-error': pageerror,
    'page-empty': pageempty,
    'staff-add-invite': admstaffinviteadd,
    'nitrozen-input': NitrozenInput,
    'nitrozen-button': NitrozenButton,
    'nitrozen-chips': NitrozenChips,
    'nitrozen-inline': NitrozenInline,
    'nitrozen-tab': NitrozenTab,
    'nitrozen-menu': NitrozenMenu,
    'nitrozen-menu-item': NitrozenMenuItem
  },
  directives: {
    flatBtn,
    strokeBtn
  },
  data() {
    return {
      pendingInvites: [],
      acceptedInvites: [],
      staffUsers: [],
      menus: [],
      mainTabIndex: 0,
      inProgress: false
    }
  },
  watch: {
    mainPendingUserItems() {
      this.menus[0].display = `${this.menus[0].title} (${this.mainPendingUserItems.length})`
    },
    mainAcceptedUserItems() {
      this.menus[1].display = `${this.menus[1].title} (${this.mainAcceptedUserItems.length})`
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
    partnerId() {
      return this.$route.params.partnerId
    }
  },
  mounted() {
    this.fetchTabsData()
    this.updateMenu()
  },
  methods: {
    fetchTabsData: function() {
      TeamService.listInvites({
        status: 'pending',
        platform: window.grimlock.platform,
        platformId: env.INVITE.PLATFORM
      })
        .then((data) => {
          this.pendingInvites = data.invites || []
        })
        .catch((err) => {})
      TeamService.listInvites({
        status: 'done',
        platform: window.grimlock.platform,
        platformId: env.INVITE.PLATFORM
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
    updateMenu() {
      this.menus = MENUS
      this.menus[0].display = `${this.menus[0].title} (${this.mainPendingUserItems.length})`
      this.menus[1].display = `${this.menus[1].title} (${this.mainAcceptedUserItems.length})`
    },
    selectIndex(item) {
      this.mainTabIndex = item.index
    },
    getInviteBody(message, emails, phoneNumbers, roles, permissions) {
      const body = {
        message: message,
        emails: emails || [],
        phoneNumbers: (phoneNumbers || []).map((p) =>
          p.length == 10 ? `91${p}` : p
        ),
        platform: window.grimlock.platform,
        platformId: env.INVITE.PLATFORM,
        redirectUrl: window.location.origin,
        meta: {
          application: window.grimlock.platform,
          title: this.meta.designation,
          permissions: permissions || this.meta.permissions,
          roles: roles || this.meta.roles
        }
      }
      return body
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
        this.$snackbar.global.showSuccess('Invites sent successfully')
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
        this.fetchTabsData()
        this.$snackbar.global.showSuccess('Invites deleted successfully')
      })
    },
    onCancel() {
      this.$router.push({
        path: `/partner/${this.partnerId}/invite`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.header-position {
  height: 58.5px;
}
.invite-all-btn-container {
  display: flex;
  justify-content: flex-end;
  margin: 12px 0px;
  .mr24 {
    margin-right: 24px;
  }
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
</style>
