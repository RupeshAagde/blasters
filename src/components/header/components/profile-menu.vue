<template>
  <div v-click-outside="closeProfileDropdown">
    <div
      v-if="userData"
      class="profile content-item"
      @click="profileDropdownOpen = !profileDropdownOpen"
    >
      <div class="user-info">
        <div class="user-name" :title="fullName">
          {{ fullName }}
        </div>
        <div class="super-user" v-if="false">
          <nitrozen-badge state="info" :fill="true">
            Super Admin
          </nitrozen-badge>
        </div>
      </div>
      <div
        :class="{ 'profile-open': profileDropdownOpen }"
        class="regular-xs cl-DustyGray2 content-item"
      >
          <ukt-inline-svg
            v-if="userData && userData.user"
            class="profile-arrow"
            src="arrow-dropdown-black"
          ></ukt-inline-svg>
        <template v-else>
          <ukt-inline-svg class="spinner" src="button-spinner"></ukt-inline-svg>
        </template>
      </div>
    </div>
    <transition name="menu-list" mode="out-in">
      <div
        class="profile-dropdown-options"
        v-if="userData && userData.user && profileDropdownOpen"
      >
        <div
          v-if="$route.params.company_id"
          class="username mobile-company-name"
          :title="profileDetails.name"
        >
          {{ profileDetails.name }}
        </div>
        <div class="username" :title="`@${userData.user.username}`">
          @{{ userData.user.username }}
        </div>
        <div @click="navigateToUserProfile()" class="profile-dropdown-option">
          <span class="new-org">
            My Profile
          </span>
        </div>
        <div @click="naviagteToAuditTrail" class="profile-dropdown-option">
          <span class="new-org">
            Audit Trail
          </span>
        </div>
        <div class="profile-dropdown-option" @click="signOut()">Logout</div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  NitrozenButton,
  NitrozenInput,
  strokeBtn,
  NitrozenMenu,
  NitrozenMenuItem,
  NitrozenBadge,
} from '@gofynd/nitrozen-vue'
import root from 'window-or-global'
const env = root.env || {};

import { mapGetters } from 'vuex'
import { GET_USER_INFO, GET_ORGANIZATION_LIST } from '@/store/getters.type'
import { SIGNOUT_USER } from '@/store/action.type'
import { IS_LOGGED_IN } from '@/store/getters.type'
import inlineSvgVue from '../../common/inline-svg.vue'
import uktinlinesvg from '../../common/ukt-inline-svg.vue'
import adminlinesvg from '@/components/common/adm-inline-svg.vue'

export default {
  name: 'profile-menu',
  components: {
    'nitrozen-input': NitrozenInput,
    'inline-svg': inlineSvgVue,
    'ukt-inline-svg': uktinlinesvg,
    'adm-inline-svg': adminlinesvg,
    'nitrozen-badge': NitrozenBadge,
  },
  directives: {
    strokeBtn,
  },
  computed: {
    profilePicUrl() {
      if (
        this.userData &&
        this.userData.user &&
        this.userData.user.profilePicUrl
      ) {
        return this.userData.user.profilePicUrl
      }
      return '/public/admin/assets/pngs/user.png'
    },
    fullName() {
      if (this.userData.user && this.userData.user.first_name) {
        return `${this.userData.user.first_name} ${this.userData.user.last_name}`
      }
      return 'Team Member'
    },
    ...mapGetters({
      userData: GET_USER_INFO,
      isLoggedIn: IS_LOGGED_IN,
    }),
  },
  data() {
    return {
      profileDropdownOpen: false,
      partnerId: '',
    }
  },
  mounted() {
    this.partnerId = this.$route.params.partnerId
  },
  methods: {
    $imageError(event) {
      let image = '/public/assets/pngs/user.png'
      this.$set(this.userData.user, 'profilePicUrl', image)
    },
    closeProfileDropdown() {
      this.profileDropdownOpen = false
    },
    navigateToUserProfile() {
      window.open(`https://platform.${env.FYND_PLATFORM_DOMAIN}/user-profile`,'_blank')
    },
    naviagteToAuditTrail(){
      this.$router.push('/administrator/audit-trail')
    },
    changeOrganization(slug) {
      this.$router.go(`partner/${slug}/home`)
    },
    signOut() {
      if (this.isLoggedIn) {
        this.$store.dispatch(SIGNOUT_USER)
        return this.$router.push('/')
      }
    },
  },
}
</script>

<style lang="less">
.profile-menu {
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  width: fit-content;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
  margin-right: 24px;
  .profile-image {
    margin-right: 12px;
    img {
      height: 24px;
    }
  }
}
.profile-dropdown-options {
  width: 200px;
  color: @Mako;
  position: absolute;
  top: 64px;
  right: 10px;
  background: @White;
  border: 1px solid @Gray;
  border-radius: 3px;
  padding: 12px 0px;
  box-shadow: 0 4px 16px 0 #e5e5e5;
  font-size: 12px;
  line-height: 16px;
  @media @mobile {
    right: initial;
    // width: 150px;
  }
  .name-option {
    padding: 0 12px;
    .name {
      color: @RoyalBlue;
      font-weight: bold;
      cursor: pointer;
    }
  }
  .username {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 16px;
    font-style: oblique;
    padding: 10px 12px;
    cursor: default;
  }
  .mobile-company-name {
    display: none;
    @media @mobile {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }
  }
  .profile-dropdown-option {
    padding: 10px 12px;
    color: @Mako;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .icon {
      margin-right: 12px;
      width: 24px;
      height: 24px;
    }
    &:hover {
      background-color: @WhiteSmoke;
    }
  }
}
.profile {
  height: 40px;
  // border: 1px solid @Gray;
  border-left: 1px solid @Gray;
  // border-radius: 3px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media @mobile {
    width: 100%;
  }
  .user-info {
    margin: 0px 10px 0 16px;
    // @media @mobile {
    //         margin: 0px 5px 0 8px;
    // }
    .user-name {
      color: @Mako;
      font-size: 12px;
      width: 80px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .super-user {
      margin-top: 6px;
      .nitrozen-badge.nitrozen-badge-info-fill {
        cursor: pointer;
      }
    }
  }
  .profile-arrow {
    background-color: @Alabaster2;
    border-radius: 3px;
  }
  img {
    width: 24px;
    height: 24px;
    margin-left: 10px;
    border-radius: 50%;
  }
  // .super-user {
  //     margin-left: 8px;
  // }

  // .company-name {
  //     font-size: 12px;
  //     white-space: nowrap;
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     width: 60px;
  //     margin-left: 8px;
  // }
}
.user {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 25px;
  background-color: rgb(45, 47, 56);
  padding: 5px 0px;
  border-radius: @BorderRadius;
  .profile {
    img {
      width: 24px;
      height: 24px;
    }
  }
}

.content-item {
  display: flex;
  align-items: center;
  // margin: 0px 16px 0 10px;
  margin: 0 10px;
  height: 40px;
}
.profile-open {
  transform: rotate(180deg);
}
.slide-leave-active,
.slide-enter-active {
  transition: all 0.3s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
