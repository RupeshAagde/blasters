<template>
  <div class="progress-bar-container">
    <single-row v-for="(item, i ) in getGraphData" :key="i"
                :change-in-percentage="item.changeInPercentage"
                :opacity="getOpacity(item.percentage)"
                :name="item.name" :percentage="item.percentage"></single-row>
  </div>
</template>

<script>
import SingleRow from "@/components/generic-graphs/graphs/progress-bar-graph/single-row";
import { PROGRESS_BAR_OPACITY_OFFSET } from "../../data/constants";

export default {
  name: "progress-bar-graph",
  components: { SingleRow },
  props: {
    xAxes: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    yAxes: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    graphType: { type: String, default: "bar" },
    chartId: String
  },
  computed: {
    getGraphData() {
      return this.xAxes.map((x, index) => ({
        name: x,
        percentage: this.yAxes[index].value,
        changeInPercentage: this.yAxes[index].changeInValue
      }));
    }
  },
  methods: {
    getOpacity(percentage) {
      percentage += PROGRESS_BAR_OPACITY_OFFSET;
      return Math.abs(percentage/ 100);
    }
  }
};
</script>

<style scoped lang="less">
.progress-bar-container {
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 25px;
  color: #666666;
  @media @mobile{
    padding: 0;
  }

}

@media (max-width: 480px) {
  .progress-bar-container > .row {
    grid-template-columns: 24% 37% 17% 20%;
  }
}
</style>
