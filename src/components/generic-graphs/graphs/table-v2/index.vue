<template>
    <div class="table">
        <tableComponent :columns="columns" :rows="rows" :chart-id="chartId"
        :hyperlocal-page="hyperlocalPage"
            :showPagination="showPagination" :analytic-page="analyticPage" :extra-props="extraProps"
            :status-code="statusCode"></tableComponent>
    </div>
</template>

<style>
.table {
    margin-top: 12px;
    background: White;
    width: 100%;
}
</style>

<script>
import topFilters from "../filters/top-filters.vue"
import tableComponent from "./table-v2.vue"
import {analyticsTablePropsMixins} from "@/components/generic-graphs/graphs/mixins/analytics-props.mixins.js";

export default {
  name: "index",
  mixins: [analyticsTablePropsMixins],
  provide() {
    return {'chartId': this.chartId}
  },
  props: {
    // seedFilters: {type: Array, required: true}
  },
  components: {
    topFilters,
    tableComponent
  }
}
</script>