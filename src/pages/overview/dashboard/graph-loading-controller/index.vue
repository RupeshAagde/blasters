<template>
  <div>
    <graph-filters v-if="item.filters" :disabled="disabled" :filters="item.filters" :is-loading="isLoading"
                   :page-name="pageName" @reset-data="resetData" :chart-id="getRandomId(item.id)"></graph-filters>
    <div class="is-loading" v-if="isLoading">
      <adm-shimmer
          :count="2"
          class="shimmer-wrapper"
      ></adm-shimmer>
    </div>

    <generic-graph v-if="!isLoading && hasGraphInfo"
                   :x-axes="item.graphInfo.xAxes"
                   :y-axes="item.graphInfo.yAxes"
                   :showPagination="item.graphInfo.showPagination"
                   :columns="item.graphInfo.columns"
                   :rows="item.graphInfo.rows"
                   :type="item.graphInfo.graphType"
                   :chart-id="getRandomId(item.id)"
                   :filters="item.filters"
                   :extra-props="item.extraProps"
                   :analytic-page="pageName"
                   :status-code="item.graphInfo.statusCode"
                   :data-source="item.graphInfo.dataSource"
                   :seed-filters="item.seedFilters"
                   @reset-data="resetData"
    ></generic-graph>
  </div>
</template>

<script>
import GenericGraph from "@/components/generic-graphs";
import loader from "@/components/common/loader";
import {ADMIN_FLOAT_INDIVIDUAL_CHART_DATA, ADMIN_RESET_INDIVIDUAL_CHART_DATA} from "@/store/action.type";
import {ANALYTICS_PAGES} from "@/components/generic-graphs/data/constants";
import GraphFilters from "@/components/generic-graphs/graphs/filters";
import {loadingMixins} from "@/components/generic-graphs/graphs/mixins/loading.mixins";
import {DashboardCommonMixins} from "../mixins/dashboard-common.mixins";
import {graphLoadingCondition} from "../utils/graph-loading.utils";
import admshimmer from "@/components/common/shimmer.vue";
import SlaIndicator from '@/components/generic-graphs/sla/sla-indicator.vue'
export default {
  name: "graph-loading-controller",
  mixins: [loadingMixins, DashboardCommonMixins],
  provide() {
    return {CHART_ID: this.item.id}
  },
  components: {GraphFilters, "generic-graph": GenericGraph, loader, "adm-shimmer": admshimmer,
    SlaIndicator
  },
  props: {
    item: {type: Object, default: null, required: true},
    disabled: {
      type: Boolean, default: false
    },
    panelIndex: {type: Number, default: 0},
    cardIndex: {type: Number, default: 0},
    pageName: {type: String, default: ANALYTICS_PAGES.DASHBOARD}
  },
  methods: {
    loadData() {
      this.$nextTick(function () {

        this.$store.dispatch(ADMIN_FLOAT_INDIVIDUAL_CHART_DATA, {
          panelIndex: this.panelIndex,
          cardIndex: this.cardIndex,
          url: this.item.graphInfo.dataSource,
          pageName: this.pageName,
          appId: this.appId,
          allFilters: this.allFilters,
          chartId: this.item.id,
          graphType: this.item.graphInfo.graphType
        });
      });
    },
    loadingCondition() {
     return graphLoadingCondition(this.item);
    },
    resetData() {
      this.$store.dispatch(ADMIN_RESET_INDIVIDUAL_CHART_DATA, {
        panelIndex: this.panelIndex,
        cardIndex: this.cardIndex,
        pageName: this.pageName
      });
    },
    setPageName() {
      this._pageName = this.pageName;
    },
    getRandomId(id) {
      if (!id) return Math.floor(Math.random() * 101);
      return id;
    }
  },
  computed: {
    refreshToken() {
      return this.item && this.item.graphInfo && this.item.graphInfo.dataSource;
    },
    hasGraphInfo() {
      return !(!this.item || !this.item.graphInfo);
    }
  },
};
</script>

<style lang="less" scoped>
.is-loading {
  min-height: 16rem;
  display: grid;
  place-items: center;
}

.shimmer-wrapper {
  width: 100%;
}
::v-deep .card-avatar {
  display: none;
}

</style>
