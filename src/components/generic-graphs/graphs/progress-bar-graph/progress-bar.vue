<template>
  <div class="outer-wrapper">
    <div :style="{ width: percentageWidth, opacity: opacity }"></div>
  </div>
</template>

<script>
export default {
  name: "custom-progress-bar",
  data: () => ({ percentageWidth: "0%" }),
  props: {
    percentage: { type: Number, required: true },
    opacity: { type: Number, required: true }
  },
  mounted() {
    setTimeout(() => (this.percentageWidth = `${this.percentage}%`), 100);
  }
};
</script>

<style scoped>
.outer-wrapper {
  width: 100%;
  height: 0.5em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.outer-wrapper > div {
  height: 100%;
  background: #2e31be;
  border-radius: 20px;
  width: 0;
  transition: width 1s ease-in-out;
}
</style>
