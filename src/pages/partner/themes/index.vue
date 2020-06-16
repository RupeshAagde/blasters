<template>
  <div class="main-container">
    <div class="page-container">
      <section class="page-container__top">
        <theme-header></theme-header>
      </section>
      <section class="page-container__bottom">
        <theme-listing></theme-listing>
      </section>
      <section class="page-container__footer">
        <theme-footer></theme-footer>
      </section>
    </div>
  </div>
</template>

<script>
import { NitrozenDropdown } from '@gofynd/nitrozen-vue'
import themefooter from './theme-footer.vue'
import themeheader from './theme-header.vue'
import themelisting from './theme-listing.vue'
export default {
  components: {
    'nitrozen-dropdown': NitrozenDropdown,
    'theme-header': themeheader,
    'theme-footer': themefooter,
    'theme-listing': themelisting
  },
  data() {
    return {
      themename: 'Current Theme',
      siteAction: [
        {
          text: 'First Option',
          value: 'first'
        },
        {
          text: 'Second Option',
          value: 'second'
        }
      ],
      selectedSiteAction: ''
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
@import './theme-variables.less';
.page-container {
  padding: 0;
  width: auto;
  background-color: transparent;
  &__bottom,
  &__top {
    margin-bottom: 24px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 24px;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
    color: @text-color;
    font-size: @fs-rg;
  }
  .page-container__footer {
    width: 100%;
  }
}
.nitrozen {
  &__dropdown {
    width: 150px;
  }
}
</style>
