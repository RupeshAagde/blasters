<template>
  <div class="panel-container">
    <time-filter v-if="doesTimeFiltersExists" :chart-id="cleanedChartId" :data="timeFilters" :disabled="false"
                 :is-loading="false"
                 :loading="false" :page-name="pageName" :value="selectedFilter"
                 class="time-filter" @reset-data="$emit('reset-data')"></time-filter>
    <div class="graph-control" @click="toggleGraph">
      <inline-svg :src="toggleIcon"></inline-svg>
      <h3>{{ toggleText }} graph</h3>
    </div>
    <h3 v-if="!!navLink" @click="redirect()">See more</h3>
  </div>
</template>

<script>
import {navLinkMixins} from "./mixins/navLink.mixins";
import {ADMIN_CLONE_GLOBAL_FILTERS, ADMIN_SAVE_FILTERS, ADMIN_SET_ACTIVE_TAB} from "../../../store/action.type";
import {ANALYTICS_PAGES} from "../data/constants";
import {getRedirectionUrl} from "../../../pages/admin/overview/dashboard/utils/redirect.util";
import uktInlineSvg from "../../common/ukt-inline-svg";
import {timeFiltersMixins} from "./mixins/timeFilters.mixins";
import graphFilters from "../graphs/filters/index";
import TimeFilter from "../timeFilter";

export default {
  name: "graph-controls",
  components: {TimeFilter, 'graph-filters': graphFilters, 'inline-svg': uktInlineSvg},
  mixins: [navLinkMixins, timeFiltersMixins],
  emit: {
    "toggle-graph": null
  },
  data: () => ({icon: "show-eye", showGraph: true}),
  methods: {
    toggleGraph() {
      this.showGraph = !this.showGraph;
      this.$emit("toggle-graph", this.showGraph);
    },
    redirect(navLink = "reports") {
      this.$store.dispatch(ADMIN_SAVE_FILTERS, {
        pageName: ANALYTICS_PAGES.REPORTS,
        graphFilter: this.navLink.filter_id,
      }).then(y => {
        this.$store.dispatch(ADMIN_SET_ACTIVE_TAB, this.navLink.tab).then(x => {
          this.$store.dispatch(ADMIN_CLONE_GLOBAL_FILTERS, {
            to: ANALYTICS_PAGES.REPORTS,
            from: ANALYTICS_PAGES.DASHBOARD
          }).then(z => {
            this.$router.push({
              path: getRedirectionUrl(this.$basePath, navLink, this.$route)
            });
          });
        })
      });
    }
  },
  computed: {
    toggleIcon() {
      return this.showGraph ? "hide-eye" : "show-eye";
    },
    toggleText() {
      return this.showGraph ? "Hide" : "Show";
    },
  }
};
</script>

<style lang="less" scoped>
@primary-font-family: 'Inter';
.panel-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block: 1rem;

  & > *:nth-child(2) {
    margin-left: auto;

    &:not(:last-child) {
      margin-right: 0.5em;
    }
  }

  @media @mobile {
    padding: 0;
  }
}

.graph-control > h3,
.graph-control span ::v-deep svg {
  font-family: @primary-font-family;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 17px;
  color: #bdbdbd;
  cursor: pointer;
}

.graph-control span ::v-deep svg {
  width: 70%;
}

.panel-container > h3 {
  color: #2e31be;
  font-family: @primary-font-family;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
}

.graph-control {
  display: flex;
  gap: 0.1em;
  align-items: center;
}
</style>
