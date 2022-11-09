<template>
  <div class="is-loading" v-if="isLoading">
    <loader></loader>
  </div>
  <div class="metrics" v-else>
    <h6 class="metrics-props">
      <graph-value-formatter :config="displayCard.valueFormatter"
                             :use-default-value-formatter="displayCard.valueFormatter.enableDynamicSuffix"
                             :value="displayCard.value"></graph-value-formatter>
    </h6>
    <change-in-value class="card-metrics metrics-props" :value="displayCard.changeInValue" :arrow-color="displayCard.color"></change-in-value>
  </div>
</template>

<script>
import GraphValueFormatter from "../../graph-value-formatter";
import ChangeInValue from "../../change-in-value";
import {
  ADMIN_FLOAT_INDIVIDUAL_FILTER_CARD_DATA,
  ADMIN_RESET_INDIVIDUAL_FILTER_CARD_DATA
} from "../../../../store/action.type";
import loader from "../../../admin/common/adm-loader";
import {DASHBOARD_PAGE_PANELS} from "../../../../constants/chart/dashboardConstants";
import {ANALYTICS_PAGES} from "../../data/constants";
import {loadingMixins} from "../mixins/loading.mixins";
import {SET_REFRESH_TOKENS} from "../../../../store/mutation.type";
import {DashboardCommonMixins} from "../../../../pages/admin/overview/dashboard/mixins/dashboard-common.mixins";

export default {
  name: "filter-metrics",
  mixins: [loadingMixins, DashboardCommonMixins],
  components: {ChangeInValue, GraphValueFormatter, loader},
  props: {
    card: {type: Object, required: true},
    cardIndex: {type: Number, required: true},
    pageName: {type: String, default: ANALYTICS_PAGES.DASHBOARD}
  },
  computed: {
    displayCard() {
      return this.card;
    },
    refreshToken() {
      return this.card.dataSource;
    }
  },
  methods: {
    loadData() {
      this.$store.dispatch(ADMIN_FLOAT_INDIVIDUAL_FILTER_CARD_DATA, {
        panelIndex: DASHBOARD_PAGE_PANELS.HEADER,
        cardIndex: this.cardIndex,
        url: this.card.dataSource,
        appId: this.appId,
        pageName: this.pageName,
        allFilters: this.allFilters
      });
    },
    loadingCondition() {
      if (this.card.value === 0 || this.card.changeInValue === 0) {
        return false;
      }
      return !this.card.value || !this.card.changeInValue;
    },
    resetData() {
      this.$store.dispatch(ADMIN_RESET_INDIVIDUAL_FILTER_CARD_DATA, {
        panelIndex: DASHBOARD_PAGE_PANELS.HEADER,
        cardIndex: this.cardIndex
      });
      this.$store.commit(SET_REFRESH_TOKENS, {key: this.refreshToken});
    },
    setPageName() {
      this._pageName = this.pageName;
    },
  }
};
</script>

<style scoped lang="less">
@primary-gray: #dadada;
@font-gray: #828282;
@card-padding: 0.5em;
.metrics > h6:first-child {
  font-weight: bold;
  font-size: 18px;
  line-height: 18px;
  color: #333333;
}

.metrics > h6 {
  font-family: Inter;
  font-style: normal;
}

.metrics > .card-metrics {
  color: #219653;
  font-size: 12px;
  margin-left: .3em;
}

.filter-card-container .metrics {
  display: flex;
  align-items: flex-end;
}

.metrics .metrics-props:nth-child(2) {
  margin-left: .5em;
}

::v-deep .loader img {
  height: 20px;
}

::v-deep .loader {
  padding: 0;
  align-items: flex-start;
}
</style>
