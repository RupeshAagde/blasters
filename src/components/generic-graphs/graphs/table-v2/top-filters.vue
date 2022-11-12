<template>
    <div class="topFilter">
      <filter-components :page-name="pageName" :seed-data="filters" :should-show-tool-tip="false"
                         :chart-id="chartId" class="components-specific-styles"></filter-components>
    </div>
</template>

<style lang="less" scoped>
.topFilter {
  padding: 12px;
  background: #F5F5F5;
  border-radius: 4px;
}

::v-deep .rest-of-filters {
  .component-wrapper:nth-child(1) {
    width: 80% !important;
  }

  .component-wrapper:nth-child(2) {
    width: 20% !important;
  }
}

::v-deep .nitrozen-dropdown-container {
  min-width: 12.687rem;
}

::v-deep .nitrozen-dropdown-container .nitrozen-select__trigger span {
  opacity: 0.8;
  font-size: 12px;
}

::v-deep .nitrozen-dropdown-container .nitrozen-option.selected {
  color: #2e31be;
  background-color: inherit;
  font-weight: 600;
}
</style>

<script>
import {NitrozenDropdown, NitrozenInput} from '@gofynd/nitrozen-vue';
import FilterComponents from "@/components/analytics-generic-filters/components/filter-components";

export default {
  name: "top-filters",
  components: {
    NitrozenDropdown,
    NitrozenInput,
    FilterComponents
  },
  provide(){
    return {}
  },
  props: {
    filters: {type: Array | Object, required: true},
    chartId: {type: String}
  },
  inject: ['pageName'],
  data() {
    return {
      selectedStatus: {},
      searchText: ''
    }
  },
}
</script>