<template>
  <nitrozen-input v-model="searchText" :showSearchIcon="true" class="search" placeholder="Search shipment ID"
                  type="search" @input="filterChange()"></nitrozen-input>
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
      console.log(search);
      this.$emit('reset-data')
    }),
  }
}
</script>

<style lang="less" scoped>
.search {
  height: 2.5rem;
}

</style>