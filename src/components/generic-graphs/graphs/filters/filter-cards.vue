<template>
  <div
      class="filter-card-container"
      :class="{ 'is-active': card.isSelected }"
      @click="onFilterClick()"
  >
    <!--    <span v-html="moveIcon" class="move-icon" v-if="!isMobile"></span>-->
    <div v-if="card.isClosable" class="remove-icon" @click.stop="onClose($event)">
      <inline-svg src="remove-icon"></inline-svg>
    </div>
    <div class="card-name-wrapper">
      <h4>
        {{ card.name }}
      </h4>
      <nitrozen-tooltip
          :position="toolTipPosition"
          icon="help"
          class="questionmark-icon tool-tip-control"
          :class="isLastCard ? 'last-card' : ''"
      >
        <p>{{ card.toolTip }}</p>
      </nitrozen-tooltip>
    </div>
    <filter-metrics :card="card" :card-index="cardIndex"></filter-metrics>
  </div>
</template>

<script>
import {NitrozenTooltip} from "@gofynd/nitrozen-vue";
import GraphArrow from "../../change-in-value";
import GraphValueFormatter from "../../graph-value-formatter";
import {mediaScreensMixins} from "../../../../mixins/media-screens-mixins";
import FilterMetrics from "./filter-metrics";
import uktInlineSvg from "../../../common/ukt-inline-svg";

export default {
  name: "filter-card",
  mixins: [mediaScreensMixins],
  components: {
    FilterMetrics,
    GraphValueFormatter,
    "nitrozen-tooltip": NitrozenTooltip,
    "change-in-value": GraphArrow,
    'inline-svg': uktInlineSvg
  },
  emits: {
    "on-filter-click": null,
    "on-close": null
  },
  props: {
    card: {type: Object, required: true},
    cardIndex: {type: Number, required: true},
    isLoading: {type: Boolean, required: true},
    isLastCard: {type: Boolean, required: true},
  },
  methods: {
    onFilterClick() {
      // console.log("on filter click child triggered", this.card.isSelected);
      if (this.isLoading || this.card.isSelected) {
        return;
      }
      this.card.isSelected = true;
      this.$emit("on-filter-clicked", {
        index: this.cardIndex,
        chartUrl: this.card.chartUrl,
        navLink: this.card.navlink
      });
    },
    onClose() {
      // console.log('on close child triggered');
      this.$emit("on-close", this.card.cardIndex);
    }
  },
  computed: {
    toolTipPosition() {
      return 'top';
    }
  }
};
</script>

<style lang="less" scoped>
@primary-gray: #dadada;
@font-gray: #828282;
@card-padding-mobile: 0.5em;
@card-padding-desktop: 0.7em;
::v-deep .questionmark-icon > .nitrozen-inline-svg > svg > path {
  stroke: @primary-gray;
}

::v-deep .last-card .nitrozen-tooltip-top {
  left: -124%;
}

::v-deep .last-card .nitrozen-tooltiptext {
  left: -124%;
  padding: 10px;
}

::v-deep .last-card .nitrozen-tooltip-top:after {
  left: 55%;
}

.filter-card-container {
  padding: calc(@card-padding-desktop - 0.2em) 0 @card-padding-desktop 0.8em;
  flex: 1;
  border-radius: 4px;
  border: 1px solid #dadada;
  cursor: pointer;
  position: relative;
  @media @mobile {
    //width: 70vw;
    max-width: none;
    min-width: max-content;
    padding-block: @card-padding-mobile;
    padding-inline: @card-padding-mobile 1.8em;
  }
}

.filter-card-container h4 {
  font-family: Inter, sans-serif;
  font-size: 12px;
  line-height: 18px;
  color: @font-gray;
}

.is-active {
  background: #e7eeff;
  border: 1px solid #2e31be;
}

.remove-icon {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(-10px, 10px);
}

.move-icon {
  position: absolute;
  top: 50%;
  left: 8%;
  transform: translateY(-18px);
}

.card-name-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

::v-deep .nitrozen-tooltip-bottom {
  //left: -200%;
}

</style>
