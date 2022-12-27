<template>
  <span :style="appliedStyles">{{ displayValue }}</span>
</template>

<script>
import {displayValueFormatter, getValueFormatterConsideringAmountWeight} from "../utils/dataFormatter";

export default {
  name: "graph-value-formatter",
  props: {
    config: {
      type: Object,
      default() {
        return {
          prefixSymbol: "",
          suffixSymbol: "",
          divisor: 1
        };
      }
    },
    value: {type: [String, Number], default: ''},
    styles: {
      type: Object, default() {
        return {};
      }
    },
    useDefaultValueFormatter: {type: Boolean, default: false}
  },
  computed: {
    displayValue() {
      if (isNaN(this.value) || typeof this.value === 'string') {
                return this.value;
      }
      let config = {...this.config};
      if (this.useDefaultValueFormatter) {
        config = {
          ...config, ...getValueFormatterConsideringAmountWeight(this.value)
        };
      }
      return displayValueFormatter({...config, value: this.value});
    },
    appliedStyles() {
      return this.styles;
    }
  }
};
</script>

<style scoped>

</style>
