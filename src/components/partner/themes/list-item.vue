<template>
  <div
    class="bombshell-list-card-container"
    @click="
      () => {
        return
        $router.push({ name: 'application-edit', params: { appId: data._id } })
      }
    "
  >
    <div class="card-avatar">
      <text-avatar :text="data.information.name"></text-avatar>
    </div>
    <div class="card-content-section">
      <div class="card-content-line-1">{{ data.information.name }}</div>
      <div class="card-content-line-2">
        <!-- <a class="url" :href="primaryDomain" target="_blank" @click.stop="">
          {{ primaryDomain }}
        </a>
        <inline-svg
          class="copy-icon"
          src="copy"
          @click.stop.native="copyToClipboard(primaryDomain)"
        ></inline-svg> -->
      </div>
      <div class="card-content-line-3">updated at {{ updatedAt }}</div>
    </div>
    <div class="card-badge-section">
      <nitrozen-badge state="success">
        active
      </nitrozen-badge>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { NitrozenBadge } from '@gofynd/nitrozen-vue'
import textAvatar from '@/components/common/text-avatar.vue'
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
    'text-avatar': textAvatar,
    'inline-svg': inlinesvg
  },
  computed: {
    primaryDomain() {
      return `https://${_.find(this.data.domains, { is_primary: true }).name}`
    },
    updatedAt() {
      return moment(this.data.updatedAt).format('Do MMMM YYYY, h:mm a')
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
