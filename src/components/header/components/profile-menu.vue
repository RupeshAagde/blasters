<template>
  <div class="profile-menu" v-show="userData">
    <div class="profile-image">
      <img :src="profilePicUrl" @error="$imageError" alt="" />
    </div>
    <div class="regular-xs cl-DustyGray2">
      <span v-if="userData.user">{{ fullName }}</span>
      <span v-else> </span>
    </div>
  </div>
</template>

<script>
import { NitrozenButton, NitrozenInput, strokeBtn } from '@gofynd/nitrozen-vue'
import root from 'window-or-global'
import { mapGetters } from 'vuex'
import { GET_USER_INFO } from '@/store/getters.type'
import inlineSvgVue from '../../common/inline-svg.vue'

export default {
  name: 'profile-menu',
  components: {
    'nitrozen-input': NitrozenInput,
    'inline-svg': inlineSvgVue
  },
  directives: {
    strokeBtn
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
      if (this.userData.user && this.userData.user.firstName) {
        return `${this.userData.user.firstName} ${this.userData.user.lastName}`
      }
      return 'Team Member'
    },
    ...mapGetters({
      userData: GET_USER_INFO
    })
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    $imageError(event) {
      let image = '/public/assets/pngs/user.png'
      this.$set(this.userData.user, 'profilePicUrl', image)
    }
  }
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
</style>
