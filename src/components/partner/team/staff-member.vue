<template>
  <div class="bombshell-list-card-container" @click="redirectEdit(staff)">
    <div class="card-avatar">
      <img
        :src="getStaffProfile(staff)"
        @error="getErrorImage(staff)"
        alt="profile"
      />
    </div>
    <div class="card-content-section">
      <!-- 1st line -->
      <div class="full-name card-content-line-1">
        {{ fullName(staff) }}
      </div>
      <!-- 2nd line -->
      <div class="card-content-line-2">
        <div>{{ staff.title || 'Staff' }}</div>
        <div class="separator" v-if="staff.employee_code">|</div>
      </div>
      <!-- 3rd line -->
      <div class="card-content-line-3">
        <span
          v-if="reduce(staff.phone_numbers).phone"
          title="Click to copy"
          @click.stop="copy(reduce(staff.phone_numbers).phone)"
        >
          {{ fullPhNo(reduce(staff.phone_numbers)) }}
        </span>
        <inline-svg
          v-if="reduce(staff.phone_numbers).verified || false"
          class="verified-icon left-space-s"
          :src="'check-circle'"
          title="Verified"
        ></inline-svg>
        <span
          class="left-space-md"
          v-if="reduce(staff.emails).email"
          title="Click to copy"
          @click.stop="copy(reduce(staff.emails).email)"
        >
          {{ reduce(staff.emails).email }}
        </span>
        <inline-svg
          v-if="reduce(staff.emails).verified || false"
          class="verified-icon left-space-s"
          :src="'check-circle'"
          title="Verified"
        ></inline-svg>
      </div>
    </div>
    <div class="card-badge-section">
      <nitrozen-badge
        class="tag tooltip"
        state="info"
        v-if="staff.roles.length > 0"
      >
        {{ staff.roles[0].toUpperCase() }}
        <span class="tooltiptext nitrozen-tooltip-bottom">
          <div class="cl-Mako bold-xs">Access</div>
          <div
            class="cl-Mako regular-xxxs"
            v-for="(access, index) in staff.permissions"
            :key="index"
          >
            &bull;&nbsp;{{ titleCase(access) }}
          </div>
        </span>
      </nitrozen-badge>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bombshell-list-card-container {
  overflow: visible;
  .verified-icon {
    display: inline;
    ::v-deep svg {
      cursor: pointer;
      width: 12px;
      height: 12px;
    }
  }
  .left-space-s {
    margin-left: 4px;
  }
  .left-space-md {
    margin-left: 12px;
  }
  .separator {
    width: 12px;
    text-align: center;
  }
  .tag {
    margin-left: 8px;
  }
  .tooltip {
    text-transform: none;
    position: relative;
    &:hover {
      .tooltiptext {
        visibility: visible;
      }
    }
    .nitrozen-tooltip-bottom {
      top: 120%;
      left: -5em;
      margin-left: -20px;
      &::after {
        bottom: 100%;
        left: 80%;
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
      }
    }
    .tooltiptext {
      visibility: hidden;
      color: black;
      border-radius: 6px;
      padding: 15px;
      border: 1px solid #e4e5e6;
      position: absolute;
      z-index: 1;
      max-width: 100px;
      min-width: 100px;
      line-height: 1.7;
      background-color: #ebedfb;
      &::after {
        content: ' ';
        position: absolute;
        border-style: solid;
        border-color: #ebedfb transparent transparent transparent;
        border-width: 5px;
      }
    }
  }
  .card-avatar {
    display: flex;
    align-items: center;
    img {
      min-height: 60px;
      max-height: 60px;
      min-width: 60px;
      max-width: 60px;
      border-radius: 50%;
    }
  }
  .full-name {
    color: @RoyalBlue;
  }
}
</style>

<script>
import {
  NitrozenButton,
  flatBtn,
  NitrozenInput,
  NitrozenPagination,
  NitrozenBadge,
  NitrozenDropdown
} from '@gofynd/nitrozen-vue'
import _ from 'lodash'
import { fullName, reduce, fullPhNo } from './helper'
import { copyToClipboard, titleCase } from '@/helper/utils.js'
import inlineSvgVue from '../../common/inline-svg.vue'

export default {
  components: {
    'nitrozen-button': NitrozenButton,
    'nitrozen-input': NitrozenInput,
    'nitrozen-pagination': NitrozenPagination,
    'nitrozen-badge': NitrozenBadge,
    'nitrozen-dropdown': NitrozenDropdown,
    'inline-svg': inlineSvgVue
  },
  props: {
    staff: {}
  },
  methods: {
    fullName,
    reduce,
    fullPhNo,
    titleCase,
    redirectEdit(staff) {
      const { partnerId } = this.$route.params
      this.$router.push('/partner/' + partnerId + '/team/edit/' + staff._id)
    },
    getStaffProfile(staff) {
      //@@TODO change owner/admin pic when available
      let profilePic =
        staff.title == 'Owner'
          ? '/public/assets/pngs/default-profile.png'
          : '/public/assets/pngs/profile-pic-default.png'

      return staff.profile_pic || profilePic
    },
    getErrorImage(staff) {
      staff.title == 'Owner'
        ? (event.target.src = '/public/assets/pngs/default-profile.png')
        : (event.target.src = '/public/assets/pngs/profile-pic-default.png')
    },

    copy(text) {
      copyToClipboard(text)
      this.$snackbar.global.showInfo('Copied to clipboard', 1000)
    }
  }
}
</script>
