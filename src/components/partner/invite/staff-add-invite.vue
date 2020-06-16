<template>
  <div class="bombshell-list-card-container">
    <div class="card-avatar prof-image">
      <img :src="getStaffProfile" alt="prof" />
    </div>
    <div class="card-content-section">
      <div class="card-content-line-1">{{ fullName }}</div>
      <div class="card-content-line-2" v-if="email">
        {{ email }}
      </div>
      <div class="card-content-line-3" v-if="phone">
        {{ phone }}
      </div>
      <div class="card-content-line-3" v-if="!staffData.registered">
        {{ staffData.meta.search }}
      </div>
    </div>
    <div class="card-badge-section">
      <div class="emp-box">
        <div class="action cl-Mako dark-xs" v-if="staffData.isStaff">
          Already Member
        </div>
        <div class="action" v-if="!staffData.isStaff">
          <!-- <button
                    class="staff cl-Mako dark-xs"
                    @click="addStaff"
                    v-if="staffData.registered && !staffData.invited"
                >
                    {{ registeredText }}
                </button> -->
          <nitrozen-button
            :theme="'secondary'"
            class="staff"
            @click="openRoleModal(true)"
            v-if="staffData.registered && !staffData.invited"
          >
            {{ registeredText }}
          </nitrozen-button>
          <!-- <button
                    class="invite cl-White dark-xs"
                    @click="openInviteModal = true"
                    v-if="!staffData.registered && !staffData.invited"
                >
                    {{ unRegisteredText }}
                </button> -->
          <nitrozen-button
            :theme="'secondary'"
            class="staff"
            @click="openRoleModal(false)"
            v-if="!staffData.registered && !staffData.invited"
          >
            {{ unRegisteredText }}
          </nitrozen-button>
          <!--
                <button
                    class=" cl-White dark-xs"
                    @click="resendInvite(staffData.meta.inviteId)"
                    v-if="staffData.invited"
                >
                    Resend Invite
                </button> -->
          <nitrozen-button
            :theme="'secondary'"
            class="invite"
            @click="resendInvite(staffData.meta.inviteId)"
            v-if="staffData.invited"
          >
            {{ resendText }}
          </nitrozen-button>
          <!-- <button
                    class="invite cl-White dark-xs"
                    @click="deleteInvite(staffData.meta.inviteId)"
                    v-if="staffData.invited"
                >
                    Delete Invite
                </button> -->
          <nitrozen-button
            :theme="'secondary'"
            class="invite"
            @click="deleteInvite(staffData.meta.inviteId)"
            v-if="staffData.invited"
          >
            {{ deleteText }}
          </nitrozen-button>
        </div>
      </div>
    </div>

    <div class="main-staff-box">
      <loader v-if="inProgress" class="loading"></loader>

      <role-modal
        ref="role-modal"
        @close="hideMessagebox = false"
        @invite="sendInvite"
        :hideMessage="hideMessagebox"
      ></role-modal>
    </div>
  </div>
</template>

<style lang="less" scoped>
.prof-image {
  overflow: hidden;
  img {
    width: 60px;
    height: 60px;
  }
}
.main-staff-box {
  margin: 10px 0px;
  font-family: Poppins;
  .emp-box {
    display: flex;
    justify-content: space-around;
    min-height: 70px;
    border: 1px solid @Gray;
    padding: 5px;
    border-radius: @BorderRadius;

    .emp-info {
      flex: 3;
      display: flex;
      padding: 5px;
      .full-name {
        padding: 5px 0px;
        font-size: 16px;
        font-weight: 500;
      }
      .info {
        padding-bottom: 5px;
        color: #9b9b9b;
        font-size: 14px;
        line-height: 21px;
      }
      .designation {
        opacity: 0.5;
      }
    }
    .action {
      .flex-center();
      flex: 0.5;
      .staff {
        white-space: nowrap;
        margin-left: 20px;
        font-size: 14px;
      }
      .invite {
        white-space: nowrap;
        margin-left: 20px;
        font-size: 14px;
      }
    }
  }
}
</style>

<script>
import inlinesvg from '@/components/common/inline-svg.vue'
import { ADD_STAFF_USER } from '@/store/action.type'
import loader from '@/components/common/loader'
import invitemodal from './invite-modal.vue'
import rolemodal from './role-modal.vue'
import TeamService from '@/services/team.service'
import root from 'window-or-global'
import { mapGetters } from 'vuex'
import {
  GET_APP_PLATFORM,
  GET_ORGANIZATION_DETAILS
} from '@/store/getters.type'
import { normalizeAPIError } from '@/helper/utils'
import { NitrozenButton, flatBtn, strokeBtn } from '@gofynd/nitrozen-vue'

const env = root.env || {}
const DEFAULT_DESIGNATION = 'Staff'

export default {
  name: 'staff-add-invite',
  components: {
    'inline-svg': inlinesvg,
    'invite-modal': invitemodal,
    'role-modal': rolemodal,
    'nitrozen-button': NitrozenButton,
    loader: loader
  },
  props: {
    staffData: Object,
    getInviteBody: Function
  },
  directives: {
    flatBtn,
    strokeBtn
  },
  computed: {
    fullName() {
      if (!this.staffData.registered) {
        return 'Unregistered User'
      }
      return `${this.staffData.firstName} ${this.staffData.lastName}`
    },
    email() {
      if (
        Array.isArray(this.staffData.emails) &&
        this.staffData.emails.length > 0
      ) {
        const arrEmails = this.staffData.emails.filter(
          (it) => it.primary === true
        )
        if (arrEmails.length > 0) {
          return arrEmails[0].email
        }
        return ''
      }
      return ''
    },
    phone() {
      if (
        Array.isArray(this.staffData.phoneNumbers) &&
        this.staffData.phoneNumbers.length > 0
      ) {
        const arrPhoneNumbers = this.staffData.phoneNumbers.filter(
          (it) => it.primary === true
        )
        if (arrPhoneNumbers.length > 0) {
          return arrPhoneNumbers[0].phone
        }
        return ''
      }
      return ''
    },
    getStaffProfile() {
      return (
        this.staffData.profile_pic || '/public/assets/pngs/default_profile.png'
      )
    },
    ...mapGetters({
      platform: GET_APP_PLATFORM,
      organization: GET_ORGANIZATION_DETAILS
    })
  },
  data: function() {
    return {
      registeredText: 'Add as Staff',
      unRegisteredText: 'Send Invite',
      invitedText: 'Invite sent',
      resendText: 'Resend Invite',
      deleteText: 'Delete Invite',
      openInviteModal: false,
      inProgress: false,
      hideMessagebox: false
    }
  },
  methods: {
    addStaff(value) {
      let body = this.getInviteBody(
        value.message,
        '',
        '',
        [value.roles],
        value.permissions
      )
      const data = {
        ...body.meta,
        user: this.staffData._id
      }
      this.inProgress = true

      const payload = {
        body: data,
        params: {
          partnerId: this.organization._id
        }
      }
      this.$store
        .dispatch(ADD_STAFF_USER, payload)
        .then((data) => {
          this.inProgress = false
          this.hideMessagebox = false
          this.$emit('inviteAction')
          this.registeredText = 'Added as staff'
          this.$snackbar.global.showSuccess('Added as staff')
          return data
        })
        .catch((err) => {
          this.inProgress = false
          this.$snackbar.global.showError(normalizeAPIError(err).message)
        })
    },
    deleteInvite(inviteId) {
      this.inProgress = true
      TeamService.deleteInvite({ inviteId })
        .then((res) => {
          this.inProgress = false
          this.$snackbar.global.showSuccess('Invite deleted')
          this.$emit('inviteAction')
        })
        .catch((err) => {
          this.inProgress = false
          this.$snackbar.global.showError(normalizeAPIError(err).message)
        })
    },
    resendInvite(inviteId) {
      this.inProgress = true
      TeamService.reinviteUser({
        data: { inviteId }
      })
        .then((res) => {
          this.inProgress = false
          this.$snackbar.global.showSuccess('Invite sent')
        })
        .catch((err) => {
          this.inProgress = false
          this.$snackbar.global.showError(normalizeAPIError(err).message)
        })
    },
    sendInvite(data) {
      if (this.hideMessagebox) {
        this.addStaff(data)
      } else {
        const body = this.getInviteData(data)
        this.inProgress = true
        // this.openInviteModal = false;
        TeamService.inviteUser({
          data: body
        })
          .then((res) => {
            this.inProgress = false
            this.hideMessagebox = false
            let { data } = res
            if (data.success) {
              this.unRegisteredText = 'Invite Sent'
              this.$snackbar.global.showSuccess('Invite sent successfully')
              this.$emit('inviteAction')
              return
            }
            this.$snackbar.global.showError('Failed to send Invite')
          })
          .catch((err) => {
            this.inProgress = false
            this.$snackbar.global.showError(normalizeAPIError(err).message)
          })
      }
    },
    getInviteData(data) {
      let val = this.staffData.meta.search || ''
      let emails = [],
        phoneNumbers = []
      if (Number.isNaN(Number(val))) {
        emails.push(val)
      } else {
        if (val.length === 10) {
          val = '91' + val
        }
        phoneNumbers.push(val)
      }

      let body = this.getInviteBody(
        data.message,
        emails,
        phoneNumbers,
        [data.roles],
        data.permissions
      )

      return body
    },
    openRoleModal(flag) {
      this.hideMessagebox = flag
      this.$nextTick(() => {
        this.$refs['role-modal'].open()
      })
    }
  }
}
</script>
