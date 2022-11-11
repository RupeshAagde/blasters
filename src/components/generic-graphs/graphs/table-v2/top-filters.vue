<template>
    <div class="topFilter">
      <nitrozen-input v-model="searchText" :showSearchIcon="true" class="search" placeholder="Search shipment ID"
                      type="search" @input="filterChange()"></nitrozen-input>
      <filter-components :page-name="pageName" :seed-data="filters" :should-show-tool-tip="false"
                         class="components-specific-styles"></filter-components>
    </div>
</template>

<style scoped>
.topFilter{
    padding: 12px;
    background: #F5F5F5;
    display: flex;
    flex-direction: row;
    gap:1rem;
    border-radius: 4px
}
::v-deep .nitrozen-dropdown-container{
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
.search{
    width: 100%;
    height: 2.5rem;
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
    filters: {type: Array | Object, required: true}
  },
  inject: ['pageName'],
  data() {
    return {
      selectedStatus: {},
      searchText: ''
    }
  },
  methods: {
    filterChange(event) {
      console.log("EVENT", event);
      console.log("Filter Selected", this.selectedStatus)
    }
  }
}
</script>