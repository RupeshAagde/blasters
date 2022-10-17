<template>
  <div class="container">
    <show-more-filters-popup ref="more-filters" :filters-to-show="filtersToShow"
                             :title="'Selected Filters'"></show-more-filters-popup>
    <adm-inline-svg :src="'csv-file2'" class="csv-img"></adm-inline-svg>
    <div class="container-body">
      <div class="body-heading">
        <p>{{ displayCard.filename }}</p>
        <div  v-if="isSuccess" class="extra-controls">
          <div @click="onCopy" class="clickable">
            <adm-inline-svg src="copy"></adm-inline-svg>
          </div>
          <div @click="onDownload" class="clickable">
            <adm-inline-svg src="download"></adm-inline-svg>
          </div>
        </div>
      </div>
      <p :class="colorCode">{{ displayCard.message }}</p>
      <p>
        {{ displayCard.filters | limitFilters(FILTER_LIMIT) }}
        <span v-if="limitObject.hasExceeded" class="show-more clickable" @click="onShowMore"> +{{ limitObject.exceededQuantity }} more</span>
      </p>
    </div>
    <div :class="colorCode" class="status">
      <span class="tags">
      {{ displayCard.status | formatStatus }}
      </span>
      <div v-if="isProcessing" class="cross-wrapper clickable" @click="onCancelReport">
        <adm-inline-svg src="cross-black"></adm-inline-svg>
      </div>
    </div>
  </div>

</template>

<script>
import admInlineSvg from "@/components/common/adm-inline-svg";
import pick from "lodash/pick";
import {FILTER_KEYS_TO_SHOW, REPORT_HISTORY_STATUS} from "../utils/constants";
import values from "lodash/values";
import {copyToClipboard} from "@/helper/utils";
import ShowMoreFiltersPopup from "./show-more-filters-popup";
import cloneDeep from "lodash/cloneDeep";
import {ADMIN_CANCEL_WEBHOOK_REPORT} from "@/store/action.type";
import {mapGetters} from "vuex";
import {GET_SUBSCRIBER_ID_MAP} from "@/store/getters.type";

export default {
  name: "report-history-card",
  props: {card: {type: Object}, index: {type: Number, required: true}},
  components: {ShowMoreFiltersPopup, 'adm-inline-svg': admInlineSvg},
  data: () => ({
    FILTER_LIMIT: 5,
  }),
  filters: {
    formatStatus(value) {
      if (value === REPORT_HISTORY_STATUS.SUCCESS) {
        return 'SUCCESS'
      }
      return value
    },
    limitFilters(value, limit) {
      if (value.length > limit) {
        return value.slice(0, limit).join(', ')
      }
      return value.join(', ')
    },
  },
  computed: {
    ...mapGetters({
      subscriberIdMap: GET_SUBSCRIBER_ID_MAP
    }),
    displayCard() {
      return {
        message: this.card.message || 'nothing...',
        filename: this.card.filename || 'nothing...',
        filters: this.buildFilters(this.card.filters),
        status: this.card.status || 'nothing...',
        url: this.card.upload_service_response && this.card.upload_service_response.cdn && this.card.upload_service_response.cdn.url && this.card.upload_service_response.cdn.url
      }
    },
    filtersToShow() {
      const filtersToShow = cloneDeep(this.card.filters);
      if (filtersToShow.subscribers) {
        filtersToShow.subscribers = filtersToShow.subscribers.map(id => this.subscriberIdMap[id] ? this.subscriberIdMap[id] : id);
      }
      return filtersToShow;
    },
    colorCode() {
      return this.displayCard.status.toLowerCase();
    },
    limitObject() {
      const filterLength = this.displayCard.filters.length;
      return {hasExceeded: filterLength > this.FILTER_LIMIT, exceededQuantity: filterLength - this.FILTER_LIMIT}
    },
    isSuccess() {
      return this.displayCard.status === REPORT_HISTORY_STATUS.SUCCESS;
    },
    isProcessing() {
      return this.displayCard.status === REPORT_HISTORY_STATUS.PROCESSING;
    }
  },
  methods: {

    buildFilters(filters) {
      return values(pick(filters, FILTER_KEYS_TO_SHOW)).reduce((acc, item) => {
        acc.push(...item.map(elem => {

          if (typeof elem === 'object') {
            return elem.event_name;
          }
          if ((typeof elem).toLowerCase() === 'string') {
            return '' + elem;
          }
          if (!isNaN(elem)){
            return this.subscriberIdMap[elem] ? this.subscriberIdMap[elem] : elem;
          }
          if (Array.isArray(elem)) {
            elem.join(', ')
          }

        }));
        return acc;
      }, [])
    },
    onDownload() {
      console.log('download called!')
      window.open(this.displayCard.url);
    },
    onCopy() {
      copyToClipboard(this.displayCard.url);
      this.$snackbar.global.showInfo('Copied url to clipboard', 1000);
    },
    onShowMore() {
      this.$refs['more-filters'].open();
    },
    onCancelReport() {
      this.$store.dispatch(ADMIN_CANCEL_WEBHOOK_REPORT, {index: this.index, filename: this.displayCard.filename})
    }
  }
}
</script>

<style lang="less" scoped>

@success: #0A5F23;
@cancelled: #9B9B9B;
@processing: #2E31BE;
@failed: red;

@container-image-width: 7%;
@container-text-width: 77%;

.clickable{
  cursor: pointer;
}

.completed {
  color: @success;
  border-color: @success;
}

.cancelled {
  color: @cancelled;
  border-color: @cancelled;
}

.processing {
  color: @processing;
  border-color: @processing;
}

.failed {
  color: @failed;
  border-color: @failed;
}

.container {
  /* white */

  background: #FFFFFF;
  /* Divider,Stroke or Highlighters / Divider or Stroke */

  border: 1px solid #E0E0E0;
  border-radius: 8px;
  display: flex;
  gap: 0.9rem;
  padding: 0.8em;

  //cursor: pointer;
  flex-wrap: wrap;


  .csv-img {
    width: @container-image-width;
  }

  .container-body {
    width: @container-text-width;

    p, div p {
      font-family: 'Inter', serif;
      font-style: normal;
      font-size: 0.9rem;

      & > span > span {
        color: #2E31BE !important;
      }
    }

    .body-heading {
      display: flex;
      gap: 1rem;
      align-items: center;

      .extra-controls {
        display: flex;
        gap: 1rem;
        align-items: center;
        height: 0.4rem;

        span {
          width: 1.37rem;
        }
      }
    }

    div p {
      color: #000000;
      font-weight: 600;
      line-height: 130%;
    }

    p:nth-child(2) {
      font-weight: 400;
      line-height: 140%;
      margin-block: 0.6rem;
    }

    p:nth-child(3) {
      color: #9B9B9B;

      .show-more {
        color: @processing;
      }
    }
  }

  .status {
    width: calc(100% - (@container-text-width + @container-image-width + 3%));
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: #FFFFFF;
    gap: 0.4rem;
    @media @mobile {
      margin-left: auto;
      width: max-content;
    }

    .cross-wrapper {
      border: 1px solid #8F8F8F;
      border-radius: 3px;
      padding-inline: 0.25em;

      span {
        width: 0.8rem;
      }
    }

    .tags {
      border-radius: 8px;
      border: 1px solid;
      padding: 0.2em 0.7em;
      font-family: 'Inter', serif;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 160%;
      min-width: 60%;
      text-align: center;
      @media @mobile {
        min-width: max-content;
      }
    }
  }
}
</style>