<template>
  
  <nitrozen-input :value="value" :showSearchIcon="true" class="search" placeholder="Search shipment ID"
                  :class="{'invalid-field': error}"
                  :disabled="isGlobalLoading" type="search" @input="filterChange"></nitrozen-input>

</template>

<script>
import {
  filterComponentSharedProps,
  filterMixin,
  filtersSharedValueMixins,
  isGlobalLoadingProps
} from "../../mixins/filter.mixin";
import {NitrozenInput} from "@gofynd/nitrozen-vue";
import {debounce} from "@/helper/utils";
import {ADMIN_SAVE_FILTERS} from "@/store/action.type"
import {ANALYTICS_PAGES} from "../../../generic-graphs/data/constants";
import {ADMIN_RESET_DROPDOWN_SEED_FILTERS_FOR_DUNZO_DASHBOARD} from "../../../../store/action.type";

export default {
  name: "filter-search-component",
  emits: ['on-error'],
  mixins: [filterMixin, filterComponentSharedProps, filtersSharedValueMixins, isGlobalLoadingProps],
  components: {NitrozenInput},
  data() {
    return {
      selectedStatus: {},
      searchText: '',
      error: false
    }
  },
  methods: {
    filterChange: debounce(function (searchText) {
      //add more validations
      this.error = false;
      this.searchText = searchText;
      if(searchText.trim()) { 
        if(this.seedData.regex) {
          const pattern = new RegExp(this.seedData.regex);
          if(!pattern.test(searchText)) {
            this.$emit('on-error',`Invalid value provided in ${this.seedData.name}`);
            this.error = true;
            this.$store.dispatch(ADMIN_SAVE_FILTERS, {
              pageName: ANALYTICS_PAGES.DASHBOARD,
              isComponentSpecific: true,
              filterId: this.chartId,
              searchFilter: {
                id: this.seedData.id,
                searchText: searchText
                 }
          });
            return false;
          }
        }
        this.$emit('on-error',null);
        this.onFilterChangeInternal(searchText);
      } else {
        this.$emit('on-error',null);
        this.onFilterChangeInternal(searchText);
      }
     
    }, 700),
    onFilterChangeInternal(searchText) {
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
      if (this.seedData.dependency) {
        this.$store.dispatch(ADMIN_RESET_DROPDOWN_SEED_FILTERS_FOR_DUNZO_DASHBOARD, {
          pageName: this.pageName,
          panelIndex: 1,
          cardIndex: 0,
          filterIndex: this.filterIndex,
          dependency: this.seedData.dependency.clearFilters,
          chartId: this.chartId
        });
      }
      this.$emit('reset-data')
    }
  },
  destroyed() {
    this.onFilterChangeInternal('');
  }
}
</script>

<style lang="less" scoped>
.search {
  height: 2.5rem;
}
.invalid-field ::v-deep .n-input {
  border: 1px solid #eb5757 !important;


}

</style>