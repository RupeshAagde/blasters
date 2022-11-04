<template>
  <div class="panel">
    <adm-page-header
        :title="`Report History`"
        @backClick="onCancel"
        @openHelp="docRedirect"
    >
    </adm-page-header>
    <adm-no-content v-if="hasNoContent" :helper-text="`No report downloads present`"></adm-no-content>
    <div v-else class="report-body">
      <div class="report-history-body">
        <report-history-body :cards="cards"></report-history-body>
      </div>
      <div class="pagination">
        <nitrozen-pagination
            :pageSizeOptions="paginationRows"
            :value="page"
            name=""
            @change="paginationChange"
        >
        </nitrozen-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import admpageheader from '@/components/common/layout/adm-page-header';
import {WebhookHelpMixins} from "../mixins/webhook-help.mixins";
import ReportHistoryBody from "./report-history-body";
import {mapGetters} from "vuex";
import {GET_REPORT_HISTORIES, GET_REPORT_HISTORY_PAGINATION} from "@/store/getters.type";
import {
  ADMIN_CHANGE_REPORT_HISTORY_PAGINATION, ADMIN_CLEAR_TO_DEFAULTS,
  ADMIN_GET_REPORT_HISTORIES,
  ADMIN_SET_SUBSCRIBER_ID
} from "@/store/action.type";
import AdmNoContent from "@/components/common/adm-no-content";
import {NitrozenPagination} from "@gofynd/nitrozen-vue";

export default {
  name: "report-history",
  components: {
    AdmNoContent,
    ReportHistoryBody,
    'adm-page-header': admpageheader,
    'nitrozen-pagination': NitrozenPagination
  },
  mixins: [WebhookHelpMixins],
  data: () => ({
    TIME_INTERVAL: 10,
    HARD_LIMIT_INTERVAL: 100,
    currentTime: 0,
    timerId: null,
    paginationRows: [10, 25, 50, 100],
  }),
  computed: {
    ...mapGetters({
      cards: GET_REPORT_HISTORIES,
      paginationObject: GET_REPORT_HISTORY_PAGINATION
    }),
    hasNoContent() {
      return this.cards && this.cards.length === 0
    },
    page() {
      if (!this.paginationObject) {
        return {
          total: 10,
          current: 1,
          limit: 10
        };
      }
      // console.log('bounded page: ', this.paginationObject)
      return this.mapToPaginationFormat(this.paginationObject);
    }
  },
  methods: {
    fetchData() {
      this.$store.dispatch(ADMIN_GET_REPORT_HISTORIES).then(x => {
      });
    },
    fetchDataForEveryTimeInterval() {
      const context = this;
      this.timerId = setInterval(() => {
        context.fetchData();
        context.currentTime += 1;
        if (context.currentTime >= context.HARD_LIMIT_INTERVAL) {
          console.log('hard limit reached!')
          context.clearTimer();
        }
      }, this.TIME_INTERVAL * 1000)
    },
    clearTimer() {
      console.log('timer has been cleared!')
      clearInterval(this.timerId);
    },
    paginationChange(pageObject) {
      // console.log('obj: ', pageObject)
      this.$store.dispatch(ADMIN_CHANGE_REPORT_HISTORY_PAGINATION, pageObject);
    },
    mapToPaginationFormat({current, size, item_total}) {
      return {
        total: item_total,
        current,
        limit: Math.max(size, this.paginationRows[0])
      }
    },
    setSubscriberIdToStore() {
      if (this.$route.params.subscriberId) {
        this.$store.dispatch(ADMIN_SET_SUBSCRIBER_ID, this.$route.params.subscriberId);
      }
    },
    clearPresets() {
        this.$store.dispatch(ADMIN_CLEAR_TO_DEFAULTS);
    }
  },
  mounted() {
    this.setSubscriberIdToStore();
    this.fetchData();
    this.fetchDataForEveryTimeInterval();
  },
  destroyed() {
    this.clearTimer();
    this.clearPresets();
  }
}
</script>

<style lang="less" scoped>
@import './../../../less/page-header.less';
@import './../../../less/page-ui.less';

@internal-padding: 1.5rem;

.report-history-body {
  width: 100%;
  //padding: @internal-padding;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    background: #FFFFFF;
    padding: @internal-padding;
    padding-bottom:0.8rem;
    width: 94%;
  }
}

.pagination {
  width: 94%;
  background: #FFFFFF;
  margin: 0 auto;
  padding: 0 1.5rem;
  margin-bottom:1.5rem;

}


::v-deep .page-error > img {
  width: 50%;
  height: unset;
}
</style>