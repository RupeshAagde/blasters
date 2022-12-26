<template>
  <div class="page-slot">
    <!-- <div class="date-text">Date Range</div> -->
    <div class="date">
      <date-picker
          label="Select Date Range"
          class="date-picker filter-input-sm"
          picker_type="date"
          :date_format="dateFormat"
          :clearable="false"
          v-model="orderDateRange"
          :range="true"
          :not_before="notBefore"
          :not_after="new Date().toISOString()"
          :useNitrozenTheme="true"
          @input="dateRangeChange"
          :shortcuts="dateRangeShortcuts"
      />
    </div>
    <div
        v-if="show_from_date && show_to_date && shouldShow"
        class="date-text"
    >
      Compared to {{ show_from_date }} -
      {{ show_to_date }}
    </div>
  </div>
</template>

<script>
import moment from "moment";
import DatePicker from "@/components/common/date-picker.vue";
import {ANALYTICS_PAGES} from "@/components/generic-graphs/data/constants";
import {
  API_DATE_FORMAT,
  COMPARE_DATE_OFFSET,
  DATE_FORMAT,
  DATE_RANGE_LOWER_LIMIT,
  DATE_RANGE_IN_DAYS
} from "@/constants/chart/dashboardConstants";
import {ADMIN_RESET_ALL_REFRESH_TOKENS, ADMIN_SAVE_FILTERS} from "@/store/action.type";
import {ANALYTICS_STATE,
  FILTER_TYPES,
  GLOBAL_FILTERS_MODEL
} from "@/store/modules/admin-analytics.module";
import {mapGetters} from "vuex";
import {GET_ALL_FILTERS} from "@/store/getters.type";
import {dateRangeShortcuts} from '@/helper/datetime.util';

export default {
  name: "date-range-filter",
  props: {
    pageName: {type: String, required: true, default: ANALYTICS_PAGES.DASHBOARD}
  },
  components: {
    DatePicker
  },
  data: () => ({
    orderDateRange: [
      moment().subtract(DATE_RANGE_IN_DAYS, "days").toISOString(),
      moment().toISOString()
    ],
    notBefore: moment().subtract(DATE_RANGE_LOWER_LIMIT, "days").toISOString(),
    dateFormat: DATE_FORMAT,
    excludedShortcuts: ['Last 15 days', 'Last 3 Months', 'Last Week', 'Last Month'],
    includedShortcuts: [{
      text: 'Yesterday',
      start: moment().subtract(1, "day"),
      end: moment().subtract(1, "day"),
      index: 1
    }],
    shouldShow : false
  }),
  methods: {
    dateRangeChange(shouldResetTokens = true) {
      this.$store.dispatch(ADMIN_SAVE_FILTERS, {
        pageName: this.pageName,
        globalFilters: {
          [GLOBAL_FILTERS_MODEL.START_DATE]: moment(this.orderDateRange[0]).format(API_DATE_FORMAT),
          [GLOBAL_FILTERS_MODEL.END_DATE]: moment(this.orderDateRange[1]).format(API_DATE_FORMAT),
          [GLOBAL_FILTERS_MODEL.COMPARE_START_DATE]: moment(this.show_from_date, this.dateFormat).format(API_DATE_FORMAT),
          [GLOBAL_FILTERS_MODEL.COMPARE_END_DATE]: moment(this.show_to_date, this.dateFormat).format(API_DATE_FORMAT)
        }
      });
      if (shouldResetTokens) {
        this.$store.dispatch(ADMIN_RESET_ALL_REFRESH_TOKENS, {toggle: true, page: this.pageName});
      }
    },
    loadDateFromStore() {
      const page = this.pageName === ANALYTICS_PAGES.DASHBOARD ? ANALYTICS_STATE.DASHBOARD_FILTERS : ANALYTICS_STATE.REPORT_FILTERS;
      const dateFilters = this.filters[page][FILTER_TYPES.GLOBAL_FILTERS];
      if (dateFilters && dateFilters[GLOBAL_FILTERS_MODEL.START_DATE] && dateFilters[GLOBAL_FILTERS_MODEL.END_DATE]) {
        this.orderDateRange = [moment(dateFilters[GLOBAL_FILTERS_MODEL.START_DATE], API_DATE_FORMAT).toISOString(),
          moment(dateFilters[GLOBAL_FILTERS_MODEL.END_DATE], API_DATE_FORMAT).toISOString()];
        return;
      }
      this.dateRangeChange();
    }
  },
  computed: {
    ...mapGetters({
      filters: GET_ALL_FILTERS
    }),
    show_to_date() {
      return moment(this.orderDateRange[0]).subtract(COMPARE_DATE_OFFSET, "day").format(this.dateFormat);
    },
    show_from_date() {
      const diff = moment(this.orderDateRange[1]).diff(moment(this.orderDateRange[0]), "days");
      return moment(this.orderDateRange[0]).subtract(diff + COMPARE_DATE_OFFSET, "days").format(this.dateFormat);
    },
    dateRangeShortcuts() {
      if (!this.includedShortcuts || !this.excludedShortcuts) {
        return [];
      }
      const dateRange = dateRangeShortcuts.filter(x => !this.excludedShortcuts.includes(x.text));
      this.includedShortcuts.forEach(item => {
        dateRange.splice(item.index, 0, item);
      })
      return dateRange
    },
  },
  mounted() {
    this.loadDateFromStore();
  }
};
</script>

<style scoped lang="less">
@import "../../../pages/overview/dashboard/some-common.less";

::v-deep .date-picker .n-input-label {
  display: none;
}

.date-text {
  align-self: center;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 23px;
  color: #41434c;

  opacity: 0.7;
}

.date {

  min-width: @date-min-width;

}


.page-slot {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  @media @sm {
    gap: 0;
    .date {
      width: 100% !important;
      order: 3;
    }

    .date-text:first-child {
      margin-bottom: 0.7em;
    }

    .date-text:last-child {
      order: 2;
      margin-left: auto;
      font-size: 0.6rem;
    }

    .date-text {
      opacity: 0.5;
    }
  }
}
@media only screen and (min-width: 481px) and (max-width: 768px) {
  .page-slot{
    width: 36rem;
  }
}

</style>
