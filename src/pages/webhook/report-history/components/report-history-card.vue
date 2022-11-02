<template>
  <div class="container">
    <show-more-filters-popup ref="more-filters" :filters-to-show="filtersToShow"
                             :title="'Selected Filters'"></show-more-filters-popup>
    <show-all-download-popup ref="show-all-download" :filedata-to-show="filedataToShow" :title="'Webhook Report Files'"></show-all-download-popup>
    <adm-inline-svg :src="'csv-file2'" class="csv-img"></adm-inline-svg>
    <div class="container-body">
      <div class="body-heading">
        <p>{{ displayCard.filename }} </p>
        <div v-if="isSuccess" class="extra-controls">
          <div @click="onCopy" class="clickable" v-if="!isMultipleDownloadExists">
            <adm-inline-svg src="copy"></adm-inline-svg>
          </div>
          <div @click="onDownload" class="clickable">
            <inline-svg src="download"></inline-svg>
          </div>
        </div>
      </div>
      <p :class="colorCode">{{ displayCard.message }} <span class="date">
          <span class="created-on">Started On:</span>
          <span>{{ formatDate(displayCard.created_on) }}</span>
        </span></p>
      <div class="tags-wrapper">
        <div class="tags-container">
          <span v-for="(tag, index) in displayCard.filters " ref="dynamic-tags" class="dynamic-tags">{{ tag | addComma(index) }}</span>
        </div>
        <span v-if="exceededQuantity > 0" class="show-more clickable" @click="onShowMore"> ...+{{ exceededQuantity }} more</span>
      </div>
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
import inlineSvg from "@/components/common/inline-svg.vue"
import pick from "lodash/pick";
import {FILTER_KEYS_TO_SHOW, REPORT_HISTORY_STATUS} from "../utils/constants";
import values from "lodash/values";
import {copyToClipboard} from "@/helper/utils";
import ShowMoreFiltersPopup from "./show-more-filters-popup";
import ShowAllDownloadPopup from './show-all-download-popup';

import cloneDeep from "lodash/cloneDeep";
import {ADMIN_CANCEL_WEBHOOK_REPORT} from "@/store/action.type";
import {mapGetters} from "vuex";
import {GET_SUBSCRIBER_ID_MAP} from "@/store/getters.type";
import keys from "lodash/keys";
import {dynamicTagsCountMixins} from "../mixins/dynamic-tags-count.mixins";
import moment from 'moment'

export default {
  name: "report-history-card",
  props: {card: {type: Object}, index: {type: Number, required: true}},
  mixins: [dynamicTagsCountMixins],
  components: {ShowAllDownloadPopup,ShowMoreFiltersPopup, 'adm-inline-svg': admInlineSvg, 'inline-svg':inlineSvg},
  data: () => ({
    FILTER_LIMIT: 5,
    exceededQuantity: 0
  }),
  filters: {
    formatStatus(value) {
      if (value === REPORT_HISTORY_STATUS.SUCCESS) {
        return 'SUCCESS'
      }
      return value
    },
    addComma(value, index) {
      if (index === 0) {
        return value.trim();
      }
      return ', ' + value.trim();
    }
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
        urls: this.card.upload_service_response && this.card.upload_service_response.cdn && this.card.upload_service_response.cdn.urls,
        created_on : this.card.created_on
      }
    },
    filtersToShow() {
      const filters = cloneDeep(this.card.filters);
      const order = ['events', 'start_date', 'end_date', 'subscribers'];
      const filtersToShow = keys(filters).sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b);
      }).reduce((acc, key) => {
        acc[key] = filters[key];
        return acc;
      }, {});
      if (filtersToShow.subscribers) {
        filtersToShow.subscribers = filtersToShow.subscribers.map(id => this.subscriberIdMap[id] ? this.subscriberIdMap[id] : id);
      }
      return filtersToShow;
    },
    filedataToShow() {
     const data =
      this.displayCard &&
      this.displayCard.urls &&
                this.displayCard.urls.reduce((previousdata, currentdata) => {
                    previousdata[currentdata.name] = currentdata.url;
                    return previousdata;
                }, {});
            return data;
    },
    colorCode() {
      return this.displayCard.status.toLowerCase();
    },
    isSuccess() {
      return this.displayCard.status === REPORT_HISTORY_STATUS.SUCCESS;
    },
    isMultipleDownloadExists() {
            return this.displayCard.urls && this.displayCard.urls.length > 1;
    },
    isProcessing() {
      return this.displayCard.status === REPORT_HISTORY_STATUS.PROCESSING;
    },
  },
  methods: {
    formatDate(date){
      return moment(date).format('MMM Do, YY h:mm A');
    },
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
      const filedata = this.displayCard.urls;
      console.log("----filedata",filedata);
      if (filedata.length === 1) {
        window.open(filedata[0].url);
      } else 
      this.$refs['show-all-download'].open();
    },
    onCopy() {
      copyToClipboard(this.displayCard.urls[0].url);
      this.$snackbar.global.showInfo('Copied url to clipboard', 1000);
    },
    onShowMore() {
      this.$refs['more-filters'].open();
    },
    onCancelReport() {
      this.$store.dispatch(ADMIN_CANCEL_WEBHOOK_REPORT, {index: this.index, filename: this.displayCard.filename})
    },
    limitFilters(value, limit) {
      if (value.length > limit) {
        return value.slice(0, limit);
      }
      return value;
    },
  },
  mounted() {
    this.exceededQuantity = this.calculateTagsOrientation();
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

    @media (max-width: 1357px) {
      width: 91%;
    }

    p, div p {
      font-family: 'Inter', serif;
      font-style: normal;
      font-size: 0.9rem;
      line-height: 150%;
    }

    .body-heading {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;

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

    .tags-wrapper {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      font-size: 0.875rem;

      .tags-container {
        color: #9B9B9B;
        width: 80%;
      }
      .dynamic-tags {
        width: max-content;
        //overflow: hidden;
        white-space: nowrap;
        height: 1.5rem;
      }

      .show-more {
        color: @processing;
        width: 10%;
        box-shadow: -28px 0 15px 6px #fff;
      }

      .tags-container {
        display: flex;
        overflow-x: hidden;
        //width: 10rem;
        //height: 2rem;
      }
    }
    .status-date{
    display: flex;
  }
  }

  .status {
    width: 9rem;
    //width: calc(100% - (@container-text-width + @container-image-width + 3%));
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #FFFFFF;
    gap: 0.4rem;
    @media @mobile {
      margin-left: auto;
      width: max-content;
    }

    @media (min-width: 1428px){
      justify-content: flex-end;
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
.date{
  color: @cancelled !important;
  margin-left: 1rem;
  span{
    font-size: 0.725rem;
  }
}
::v-deep .csv-img rect{
    fill: @processing;
}
</style>