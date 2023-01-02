<template>
    <div class="panel">
      <div>
        <div class="page-header">
          <div class="page-nav">
            <div class="page-title">
              <span>Hyperlocal Tracking</span>
              <nitrozen-button  
                v-strokeBtn
                @click="refreshBtn"
                :theme="'secondary'">
                  
                  <inline-svg :src="'refresh_regular'" class="refresh_icon"></inline-svg>
              </nitrozen-button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="hasCardsLoaded" class="main-section">
        <analytics-generic-filters
            :page-name="ANALYTICS_PAGES.DASHBOARD"
            class="filter-section"
        ></analytics-generic-filters>
        <tags-container
            :page-name="ANALYTICS_PAGES.DASHBOARD"
        ></tags-container>
        <div class="main-wrapper">
            <div v-for="(card, index) in cards" class="graph-loading--controller-wrapper">
              <dashboard-grid-header :card="card" :is-header-card="card.showHeader === true"
                                     :card-index="0"></dashboard-grid-header>
              <graph-loading-controller
                  :item="card"
                  :page-name="ANALYTICS_PAGES.DASHBOARD"
                  :panel-index="index"
              ></graph-loading-controller>
            </div>
          </div>
        </div>
      <div v-else class="error-cases">
        <adm-loader v-if="isDataLoading"></adm-loader>
        <error-handlers
            v-else
            :error-code="500"
            :show-try-again="true"
        ></error-handlers>
      </div>
    </div>
</template>
<style lang="less" scoped>

::v-deep .panel-container {
  display: none !important;
}

::v-deep .date-picker .n-input-label {
  display: none;
}

.graph-loading--controller-wrapper{
  padding: 1em;
}

.reports-filter-dialog {
  background: #ffffff;
  border-radius: 12px;

  ::v-deep .nitrozen-dialog-footer {
    display: none !important;
  }

  ::v-deep .nitrozen-dialog {
    border-radius: 12px;
  }

  ::v-deep .nitrozen-dialog-body {
    overflow: unset !important;
    padding: unset !important;
  }

  ::v-deep .nitrozen-dialog {
    @media @mobile {
      margin: 0;
      border-radius: 0;
    }
  }
}

.left-panel > .n-button-stroke-secondary {
  border: 1px solid #e0e0e0;
  color: #666666;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  padding: 0 15px;
}

.canvas-wrapper > canvas {
  height: 300px;
}

.version-dropdown {
  width: 10rem;
}

.filter-panel {
  display: flex;
  margin-block: 2.5vh 2vh;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.demo-box {
  margin-top: 2vh;
}

.right-panel {
  display: flex;
  gap: 1vw;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
}

.ag-theme-alpine {
  width: auto !important;
}

::v-deep .ag-center-cols-container {
  width: auto !important;
}

.content {
  //margin-top: 51px !important;
}

.input-shimmer {
  height: 40px;
  width: 400px;
}

.item {
  background-color: @White;
  border: 1px solid @LightGray;

  &:hover {
    box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
  }
}

.empty-state {
  width: 100%;
}

.order-menu {
  ::v-deep ul.nitrozen-menu-vertical-dropdown {
    max-height: unset;
  }
}

.lock-toggle {
  margin-top: 2%;
  @media @mobile {
    margin-left: auto;
    margin-top: 0px;
  }
}

.button-box {
  display: flex;
  align-items: center;
  @media @mobile {
    margin-left: 24px;
  }

  .toggle-label {
    display: flex;
    align-items: center;
    cursor: pointer;

    .toggle-label-div {
      display: flex;
      align-items: center;
    }
  }
}

.pad-right {
  margin-right: 8px;
}

.ss-container {
  width: 100%;
}

::v-deep .nitrozen-options {
  z-index: @actionBar !important;
}

.custom-store-dropdown-option {
  display: flex;
  padding-left: 12px;

  .option-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6px 0;

    .text {
      font-weight: bold;
    }

    .subtext {
      font-weight: normal;
    }
  }

  &.selected {
    color: @White;
    background-color: @RoyalBlue;
  }
}

::v-deep .titlize {
  text-transform: capitalize;
}

@media @mobile {
  width: calc(100% - 48px);
  margin-top: 48px;
}

.tab-row {
  display: flex;
  justify-content: center;
  width: 100%;
  border-bottom: 1px solid @Iron;

  .tabs {
    width: 96%;
    @media @mobile {
      padding-left: 0;
    }

    ::v-deep .nitrozen-tab {
      overflow-x: auto;
      @media @mobile {
        //gap: 6vw;
        justify-content: space-between;
      }
    }

    ::v-deep .nitrozen-tab-item {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      justify-content: center;
      align-items: center;
      height: 6vh;
      min-width: 6rem;

      @media @mobile {
        padding-inline: 1rem
      }
    }

    ::v-deep .nitrozen-tab-active {
      font-weight: bold;
    }
  }

  .bulk-actions-button {
    top: -10px;
    margin-right: 12px;
  }

  .refresh-icon {
    cursor: pointer;
    margin: 0px 12px;

    ::v-deep svg {
      fill: @RoyalBlue;
      transition: all 0.6s ease;
    }

    &:hover {
      ::v-deep svg {
        transform: rotate(120deg);
      }
    }
  }
}

.content-container {
  width: 100%;
  margin-block: 1.4rem;
  padding-inline: 1rem;
}

.extra-padding-bottom {
  padding-bottom: 2rem;
}

.table-container {
  margin-inline: 2vw;
}

.border-top {
  border-top: 1px solid #e0e0e0;
}

.panel {
  display: grid;
  min-height: 650px !important;
}

.date-text {
  align-self: center;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 23px;
  color: #41434c;

  opacity: 0.7;
}

.page-slot {
  display: flex;
  padding: 15px;
  gap: 15px;
  align-items: center;
  margin: 5vh 0 2vh 0;
  background: #ffffff;
  flex-wrap: wrap;
  @media @mobile {
    margin-top: 9vh;
    gap: 0;
    .date {
      width: 100%;
      order: 3;
    }

    .date-text:first-child {
      margin-bottom: 0.7em;
    }

    .date-text:last-child {
      order: 2;
      margin-left: auto;
      font-size: 0.6rem;
    }

    .date-text {
      opacity: 0.5;
    }
  }
}

.page-title {
  color: #41434c;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 15px 15px 15px 0px;
}

.export {
  font-size: 14px;
  font-weight: 700;
  color: #2e31be;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 10rem;

  .export-icon {
    margin-top: 2px;
    margin-right: 8px;
  }
}

.refresh_icon {
  transform: scale(1.3);
}
.page-header {
  display: flex;
  align-items: center;
  position: fixed;
  width: calc(100% - 250px);
  z-index: 6;
  box-shadow: 0 1px 0 0 #dfdfdf;
  background-color: #ffffff;
  @media @mobile {
   width:100%;
  }
}

.page-nav {
  padding: 0px 24px 0 24px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.section-content {
  margin: 24px;
  @media @mobile {
    margin: 24px 0;
  }
}

.dashboards {
  margin-top: 10px;
  border: 1px solid gray;
  min-height: 500px;
  width: 100%;
  padding: 10px;

  .graphs {
    padding: 0px 10px;
  }
}

.title {
  padding: 10px;
}

canvas {
  height: 350px !important;
  width: 800px !important;
}

.value {
  padding: 10px 30px;
  font-size: 25px;
  font-weight: 600;
}

.main-section {
  width: 100%;
  margin-top: 4.5rem;
  padding: 0 1.375rem;
  box-sizing: border-box;
  @media @mobile {
    max-width: 100vw;
    margin-top: 4rem;
    padding: 0;
  }
}

.graph-loading--controller-wrapper {
  background: #ffffff;
  border-radius: 4px;
  margin-block: 1.5rem;
  @media @mobile {
    margin: 0;
    margin-top: 1rem;
  }
}

::v-deep .loader {
  padding: 0;

  & > img {
    height: 2.6rem;
  }
}

::v-deep .nitrozen-select-wrapper .disabled .nitrozen-select__trigger {
  background-color: #fff !important;
}
::v-deep .card-content-main {
    margin-bottom: 0.5rem;
    margin-left: 0.5rem;
    font-size: 18px;
    font-weight: 600;
}

.manage-columns-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .coming-soon {
    position: absolute;
    top: -13px;
    left: -10px;
    z-index: 10;
  }
}

.sales-dump-progress-panel {
  margin-block: 0 1rem;
}

::v-deep .filter-section{
  width: 98%
}

</style>

<script>
import {mapGetters} from 'vuex';
import adminlinesvg from '@/components/common/adm-inline-svg.vue';
import admncomingsoon from '@/components/common/coming-soon.vue';
import admpageheader from '@/components/common/layout/page-header.vue';
import {
  flatBtn,
  NitrozenButton,
  NitrozenDialog,
  NitrozenDropdown,
  NitrozenInput,
  NitrozenTab,
  NitrozenTabItem,
  strokeBtn,
} from '@gofynd/nitrozen-vue';
import admforminput from '@/components/common/form-input.vue';
import datePicker from '@/components/common/date-picker.vue';
import GenericGraph from '@/components/generic-graphs';
import DateRangeFilter from '@/components/analytics-generic-filters/components/date-range-filter';
import uktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import AnalyticsGenericFilters from '@/components/analytics-generic-filters';
import TagsContainer from '@/components/common/tags/tags-container';
import {ADMIN_FETCH_DASHBOARD_DATA} from "@/store/action.type";
import {ANALYTICS_PAGES} from "@/components/generic-graphs/data/constants";
import {mediaScreensMixins} from "../../../mixins/media-screens-mixins";
import {DashboardReportSharedMixins} from "../../overview/dashboard/mixins/dashboard-report-shared.mixins";
import {DashboardCommonMixins} from "../../overview/dashboard/mixins/dashboard-common.mixins";
import GraphLoadingController from "../../overview/dashboard/graph-loading-controller";
import ErrorHandlers from "@/components/generic-graphs/graphs/error-handlers";
import AdmLoader from "@/components/common/loader";
import {ANALYTICS_STATE} from "@/store/modules/admin-analytics.module";
import DashboardGridHeader from "@/pages/overview/dashboard/dashboard-grid/dashboard-grid-header.vue";
import {HTTP_STATUS_CODES} from "../../../components/generic-graphs/data/constants";
import inlineSvgVue from '@/components/common/inline-svg.vue';

export default {
  name: 'adm-orders-ninja',
  data() {
    return {
      ANALYTICS_PAGES: ANALYTICS_PAGES,
      isDataLoading: false,
    }
  },
  provide() {
    return {pageName: ANALYTICS_PAGES.DASHBOARD}
  },
  methods: {
    cardExists(card) {
      return card.graphInfo.statusCode !== HTTP_STATUS_CODES.NO_CONTENT
    },
    fetchData() {
      this.isDataLoading = false;
        this.$store
          .dispatch(ADMIN_FETCH_DASHBOARD_DATA, {
            appId: this.appId,
            emailId: this.emailId,
            mobileNumber: this.mobileNumber,
            pageName: ANALYTICS_PAGES.NINJA
          })
            .then()
            .finally((x) => {
                this.isDataLoading = false;
            });
    },
    refreshBtn() {
     location.reload();
    }
  },
  mixins: [
    mediaScreensMixins,
    DashboardReportSharedMixins,
    DashboardCommonMixins,
  ],
  directives: {
    flatBtn,
    strokeBtn,
  },
  components: {
    AnalyticsGenericFilters,
    uktInlineSvg,
    TagsContainer,
    DateRangeFilter,
    'adm-inline-svg': adminlinesvg,
    'adm-coming-soon': admncomingsoon,
    'nitrozen-tab': NitrozenTab,
    'nitrozen-tab-item': NitrozenTabItem,
    'adm-page-header': admpageheader,
    'adm-form-input': admforminput,
    'adm-date-picker': datePicker,
    'generic-graph': GenericGraph,
    'nitrozen-button': NitrozenButton,
    'nitrozen-dropdown': NitrozenDropdown,
    'nitrozen-dialog': NitrozenDialog,
    'nitrozen-input': NitrozenInput,
    'graph-loading-controller': GraphLoadingController,
    'error-handlers': ErrorHandlers,
    'adm-loader': AdmLoader,
    'inline-svg': inlineSvgVue,
    DashboardGridHeader
  },
    computed: {
      ...mapGetters({
        dashboardData: ANALYTICS_STATE.DASHBOARD_DATA,
      }),
      cards() {
        if (!this.dashboardData || !Object.keys(this.dashboardData).length) {
          return [];
        }
        // console.log('data: ', this.dashboardData)
        return this.dashboardData.reduce((a, d) => {
          a.push(...d.cards);
          return a;
        }, []);
      },
      hasCardsLoaded() {
        return !!this.cards;
      }
    },
    mounted() {
        this.fetchData();
    },
};
</script>
