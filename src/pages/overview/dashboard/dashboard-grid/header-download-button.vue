<template>
  <div :class="{'disabled': isDisabled}" class="download-wrapper" @click="download">
    <uktinlinesvg :src="'download-export'" class="download-icon"></uktinlinesvg>
    <p>{{ downloadOptions.displayText }}</p>
  </div>
</template>

<script>
import Uktinlinesvg from "@/components/common/ukt-inline-svg";
import {ADMIN_START_COMPONENT_SPECIFIC_DOWNLOAD} from "../../../../store/action.type";
import {ANALYTICS_PAGES} from "../../../../components/generic-graphs/data/constants";

export default {
  name: "header-download-button",
  components: {Uktinlinesvg},
  props: {
    downloadOptions: {type: Object, required: true},
    pageName: {type: String, default: ANALYTICS_PAGES.DASHBOARD},
    dataExistsToDownload: {type: Boolean, default: true},
    chartId: {type: String, required: true}
  },
  data: () => ({
    downloadInProgress: false
  }),
  computed: {
    isDisabled() {
      return this.dataExistsToDownload || this.downloadInProgress;
    }
  },
  methods: {
    download() {
      if (this.downloadInProgress || this.isDisabled) {
        return;
      }
      this.downloadInProgress = true;
      this.$store.dispatch(ADMIN_START_COMPONENT_SPECIFIC_DOWNLOAD, {
        pageName: this.pageName,
        url: this.downloadOptions.downloadUrl,
        chartId: this.chartId
      }).then(finished => {
        this.downloadInProgress = false;
      }).catch((err) => {
        this.downloadInProgress = false;

      })
      ;
    }
  }
}
</script>

<style lang="less" scoped>

.disabled {
  cursor: not-allowed !important;

  p {
    color: #dadada !important;
  }

  ::v-deep svg > path {
    stroke: #dadada;
  }
}

.download-wrapper {
  display: flex;
  gap: 0.4rem;
  margin-left: auto;
  padding-right: 0.2rem;
  cursor: pointer;

  p {
    /* Button/Medium */

    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 150%;
    /* identical to box height, or 21px */

    text-align: right;

    /* Brands colors/Accent */

    color: #2E31BE;
  }
}

</style>