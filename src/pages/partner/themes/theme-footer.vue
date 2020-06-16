<template>
  <div class="theme-footer">
    <div class="theme-footer__left">
      <div class="theme-footer__left--icon">
        <inline-svg src="build"></inline-svg>
      </div>
      <div class="theme-footer__left--text">
        <h3>Build Your Own theme</h3>
        <p>
          Explore themes which suits your business and defines your business
          identity
        </p>
      </div>
    </div>
    <div class="theme-footer__right">
      <nitrozen-button theme="secondary" v-strokeBtn>Know More</nitrozen-button>
    </div>
  </div>
</template>

<script>
import { NitrozenButton, strokeBtn } from '@gofynd/nitrozen-vue'
import inlinesvg from '@/components/common/inline-svg.vue'
export default {
  components: {
    'nitrozen-button': NitrozenButton,
    'inline-svg': inlinesvg
  },
  directives: {
    strokeBtn
  }
}
</script>

<style lang="less" scoped>
@import './theme-variables.less';
.theme-footer {
  display: flex;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  &__left {
    display: flex;
    align-items: center;
    &--text {
      line-height: 25px;
      font-size: @fs-rg;
      margin-left: 15px;
      h3 {
        font-size: @fs-md;
        font-weight: 600;
      }
    }
  }
}
</style>
