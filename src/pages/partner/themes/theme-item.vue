<template>
  <div>
    <div class="theme-item" @click="openThemeDialog">
      <div class="box" v-if="!getImage()"></div>
      <div class="theme-item__image shimmer" ref="themeItemImage" v-else>
        <img :src="getImage()" @load="removeShimmer" />
      </div>
      <div class="theme-item__details">
        <div class="theme-item__details--name">{{ theme.name }}</div>
        <div class="theme-item__details--price">
          <p v-if="theme.price">{{ theme.price }}</p>
          <p v-else class="free">FREE</p>
        </div>
      </div>
      <div class="theme-item__ribbon" v-if="theme.price">
        <img
          src="/public/admin/assets/admin/pngs/theme-ribbon.png"
          alt="ribbon"
        />
        <p>Premium</p>
      </div>
    </div>
    <nitrozen-dialog ref="themeDialog" :title="theme.name">
      <template slot="body">
        <div class="theme-dialog">
          <div class="theme-dialog__image">
            <img :src="getImage()" alt v-if="this.theme && this.theme.images" />
            <div class="theme-dialog__image--box" v-else></div>
          </div>
          <div class="theme-dialog__content">
            <div class="theme-dialog__content--about">
              <h3 class="content-title">About Theme</h3>
              <p class="content-subtitle" v-if="theme.description">
                {{ theme.description }}
              </p>
              <p class="content-subtitle" v-else>
                No description found
              </p>
            </div>
            <div class="theme-dialog__content--features">
              <h3 class="content-title">Features</h3>
              <p
                class="content-subtitle"
                v-for="(feature, index) in theme.features"
                :key="index"
              >
                <span v-if="theme.features">{{ feature }}</span>
                <span v-else>No features found</span>
              </p>
              <p class="content-subtitle">Theme ID : {{ theme._id }}</p>
            </div>
          </div>
        </div>
      </template>
      <template class="dialog__footer" slot="footer"> </template>
    </nitrozen-dialog>
    <loader class="loading" v-if="inProgress"></loader>
  </div>
</template>
<script>
import {
  NitrozenDialog,
  NitrozenButton,
  flatBtn,
  strokeBtn
} from '@gofynd/nitrozen-vue'
import loader from '@/components/common/loader'

import ThemeService from '@/services/themes.service'
const toasterConfig = {
  theme: 'toasted-primary',
  position: 'top-center',
  duration: 2000
}
export default {
  name: 'theme-item',
  components: {
    'nitrozen-dialog': NitrozenDialog,
    'nitrozen-button': NitrozenButton,
    loader
  },
  props: {
    theme: {},
    isLoading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      inProgress: false
    }
  },
  directives: {
    flatBtn,
    strokeBtn
  },
  methods: {
    getImage() {
      if (
        this.theme &&
        this.theme.images &&
        this.theme.images.desktop &&
        this.theme.images.desktop[0]
      ) {
        return this.theme.images.desktop[0].replace(
          '/upload/',
          '/upload/q_auto,f_auto/'
        )
      } else {
        return '/public/admin/assets/admin/pngs/theme_default_image.jpg'
        // this.$refs.themeItemImage.classList.remove('shimmer');
        // this.$refs.themeItemImage.classList.styles.backgroundColor =
        //     '#d8d8d8';
      }
    },
    removeShimmer() {
      if (this.$refs && this.$refs.themeItemImage) {
        this.$refs.themeItemImage.classList.remove('shimmer')
      }
    },
    openThemeDialog: function() {
      this.$refs['themeDialog'].open({
        width: '800px',
        showCloseButton: true,
        dismissible: true
      })
    },
    closeDialog: function() {
      this.$refs['themeDialog'].close()
    }
  }
}
</script>

<style lang="less" scoped>
@import './theme-variables.less';
.theme-item {
  position: relative;
  padding: 10px;
  cursor: pointer;
  &__image {
    width: 100%;
    img {
      width: 100%;
      height: 260px;
      .round-border();
      border-color: #d8d8d891;
    }
  }
  &__details {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    &--price {
      color: @color-light-gray-2;
    }
  }
  &__ribbon {
    position: absolute;
    top: 2px;
    right: 0;
    width: 85px;
    img {
      width: 100%;
    }
    p {
      position: absolute;
      transform: rotate(45deg);
      top: 25px;
      font-size: 10px;
      font-weight: bolder;
      color: white;
      right: 12px;
    }
  }
  .box {
    display: block;
    width: 100%;
    height: 200px;
    background-color: @color-light-gray;
  }
}
.theme-dialog {
  display: flex;
  justify-content: space-between;
  &__image {
    width: 50%;
    img {
      width: 100%;
    }
    &--box {
      width: 375px;
      height: 220px;
      background-color: @color-light-gray;
    }
  }
  &__content {
    width: 50%;
    padding: 0 40px;
    box-sizing: border-box;
    .content-title {
      font-size: 20px;
      line-height: 40px;
      font-weight: 600;
    }

    .content-subtitle {
      line-height: 30px;
    }
  }
}
.buttons {
  &__select {
    margin-right: 15px;
  }
}
.free {
  color: @color-green;
}
</style>
