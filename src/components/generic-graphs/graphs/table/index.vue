<template>
  <div v-if="columns && columns.length > 0 && rows && rows.length > 0">
    <table-cards v-if="shouldShowTableCards"
                 :columns="columns"
                 :rows="rows"
                 :graph-type="type"
                 :extra-props="extraProps"></table-cards>
    <div v-else class="sub-header" :data-screen="analyticPage">
      <div class="table-content">
        <table class="generic-table">
          <tr class="headers" :data-screen="analyticPage">
            <th
                v-for="(column, columnIndex) in columns"
                :key="columnIndex"
                :data-screen="analyticPage"
                class="clickable no-wrap"
                @click="sortTable(column.field)"
                :class="{'last-header': analyticPage === ANALYTICS_PAGES.DASHBOARD && columnIndex === columns.length - 1,
                 'dashboard-header': analyticPage === ANALYTICS_PAGES.DASHBOARD}"
            >
              <div class="table-header">
                {{ column.headerName }}
              </div>
            </th>
          </tr>
          <template>
            <tr
                :key="rowIndex"
                v-for="(row, rowIndex) in rows"
                class="content"
                :class="{'total-row': isTotalField(rowIndex), 'table-border-top': analyticPage === ANALYTICS_PAGES.REPORTS && rowIndex === 0}"
            >
              <td v-for="(column, idx) in columns" :key="idx"
                  :class="{'first-td-padding': column.type !== COLUMN_TYPES.IMAGE && idx === 0}"
                  :data-screen="analyticPage">
                <p v-if="column.type === COLUMN_TYPES.STRING" :style="customStyles(row, column)"
                   :class="{ 'padding-cell':analyticPage === ANALYTICS_PAGES.REPORTS}">
                  <graph-value-formatter :config="column.valueFormatter" :use-default-value-formatter="shouldUseDefaultValueFormatter(row, column)"
                                         :value="rowDataPicker(row[column.field], COLUMN_TYPES.STRING)"></graph-value-formatter>
                </p>
                <div v-if="column.type === COLUMN_TYPES.IMAGE" class="image-column" :style="customStyles(row, column)">
                  <image-container :src="imageValuePicker(row, column.field)" class="image-container"></image-container>
                  <graph-value-formatter :config="column.valueFormatter" v-if="rowDataPicker(row[column.field], COLUMN_TYPES.IMAGE)"
                                         :use-default-value-formatter="shouldUseDefaultValueFormatter(row, column)"
                                         :value="rowDataPicker(row[column.field], COLUMN_TYPES.IMAGE)"></graph-value-formatter>
                </div>
                <p v-if="column.type === COLUMN_TYPES.NUMBER" :style="customStyles(row, column)"
                   :class="{ 'padding-cell':analyticPage === ANALYTICS_PAGES.REPORTS}">
                  <graph-value-formatter :config="column.valueFormatter" :use-default-value-formatter="shouldUseDefaultValueFormatter(row, column)"
                                         :value="rowDataPicker(row[column.field], COLUMN_TYPES.NUMBER)"></graph-value-formatter>
                </p>
                <div v-if="column.type === COLUMN_TYPES.GROWTH" class="growth" :style="customStyles(row, column)"
                     :class="{ 'padding-cell':analyticPage === ANALYTICS_PAGES.REPORTS}">
                  <graph-value-formatter :config="column.valueFormatter" :value="rowDataPicker(row[column.field], COLUMN_TYPES.GROWTH)"
                                         :use-default-value-formatter="shouldUseDefaultValueFormatter(row, column)">
                  </graph-value-formatter>
                  <change-in-value class="card-metrics metrics-props"
                                   :value="row[column.field].growth_percentage"></change-in-value>
                </div>
              </td>
            </tr>
          </template>
        </table>
      </div>
      <adm-no-content
          v-if="showErrorPage"
          :helperText="'No Data Found'"
      ></adm-no-content>
      <div class="pagination" v-if="showPagination">
        <nitrozen-pagination
            v-if="showPagination"
            name=""
            @change="paginationChange"
            :value="_pageObject"
            :pageSizeOptions="paginationRows"
        >
        </nitrozen-pagination>
      </div>
    </div>
  </div>
  <div class="no-content" v-else>
    <error-handlers :error="errorText" :graph-type="graphType" :error-code="statusCode"></error-handlers>
  </div>
</template>

<script>
import {debounce} from "@/helper/utils";
import GraphArrow from "@/components/generic-graphs/change-in-value";
import {NitrozenDropdown, NitrozenInput, NitrozenPagination} from "@gofynd/nitrozen-vue";
import {ANALYTICS_PAGES, TABLE_COLUMN_TYPES, TABLE_CONFIGS, TOTAL_ROW_POSITION} from "../../data/constants";
import GraphValueFormatter from "../../graph-value-formatter";
import TableCards from "./table-cards";
import {mediaScreensMixins} from "../../../../mixins/media-screens-mixins";
import {analyticsTablePropsMixins} from "../mixins/analytics-props.mixins";
import ImageContainer from "../../responsive-image-container";
import {mapGetters} from "vuex";
import {ANALYTICS_STATE} from "../../../../store/modules/admin-analytics.module";
import {ADMIN_SAVE_PAGINATION_CHANGE} from "../../../../store/action.type";
import ErrorHandlers from "../error-handlers";

export default {
  name: "custom-table-graph",
  mixins: [mediaScreensMixins, analyticsTablePropsMixins],
  props: {
    showPagination: {type: Boolean, default: false, required: false},
    showFilters: {type: Boolean, default: false, required: false},
    graphType: {
      type: String
    }
  },
  components: {
    ErrorHandlers,
    ImageContainer,
    TableCards,
    GraphValueFormatter,
    "nitrozen-input": NitrozenInput,
    "nitrozen-dropdown": NitrozenDropdown,
    "nitrozen-pagination": NitrozenPagination,
    "change-in-value": GraphArrow,

  },
  data() {
    return {
      filter: [],
      filterData: [{text: "test", value: "test1"}],
      webhookReport: [],
      searchText: "",
      showErrorPage: false,
      query_param: {},
      paginationRows: [10, 25, 50, 100],
      pageObjectValue: {
        total: 100,
        current: 1,
        limit: 10
      },
      emptyObject: {},
      rowStyle: {
        "font-family": "Inter",
        "font-style": "normal",
        "font-weight": "normal",
        "font-size": "12px",
        "line-height": "25px",
        color: "#666666"
      },
      COLUMN_TYPES: TABLE_COLUMN_TYPES,
      TABLE_CONFIG_KEYS: TABLE_CONFIGS,
      ANALYTICS_PAGES: ANALYTICS_PAGES
    };
  },
  mounted() {
    this.pageObject(this.pageConfig);
  },
  computed: {
    ...mapGetters({
      pageConfig: ANALYTICS_STATE.PAGINATION
    }),
    shouldShowTableCards() {
      return this.isMobile && this.analyticPage === ANALYTICS_PAGES.DASHBOARD;
    },
    _pageObject: {
      get() {
        if (!this.chartId || !this.pageConfig[this.chartId])
          return {
            total: 100,
            current: 1,
            limit: 10
          }
        return this.mapToPaginationFormat(this.pageConfig[this.chartId]);
      },
      set(val) {
        this.pageObjectValue = val;
      }
    }
  },
  methods: {
    webhookInput: debounce(function (e) {
      this.query_param["search_text"] = e.search.trim();
      this.search(this.query_param);
    }, 200),
    sortTable(key) {
      this.webhookReport.sort(function (a, b) {
        const key_a = eval("a." + key);
        const key_b = eval("b." + key);
        if (key_a < key_b) return -1;
        if (key_a > key_b) return 1;
        return 0;
      });
    },
    paginationChange(pageConfigs) {
      this.$store.dispatch(ADMIN_SAVE_PAGINATION_CHANGE, {graphId: this.chartId, ...pageConfigs});
    },
    customStyles(row, column = null) {
      if (!row[TABLE_CONFIGS.BASE_KEY] || !row[TABLE_CONFIGS.BASE_KEY][TABLE_CONFIGS.STYLES]) {
        return "";
      }
      let styles = row[TABLE_CONFIGS.BASE_KEY][TABLE_CONFIGS.STYLES];
      if (row[column.field][TABLE_CONFIGS.BASE_KEY] && row[column.field][TABLE_CONFIGS.BASE_KEY][TABLE_CONFIGS.STYLES]) {
        styles = {...styles, ...row[column.field][TABLE_CONFIGS.BASE_KEY][TABLE_CONFIGS.STYLES]};
      }
      return styles;
    },
    pageObject(pageConfig) {
      if (!this.chartId || !pageConfig[this.chartId])
        return {
          total: 100,
          current: 1,
          limit: 10
        }
      this._pageObject = this.mapToPaginationFormat(pageConfig[this.chartId]);
    },
    isTotalField(rowIndex) {
      if (!this.extraProps.resultRow) {
        return false;
      }
      if (this.extraProps.resultRowPos === TOTAL_ROW_POSITION.START && rowIndex === 0) {
        return true
      }
      return this.extraProps.resultRowPos === TOTAL_ROW_POSITION.END && rowIndex === this.rows.length - 1;

    },
    shouldUseDefaultValueFormatter(row, column) {
      if (!column || !column.valueFormatter) {
        return false;
      }
      return column.valueFormatter.enableDynamicSuffix;
    }
  },
  watch: {
    pageConfig(value) {
      if (value) {
        this.pageObject(value);
      }
    }
  }
};
</script>


<style lang="less" scoped>
@import '../../../../pages/less/page-header.less';
@import '../../../../pages/less/page-ui.less';
@import "./../graph.less";

@first-table-element-padding: 1.7em;
@dashboard-table-padding: 0.5rem 0.8rem 0 0;
@image-resolution: 2rem;

.header-font {
  font-family: 'Inter', sans-serif;
  font-style: normal;
}

.word-break {
  word-break: break-all;
}

.line-break{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical;
}

.growth-percentage {
  color: #219653;
}

.growth {
  display: flex;
  gap: 5px;
  word-break: normal;
}

.image-container {
  max-width: @image-resolution;
  max-height: @image-resolution;
}

.sub-header {
  width: 100%;
  margin-block: 1rem 0.3rem;
}

.filter {
  padding-bottom: 16px;
  display: inline-block;
  width: 100%;
}

.search {
  align-self: flex-end;
  margin-right: 10px;
  margin-bottom: 20px;
  width: 100%;
  float: left;
}

.filter-dynamic {
  align-items: flex-end;
  display: flex !important;
  display: inline-block;
  width: 100%;
  gap: 10px;
}

.filter-dropdown-field {
  display: contents;
}

.filter-dropdown {
  align-self: flex-end;
  min-width: 30%;
  display: flex;
  float: left;
}

.table-content {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-sizing: border-box;
}

.generic-table {
  width: 100%;
  font-family: Inter, sans-serif;
  font-size: 10px;

  ::v-deep .eye-icon > svg {
    width: 16px;
    height: 16px;

    #prefix__Eye_Open {
      stroke: @Mako;
    }

    &:hover {
      box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);

      #prefix__Eye_Open {
        stroke: @RoyalBlue;
      }
    }
  }

  .headers[data-screen='REPORTS'] {
    height: 2.8rem;
  }

  .headers[data-screen='DASHBOARD'] {
    height: 1.9rem;
  }

  .generic-table tr:first-child td {
    padding-left: @first-table-element-padding;
  }

  .headers .last-header {
    padding-left: 0;
  }

  // common styles for reports and dashboard
  .headers th {
    vertical-align: middle;
  }

  .headers > th[data-screen='REPORTS'] {
    .header-font();
    font-weight: 600;
    font-size: 12px;
    line-height: 17px;
    color: #41434C;
    background: #f8f8f8;
    padding-right: @first-table-element-padding;
  }

  .headers > th[data-screen='REPORTS']:first-child {
    padding-left: @first-table-element-padding;
  }

  .headers > th[data-screen='DASHBOARD'] {
    .header-font();
    font-weight: 400;
    font-size: 14px;
    line-height: 25px;
    color: #666666;
    background: #fff;
  }

  .headers > th[data-screen='DASHBOARD']:nth-child(1) {
    width: 55%;
  }

  .headers > th[data-screen='DASHBOARD']:nth-child(2) {
    width: 30%;
  }

  th .table-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  tr:not(:first-child) {
    border-bottom: 1px solid lightgray;
  }

  td {
    text-align: left;
    font-size: 12px;
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 400;
    line-height: 17px;
    color: #41434c;
    .actions-container {
      display: flex;
      align-items: center;

      .current-default {
        text-align: right;
        color: #2e31be;
        border: 1px solid #2e31be;
        padding: 5px;
      }

      .action {
        cursor: pointer;
        margin-right: 12px;
      }

      span:nth-child(1) {
        color: #2e31be;
        flex: 4;
      }

      span:nth-child(2) {
        flex: 1;
      }
    }

    .image-column {
      display: flex;
      gap: .8em;
      justify-content: flex-start;
    }
  }

  td[data-screen='DASHBOARD'] {
    vertical-align: top;
    min-width: 5rem;

    .image-column {
      align-items: flex-start;

      span {
        padding: 0rem 0.8rem 0 0;;
        .word-break();
      }

      .image-wrapper {
        padding-block: 0.3rem;
      }

      & > p {
        .word-break();
      }
    }
    span{
      .line-break();
    }
    span:hover{
    background-color: inherit;
    contain: paint;
    display: flex;
    min-width: 50%;
    }
  }

  td[data-screen='DASHBOARD']:not(:first-child) {
    padding: @dashboard-table-padding;
    .word-break();
  }

  td[data-screen='REPORTS'] {
    vertical-align: middle;
    padding-right: 0.8em;
    max-width: 25rem;

    .image-column {
      align-items: center;

      .image-wrapper {
        padding-left: @first-table-element-padding;
      }

      span {
        word-break: break-all !important;
      }
    }

    span {
      .text-overflow();
      white-space: normal;
      .word-break();
      .line-break();
    }
    span:hover{
    background-color: inherit;
    contain: paint;
    display: flex;
    min-width: 50%;
  }

    @media @mobile {
      & > * {
        padding-right: @first-table-element-padding;
      }
    }
  }

  .first-td-padding {
    padding-left: @first-table-element-padding;
  }

}

.clickable {
  cursor: pointer;
  font-size: 14px;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
}

.clickable-payload {
  cursor: pointer;
  color: #1a73ea;
  text-decoration: underline;
}

.no-wrap {
  white-space: nowrap;
}

.image-column > span {
  max-width: 100%;
  margin-block: 0.8em;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.padding-cell {
  padding-block: 0.8rem;
}

.total-row {
  & > td {
    font-size: 12px;
    background-color: #F5F8FF;
    color: #41434C;
    font-weight: 600;

    &:first-child {
      color: #666666;
    }

    & > .image-column > span {
      padding-left: @first-table-element-padding;
    }
  }

}

.table-border-top {
  border-top: 1px solid #E0E0E0
}

</style>
