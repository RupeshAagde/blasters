<template>
  <div class="growth-container" v-if="!isLoading">
    <div class="growth-wrapper"
         :class="{'growth-gap-block': shouldShowChangeInValue, 'growth-gap-top': !shouldShowChangeInValue}">
      <graph-value-formatter :value="growth.value" :config="valueFormatter"></graph-value-formatter>
      <change-in-value v-if="shouldShowChangeInValue" :value="growth.changeInValue" :arrow-color="growth.color"></change-in-value>
    </div>
    <p class="card-description growth-gap-top" v-if="growth.description">{{ growth.description }}</p>
  </div>
  <div class="is-loading" v-else>
    <loading></loading>
  </div>
</template>

<script>
import changeInValue from "../../../../components/generic-graphs/change-in-value";
import {loadingMixins} from "../../../../components/generic-graphs/graphs/mixins/loading.mixins";
import loading from "../../../../components/common/ukt-loader";
import {
  ADMIN_FLOAT_INDIVIDUAL_FILTER_CARD_DATA,
  ADMIN_RESET_INDIVIDUAL_FILTER_CARD_DATA
} from "../../../../store/admin/action.type";
import {DASHBOARD_PAGE_PANELS} from "../../../../constants/chart/dashboardConstants";
import {ANALYTICS_PAGES} from "../../../../components/generic-graphs/data/constants";
import GraphValueFormatter from "../../../../components/generic-graphs/graph-value-formatter";
import {DashboardCommonMixins} from "./mixins/dashboard-common.mixins";

export default {
  name: "growth-factor",
  mixins: [loadingMixins, DashboardCommonMixins],
  data: () => ({
    config: {
      prefixSymbol: "",
      suffixSymbol: "%",
      divisor: 1
    },
    pageName: ANALYTICS_PAGES.DASHBOARD
  }),
  props: {
    growth: {type: Object, required: true},
    cardIndex: {type: Number, required: true}
  },
  components: {GraphValueFormatter, changeInValue, loading},
  methods: {
    loadingCondition() {
      // console.log("cardIndex:", this.cardIndex, "url: ", this.growth.dataSource);
      // return true;
      // return !this.growth.value || !this.growth.changeInValue;
      if (this.growth.value === 0 || this.growth.changeInValue === 0 || (this.growth.changeInValue === null && this.growth.value !== null)) {
        return false;
      }
      return !this.growth.value || !this.growth.changeInValue;
    },
    loadData() {
      this.$store.dispatch(ADMIN_FLOAT_INDIVIDUAL_FILTER_CARD_DATA, {
        panelIndex: DASHBOARD_PAGE_PANELS.REST,
        cardIndex: this.cardIndex,
        url: this.growth.dataSource,
        appId: this.appId,
        pageName: this.pageName,
        allFilters: this.allFilters,
        forGrowth: true
      });
    },
    resetData() {
      // console.log("reset called for growth factor");
      this.$store.dispatch(ADMIN_RESET_INDIVIDUAL_FILTER_CARD_DATA, {
        panelIndex: DASHBOARD_PAGE_PANELS.REST,
        cardIndex: this.cardIndex,
        forGrowth: true
      });
    },
    setPageName() {
      this._pageName = this.pageName;
    },
  },
  computed: {
    refreshToken() {
      // console.log("refresh token called for growth ", `[${DASHBOARD_PAGE_PANELS.REST}][${this.cardIndex}]`, this.growth.dataSource);
      return this.growth.dataSource;
    },
    shouldShowChangeInValue() {
      return this.growth.changeInValue !== null;
    },
    valueFormatter() {
      return this.config;
    }
  },
  mounted() {
    if (this.growth.valueFormatter && Object.keys(this.growth.valueFormatter).length) {
      this.config = this.growth.valueFormatter;
      // console.log('config: ', this.config);
    }
  }
};
</script>

<style scoped lang="less">
@growth-factor-gap-bottom: 1.5rem;
@growth-factor-gap-top: 0.5rem;
.growth-wrapper {
  display: flex;
  gap: 7px;
  align-items: flex-end;
}

.growth-wrapper > span {
  color: #333333;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
}

::v-deep .loader img {
  height: 30px;
}

::v-deep .loader {
  padding: 0;
  justify-content: flex-start;
}

.card-description {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 17px;
  /* identical to box height, or 142% */
  /* Gray 4 */

  color: #BDBDBD;
}

.growth-gap-block {
  margin-block: @growth-factor-gap-top @growth-factor-gap-bottom;
}

.growth-gap-top {
  margin-top: @growth-factor-gap-top;
}

</style>
