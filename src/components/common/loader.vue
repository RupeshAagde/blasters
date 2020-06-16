<template>
  <div class="loader" :class="{ loading: fullScreen }">
    <img src="/public/assets/loader.gif" />
  </div>
</template>
<script>
export default {
  name: 'loader',
  props: {
    fullScreen: { type: Boolean, default: true }
  },
  components: {}
}
</script>

<style lang="less" scoped>
.loader {
  .flex-center();
  padding: 15px 0px;
  margin: auto;

  img {
    height: 100px;
  }
  span {
    .flex-center();
  }
}

.loading {
  position: fixed;
  height: calc(100% - 64px);
  width: calc(100% - 250px);
  left: 250px;
  top: 64px;
  z-index: @loader;
  background: hsla(0, 0%, 83%, 0.3);

  span {
    top: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
