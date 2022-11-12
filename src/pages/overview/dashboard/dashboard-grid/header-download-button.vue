<template>
  <div class="download-wrapper" @click="download">
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
    pageName: {type: String, default: ANALYTICS_PAGES.DASHBOARD}
  },
  methods: {
    download() {
      this.$store.dispatch(ADMIN_START_COMPONENT_SPECIFIC_DOWNLOAD, {
        pageName: this.pageName,
        url: this.downloadOptions.downloadUrl
      }).then();
    }
  }
}
</script>

<style lang="less" scoped>
.download-wrapper {
  display: flex;
  justify-content: space-between;
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