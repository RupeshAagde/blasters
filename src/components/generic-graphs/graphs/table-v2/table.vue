<template>
    <div class="table">
        <topFilters></topFilters>
        <tableComponent :columns="columns" :rows="rows" :chart-id="chartId"
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
import topFilters from "./topFilters.vue"
import tableComponent from "./tableComponent.vue"
import { analyticsTablePropsMixins } from "@/components/generic-graphs/graphs/mixins/analytics-props.mixins.js";
export default{
    name: "table-dunzo", 
    mixins: [analyticsTablePropsMixins],
    components:{
        topFilters,
        tableComponent
    }
}
</script>