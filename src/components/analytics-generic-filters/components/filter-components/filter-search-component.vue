<template>
  <nitrozen-input :value="value" :showSearchIcon="true" class="search" placeholder="Search shipment ID"
                  type="search" @input="filterChange"></nitrozen-input>
</template>

<script>
import {filterComponentSharedProps, filterMixin, filtersSharedValueMixins} from "../../mixins/filter.mixin";
import {NitrozenInput} from "@gofynd/nitrozen-vue";
import {debounce} from "@/helper/utils";

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
    filterChange: debounce(function (search) {
      this.$emit('reset-data')
    }, 300),
  }
}
</script>

<style lang="less" scoped>
.search {
  height: 2.5rem;
}

</style>