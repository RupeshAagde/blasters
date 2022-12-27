<template>
  <div class="body-wrapper">
    <report-history-card v-for="(card, index) in cards" :key="index" :card="card" :index="index"></report-history-card>
  </div>

</template>

<script>
import ReportHistoryCard from "./report-history-card";

export default {
  name: "report-history-body",
  components: {ReportHistoryCard},
  props: {
    cards: {
      type: Array, default() {
        return []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.body-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

</style>