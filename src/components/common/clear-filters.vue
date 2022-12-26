<template>
  <div class="wrapper" @click="$emit('clear-all')">
    <h5>Clear Filters</h5>
  </div>
</template>

<script>
export default {
  name: "clear-filters"
}
</script>

<style scoped lang="less">
.wrapper {
  display: grid;
  place-items: center;
  height: 2rem;

  h5 {
    cursor: pointer;
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    color: #2e31be;
  }
}
</style>