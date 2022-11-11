<template>
    <div class="table-top">
        <table>
          <tr class="table-head">
            <th v-for="(column, columnIndex) in columns" :key="columnIndex" scope="col">
              <div class="table-head-content">
                {{ column.headerName }}
              </div>
            </th>
          </tr>
          <tr v-for="(row, rowIndex) in modifiedRows" :key="rowIndex" class="ninja-table-content">
            <td v-if="row.collapse" :class="{'hidden': !rowMap[row.id]}" class="bg-color" colspan="9">
              <div class="collapse-wrapper">
                <div v-for="item in row.fields">
                  <p class="heading mb-half-rem">{{ item.name }}</p>
                  <p class="content">{{ item.value }}</p>
                </div>
              </div>
            </td>
            <td v-for="(column, idx) in columns" v-else :key="idx">
              <!--              first column with arrow-->
              <div v-if="idx === 0 && hasCollapse(row)" class="table-content-content cp"
                   @click="toggleRow(row.id)">
                <ukt-inline-svg :class="{'rotate': rowMap[row.id]}" src="keyboard_arrow_right"
                ></ukt-inline-svg>
                <span class="first-arrow-content">{{ row[column.field] }}</span>
                <!--              If  has more details let this be collapsable-->
                <p :class="{'hidden': column.type !== TABLE_COLUMN_TYPES.COLLAPSE && hasOtherRidersInfo(row)}"
                   class="view-more-text cp"
                   @click="toggleRow(row.id)">
                  View {{ !rowMap[row.id] ? 'More' : 'Less' }}
                </p>
              </div>

              <!--              if the value is array     -->
              <div v-else-if="Array.isArray( row[column.field])" class="table-content-content">
                <p v-for="index in row[column.field]" :key="index" class="mb-half-rem">{{ index }}</p>
                <!--              If  has more details let this be collapsable-->
                <p :class="{'hidden': column.type !== TABLE_COLUMN_TYPES.COLLAPSE && hasOtherRidersInfo(row)}"
                   class="view-more-text cp"
                   @click="toggleRow(row.id)">
                  View {{ !rowMap[row.id] ? 'More' : 'Less' }}
                </p>
              </div>

              <!--              value is string       -->
              <div v-else-if="column.type === TABLE_COLUMN_TYPES.STRING" class="table-content-content">

                <p>{{ row[column.field] }}</p>
                <!--              If  has more details let this be collapsable-->
                <p :class="{'hidden': column.type !== TABLE_COLUMN_TYPES.COLLAPSE && hasOtherRidersInfo(row)}"
                   class="view-more-text cp"
                   @click="toggleRow(row.id)">
                  View {{ !rowMap[row.id] ? 'More' : 'Less' }}
                </p>

              </div>

              <!--              icon type             -->
              <div v-else-if="column.type === TABLE_COLUMN_TYPES.ICON" :class="['icon']" class="table-content-content"
                   @click="linkTodirect(row[column.field].url)">
                <ukt-inline-svg class="platform-icons" src="location"></ukt-inline-svg>
                <!--              If  has more details let this be collapsable-->
                <p :class="{'hidden': column.type !== TABLE_COLUMN_TYPES.COLLAPSE && hasOtherRidersInfo(row)}"
                   class="view-more-text cp"
                   @click="toggleRow(row.id)">
                  View {{ !rowMap[row.id] ? 'More' : 'Less' }}
                </p>
              </div>


              <!--              Status fields     -->
              <div v-else-if="column.type === TABLE_COLUMN_TYPES.STATUS" class="table-content-content">
                <NitrozenBadge v-if="row[column.field].state==='success'" class="mb-half-rem " state="success">{{
                    row[column.field].name
                  }}
                </NitrozenBadge>
                <NitrozenBadge v-else-if="row[column.field].state==='failed'" class="mb-half-rem " state="warn">{{
                    row[column.field].name
                  }}
                </NitrozenBadge>

                <NitrozenBadge v-else class="mb-half-rem " state="default">{{ row[column.field].name }}</NitrozenBadge>
                <p>{{ row[column.field].time }}</p>
                <!--              If  has more details let this be collapsable-->
                <p :class="{'hidden': column.type !== TABLE_COLUMN_TYPES.COLLAPSE && hasOtherRidersInfo(row)}"
                   class="view-more-text cp"
                   @click="toggleRow(row.id)">
                  View {{ !rowMap[row.id] ? 'More' : 'Less' }}
                </p>
              </div>
            </td>

          </tr>

        </table>
      <adm-no-content v-if="showErrorPage" :helperText="'No Data Found'"></adm-no-content>
      <div v-if="showTablePagination" class="pagination">
        <nitrozen-pagination :pageSizeOptions="paginationRows" :value="_pageObject" name=""
                             @change="paginationChange">
        </nitrozen-pagination>
      </div>
    </div>
</template>

<script>
import {NitrozenBadge, NitrozenPagination} from '@gofynd/nitrozen-vue';
import uktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import admnocontent from '@/components/common/adm-no-content';
import {analyticsTablePropsMixins} from "@/components/generic-graphs/graphs/mixins/analytics-props.mixins.js";
import {mapGetters} from "vuex";
import {ANALYTICS_STATE} from "@/store/modules/admin-analytics.module";
import {ADMIN_SAVE_PAGINATION_CHANGE} from "@/store/action.type";
import {TABLE_COLUMN_TYPES} from "@/components/generic-graphs/data/constants"

export default {
  name: "table-component",
  mixins: [analyticsTablePropsMixins],
  data() {
    return {
      showErrorPage: false,
      showTablePagination: true,
      paginationRows: [10, 25, 50, 100],
      pageObjectValue: {
        total: 100,
        current: 1,
        limit: 10
      },
      TABLE_COLUMN_TYPES: TABLE_COLUMN_TYPES,
      rowIndices: {}
    }
  },
  components: {
    NitrozenBadge,
    uktInlineSvg,
    "nitrozen-pagination": NitrozenPagination,
    'adm-no-content': admnocontent,
  },
  mounted() {
    this.pageObject(this.pageConfig);
    // this.initialiseRowMap();
  },
  computed: {
    ...mapGetters({
      pageConfig: ANALYTICS_STATE.PAGINATION
    }),
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
    },
    rowMap: {
      get() {
        // console.log('log: ', this.rows.reduce((a, i) => {
        //       a[i.id] = false;
        //       return a;
        //     }, {})
        // )
        this.rowIndices = this.modifiedRows.reduce((a, i) => {
          a[i.id] = false;
          return a;
        }, {});
        return this.rowIndices;
      }, set(index) {
        this.rowIndices[index] = !this.rowIndices[index];
      }
    },
    modifiedRows() {
      return this.rows && this.rows.reduce((a, i, index) => {
        a.push({...i, id: index});
        if (i.collapseModel) {
          a.push({...i.collapseModel, collapse: true, id: index});
        }
        return a;
      }, [])
    },
  },
  watch: {
    pageConfig(value) {
      if (value) {
        this.pageObject(value);
      }
    }
  },
  methods: {
    linkTodirect(event) {
      window.open(`${event}`, '_blank');
    },
    toggleRow(rowIndex) {
      this.rowMap = rowIndex;
    },
    paginationChange(pageConfigs) {
      this.$store.dispatch(ADMIN_SAVE_PAGINATION_CHANGE, {graphId: this.chartId, ...pageConfigs});
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
    hasCollapse(row) {
      return row.collapseModel;
    },
    hasOtherRidersInfo(row) {
      return row.collapseModel && row.collapseModel.fields.some(f => f.name !== 'Other Rider Details');
    }
  }
}
</script>

<style scoped>
::v-deep .nitrozen-badge {
    border-radius: 4px;
}

.table-top {
    margin-top: 1rem;
}

table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
}

th {
    background: #F5F5F5 !important;
    padding: 1rem;
}

td {
    padding-left: 1rem;
    border-bottom: 1px solid #E0E0E0 !important;
}

.table-content-content {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    padding: 1rem 0rem;
}

.table-head-content {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 14px
}

.inline-svg {
    display: inline-table;
}

.first-arrow-content {
    padding-left: 0.5rem;
}

span {
    line-height: 1.5rem;
}

.view-more {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    color: #2E31BE;
}

th {
    text-align: left;
}

.collapse-wrapper {
  display: flex;
  gap: 3.5rem;
  padding: 1.5rem;
}

.bg-color {

  background: #F7F7F7;
}

.hidden {
  display: none;
}

.view-more-text {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 130%;
  /* identical to box height, or 16px */


  /* Brand Color/Accent or Primary */

  color: #2E31BE;
}

.rotate {
  transition: all 300ms ease-in-out;
  transform: rotate(-90deg);
}

.content {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
}

.heading {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
}

.button-more {
  color: #2E31BE;
  font-weight: 600;
}

.button-more, .icon {
  cursor: pointer;
}

td:last-child {
  vertical-align: middle;
}

.cp {
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

::v-deep .nitrozen-pagination__count::before {
    content: "Result";
}
::v-deep .nitrozen-badge.nitrozen-badge-success {
    border: 1px solid #0A5F23;
  color: #0A5F23;
}

::v-deep .nitrozen-badge.nitrozen-badge-default {
  border: 1px solid #41434C;
  color: #41434C;
}

::v-deep .nitrozen-badge.nitrozen-badge-warn {
  border: 1px solid #F5A300;
  color: #F5A300;
}

.mb-half-rem {
  margin-bottom: 0.5rem;
}
</style>