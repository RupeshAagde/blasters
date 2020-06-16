<template>
  <transition name="modal">
    <nitrozen-dialog
      ref="dialog"
      :title="hideMessage ? 'Add as Staff' : 'Invite Users'"
      @close="close"
    >
      <template slot="body">
        <loader v-if="inProgress" class="loading"></loader>

        <div v-if="!inProgress">
          <div>
            <label class="dark-xs cl-DustyGray2">Select Role *</label>
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

          <div v-if="!hideMessage">
            <label class="dark-xs cl-DustyGray2">Any Message</label>

            <nitrozen-input
              class="roles-div"
              type="textarea"
              placeholder="Write message here"
              v-model="message"
            ></nitrozen-input>
          </div>

          <div class="form-row mb15" v-if="copyLinkText">
            <div class="desc">
              <label class="dark-xs cl-DustyGray2">Invite Url</label>
            </div>
            <div class="invite-container" @click="copyLink">
              <nitrozen-input
                type="text"
                :disabled="true"
                :value="copyLinkText"
              />
              <inline-svg :src="'copy'"></inline-svg>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <nitrozen-button
          @click="generateLink"
          v-if="!hideMessage"
          :theme="'secondary'"
        >
          Generate Link
        </nitrozen-button>
        <nitrozen-button @click="invite" v-flatBtn :theme="'secondary'">
          <span v-if="!hideMessage">Send Invite</span>
          <span v-if="hideMessage">Add as Staff</span>
        </nitrozen-button>
      </template>
    </nitrozen-dialog>
  </transition>
</template>

<script>
import inlinesvg from '@/components/common/inline-svg.vue'
import loader from '@/components/common/loader'
import { FETCH_ACL } from '@/store/action.type'
import {
  NitrozenButton,
  NitrozenDialog,
  NitrozenInput,
  flatBtn,
  strokeBtn,
  NitrozenRadio
} from '@gofynd/nitrozen-vue'

import TeamService from '@/services/team.service'
import { copyToClipboard } from './../../../helper/utils'

import root from 'window-or-global'
const config = root.config || {}
const env = root.env || {}

export default {
  name: 'role-modal',
  props: {
    hideMessage: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'inline-svg': inlinesvg,
    loader,
    'nitrozen-button': NitrozenButton,
    'nitrozen-dialog': NitrozenDialog,
    'nitrozen-input': NitrozenInput,
    'nitrozen-radio': NitrozenRadio
  },
  directives: {
    flatBtn,
    strokeBtn
  },
  data() {
    return {
      message: '',
      aclList: {},
      currentRole: 'public',
      selectedPermission: [],
      copyLinkText: '',
      inProgress: false
    }
  },
  // computed: {
  //     aclList: ADMIN_GET_ACL
  // },
  mounted() {
    this.getAcl()
  },
  methods: {
    open() {
      this.$refs['dialog'].open({
        width: '600px',
        height: this.hideMessage ? '230px' : '450px',
        showCloseButton: true,
        dismissible: false,
        neutralButtonLabel: this.leftButton,
        positiveButtonLabel: this.rightButton
      })
    },
    close(e) {
      this.$emit('close', e)
    },
    getAcl: function() {
      this.inProgress = true
      this.$store
        .dispatch(FETCH_ACL)
        .then((data) => {
          this.inProgress = false
          this.aclList = data
        })
        .catch((err) => {
          console.error(err)
        })
    },
    invite() {
      let data = {
        roles: this.currentRole,
        message: this.message,
        permissions: this.selectedPermission
      }
      this.$emit('invite', data)
      this.$refs['dialog'].close('invite')
    },
    changeRole(index) {
      this.selectedPermission = this.aclList.roles[index].permissions
    },
    generateLink() {
      const data = {
        meta: {
          application: window.grimlock.platform,
          permissions: this.selectedPermission,
          roles: [this.currentRole],
          title: 'Staff'
        },
        platform: window.grimlock.platform,
        redirectUrl: window.location.origin,
        platformId: env.INVITE.PLATFORM
      }

      TeamService.getInviteLink({
        data
      })
        .then(({ data }) => {
          this.copyLinkText = data.link
          console.log(this.copyLinkText)
        })
        .catch((err) => {})
    },
    copyLink() {
      copyToClipboard(this.copyLinkText)
      if (this.copyLinkText) {
        this.$snackbar.global.showInfo('Copied to clipboard')
      } else {
        this.$snackbar.global.showError('Failed to copy')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.mb15 {
  margin: 15px 0;
}

.selected-item {
  font-weight: bold;
}

.roles-div {
  display: flex;
  margin: 20px 0;
  font-size: 14px;
  line-height: 21px;
  input[type='radio']:checked + label {
    font-weight: bold;
  }
  ::v-deep .nitrozen-radio-group {
    margin-right: 30px;
  }
}

.form-row {
  .invite-container {
    display: flex;
    .nitrozen-form-input {
      flex-grow: 1;
    }
    nitrozen-button {
      margin-left: 15px;
    }
  }
}
</style>
