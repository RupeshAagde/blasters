<template>
    <div class="panel">
        <div class="header-position">
            <adm-page-header
                title="History"
                @backClick="goBack"
            ></adm-page-header>
        </div>
        <div class="history-container">
            <section class="bulk-history" ref="section">
                <div class="title-row">
                    <div class="cl-Mako darker-md">{{ title }}</div>
                    <div class="refresh-icon" @click="loadHistory">
                        <inline-svg src="refresh-blue"></inline-svg>
                        <p class="darker-xxxs cl-RoyalBlue">Refresh</p>
                    </div>
                </div>
                <div class="filter-row">
                    <nitrozen-input
                        class="search"
                        :showSearchIcon="true"
                        type="search"
                        :placeholder="'Search here'"
                        v-model="searchText"
                        @keyup.enter="loadHistory(true)"
                        @blur="loadHistory(true)"
                    ></nitrozen-input>
                    <div class="filter">
                        <div class="date">
                            <date-picker
                                class="date-picker"
                                :placeholder="'Date Range'"
                                picker_type="date"
                                date_format="YYYY-MM-DD"
                                v-model="historyDateRange"
                                :clearable="true"
                                :range="true"
                                :not_before="notBefore"
                                :shortcuts="dateRangeShortcuts"
                                :not_after="new Date().toISOString()"
                                :useNitrozenTheme="true"
                                @input="
                                    setRouteQuery({
                                        historyDate: historyDateRange
                                    });
                                    loadHistory(true);
                                "
                            />
                        </div>
                        <nitrozen-dropdown
                            label=" "
                            :placeholder="'Stage'"
                            class="stage-dropdown"
                            :items="stages"
                            v-model="selectedStageFilter"
                            @change="
                                searchText = '';
                                setRouteQuery({
                                    statusFilter: selectedStageFilter
                                });
                                loadHistory(true);
                            "
                        ></nitrozen-dropdown>
                    </div>
                </div>

                <shimmer
                    v-if="inProgress"
                    class="page-shimmer"
                    :count="3"
                ></shimmer>
                <no-content
                    v-else-if="historyData.length == 0"
                    helperText="No History Found"
                ></no-content>
                <page-error
                    v-else-if="isError && !inProgress"
                    @tryAgain="loadHistory(true)"
                ></page-error>
                <div
                    v-else
                    class="blaster-list-card-container"
                    v-for="history in historyData"
                    :key="history.id"
                    @click="openSidebar(history)"
                >
                    <div class="card-avatar template-logo-image">
                        <img
                            src="/public/assets/admin/pngs/csv_filetype.png"
                            v-if="getFileType(history.tracking_url) === 'csv'"
                        />
                        <inline-svg v-else :src="'excel_filetype'"></inline-svg>
                    </div>
                    <div class="card-content-section">
                        <div class="card-content-line-1">
                            {{ `${capitalize(productType)} ${history.id}` }}

                            <div class="svg-icons">
                                <a
                                    v-if="history.tracking_url"
                                    class="download-source-file"
                                    :href="history.tracking_url"
                                    download
                                    @click.stop=""
                                >
                                    <inline-svg
                                        :src="'cloud_download'"
                                    ></inline-svg>
                                </a>
                            </div>
                        </div>
                        <div v-if="history.stage === 'running'" class="running">
                            <inline-svg :src="'loader'"></inline-svg>
                            <p>
                                {{
                                    `${history.stats.succeed}/${history.stats.total}`
                                }}
                                records are being processed
                            </p>
                        </div>
                        <div v-else class="job-status">
                            <p class="cl-DustyGray2 regular-xxs total">
                                Total:
                                <span class="cl-Mako darker-xxs">{{
                                    history.stats.total
                                }}</span>
                            </p>
                            <div class="status" v-if="history.stats.succeed">
                                <inline-svg src="completed_green"></inline-svg>
                                <p class="cl-DustyGray2 regular-xxs">
                                    Success:
                                    <span class="cl-Mako darker-xxs">{{
                                        history.stats.succeed
                                    }}</span>
                                </p>
                            </div>
                            <div class="status" v-if="history.stats.failed">
                                <inline-svg src="error_status"></inline-svg>
                                <p class="cl-DustyGray2 regular-xxs">
                                    Error:
                                    <span class="cl-Mako darker-xxs">{{
                                        history.stats.failed
                                    }}</span>
                                </p>
                            </div>
                        </div>
                        <div class="card-content-line-3">
                            Imported By {{ history.created_by.username }} on
                            {{ getFormattedDate(history.created_on) }}
                        </div>
                    </div>
                    <div class="status-buttons">
                        <div class="card-badge-section">
                            <div
                                class="notify"
                                @click.stop="notifyByEmail(history)"
                                v-if="history.stage === 'running'"
                            >
                                <inline-svg
                                    src="notification_blue"
                                ></inline-svg>
                                <span
                                    class="cl-RoyalBlue darker-xxxs notification"
                                    >Notify on mail</span
                                >
                            </div>

                            <nitrozen-badge
                                v-if="history.stage"
                                :state="getBadgeState(history.stage)"
                                :class="{ gray: history.stage === 'running' }"
                            >
                                {{ history.stage === 'running' ? 'In Process' : history.stage  }}
                            </nitrozen-badge>
                            <div
                                class="close-box"
                                v-if="history.stage === 'running'"
                                @click.stop="cancelImport(history)"
                            >
                                <inline-svg src="close_gray"></inline-svg>
                            </div>
                        </div>
                    </div>
                </div>
                <nitrozen-pagination
                    v-if="!isError && !inProgress && historyData.length"
                    name="Batches"
                    v-model="pagination"
                    @change="setPagination"
                    :pageSizeOptions="[5, 10, 20, 50]"
                ></nitrozen-pagination>
            </section>

            <adm-sidebar
                v-if="isSidebarTogle"
                ref="sidebar"
                :closeOverlay="closeOverlay"
                :productType="productType"
                :footer="false"
                :detailType="'batch'"
                :history="history"
                :title="history.id"
            >
                <template class="sidebar-header" slot="header">
                    <div class="download-container">
                        <a
                            v-if="history.tracking_url"
                            class="download-source-file download-file"
                            :href="history.tracking_url"
                            download
                            @click.stop=""
                        >
                            <inline-svg :src="'cloud_download'"></inline-svg>
                            <span class="darker-xxxs cl-RoyalBlue ml-5"
                                >Source File</span
                            >
                        </a>
                    </div>
                </template>
                <template slot="body">
                    <div class="upload-summary">
                        <div class="title">
                            <p class="cl-Mako darker-sm">Upload Summary</p>
                            <nitrozen-badge
                                v-if="history.stage"
                                :state="getBadgeState(history.stage)"
                            >
                                {{ history.stage === 'running' ? 'In Process' : history.stage }}
                            </nitrozen-badge>
                        </div>
                        <div class="summary">
                            <div>
                                <div class="header">Total Records</div>
                                <div class="value">
                                    {{ history.stats.total }}
                                </div>
                            </div>
                            <div>
                                <div class="header">Valid Records</div>
                                <div class="value">
                                    {{ history.stats.succeed }}
                                </div>
                            </div>
                            <div>
                                <div class="header">Error Records</div>
                                <div class="value">
                                    {{ history.stats.failed }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div
                        class="errors-table"
                        v-show="history.failed_records.length"
                    >
                        <div class="failed-records">
                            <div class="cl-Mako darker-sm">Failed Records</div>
                            <div>
                                <div
                                    class="download-container"
                                    @click="getFailedRecords"
                                >
                                    <inline-svg
                                        :src="'cloud_download'"
                                    ></inline-svg>
                                    <!-- <inline-svg :src="'cloud_download'"></inline-svg> -->
                                    <p class="darker-xxxs cl-RoyalBlue ">
                                        Failed Records
                                    </p>
                                </div>
                            </div>
                        </div>
                        <csv-view ref="errors-preview"></csv-view>
                    </div>

                    <div
                        class="divider"
                        v-show="history.failed_records.length"
                    ></div>

                    <div class="batch-details">
                        <p class="cl-Mako darker-sm">Batch Details</p>

                        <div class="batch">
                            <div class="header column-1">Imported By:</div>
                            <div class="value colum-2n">
                                {{ history.created_by.username }}
                            </div>
                        </div>
                        <div class="batch">
                            <div class="header column-1">Started On:</div>
                            <div class="value column-2">
                                {{ getFormattedDate(history.created_on) }}
                            </div>
                        </div>
                        <div class="batch">
                            <div class="header column-1">Completed On:</div>
                            <div class="value column-2">
                                {{ getFormattedDate(history.modified_on) }}
                            </div>
                        </div>
                        <div class="batch">
                            <div class="header column-1">Processing Time:</div>
                            <div class="value column-2">
                                {{ getProcessingTime(history) }}
                            </div>
                        </div>
                    </div>
                </template>
            </adm-sidebar>
        </div>
    </div>
</template>
<style lang="less" scoped>
.header-position {
    height: 58.5px;
    .set-upload {
        line-height: 56.5px;
        cursor: pointer;
        color: @RoyalBlue;
        -webkit-font-smoothing: antialiased;
    }
    .set-upload-disabled {
        color: @DustyGray2;
    }
}
.batch-details {
    margin: 24px;
    // display: flex;
    // justify-content: space-between;
    // flex-wrap: wrap;

    .batch {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;

        .column-1 {
            width: 25%;
        }
        .column-2 {
        }
    }

    .header {
        font-family: Inter, sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 160%;
        color: #9b9b9b;
    }
    .value {
        font-weight: 400;
        font-size: 14px;
        line-height: 140%;
        color: #41434c;
    }
    > div {
        margin: 18px 0;
        flex-basis: 48%;
    }
}
.svg-icons {
    display: inline-flex;
    span {
        cursor: pointer;
        margin-left: 6px;
        ::v-deep svg {
            width: 16px;
            height: 16px;
        }
    }
}
.close-box {
    border: 1px solid #9b9b9b;
    border-radius: 3px;
    margin-left: 10px;
    span {
        padding: 8px;
    }
}

.line-2 {
    color: #41434c !important;
    font-size: 14px !important;
}

.total {
    align-self: center;
}
.running {
    display: flex;
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: #9b9b9b;
    img {
        width: 16px;
    }
    p {
        padding-left: 4px;
    }
}
.status {
    display: flex;
    align-items: center;
    padding-left: 16px;

    p {
        padding-left: 4px;
    }
}

.job-status {
    display: flex;
    padding-top: 8px;
}

.bulk-history {
    margin: 24px 0;
    padding: 24px;
    border: 1px solid @WhiteSmoke;
    border-radius: 8px;
    background-color: #ffffff;

    .title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
    .filter-row {
        margin-top: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: #f5f5f5;
        .search {
            width: 100%;
            margin-right: 15px;
        }
        .filter {
            display: flex;
            justify-content: space-between;
            .date {
                width: 230px;
            }
            .stage-dropdown {
                width: 150px;
                margin-left: 12px;
            }
            ::v-deep .nitrozen-dropdown-container .nitrozen-select__trigger {
                opacity: 0.5 !important;
                font-weight: 400;
                font-size: 12px;
                line-height: 23px;
            }
        }
    }
    .results-row {
        color: @Mako;
        height: 24px;
        display: flex;
        justify-content: flex-end;
        font-size: 12px;
        align-items: center;
        margin-top: 6px;
    }
    .refresh-icon {
        display: flex;
        align-items: center;
        cursor: pointer;

        > p {
            margin-left: 5px;
        }
    }
    .download-source-file {
        color: @RoyalBlue;
        &:hover {
            text-decoration: underline;
        }
    }
    .template-logo-image {
        background-color: #d8d8d8;
        overflow: hidden;
        img {
            height: 100%;
        }
        span {
            height: 100%;
            width: 100%;
        }
    }
}
.download-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    p {
        padding-left: 4px;
    }
}
.meta-space {
    margin: 0 6px;
}
.left-space-co {
    margin-left: 16px;
    color: #2e31be;
}
.left-space-mo {
    margin-left: 14px;
    color: #2e31be;
}
.label {
    color: #9b9b9b;
    font-size: 14px;
}

.history-container {
    margin: 24px;
    background-color: #fff;
}

.flex-column {
    display: flex;
    flex-direction: column;
}
.ml-24 {
    margin-left: 24px;
}
/deep/.sidebar {
    width: 40%;
    .sidebar-body {
        display: block;
        .upload-summary {
            margin: 24px;

            .title {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .summary {
                display: flex;
                margin-top: 16px;
                gap: 24px;

                .header {
                    font-family: Inter, sans-serif;
                    font-style: normal;
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 160%;
                    color: #9b9b9b;
                    padding-bottom: 5px;
                }
                .value {
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 140%;
                    color: #41434c;
                }
            }
        }
    }
}
.container {
    border: 1px solid #e4e5e6;
    border-radius: 4px;
    display: flex;
    overflow: visible;
    padding: 24px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: box-shadow 0.3s;
    &:hover {
        box-shadow: 0px 9px 13px 0px rgba(221, 221, 221, 0.5);
    }

    .card-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 24px;
        width: 90px;
        height: 90px;
        align-self: center;
        background-color: #f8f8f8;
        border-radius: 50%;
        border: 1px solid #e4e5e6;
        img {
            align-items: center;
            min-height: 86px;
            max-height: 86px;
            min-width: 86px;
            max-width: 86px;
            border-radius: 50%;
        }
    }
    .card-content-section {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;

        .full-name {
            font-weight: 600;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            line-height: 24px;
            color: #2e31be;
        }

        .card-content-line-2 {
            color: #9b9b9b;
            line-height: 22px;
            font-size: 12px;
            display: flex;
        }

        .verified-icon {
            display: inline;
            ::v-deep svg {
                cursor: pointer;
                width: 6px;
                height: 6px;
            }
        }
        .left-space-s {
            margin-left: 4px;
        }
        .left-space-md {
            margin-left: 12px;
        }
        .separator {
            width: 12px;
            text-align: center;
        }
    }
}
.loader {
    width: 16px;
}
.divider {
    border: 1px solid #e0e0e0;
    margin: 24px;
}
.status-buttons {
    display: flex;
}
.errors-table {
    margin: 24px;
    .failed-records {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
    }
}
.notify {
    display: flex;
    align-items: center;
}
.cancel {
    color: #ff3333;
    font-size: 12px;
    line-height: 160%;
    text-align: center;
    font-weight: 400;
    border: 1px solid #ff3333;
    cursor: pointer;
    align-self: center;
    padding: 2px 5px 2px 5px;
    border-radius: 2px;
}

.download-file {
    display: flex;
    align-items: center;
}

.ml-16 {
    margin-left: 16px;
}
.notification {
    margin: 0 16px 0 5px;
}
.ml-5 {
    margin-left: 5px;
}
.gray {
    color: #9b9b9b;
    border: 1px solid #9b9b9b;
}
</style>
<script>
import Jumbotron from '@/components/common/jumbotron';
import CatalogService from '@/services/catalog.service';
import AdmSidebar from '../components/side-bar.vue';
import InlineSvg from '@/components/common/adm-inline-svg.vue';
import DatePicker from '@/components/common/date-picker.vue';
import Shimmer from '@/components/common/shimmer';
import PageEmpty from '@/components/common/page-empty';
import PageError from '@/components/common/page-error';
import userInfoTooltip from '@/components/common/feedback/userInfo-tooltip.vue';
import moment from 'moment';
import NoContent from '@/components/common/adm-no-content.vue';
import admpageheader from '@/components/common/layout/page-header';
import CsvView from '@/components/common/adm-csv-viewer.vue';
import { mapGetters } from 'vuex';
import { GET_USER_INFO } from '@/store/getters.type';
import values from 'lodash/values';
import keys from 'lodash/keys';
import { debounce } from '@/helper/utils';

import {
    NitrozenInput,
    NitrozenDropdown,
    NitrozenPagination,
    NitrozenBadge
} from '@gofynd/nitrozen-vue';

const FILTER = [
    { value: 'all', text: 'All' },
    { value: 'true', text: 'Active' },
    { value: 'false', text: 'Disabled' }
];
const PAGINATION = {
    limit: 10,
    current: 1,
    total: 0
};

export default {
    name: 'bulkHistory',
    components: {
        Jumbotron,
        NitrozenInput,
        NitrozenDropdown,
        NitrozenPagination,
        NitrozenBadge,
        userInfoTooltip,
        Shimmer,
        PageEmpty,
        PageError,
        InlineSvg,
        DatePicker,
        AdmSidebar,
        NoContent,
        'adm-page-header': admpageheader,
        CsvView
    },
    props: {
        title: {
            type: String,
            default: 'Upload History'
        },
        templateTag: {
            type: String,
            default: undefined
        },
        customTemplateTag: {
            type: String,
            default: undefined
        }
    },
    computed: {
        ...mapGetters({
            userData: GET_USER_INFO
        })
    },
    data() {
        return {
            isSidebarTogle: false,
            productType: this.$route.params.type,
            searchText: '',
            isLoading: false,
            pageError: false,
            pagination: {
                ...PAGINATION
            },
            filter: FILTER,
            selectedAction: '',
            tempList: [],
            userObj: {},
            inProgress: false,
            isError: false,
            companyId: this.$route.params.company_id,
            stages: [
                { text: 'All', value: 'all' },
                { text: 'Completed', value: 'completed' },
                { text: 'In Process', value: 'running' },
                { text: 'Failed', value: 'failed' },
                { text: 'Terminated', value: 'terminated' },
                { text: 'Cancelled', value: 'cancelled' },
                { text: 'Partial', value: 'partial' }
            ],
            selectedStageFilter: null,
            notBefore: moment('01012020', 'DDMMYYYY').toISOString(),
            historyDateRange: ['', ''],
            dateRangeShortcuts: [
                {
                    text: 'Today',
                    start: new Date(),
                    end: new Date()
                },
                {
                    text: 'Last Week',
                    start: moment().subtract(7, 'days'),
                    end: new Date()
                },
                {
                    text: 'Last Month',
                    start: moment().subtract(1, 'months'),
                    end: new Date()
                },
                {
                    text: 'Last 3 Months',
                    start: moment().subtract(3, 'months'),
                    end: new Date()
                }
            ],
            historyData: [],
            history: {},
            failed_records: []
        };
    },
    mounted() {
        this.loadHistory(true);
    },
    methods: {
        closeOverlay: function(index) {
            this.isSidebarTogle = !this.isSidebarTogle;
        },
        goBack() {
            // this.$router.go(-1);
            this.$router.push(
                `/administrator/product/${this.productType}/import`
            );
        },
        capitalize(str) {
            return (
                str &&
                str
                    .split('-')
                    .pop()
                    .charAt(0)
                    .toUpperCase() +
                    str
                        .split('-')
                        .pop()
                        .slice(1)
            );
        },
        openSidebar(history) {
            if (history) {
                this.history = history;
            }
            this.errorsTable();
            this.isSidebarTogle = true;
            if (this.history.failed_records.length) {
                this.$nextTick(() => {
                    this.getErrorsTable();
                });
            }
        },
        loadHistory(initial) {
            this.getBulkHistory(
                CatalogService.bulkHistory,
                initial,
                this.productType,
                'import'
            );
        },
        getBulkHistory(caller, initial, type, action) {
            this.inProgress = true;
            return caller(
                this.productType,
                {
                    page_no: this.pagination.current,
                    page_size: this.pagination.limit,
                    search: this.searchText,
                    stage:
                        this.selectedStageFilter == 'all'
                            ? ''
                            : this.selectedStageFilter,
                    start_date: this.getQueryParamDateString(
                        this.historyDateRange[0]
                    ),
                    end_date: this.getQueryParamDateString(
                        this.historyDateRange[1]
                    )
                },
                action
            )
                .then(({ data }) => {
                    this.historyData = data.items.map((o) => {
                        o.type = '';
                        return o;
                    });
                    this.isError = false;
                    this.pagination = {
                        limit: this.pagination.limit,
                        total: data.page.item_total,
                        current: data.page.current
                    };
                    this.$nextTick(() => {
                        !initial &&
                            this.$refs.section &&
                            this.$refs.section.scrollIntoView();
                    });
                    return this.historyData;
                })
                .catch((ex) => {
                    this.$snackbar.global.showError(
                        `Failed to request bulk history ${
                            ex && ex.message ? ' : ' + ex.message : ''
                        }`
                    );
                    this.isError = true;
                    return false;
                })
                .finally(() => {
                    this.inProgress = false;
                });
        },
        setRouteQuery(query) {
            if (query.search || query.statusFilter || query.historyDate) {
                // clear pagination if search or filter applied
                this.pagination = { ...PAGINATION };
                query.pageId = undefined;
                query.limit = PAGINATION.limit;
            }
            this.$router.push({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    ...query
                }
            });
        },
        setPagination(filter, action) {
            const { current, limit } = filter;
            this.pagination = Object.assign({}, this.pagination, filter);
            let pageQuery = { pageId: current, limit };
            this.setRouteQuery(pageQuery);
            this.loadHistory();
        },
        getBadgeState(stage) {
            const states = {
                running: 'info', // if not need now, remove it
                completed: 'success',
                cancelled: 'error',
                terminated: 'error',
                failed: 'error',
                partial: 'warn'
            };
            return states[stage] || 'info';
        },
        getQueryParamDateString(date) {
            if (moment(date).isValid())
                return moment(date).format('YYYY-MM-DD');
            else return '';
        },
        getFormattedDate(date) {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        },
        getFileType(url) {
            const fileExtension = url && url.split('.').pop();
            let file_type;
            if (fileExtension === 'xls' || fileExtension === 'xlsx') {
                file_type = 'excel';
            } else if (fileExtension === 'csv') {
                file_type = 'csv';
            }
            return file_type;
        },
        getErrorsTable: function() {
            this.$refs['errors-preview'].createGrid(
                {
                    column: keys(this.failed_records[0]).map((e) => ({
                        headerName: e,
                        field: e,
                        resizable: true,
                        width: e == 'Message' ? 300 : 120
                    })),
                    rows: this.failed_records
                },
                { rowClass: 'error-row' }
            );
            setTimeout(() => {
                this.$refs['errors-preview'].grid.gridOptions.api.redrawRows();
            }, 0);
        },
        errorsTable() {
            const mappedErrors = this.history.failed_records.map((err) => {
                if (this.productType === 'hsn') {
                    return {
                        ...(err.reporting_hsn && {
                            'Reporting HSN Code': err.reporting_hsn
                        }),
                        ...(err.hsn_code && { 'HSN Code': err.hsn_code }),
                        Message: `${err.hsn_code}: ${err.message}`
                    };
                }
                return {
                    Name: err.name,
                    Message: `${err.name}: ${err.message}`
                };
            });
            this.failed_records = mappedErrors;
        },
        notifyByEmail(history) {
            let payload = {};
            let userEmail =
                this.userData &&
                this.userData.user.emails &&
                this.userData.user.emails[0].email;
            if (userEmail) {
                payload.notification_emails = [
                    ...history.notification_emails,
                    userEmail
                ];
            }
            CatalogService.bulkUpdate(payload, history.id, this.productType)
                .then((res) => {
                    // console.log(res);
                    this.$snackbar.global.showSuccess(
                        'You’ll be notified on email'
                    );
                    this.loadHistory();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        cancelImport(history) {
            let payload = {};
            let userEmail =
                this.userData &&
                this.userData.user.emails &&
                this.userData.user.emails[0].email;
            if (userEmail) {
                payload.notification_emails = [
                    ...history.notification_emails,
                    userEmail
                ];
            }
            payload.is_active = false;
            CatalogService.bulkUpdate(payload, history.id, this.productType)
                .then((res) => {
                    // console.log(res);
                    this.$snackbar.global.showSuccess('Import Cancelled');
                    this.loadHistory();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getFailedRecords() {
            // this.getErrorsTable();
            this.$refs[
                'errors-preview'
            ].csvExportFileName = `failed-records.csv`;
            this.$refs['errors-preview'].exportErrorsInCsv();
        },
        getProcessingTime(history) {
            if (history.completed_on) {
                let start = new Date(history.created_on);
                let end = new Date(history.completed_on);
                let seconds = (end.getTime() - start.getTime()) / 1000;
                return seconds + 's';
            } else {
                return 'NA';
            }
        }
    }
};
</script>
