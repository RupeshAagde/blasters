<template>
  <div class="main-wrapper">
    <inline-svg :class="arrowColorDisplay" :src="arrowType"></inline-svg>
    <h6 :class="arrowColorDisplay">
      {{ displayValue }}%</h6>
  </div>
</template>

<script>
import {ARROW_COLORS, ARROW_TYPE} from "../data/constants";
import uktInlineSvg from "../../common/ukt-inline-svg";

export default {
  name: "change-in-value",
  components: {
    'inline-svg': uktInlineSvg
  },
  data: () => ({ARROW_TYPE: ARROW_TYPE}),
  props: {
    value: {
      type: Number, required: true, default: 0
    },
    arrowColor: {type: String, default: ARROW_COLORS.NONE}
  },
  computed: {
    arrowType() {
      return this.value > 0 ? ARROW_TYPE.UP : ARROW_TYPE.DOWN;
    },
    displayValue() {
      return Math.abs(this.value);
    },
    arrowColorDisplay() {
      if (this.arrowColor === ARROW_COLORS.NONE) {
        return this.arrowType === ARROW_TYPE.UP ? ARROW_COLORS.GREEN : ARROW_COLORS.RED;
      }
      // console.log('arrow color: ', this.arrowColor, this.value);
      return this.arrowColor;
    }
  },
};
</script>

<style lang="less" scoped>
@green: #219653;
@red: #EB5757;
.main-wrapper {
  display: flex;
  align-items: center;

  h6 {
    margin-left: .3rem;
  }
}

::v-deep .green svg path {
  stroke: @green;
}

::v-deep .red svg path {
  stroke: @red;
}

.red {
  color: @red;
}

.green {
  color: @green;
}

</style>
