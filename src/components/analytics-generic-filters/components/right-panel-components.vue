<template>
  <div class="filter-container" v-if="displayFilters.length > 0">
    <filter-components :page-name="pageName" :seed-data="displayFilters"
                       class="components-specific-styles"></filter-components>
    <more-filters v-if="restOfFilters.length" ref="more-filter" :page-name="pageName" :sorted-filters="restOfFilters"></more-filters>
    <nitrozen-button
        v-if="restOfFilters.length"
        v-strokeBtn
        :theme="'secondary'"
        class="more-filters"
        @click="openTestDialog"
    >More Filters
    </nitrozen-button>
  </div>
</template>

<script>
import {filterMixin, sharedDataMixins} from "../mixins/filter.mixin";
import FilterCheckboxComponents from "./filter-components/filter-checkbox-component";
import FilterDropdownComponent from "./filter-components/filter-dropdown-component";
import {NitrozenButton, strokeBtn} from "@gofynd/nitrozen-vue";
import moreFilters from "./more-filters";
import filterComponents from "./filter-components";

export default {
  name: "right-panel-components",
  components: {FilterDropdownComponent, FilterCheckboxComponents, NitrozenButton, moreFilters, filterComponents},
  mixins: [filterMixin, sharedDataMixins],
  directives: {
    strokeBtn
  },
  methods: {
    openTestDialog() {
      this.$refs['more-filter'].open();
    }
  }
}
</script>

<style scoped lang="less">
.filter-container {
  display: flex;
  gap: 1rem;
  align-items: center;

  .components-specific-styles {
    ::v-deep .component-wrapper {
      max-width: 13rem;
    }
  }
}

::v-deep .n-button-stroke-secondary {
  border: 1px solid #E0E0E0;
  line-height: 23px;

  /* Text Color */

  color: #41434C;

  opacity: 0.8;
  padding: 0 15px;
}

::v-deep .n-button-content {
  font-weight: 400 !important;
}
@media only screen and (max-width: 480px) {
  .filter-container {
    flex-direction: column;
    align-items: normal;
  }
  .n-button-stroke-secondary {
    width:88vw
  }
  .filter-container {
  
  .components-specific-styles {
    ::v-deep .component-wrapper {
      max-width: 100vw;
    }
  }
}
}
</style>