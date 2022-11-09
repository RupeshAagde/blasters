<template>
  <div>
    <div v-if="filters.filterView === FILTER_VIEWS.CARDS">
      <draggable tag="div" :draggable="`.${this.draggableClassNameConstant}`" v-model="getFilterData"
                 @change="orderChange">
        <transition-group tag="div" class="card-wrapper">
          <filter-card
              v-for="(card, index) in getFilterData"
              :key="card.cardIndex"
              :card="card"
              :card-index="index"
              :is-loading="isLoading"
              :is-last-card="index === getFilterData.length -1"
              @on-filter-clicked="onFilterClicked"
              @on-close="onClose"
              :class="draggableClass"
          ></filter-card>
        </transition-group>
      </draggable>
    </div>
    <div v-if="filters.filterView === FILTER_VIEWS.DROP_DOWN && !isMobile"
         class="dropdown-wrapper"
    >
      <nitrozen-dropdown
          v-model="selectedFilters.selectedGraphFilter"
          :value="selectedFilters.selectedGraphFilter"
          :items="graphFilter"
          :placeholder="'graph-filter'"
          @change="onDropDownsClicked('selectedGraphFilter', $event)"
          :label="'label'"
          :id="'graph-filter'"
          :disabled="loadingFlag || disabled"
      ></nitrozen-dropdown>
      <nitrozen-dropdown
          v-if="shouldShowTimeFilters"
          :id="'time-filter'"
          v-model="selectedFilters.selectedTimeFilter"
          :items="timeFilters"
          :placeholder="'time-filter'"
          class="time-filter"
          :label="'label'"
          @change="onDropDownsClicked('selectedTimeFilter', $event)"
          :disabled="loadingFlag || disabled"
      ></nitrozen-dropdown>
    </div>
  </div>
</template>

<script>
import FilterCard from "./filter-cards.vue";
import {ANALYTICS_PAGES, FILTER_VIEW} from "../../data/constants";
import {NitrozenDropdown} from "@gofynd/nitrozen-vue";
import draggable from "vuedraggable";
import {SCREEN_SIZES} from "@/helper/media-helper";
import {mediaScreensMixins} from "@/mixins/media-screens-mixins";
import {
  ADMIN_CHANGE_GRAPH_FILTER,
  ADMIN_SAVE_DASHBOARD_DRAGGABLE,
  ADMIN_SAVE_FILTERS
} from "@/store/action.type";
import {graphFilterMixins} from "../mixins/graphFilter.mixins";
import {DashboardCommonMixins} from "@/pages/overview/dashboard/mixins/dashboard-common.mixins";

export default {
  name: "graph-filters",
  mixins: [mediaScreensMixins, graphFilterMixins, DashboardCommonMixins],
  components: {
    draggable,
    FilterCard,
    "nitrozen-dropdown": NitrozenDropdown
  },
  data: () => ({
    FILTER_VIEWS: FILTER_VIEW,
    draggableClassNameConstant: "",
    selectedFilters: {
      selectedGraphFilter: "",
      selectedTimeFilter: ""
    },
    flag: false
  }),
  props: {
    filters: {type: Object, required: true},
    isLoading: {type: Boolean, required: true},
    disabled: {type: Boolean, default: false},
  },
  computed: {
    getFilterData: {
      get() {
        return this.filters.data;
      },
      set(updatedFilters = []) {
        this.filters.data = updatedFilters;
      }
    },
    draggableClass() {
      const classMapping = {
        [SCREEN_SIZES.TABLET]: this.draggableClassNameConstant,
        [SCREEN_SIZES.DESKTOP]: this.draggableClassNameConstant,
        [SCREEN_SIZES.LARGE_SCREEN]: this.draggableClassNameConstant
      };
      return this.applyClasses({...this.cssClassMapping, ...classMapping});
    },
    loadingFlag: {
      get() {
        // console.log('flag: ', this.flag);
        return this.flag;
      },
      set(flag) {
        // console.log('set flg')
        this.flag = flag
      }
    }
  },
  methods: {
    getDisabledVal() {
      // console.log('flag: ', this.flag);
      return this.flag;
    },
    onFilterClicked({index, chartUrl, navLink}) {
      // console.log("charturl: ", chartUrl);
      this.getFilterData = this.makeRestOfTheCardsInactive(index);
      // console.log('filter data: ', this.getFilterData);
      this.$store.dispatch(ADMIN_SAVE_FILTERS, {
        pageName: this.pageName,
        cardSelected: chartUrl,
        navLink
      });
      // console.log("cards: ", this.getFilterData);
    },
    onClose(index) {
      // console.log("on close parent triggered with index: ", index);
    },
    makeRestOfTheCardsInactive(index) {
      return this.filters.data.map((d, i) => {
        if (index !== i) {
          d.isSelected = false;
        }
        return d;
      });
    },
    onDropDownsClicked(dropdownName, e) {
      const context = this;
      setTimeout(function () {
        context.selectedFilters[dropdownName] = e;
        context.saveFiltersToStore();
        if (dropdownName === "selectedGraphFilter") {
          context.$store.dispatch(ADMIN_CHANGE_GRAPH_FILTER, {
            graphFilter: context.selectedFilters.selectedGraphFilter
          });
        }
      }, 0)
    },
    orderChange(e) {
      // console.log('order has been changed', this.getFilterData);
      this.$store.dispatch(ADMIN_SAVE_DASHBOARD_DRAGGABLE, {
        filterCards: this.getFilterData,
        email: this.emailId,
        appId: this.appId,
        mobileNumber: this.mobileNumber
      });
    }
  },
  watch: {
    isLoading(val) {
      // setTimeout(() => {
      this.loadingFlag = val;
      this.flag = val;
      // console.log('val setting to ', val)
      // }, 0);
    }
  }
};
</script>

<style lang="less" scoped>
@media (max-width: 1510px) {
  .filter-card-container {
    //padding: 15px 1.4em 13px 2.5em;
  }
}

::v-deep .disabled-dropdown .nitrozen-select__trigger {
  background-color: #e0e0e0;
  cursor: not-allowed;
  opacity: 0.4;
}

.card-wrapper {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  gap: 1vw;
  flex-wrap: wrap;
  @media @mobile {
    flex-wrap: nowrap;
    justify-content: normal;
    overflow-x: auto;
    padding: 0;
  }
  @media @tablet {
    flex-wrap: nowrap;
    justify-content: normal;
    overflow-x: auto;
    padding: 0;
  }
}

.dropdown-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 3vh;
  padding-inline: 0.6rem 1.3rem;
  //@media @mobile {
  //}
}

.dropdown-wrapper > .time-filter {
  //width: 9vw;
  min-width: 9rem;
  max-width: 9rem;
  @media @mobile {
    width: 48%;
  }
}

.dropdown-wrapper > div {
  min-width: 12rem;
  max-width: 13rem;
  //padding-left: 2em;
  @media @mobile {
    width: 48%;
    padding-left: 0;
  }

}

::v-deep .nitrozen-dropdown-label {
  display: none;
}

</style>
