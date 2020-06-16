<template>
  <div>
    <div v-for="shimmerIndex in count" :key="shimmerIndex">
      <div class="bombshell-list-card-container shimmer">
        <div class="shimmer card-avatar"></div>
        <div class="card-content-section">
          <div class="shimmer card-content-line-1 text-box1 width1"></div>
          <div class="shimmer card-content-line-2 text-box2 width2"></div>
          <div class="shimmer card-content-line-3 text-box2 width3"></div>
        </div>
      </div>
    </div>
    <div class="pagination" v-if="paginationShimmer">
      <div class="shimmer count"></div>
      <div class="shimmer pagesize"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list-shimmer',
  props: {
    shimmer: '',
    count: {
      type: Number,
      default: 1
    },
    paginationShimmer: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="less" scoped>
.shimmer-box {
  display: block;
  width: 100%;
  height: 120px;
  margin: 16px 0px;
  border-radius: @BorderRadius;
}
.pagination {
  display: flex;
  justify-content: space-between;
  height: 40px;
  border-radius: @BorderRadius;
  margin-top: 24px;
  .count {
    width: 200px;
  }
  .pagesize {
    width: 350px;
  }
}
.mirage-list-card-container {
  &:hover {
    box-shadow: none;
    cursor: unset;
  }
}
.text-box1 {
  height: 14px;
  border-radius: 8px;
  margin-bottom: 16px;
}
.text-box2 {
  height: 10px;
  border-radius: 8px;
  margin-bottom: 13px;
}
.card-content-section {
  div:nth-last-child(1) {
    margin-bottom: unset !important;
  }
}
.width1 {
  width: 80%;
}
.width2 {
  width: 40%;
}
.width3 {
  width: 40%;
}
</style>
