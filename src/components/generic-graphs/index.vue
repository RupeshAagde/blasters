<template>
  <div v-if="isSuccess">
    <div v-if="isGenericGraph">
      <no-ssr>
        <generic-implementation
            :x-axes="xAxes"
            :y-axes="yAxes"
            :chart-id="`chartId-${chartId}`"
            :graph-type="graphType"
            :filters="filters"
            :extra-props="extraProps"
            :page-name="analyticPage"
            :data-source="dataSource"
            @reset-data="$emit('reset-data')"
        ></generic-implementation>
      </no-ssr>
    </div>
    <div v-else-if="graphType === availableGraphs.PROGRESS_BAR">
      <progress-bar-graph
          :x-axes="xAxes"
          :y-axes="yAxes"
          :chart-id="`chartId-${chartId}`"
          :graph-type="graphType"
      ></progress-bar-graph>
    </div>
    <div v-else-if="graphType === availableGraphs.TABLE">
      <custom-table-graph
          :columns="columns"
          :rows="rows"
          :chart-id="chartId"
          :graph-type="graphType"
          :showPagination="showPagination"
          :analytic-page="analyticPage"
          :extra-props="extraProps"
          :status-code="statusCode"
      ></custom-table-graph>
    </div>
    
    <div v-else-if="graphType === availableGraphs.TABLE_V2">
      <table-v2
          :columns="columns"
          :rows="rows"
          :chart-id="chartId"
          :graph-type="graphType"
          :showPagination="showPagination"
          :analytic-page="analyticPage"
          :extra-props="extraProps"
          :status-code="statusCode"
          :seed-filters="seedFilters"
          :hyperlocal-page="hyperlocalPage"
          @reset-data="$emit('reset-data')"
      ></table-v2>
    </div>
  </div>
  <div v-else>
    <error-handlers :error-code="statusCode"></error-handlers>
  </div>
</template>
<script>
import {GRAPH_TYPES} from "@/components/generic-graphs/data/constants";
import ProgressBarGraph from "@/components/generic-graphs/graphs/progress-bar-graph";
import CustomTableGraph from "@/components/generic-graphs/graphs/table";
import NoSSR from "vue-no-ssr";
import {
  analyticsGenericGraphMixins,
  analyticsTablePropsMixins,
  analyticsTableV2
} from "./graphs/mixins/analytics-props.mixins";
import {GENERIC_GRAPHS, HTTP_STATUS_CODES} from "./data/constants";
import ErrorHandlers from "./graphs/error-handlers";
import TableGeneric from "./graphs/table-v2"

const GenericImplementation = () =>
    import(
        /*webpackChunkName:"generic-implementation" */ "@/components/generic-graphs/graphs/generic-implementation"
        );

export default {
  name: "generic-graph",
  mixins: [analyticsTablePropsMixins, analyticsGenericGraphMixins, analyticsTableV2],
  components: {
    ErrorHandlers,
    CustomTableGraph,
    ProgressBarGraph,
    'table-v2': TableGeneric,
    "generic-implementation": GenericImplementation,
    "no-ssr": NoSSR
  },
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false
    },
    genericImplementedGraphs: GENERIC_GRAPHS,
    availableGraphs: GRAPH_TYPES
  }),
  computed: {
    isGenericGraph() {
      return (
          this.genericImplementedGraphs &&
          this.genericImplementedGraphs.includes(this.graphType.trim().toLowerCase())
      );
    },
    graphType() {
      return this.type.trim().toLowerCase();
    },
    isSuccess() {
      return this.statusCode === HTTP_STATUS_CODES.SUCCESS;
    }
  },
};
</script>
