<template>
  <div class="wrapper">
    <date-range-filter :page-name="pageName"></date-range-filter>
    <right-panel-components :page-name="pageName"></right-panel-components>
  </div>
</template>

<script>
import DateRangeFilter from "./components/date-range-filter";
import RightPanelComponents from "./components/right-panel-components";
import {filterMixin} from "./mixins/filter.mixin";

export default {
  name: "analytics-generic-filters",
  mixins: [filterMixin],
  components: {RightPanelComponents, 'date-range-filter': DateRangeFilter},
  computed: {}
}
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #ffffff;
  padding: 12px;
  flex-wrap: wrap;
  gap: 1rem;

}
@media only screen and (max-width: 480px) {
  .wrapper {
    flex-direction: column;
    align-items: flex-start;
    width:100vw;
  }
}
</style>