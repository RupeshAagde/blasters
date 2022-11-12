<template>
  <div class="card-content-main">
    <div class="header">
      <inline-svg v-if="!isHeaderCard" :src="'move-icon'" class="draggable-icon"></inline-svg>
      <div
          v-if="card.heading"
          class="header-text"
      >
        {{ card.heading }}
      </div>
      <nitrozen-tooltip
          v-if="card.heading"
          icon="help"
          class="questionmark-icon"
          :position="toolTipPosition"
      >
        <p>
          {{ card.toolTipInfo }}
        </p>
      </nitrozen-tooltip>
      <div
          v-if="!isHeaderCard && card.navlink !== null && !isCardEmpty"
          class="detail-link"
          @click="redirect"
      >
        See more
      </div>
   <header-download-button v-if="hasDownloadOption" :download-options="this.card.graphInfo.download"></header-download-button>
    </div>
    <div
        v-if="card.growth"
        class="growth-factor-wrapper"
    >
      <growth-factor :growth="card.growth" :card-index="cardIndex"></growth-factor>
    </div>
  </div>
</template>

<script>

import {NitrozenTooltip} from "@gofynd/nitrozen-vue";
import UktInlineSvg from "@/components/common/ukt-inline-svg";
import GrowthFactor from "../growth-factor";
import {ADMIN_CLONE_GLOBAL_FILTERS, ADMIN_SAVE_FILTERS, ADMIN_SET_ACTIVE_TAB} from "@/store/action.type";
import {ANALYTICS_PAGES, HTTP_STATUS_CODES} from "@/components/generic-graphs/data/constants";
import {getRedirectionUrl} from "../utils/redirect.util";
import {mediaScreensMixins} from "@/mixins/media-screens-mixins";
import HeaderDownloadButton from "./header-download-button";

export default {
  name: "dashboard-grid-header",
  mixins: [mediaScreensMixins],
  components: {HeaderDownloadButton, GrowthFactor, "inline-svg": UktInlineSvg, "nitrozen-tooltip": NitrozenTooltip},
  methods: {
    redirect() {
      const navLink = "reports"
      // console.log("navlink: ", this.card.navlink);
      this.$store.dispatch(ADMIN_SAVE_FILTERS, {
        pageName: ANALYTICS_PAGES.REPORTS,
        graphFilter: this.card.navlink.filter_id,
      }).then(y => {
        this.$store.dispatch(ADMIN_SET_ACTIVE_TAB, this.card.navlink.tab).then(x => {
          this.$store.dispatch(ADMIN_CLONE_GLOBAL_FILTERS, {
            to: ANALYTICS_PAGES.REPORTS,
            from: ANALYTICS_PAGES.DASHBOARD
          }).then(z => {
            // console.log('route: ', getRedirectionUrl(this.$basePath, navLink, this.$route));
            this.$router.push({
              path: getRedirectionUrl(this.$basePath, navLink, this.$route)
            });
          });
        })
      });
    },
  },
  props: {
    card: {
      type: Object, required: true, default() {
        return {navLink: {}, heading: ""};
      }
    },
    isHeaderCard: {type: Boolean, default: true},
    cardIndex: {type: Number, required: true}
  },
  computed: {
    toolTipPosition() {
      return this.isMobile ? 'left' : 'top';
    },
    isCardEmpty() {
      return this.card && this.card.graphInfo && this.card.graphInfo.statusCode !== HTTP_STATUS_CODES.SUCCESS;
    },
    hasDownloadOption() {
      return !!this.card.graphInfo.download;
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 0.25em;
  /*margin: 20px 0 0 20px;*/
}

.header-text {
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: #41434c;
  align-self: center;
}

.detail-link {
  cursor: pointer;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  color: #2e31be;
  margin-left: auto;
}

::v-deep .questionmark-icon > .nitrozen-inline-svg > svg > path {
  stroke: #dadada;
}

.questionmark-icon {
  margin-top: 4px;
}

.draggable-icon {
  cursor: move;
}

.card-content-main {
  /*margin-bottom: 2vh;*/
}

::v-deep .nitrozen-tooltip-bottom {
  /*left: -200%;*/
}
</style>
