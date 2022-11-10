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
            <tr :key="rowIndex" v-for="(row, rowIndex) in rows" class="ninja-table-content">
                <td v-if="row.collapse" colspan="9" class="show-more-text" :id="'hidden'+rowIndex" :ref="row.class">
                    <div class="hidden">
                        <span v-for="item in row.fields">
                            <p class="heading">{{item.name}}</p>
                            <p class="content">{{item.value}}</p>
                        </span>
                    </div>
                </td>
                <td v-else v-for="(column, idx) in columns" :key="idx">
                    <p v-if="column.type === 'arrow'" class="table-content-content">
                        <ukt-inline-svg :id="'rotate'+rowIndex" src="keyboard_arrow_right"></ukt-inline-svg>
                        <span class="first-arrow-content">{{row[column.field]}}</span>
                    </p>
                    <p v-if="column.type === 'array'" class="table-content-content">
                        <span>
                            <p v-for="index in row[column.field]" :key="index">{{index}}</p>
                        </span>
                    </p>
                    <p v-if="column.type === TABLE_COLUMN_TYPES.STRING" class="table-content-content">
                        <span>
                            <p>{{row[column.field]}}</p>
                        </span>
                    </p>
                    <p v-if="column.type === TABLE_COLUMN_TYPES.ICON" class="table-content-content" :class="['icon']" @click="linkTodirect(row[column.field].url)">
                        <ukt-inline-svg class="platform-icons" src="location"></ukt-inline-svg>
                    </p>
                    <p v-if="column.type === TABLE_COLUMN_TYPES.STATUS" class="table-content-content">
                        <span>
                            <p v-if="row[column.field].state==='success'">
                                <NitrozenBadge state="success">{{row[column.field].name}}</NitrozenBadge>
                            </p>
                            <p v-else-if="row[column.field].state==='failed'">
                                <NitrozenBadge state="warn">{{row[column.field].name}}</NitrozenBadge>
                            </p>
                            <p v-else>
                                <NitrozenBadge state="default">{{row[column.field].name}}</NitrozenBadge>
                            </p>
                            <p>{{row[column.field].time}}</p>
                        </span>
                    </p>
                    <p v-if="column.type === TABLE_COLUMN_TYPES.COLLAPSE" class="table-content-content">
                        <span>
                            <p v-for="index in row[column.field]" :key="index">{{index}}</p>
                        </span>
                        <span>
                            <p v-if="row[column.class]"
                                @click="showHideRow('hidden'+(rowIndex+1),'expandRow'+(rowIndex),'rotate'+rowIndex)"
                                :id="'expandRow'+(rowIndex)" class="button-more">
                                View More
                            </p>
                        </span>
                    </p>
                </td>

            </tr>

        </table>
        <adm-no-content v-if="showErrorPage" :helperText="'No Data Found'"></adm-no-content>
        <div class="pagination" v-if="showTablePagination">
            <nitrozen-pagination name="" @change="paginationChange" :value="_pageObject"
                :pageSizeOptions="paginationRows">
            </nitrozen-pagination>
        </div>
    </div>
</template>

<script>
// import layout from "./table-v2-column.json"
// import layoutColumn from "./table-v2-rows.json"
import { NitrozenBadge, NitrozenPagination } from '@gofynd/nitrozen-vue';
import uktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import admnocontent from '@/components/common/adm-no-content';
import { analyticsTablePropsMixins } from "@/components/generic-graphs/graphs/mixins/analytics-props.mixins.js";
import { mapGetters } from "vuex";
import { ANALYTICS_STATE } from "@/store/modules/admin-analytics.module";
import { ADMIN_SAVE_PAGINATION_CHANGE } from "@/store/action.type";
import { TABLE_COLUMN_TYPES } from "@/components/generic-graphs/data/constants"
export default {
    name: "table-component",
    mixins: [analyticsTablePropsMixins],
    data() {
        return {
            // layout: layout,
            // layoutColumn: layoutColumn,
            showErrorPage: false,
            showTablePagination: true,
            paginationRows: [10, 25, 50, 100],
            pageObjectValue: {
                total: 100,
                current: 1,
                limit: 10
            },
            TABLE_COLUMN_TYPES: TABLE_COLUMN_TYPES
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
        }
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
        showHideRow(row, expandRow, rotate) {
            var x = document.getElementById(row);
            let y = document.getElementById(expandRow)
            let z = document.getElementById(rotate)
            if (x.style.display === "none") {
                x.style.display = "table-cell";
                z.style.transition = "all 300ms ease-in-out";
                z.style.transform = "rotate(-90deg)";
                y.innerHTML = "View Less"
            } else {
                x.style.display = "none";
                z.style.transition = "all 300ms ease-in-out";
                y.innerHTML = "View More";
                z.style.transform = "rotate(0deg)";
            }
        },
        paginationChange(pageConfigs) {
            this.$store.dispatch(ADMIN_SAVE_PAGINATION_CHANGE, { graphId: this.chartId, ...pageConfigs });
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

.hidden {
    display: flex;
    gap: 3.5rem;
    padding: 1.5rem;
}

.show-more-text {
    display: none;
    background: #F7F7F7;
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
.button-more, .icon{
    cursor: pointer;
}

td:last-child {
    vertical-align: middle;
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
</style>