<template>
  <nitrozen-dropdown
      v-model="selectedValue"
      :disabled="loading || disabled"
      :items="data.values"
      :label="'label'"
      :placeholder="'graph-filter'"
      :value="selectedValue"
      class="time-filter"
      @change="onDropDownsChange"
  ></nitrozen-dropdown>
</template>

<script>
import {NitrozenDropdown} from "@gofynd/nitrozen-vue";
import {ANALYTICS_PAGES} from "../data/constants";
import {ADMIN_SAVE_FILTERS} from "../../../store/action.type";

export default {
  name: "time-filter",
  components: {"nitrozen-dropdown": NitrozenDropdown},
  props: {
    loading: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    data: {
      type: Object, default() {
        return {}
      }
    },
    pageName: {type: String, default: ANALYTICS_PAGES.REPORTS},
    chartId: {type: String},
    value: {type: String},
  },
  data: () => ({
    selectedValue: ""
  }),
  methods: {
    onDropDownsChange(val) {
      this.$store.dispatch(ADMIN_SAVE_FILTERS, {
        pageName: this.pageName,
        filterId: this.chartId,
        timeFilter: val,
        isComponentSpecific: true
      });
      this.$emit('reset-data');
    }
  },
  mounted() {
    // setting default value
    if (this.value) {
      this.selectedValue = this.value;
    } else {
      this.selectedValue = this.data.values[1].value
    }
  },
  watch: {
    value(val) {
      if (val)
        this.selectedValue = val;
    }
  }
}
</script>

<style lang="less" scoped>
::v-deep .nitrozen-dropdown-label {
  display: none;
}

.time-filter {
  max-width: 9rem;
}
</style>