<template>
    <div
        :class="{ 'align-vertically': alignVertically }"
        class="rest-of-filters"
    >
    <nitrozen-tooltip
        v-if="shouldShowToolTip"
        :position="toolTipPosition"
        class="questionmark-icon tool-tip-control"
        icon="help"
    >
      <p>{{ genericTooltipText }}</p>
    </nitrozen-tooltip>
        <div
            v-for="(filter, index) in seedData"
            :key="index"
            class="component-wrapper"
        >
          <filter-checkbox-components
              v-if="ANALYTICS_FILTER_TYPES.RADIO_BUTTON === filter.filterType"
              :apply-filter="applyFilter"
              :page-name="pageName"
              :seed-data="filter"
              :show-clear="showClear"
              :show-name="showName"
              :show-tags="showTags"
              :chart-id="chartId"
          ></filter-checkbox-components>
          <filter-search-component
              v-else-if="ANALYTICS_FILTER_TYPES.SEARCH_INPUT === filter.filterType"
              :ref="filter.name"
              :apply-filter="applyFilter"
              :page-name="pageName"
              :seed-data="filter"
              :show-clear="seedData.hasClearOption"
              :show-name="showName"
              :show-tags="showTags"
              :chart-id="chartId"
              @reset-data="$emit('reset-data')"
          ></filter-search-component>
          <filter-dropdown-component
              v-else
              :ref="filter.name"
              :apply-filter="applyFilter"
              :page-name="pageName"
              :seed-data="filter"
              :show-clear="seedData.hasClearOption"
              :show-name="showName"
              :show-tags="showTags"
              :chart-id="chartId"
          ></filter-dropdown-component>
        </div>
    </div>
</template>

<script>
import {NitrozenTooltip} from "@gofynd/nitrozen-vue";
import {filterComponentSharedProps, filterMixin,} from '../../mixins/filter.mixin';
import {GENERIC_TOOLTIP_TEXT} from "./constant/tooltip-message"
import FilterCheckboxComponents from './filter-checkbox-component';
import FilterDropdownComponent from './filter-dropdown-component';
import FilterSearchComponent from "./filter-search-component";

export default {
  name: 'index',
  components: {
    FilterSearchComponent,
    FilterDropdownComponent,
    FilterCheckboxComponents,
    "nitrozen-tooltip": NitrozenTooltip
  },
  props: {
    alignVertically: {type: Boolean, default: false},
    shouldShowToolTip: {type: Boolean, default: true}
  },
  mixins: [filterMixin, filterComponentSharedProps],
  methods: {
    callDropdownFunc() {
      this.seedData.forEach((filter) => {
        this.$refs[filter.name][0].clearSearchSlugs();
      });
    }
  },
  computed: {
    toolTipPosition() {
      return 'top';
    },
  },
  data: () => ({
        genericTooltipText: GENERIC_TOOLTIP_TEXT
      }
  ),
};
</script>

<style lang="less" scoped>
.rest-of-filters {
    display: flex;
    gap: 0.5em;
    align-items: center;

    .component-wrapper {
        width: 100%;
    }
}

.align-vertically {
    flex-direction: column;
}
@media only screen and (max-width: 480px) {
  .rest-of-filters {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 1rem;
  }
}
::v-deep .questionmark-icon > .nitrozen-inline-svg > svg > path {
  stroke: #dadada;
}
</style>
