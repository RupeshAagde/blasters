<template>
  <div class="cart-error">
    <div class="logo">
      <img :src="defaultLogo" />
    </div>
    <nitrozen-dialog
      title="Invite Error"
      ref="error_dialog"
      modalClass="error-modal"
    >
      <span class="modal-error-msg">{{ modalErrorMsg }}</span>
    </nitrozen-dialog>
    <form-wizard
      ref="tabs"
      :title="formWizardTitle"
      :stepSize="detectMobile() ? 'xs' : 'md'"
      color="#3498db"
      subtitle="Please provide the required info to proceed"
      @on-loading="setLoading"
      @on-complete="onComplete"
      @on-error="handleErrorMessage"
    >
      <template slot="step" slot-scope="props">
        <wizard-step
          :tab="props.tab"
          :transition="props.transition"
          :index="props.index"
        ></wizard-step>
      </template>
      <tab-content title="Login/Register">
        <div ref="authContainer" id="authContainer"></div>
      </tab-content>
      <tab-content title="Get Started">
        <invite-get-started></invite-get-started>
      </tab-content>
      <template slot="footer" slot-scope="props">
        <div class="wizard-footer-left">
          <wizard-button v-if="false">Previous</wizard-button>
        </div>
        <div class="wizard-footer-right">
          <wizard-button
            v-if="props.activeTabIndex"
            @click.native="props.nextTab()"
            class="wizard-footer-right finish-button"
            :style="props.fillButtonStyle"
            >{{ props.isLastStep ? 'Go to Home' : 'Next' }}</wizard-button
          >
        </div>
      </template>
      <div v-if="errorMsg">
        <span class="error">{{ errorMsg }}</span>
      </div>
    </form-wizard>
    <loader v-if="loading" class="loading"></loader>
  </div>
</template>

<style lang="less" scoped>
@import '~vue-form-wizard/dist/vue-form-wizard.min.css';

.logo {
  margin-bottom: 15px;
  h4 {
    color: #41434c;
    font-weight: bold;
    margin-top: 10px;
  }
}

#authContainer {
  height: 600px;
}

.stepTitle {
  margin-top: 10px;
}

.mt20 {
  margin-top: 20px;
}

.cart-error {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.modal-error-msg {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
}

::v-deep .modal-title {
  font-size: 20px;
}

.error {
  color: @Required;
  font-size: 15px;
  margin-top: 10px;
  display: flex;
}

::v-deep .wizard-tab-content {
  padding: 0px !important;
}

::v-deep .additional-info-box {
  padding: 0px !important;
}

::v-deep .wizard-title {
  margin-bottom: 10px;
  color: @Mako;
  font-size: 18px;
  font-weight: 700;
}

.additional-info-box {
  margin-top: 15px;
  // border-width: 1px;
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
    // background-color: @Alabaster;
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
      }
      .label-btn {
        display: inline-flex;
        margin: 5px;
        color: @Mako;
        box-sizing: content-box;
        background-color: @White;
        border: 1px solid @Mako;
      }
      input[type='checkbox'] {
        display: none;
      }
      input[type='radio'] {
        display: none;
      }
      .selected {
        background-color: @Mako;
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
import _ from 'lodash'
import { NitrozenDialog } from '@gofynd/nitrozen-vue'
import {
  FormWizard,
  TabContent,
  WizardStep,
  WizardButton
} from 'vue-form-wizard'
import TeamService from '@/services/team.service'
import loader from '@/components/common/loader.vue'
import getStarted from './get-started.vue'
import { detectMobile, normalizeAPIError } from '@/helper/utils'
import EmployeeService from '@/services/employee.service'
import { setAuthTokenHeader } from '@/services/utils.service.js'
import root from 'window-or-global'
import { GET_APP_CONFIG } from '@/store/getters.type'
import { mapGetters } from 'vuex'

export default {
  name: 'invite',
  components: {
    'form-wizard': FormWizard,
    'tab-content': TabContent,
    'wizard-step': WizardStep,
    'nitrozen-dialog': NitrozenDialog,
    WizardButton,
    loader,
    'invite-get-started': getStarted
  },
  props: {
    inviteId: {
      type: String
    }
  },
  data() {
    return {
      employeeCode: '',
      errorMsg: '',
      modalErrorMsg: '',
      user: {},
      loading: false,
      authToken: '',
      defaultLogo: 'https://partners.fynd.com/public/assets/pngs/logo.png'
    }
  },
  computed: {
    formWizardTitle() {
      return this.user._id
        ? `Onboarding (${this.user.firstName} ${this.user.lastName})`
        : 'Onboarding'
    }
  },
  mounted() {
    let params = {
      limit: 500,
      page: 1
    }
    TeamService.verifyInvite(this.inviteId)
      .then(() => {
        window.grimlock
          .getUser()
          .then((u) => {
            this.user = u.user
            this.$refs.tabs.changeTab(0, 1)
            this.fetchAndUpdateInformation()
          })
          .catch((e) => {
            console.error(e)
            this.loadGrimlockPage()
          })
      })
      .catch((e) => {
        this.showModal(normalizeAPIError(e).message)
      })
  },
  methods: {
    fetchAndUpdateInformation() {
      return Promise.all([
        TeamService.fetchStaff(),
        TeamService.listInvites({
          inviteId: this.inviteId
        }).catch(() => {
          return { invite: {} }
        })
      ])
        .then(([staff, { invite }]) => {
          invite = invite || { meta: {} }
          staff = staff || {}
          staff = staff.data
          let userStaffInfo = staff.find((s) => s.user === this.user._id)
          userStaffInfo = userStaffInfo || {}
        })
        .catch((e) => {
          console.error(e)
        })
    },
    detectMobile,
    onComplete() {
      window.location.href = '/'
    },
    loadGrimlockPage() {
      window.grimlock.renderIframe({
        name: 'invite',
        parentEl: this.$refs.authContainer,
        path: 'register',
        query: { inviteId: this.inviteId },
        onLoad: () => {
          console.log('iframe loaded------------------')
        },
        onLogin: (u) => {
          console.log('onlogin-----------')
          console.log(u)
          this.user = u.user
          this.$refs.tabs.changeTab(0, 1)
          this.fetchAndUpdateInformation()
          this.authToken = u.authToken
          setAuthTokenHeader(u.authToken)
        }
      })
    },
    handleErrorMessage(errorMsg) {
      this.errorMsg = errorMsg
    },
    setLoading(value) {
      this.loading = value
    },
    showModal(msg) {
      this.$refs.error_dialog.open({
        width: '350px',
        positiveButtonLabel: 'Cancel',
        negativeButtonLabel: false,
        neutralButtonLabel: 'Ok'
      })
      this.modalErrorMsg = msg
    }
  }
}
</script>
