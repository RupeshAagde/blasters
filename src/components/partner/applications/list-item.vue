<template>
  <div
    class="bombshell-list-card-container"
    @click="
      $router.push({ name: 'application-edit', params: { appId: data._id } })
    "
  >
    <div class="card-avatar logo">
      <img :src="data.logo.secure_url" />
    </div>
    <div class="card-content-section">
      <div class="card-content-line-1">{{ data.name }}</div>
      <div class="card-content-line-2">
        <a class="url" :href="primaryDomain" target="_blank" @click.stop="">
          {{ primaryDomain }}
        </a>
        <inline-svg
          class="copy-icon"
          src="copy"
          @click.stop.native="copyToClipboard(primaryDomain)"
        ></inline-svg>
      </div>
      <div class="card-content-line-3">created at {{ createdAt }}</div>
    </div>
    <div class="card-badge-section">
      <nitrozen-badge v-if="data.is_active" state="success">
        active
      </nitrozen-badge>
      <nitrozen-badge v-else>inactive</nitrozen-badge>
      <nitrozen-badge v-if="data.internal">internal</nitrozen-badge>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { NitrozenBadge } from '@gofynd/nitrozen-vue'
import inlinesvg from '@/components/common/inline-svg.vue'
import { copyToClipboard } from '@/helper/utils'
export default {
  name: 'application-list-item',
  props: {
    data: {
      type: Object
    }
  },
  components: {
    'nitrozen-badge': NitrozenBadge,
    'inline-svg': inlinesvg
  },
  computed: {
    primaryDomain() {
      return `https://${_.find(this.data.domains, { is_primary: true }).name}`
    },
    createdAt() {
      return moment(this.data.createdAt).format('Do MMMM YYYY, h:mm a')
    }
  },
  methods: {
    copyToClipboard(text) {
      copyToClipboard(text)
      this.$snackbar.global.showInfo('Copied to clipboard', 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.bombshell-list-card-container {
  .card-avatar.logo {
    img {
      width: 60px;
    }
  }
  .card-content-section {
    .card-content-line-2 {
      .url {
        color: @RoyalBlue;
        &:hover {
          text-decoration: underline;
        }
      }
      .copy-icon {
        display: inline-block;
        ::v-deep svg {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
}
</style>
