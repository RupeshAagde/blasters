<template>
  <div class="errorPage">
    <img src="/public/admin/assets/admin/pngs/empty_state.png" />
    <div>{{ title }}</div>
  </div>
</template>

<style lang="less" scoped>
.errorPage {
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: @Mako;
  padding: 8%;
}
</style>

<script>
import uktinlinesvg from './ukt-inline-svg.vue';

export default {
  name: 'ukt-not-found',
  components: {
    'ukt-inline-svg': uktinlinesvg
  },
  props: {
    title: {
      type: String
    }
  }
};
</script>
