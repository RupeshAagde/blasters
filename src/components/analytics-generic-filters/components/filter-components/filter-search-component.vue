<template>
  <nitrozen-input :value="value" :showSearchIcon="true" class="search" placeholder="Search shipment ID"
                  type="search" @input="filterChange"></nitrozen-input>
</template>

<script>
import {filterComponentSharedProps, filterMixin, filtersSharedValueMixins} from "../../mixins/filter.mixin";
import {NitrozenInput} from "@gofynd/nitrozen-vue";
import {debounce} from "@/helper/utils";
import {ADMIN_SAVE_FILTERS} from "@/store/action.type"
import {ANALYTICS_PAGES} from "../../../generic-graphs/data/constants";

export default {
  name: "filter-search-component",
  mixins: [filterMixin, filterComponentSharedProps, filtersSharedValueMixins],
  components: {NitrozenInput},
  data() {
    return {
      selectedStatus: {},
      searchText: ''
    }
  },
  methods: {
    filterChange: debounce(function (searchText) {
      this.$store.dispatch(ADMIN_SAVE_FILTERS, {
        pageName: ANALYTICS_PAGES.DASHBOARD,
        isComponentSpecific: true,
        filterId: this.chartId,
        searchFilter: {
          id: this.seedData.id,
          searchText: searchText
        }
      });
      this.searchText = searchText;
      this.$emit('reset-data')
    },250),
  }
}
</script>

<style lang="less" scoped>
.search {
  height: 2.5rem;
}

</style>