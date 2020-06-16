<template>
  <div class="header">
    <div class="header__content">
      <h2 class="header__content--title">Themes</h2>
      <p class="header__content--details">
        Build unlimited themes and sell on Fynd Platform. Follow our User Guide
        on
        <nitrozen-button class="nitrozen__btn" :theme="'secondary'">
          Fynd Academy
        </nitrozen-button>
      </p>
    </div>
    <!-- <div class="header__image"></div> -->
  </div>
</template>

<script>
import { NitrozenButton } from '@gofynd/nitrozen-vue'

export default {
  components: {
    'nitrozen-button': NitrozenButton
  },
  name: 'theme-header'
}
</script>

<style lang="less" scoped>
@import './theme-variables.less';

.header {
  display: flex;
  flex-direction: row;
  padding: 24px;
  justify-content: space-between;
  align-items: center;
  .round-border();
  &__content {
    color: @text-color;
    // width: 66%;
    &--title {
      font-size: @fs-lg;
      font-weight: bold;
      margin-bottom: 12px;
    }
    &--details {
      line-height: 26px;
      font-size: @fs-rg;
    }
  }
  &__image {
    width: 400px;
    height: 130px;
    background-color: @color-light-gray;
  }
}
.nitrozen {
  &__btn {
    letter-spacing: 0;
    font-size: @fs-rg;
  }
}
</style>
