<template>
  <div class="image-wrapper" v-if="src">
    <img
      class="no-wrap"
      :src="src"
      alt="loading..." />
  </div>
</template>

<script>
export default {
  name: "image-container",
  props: {
    src: { type: String, default: null }
  },
};
</script>

<style scoped lang="less">
.image-wrapper {
  overflow: hidden;
  transition: 400ms transform ease-in;
  //max-width: 4vw;
  padding-block: 0.5rem;
  @media @mobile {
    //max-width: 10vw;
  }
}

.image-wrapper > img:hover {
  transform: scale(1.125);
}

.image-wrapper > img {
  display: block;
  aspect-ratio: 1;
  object-fit: contain;
  width: 100%;
  height: 100%;
}


</style>
