<template>
  <div class="panel">
    <div class="header-position">
      <page-header
        :title="`Edit ${fullName(currentUser)}`"
        :contextMenuItems="[
          {
            text: 'Remove',
            action: 'remove'
          }
        ]"
        @remove="$showConfirmDeleteDialog"
        @backClick="goBack"
      >
        <div class="button-box">
          <nitrozen-button
            class="pad-left"
            :theme="'secondary'"
            v-flatBtn
            @click="savePermission"
          >
            Save
          </nitrozen-button>
        </div>
      </page-header>
    </div>

    <page-error v-if="pageError && !pageLoading" @retry="getUser"></page-error>
    <loader class="loading" v-if="pageLoading"></loader>
    <div class="page-container">
      <div class="form-container">
        <div class="details-div" v-if="currentUser">
          <div class="cl-Mako bold-md">Details</div>
          <nitrozen-input
            label="Name"
            class="mt-md"
            :disabled="true"
            :value="fullName(currentUser)"
          ></nitrozen-input>
          <div class="mt-md inline">
            <nitrozen-input
              label="Phone Number"
              :disabled="true"
              :value="fullPhNo(primaryPhone)"
            ></nitrozen-input>
            <inline-svg
              class="copy-icon"
              src="copy"
              @click.native="copyToClipboard(primaryPhone.phone)"
            ></inline-svg>
          </div>
          <div class="mt-md inline">
            <nitrozen-input
              label="E-mail"
              :disabled="true"
              :value="primaryEmail.email"
            ></nitrozen-input>
            <inline-svg
              class="copy-icon"
              src="copy"
              @click.native="copyToClipboard(primaryEmail.email)"
            ></inline-svg>
          </div>
        </div>
      </div>
      <div class="settings-container">
        <div class="cl-Mako bold-md">Settings</div>

        <div class="access-div mt24">
          <label class="dark-xs cl-DustyGray2 bold">Roles</label>
        </div>
        <div class="roles-div">
          <nitrozen-radio
            v-for="(item, index) in aclList.roles"
            :key="index"
            name="roles"
            :radioValue="item.key"
            v-model="currentRole"
            @input="changeRole(index)"
            v-bind:class="{
              'selected-item': currentRole == item.key
            }"
            >{{ item.title }}</nitrozen-radio
          >
        </div>
        <div class="access-div">
          <label class="dark-xs cl-DustyGray2 bold">Access</label>
        </div>

        <div
          :class="{
            'disable-permission-div': currentRole != 'custom'
          }"
        >
          <permissions
            class="permission-div"
            :permissionData="aclList"
            :currentRole="currentRole"
            :currentPermissions="currentPermissions"
            @permission-data="setPermissionData"
          ></permissions>
        </div>
      </div>
    </div>

    <!-- modals -->
    <nitrozen-dialog
      ref="confirm_dialog"
      title="Confirm Delete"
      @close="$closeConfirmDeleteDialog"
    >
      <template slot="body">
        Are you sure you want to remove team member
        <span class="delete-name">({{ fullName(currentUser) }})</span>
        ?
      </template>
    </nitrozen-dialog>
  </div>
</template>

<style lang="less" scoped>
.delete-name {
  color: @DustyGray2;
  font-style: italic;
}
.header-position {
  height: 58.5px;
}
.button-box {
  display: flex;
  align-items: center;
  .menu {
    margin-left: 24px;
  }
}
.inline {
  display: flex;
}
.mt24 {
  margin-top: 24px;
}
.page-container {
  flex-direction: row-reverse;
  background-color: transparent;
  padding: 0;

  .form-container {
    width: 320px;
    margin-left: 24px;
    padding: 24px;
    border: 1px solid #f3f3f3;
    border-radius: 8px;
    background-color: #ffffff;
    height: fit-content;
    .copy-icon {
      ::v-deep svg {
        cursor: pointer;
        width: 16px;
        height: 16px;
        margin-left: 16px;
        margin-top: 20px;
      }
    }
  }
  .settings-container {
    display: block;
    flex: 1;
    padding: 24px;
    border: 1px solid #f3f3f3;
    border-radius: 8px;
    background-color: #ffffff;
  }
}

.roles-div {
  display: flex;
  margin-top: 4px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  line-height: 24px;
  ::v-deep .nitrozen-radio-group {
    margin-right: 30px;
  }
}
</style>

<script>
import { mapGetters } from 'vuex'
import * as _ from 'lodash'
import {
  NitrozenButton,
  NitrozenDialog,
  NitrozenRadio,
  NitrozenChips,
  NitrozenInput,
  NitrozenInline,
  NitrozenDropdown,
  flatBtn
} from '@gofynd/nitrozen-vue'
import {
  GET_STAFF,
  GET_ACL,
  GET_ORGANIZATION_DETAILS
} from '@/store/getters.type'
import {
  FETCH_STAFF,
  UPDATE_STAFF_USER,
  FETCH_ACL,
  REMOVE_STAFF_USER
} from '@/store/action.type'

import { fullName, reduce, fullPhNo } from '@/components/partner/team/helper'
import pageHeaderVue from '@/components/common/layout/page-header.vue'
import { copyToClipboard } from '@/helper/utils'
import loader from '@/components/common/loader.vue'
import pageError from '@/components/common/page-error.vue'
import TeamService from '@/services/team.service'
import permissionsVue from '@/components/partner/team/permissions.vue'
import inlinesvg from '@/components/common/inline-svg.vue'
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin'

export default {
  name: 'team-form',
  mixins: [dirtyCheckMixin],
  components: {
    permissions: permissionsVue,
    'page-header': pageHeaderVue,
    'nitrozen-button': NitrozenButton,
    'nitrozen-dialog': NitrozenDialog,
    'nitrozen-radio': NitrozenRadio,
    'nitrozen-chips': NitrozenChips,
    'nitrozen-input': NitrozenInput,
    'nitrozen-inline': NitrozenInline,
    'nitrozen-dropdown': NitrozenDropdown,
    'inline-svg': inlinesvg,
    'page-error': pageError,
    loader
  },
  directives: {
    flatBtn
  },
  data() {
    return {
      activeUserId: '',
      pageLoading: false,
      pageError: false,
      currentUser: {},
      currentRole: 'public',
      aclList: {},
      currentPermissions: [],
      multiSelect: [],
      isLoading: false,
      searchText: '',
      pristineData: null
    }
  },
  computed: {
    ...mapGetters({
      staffList: GET_STAFF,
      organization: GET_ORGANIZATION_DETAILS
    }),
    primaryPhone() {
      return this.reduce(this.currentUser.phone_numbers)
    },
    primaryEmail() {
      return this.reduce(this.currentUser.emails)
    }
  },
  mounted() {
    this.activeUserId = this.$router.history.current.params.user_id
    this.pageLoading = true
    this.getAcl()
  },
  watch: {},
  methods: {
    fullName,
    reduce,
    fullPhNo,
    isFormDirty() {
      return !_.isEqual(this.pristineData, this.getFormData())
    },
    getAcl: function() {
      this.$store
        .dispatch(FETCH_ACL)
        .then((data) => {
          this.aclList = data
          this.getUser()
        })
        .catch(() => {})
    },
    getUser() {
      TeamService.fetchStaffDetail(this.organization._id, this.activeUserId)
        .then(({ data }) => {
          this.currentUser = data
          this.currentRole = this.currentUser.roles[0]
          this.currentPermissions = this.currentUser.permissions
          this.pristineData = this.getFormData()
          this.pageLoading = false
          this.pageError = false
        })
        .catch((err) => {
          this.pageLoading = false
          this.pageError = true
        })
    },
    changeRole: function(index) {
      this.currentPermissions = this.aclList.roles[index].permissions
    },

    setPermissionData: function(event) {
      if (event) {
        this.currentUser.permissions = event
      }
    },
    getFormData() {
      return {
        user: this.currentUser.user,
        title: this.currentUser.title,
        roles: [this.currentRole],
        permissions: this.currentUser.permissions,
        _id: this.currentUser._id,
        partner_organization_id: this.organization._id
      }
    },
    savePermission() {
      const data = this.getFormData()
      this.pageLoading = true
      const info = {
        body: data,
        params: {
          partnerId: this.organization._id,
          staffId: this.currentUser._id
        }
      }
      this.$store
        .dispatch(UPDATE_STAFF_USER, info)
        .then((data) => {
          this.$snackbar.global.showSuccess('Team member details updated')
          this.pristineData = this.getFormData()
          this.pageLoading = false
          this.goBack()
        })
        .catch((err) => {
          this.pageLoading = false

          this.$snackbar.global.showError('Failed to Save Information')
        })
    },
    removeStaff() {
      this.$store
        .dispatch(REMOVE_STAFF_USER, {
          partnerId: this.organization._id,
          staffId: this.currentUser._id
        })
        .then((data) => {
          this.pageLoading = false
          this.$snackbar.global.showSuccess('Staff Removed')
          this.goBack()
        })
        .catch((err) => {
          this.$snackbar.global.showError('Failed to remove staff')
          this.pageLoading = false
        })
    },
    goBack() {
      this.$router.push(`/partner/${this.$route.params.partnerId}/team`)
    },
    copyToClipboard(text) {
      copyToClipboard(text)
      this.$snackbar.global.showInfo('Copied to clipboard', 1000)
    },
    $showConfirmDeleteDialog() {
      this.$refs['confirm_dialog'].open({
        width: '350px',
        positiveButtonLabel: 'Cancel',
        negativeButtonLabel: 'Remove',
        neutralButtonLabel: false
      })
    },
    $closeConfirmDeleteDialog(data) {
      if (data == 'Remove') {
        this.removeStaff()
      }
    }
  }
}
</script>
