<template>
  <div class="panel">
    <div class="header-position">
      <page-header
        :title="`Application`"
        :contextMenuItems="contextMenuItems"
        @delete="$showConfirmDeleteDialog"
        @backClick="goBack"
      >
        <div class="button-box" v-if="!editMode">
          <nitrozen-button
            class="pad-left"
            :theme="'secondary'"
            v-flatBtn
            @click="save"
          >
            {{ editMode ? 'Save' : 'Create' }}
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
          <div class="input">
            <nitrozen-input
              :required="true"
              label="Name"
              :disabled="editMode"
              v-model="name.value"
            ></nitrozen-input>
            <nitrozen-error v-if="name.showerror">
              {{ name.errortext }}
            </nitrozen-error>
          </div>
          <div class="input">
            <nitrozen-input
              type="textarea"
              :max="150"
              label="Description"
              :disabled="editMode"
              v-model="desc.value"
            ></nitrozen-input>
            <nitrozen-error v-if="desc.showerror">
              {{ desc.errortext }}
            </nitrozen-error>
          </div>
        </div>
      </div>
      <div class="form-container" v-if="editMode && application">
        <div class="details">
          <div class="bold-xs cl-Mako">Domain</div>
          <a class="url" :href="primaryDomain" target="_blank">
            {{ primaryDomain }}</a
          >
          <inline-svg
            class="copy-icon"
            src="copy"
            @click.native="copyToClipboard(primaryDomain)"
          ></inline-svg>
        </div>
        <div class="details">
          <div class="bold-xs cl-Mako">Secret</div>
          {{ application.secret }}
          <inline-svg
            class="copy-icon"
            src="copy"
            @click.native="copyToClipboard(application.secret)"
          ></inline-svg>
        </div>
        <div class="details">
          <div class="bold-xs cl-Mako">Token</div>
          {{ application.token }}
          <inline-svg
            class="copy-icon"
            src="copy"
            @click.native="copyToClipboard(application.token)"
          ></inline-svg>
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
        Are you sure you want to delete application
        <span class="delete-name">({{ name.value }})</span>
        ?
      </template>
    </nitrozen-dialog>
  </div>
</template>

<style lang="less" scoped>
.header-position {
  height: 58.5px;
}
.delete-name {
  color: @DustyGray2;
  font-style: italic;
}
.button-box {
  display: flex;
  align-items: center;
  .menu {
    margin-left: 24px;
  }
}

.page-container {
  background-color: transparent;
  padding: 0;
  justify-content: space-evenly;

  .form-container {
    width: 320px;
    padding: 24px;
    border: 1px solid @WhiteSmoke;
    border-radius: 8px;
    background-color: #ffffff;
    height: fit-content;
    .details {
      font-size: 12px;
      color: @Mako;
      div {
        padding: 12px 0;
      }
      .url {
        color: @RoyalBlue;
        &:hover {
          text-decoration: underline;
        }
      }
      .copy-icon {
        cursor: pointer;
        display: inline-block;
        ::v-deep svg {
          width: 14px;
          height: 14px;
        }
      }
    }
    .input {
      padding: 12px 0;
    }
  }
}
</style>

<script>
import { mapGetters } from 'vuex'
import * as _ from 'lodash'
import {
  NitrozenButton,
  NitrozenDialog,
  NitrozenInput,
  NitrozenError,
  flatBtn
} from '@gofynd/nitrozen-vue'
import { GET_ORGANIZATION_DETAILS } from '@/store/getters.type'
import {} from '@/store/action.type'

import pageHeaderVue from '@/components/common/layout/page-header.vue'
import { copyToClipboard } from '@/helper/utils'
import loader from '@/components/common/loader.vue'
import pageError from '@/components/common/page-error.vue'
import AppService from '@/services/app.service'
import inlinesvg from '@/components/common/inline-svg.vue'
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin'

export default {
  name: 'application-form',
  mixins: [dirtyCheckMixin],
  components: {
    'page-header': pageHeaderVue,
    'nitrozen-button': NitrozenButton,
    'nitrozen-dialog': NitrozenDialog,
    'nitrozen-input': NitrozenInput,
    'nitrozen-error': NitrozenError,
    'inline-svg': inlinesvg,
    'page-error': pageError,
    loader
  },
  directives: {
    flatBtn
  },
  data() {
    return {
      name: this.getInitialValue(''),
      desc: this.getInitialValue(''),
      application: null,
      editMode: this.$route.meta.action == 'edit',
      contextMenuItems: [],
      pageLoading: false,
      pageError: false,
      currentUser: {},
      pristineData: null
    }
  },
  computed: {
    ...mapGetters({
      organization: GET_ORGANIZATION_DETAILS
    }),
    primaryDomain() {
      return `https://${
        _.find(this.application.domains, { is_primary: true }).name
      }`
    }
  },
  mounted() {
    if (this.editMode) {
      this.contextMenuItems = [
        {
          text: 'Delete',
          action: 'delete'
        }
      ]
      this.getApplication()
    }
    this.pristineData = this.getFormData()
  },
  watch: {},
  methods: {
    isFormDirty() {
      return !_.isEqual(this.pristineData, this.getFormData())
    },
    getInitialValue(value = '') {
      return {
        showerror: false,
        value,
        errortext: ''
      }
    },
    checkEmpty(key) {
      const emptyErorrs = {
        name: 'Name is required'
      }
      if (this[key].value.trim() === '') {
        this[key].showerror = true
        this[key].errortext = emptyErorrs[key] || 'Enter ' + key
        return false
      }
      this[key].showerror = false
      return true
    },
    validateForm() {
      let valid = true
      valid = valid && this.checkEmpty('name')
      return valid
    },
    getFormData() {
      return {
        name: this.name.value,
        description: this.desc.value
      }
    },
    getApplication() {
      AppService.getApplication(this.organization._id, this.$route.params.appId)
        .then(({ data }) => {
          this.name.value = data.name
          this.name.description = data.desc
          this.application = data
          this.pristineData = this.getFormData()
          this.pageError = false
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    deleteApplication() {
      AppService.deleteApplication(
        this.organization._id,
        this.$route.params.appId
      )
        .then(({ data }) => {
          this.pristineData = this.getFormData()
          this.$snackbar.global.showSuccess('Application deleted')
          this.$router.push({ name: 'application-list' })
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    save() {
      if (!this.validateForm()) return
      const data = this.getFormData()
      console.log(data)
      this.pageLoading = true
      AppService.createApplication(this.organization._id, data)
        .then((data) => {
          console.log(data)
          this.pristineData = this.getFormData()
          this.$snackbar.global.showSuccess('Application created')
          this.$router.push({ name: 'application-list' })
        })
        .catch((err) => {
          this.$snackbar.global.showError('Failed to create application')
          console.error(err)
        })
    },
    goBack() {
      this.$router.push({ name: 'application-list' })
    },
    copyToClipboard(text) {
      copyToClipboard(text)
      this.$snackbar.global.showInfo('Copied to clipboard', 1000)
    },
    $showConfirmDeleteDialog() {
      this.$refs['confirm_dialog'].open({
        width: '350px',
        positiveButtonLabel: 'Cancel',
        negativeButtonLabel: 'Delete',
        neutralButtonLabel: false
      })
    },
    $closeConfirmDeleteDialog(data) {
      if (data == 'Delete') {
        this.deleteApplication()
      }
    }
  }
}
</script>
