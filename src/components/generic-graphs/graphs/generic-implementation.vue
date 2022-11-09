<template>
  <div>
    <graph-controls
        v-if="
                extraProps &&
                extraProps.hideGraphOptions &&
                extraProps.hideGraphOptions.display
            "
        :extraProps="extraProps"
        :chart-id="chartId"
        :page-name="pageName"
        @toggle-graph="(t) => (this.showGraph = t)"
        @reset-data="$emit('reset-data')"
    ></graph-controls>
    <div class="canvas-wrapper">
      <canvas
          :id="chartId"
          v-show="showGraphDynamically"
          :height="canvasHeight"
          ref="chartCanvas"
      />
    </div>
  </div>
</template>

<script>
import GraphFilters from "./filters";
import GraphControls from "./generic-graph-control-panel.vue";
import {Chart} from "chart.js";
import {OptionsUtil} from "../utils/optionsUtil";
import {CANVAS_HEIGHT, GRAPH_TYPES} from "../data/constants";
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default {
  name: "genericImplementation",
  components: {
    GraphFilters,
    GraphControls
  },
  data: () => ({
    showGraph: true,
    screenSize: 0,
    optionUtils: OptionsUtil,
    analyticsChart: {},
    height: 250
  }),
  props: {
    xAxes: {
      type: Array,
      required: true
    },
    yAxes: {
      type: Array,
      required: true
    },
    graphType: {type: String, default: "bar"},
    chartId: String,
    filters: {type: Object},
    extraProps: {
      type: Object,
      default() {
        return {height: 200, options: {}};
      }
    },
    dataSource: { type: String, required: true },
    pageName: {
      type: String,
    }
  },
  methods: {
    pluginLabel(){
        if(this.graphType===GRAPH_TYPES.BAR){
          return [ChartDataLabels]
        }
        return {datalabels: false}
    },
    renderGraph(xAxes, yAxes, graphType, chartId) {
      const ctx = document.getElementById(chartId).getContext("2d");
      yAxes = this.prepareYaxes(yAxes, ctx);
      let options = {
        ...this.extraProps.options, plugins: {
          datalabels: {
            formatter: function(value, context) {
          return value<1000? value : Math.round((value/1000 + Number.EPSILON) * 100) / 100 + 'k'
            },
            color: '#666666',
            anchor: 'end',
            align: 'top',
          }
        }
      };
      options = this.setOptions(options, yAxes[0].label, yAxes[0].valueFormatter, this.shouldSetMinMax(yAxes[0].data));
      this.analyticsChart = new Chart(ctx, {
        type: graphType,
        data: {
          labels: xAxes,
          datasets: yAxes
        },
        options: options,
        plugins: this.pluginLabel()
      });
    },
    addGradiantColor(ctx, gradientColor) {
      let globalContext = ctx;
      const whitecolor = "rgba(231, 238, 255, 0)";
      let linearGradient = globalContext.createLinearGradient(
          0,
          0,
          0,
          450
      );
      linearGradient.addColorStop(0.1, `${gradientColor}`);
      linearGradient.addColorStop(1, `${whitecolor}`);
      return linearGradient;
    },
    borderWidth(){
      if(this.graphType===GRAPH_TYPES.BAR){
        return { top: 1, right: 0, bottom: 0, left: 0 }
      }
      return 2
    },
    prepareYaxes(yAxes, ctx) {
      return yAxes.map((x) => ({
        ...x,
        backgroundColor: x.backgroundColor,
        borderColor: x.borderColor,
        borderWidth: this.borderWidth,
        pointBorderColor: x.borderColor,
        pointBackgroundColor: x.borderColor,
        pointHoverBackgroundColor: x.borderColor,
        hoverBackgroundColor: x.backgroundColor,
        pointHoverBorderColor: x.borderColor
      }));
    },
    shouldSetMinMax(data) {
      if (data.length <= 1) {
        return {shouldSet: true, min: 0, max: 0}
      }
      return {shouldSet: false}
    },
    setStepSizeProp(){
      return this.extraProps[this.dataSource] && !!this.extraProps[this.dataSource].stepSize
    },
    setStepSizeValue(){
      if(this.extraProps[this.dataSource]!=undefined){
        return this.extraProps[this.dataSource].stepSize
      }
      return ''
    },
    setOptions(options, title, yAxisFormatter, setMinMax = {shouldSet: false}, setStep = {
      shouldSet: this.setStepSizeProp(),
      stepSize: this.setStepSizeValue()
    }) {
      const optionsToReturn = this.optionUtils
          .set(options, this.graphType)
          .formatYaxis(yAxisFormatter)
          .toggleTicks(true)
          .formatXAxisTime();
      if (setMinMax.shouldSet) {
        optionsToReturn.setMinMax(setMinMax.min, setMinMax.max);
      }

      if (setStep.shouldSet) {
        optionsToReturn.setGraphStep(setStep.stepSize);
      }
      return optionsToReturn.get();
    }
  },
  mounted() {
    // this.graphType = 'bar';
    this.renderGraph(this.xAxes, this.yAxes, this.graphType, this.chartId);
  },
  computed: {
    getExtraProps() {
      return this.extraProps;
    },
    showGraphDynamically() {
      return this.showGraph;
    },
    canvasHeight() {
      let screenWidth = screen.width;
      let canvasHeight = 0;
      if (screenWidth < 768 && screenWidth > 360 || screenWidth < 360) {
        canvasHeight = CANVAS_HEIGHT.MOBILE;
      }
      if (screenWidth > 768) {
        canvasHeight = CANVAS_HEIGHT.LARGE_SCREEN;
      }
      return canvasHeight;
    }
  },
};
</script>

<style scoped>
.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
