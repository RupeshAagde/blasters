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
                        <div v-if="history.stage === 'in-progress'">
                            <inline-svg :src="'loader'"></inline-svg>
                            <p>01/47 records is being processed</p>
                        </div>
                        <div v-else class="card-content-line-2 line-2">
                            <!-- {{ successCountMessage(history) }} -->
                        </div>
                        <div class="job-status">
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
                            <nitrozen-badge
                                v-if="history.stage"
                                :state="getBadgeState(history.stage)"
                            >
                                {{ history.stage }}
                            </nitrozen-badge>
                        </div>
                        <div
                            class="notify ml-16"
                            @click.stop="notifyByEmail(history)"
                            v-if="
                                history.stage === 'running' ||
                                    history.stage === 'in-progress'
                            "
                        >
                            <img
                                src="/public/assets/admin/pngs/notification.png"
                            />
                        </div>
                        <div
                            class="cancel ml-16"
                            @click.stop="cancelImport(history)"
                            v-if="
                                history.stage === 'running' ||
                                    history.stage === 'in-progress'
                            "
                        >
                            CANCEL
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
                        <inline-svg :src="'cloud_download'"></inline-svg>
                        <p class="darker-xxxs cl-RoyalBlue ">Source File</p>
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
                                {{ history.stage }}
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

                    <!-- <div class="errors-table">
                        <csv-view
                            ref="errors-preview"
                            class="errors-preview"
                        ></csv-view>
                    </div> -->

                    <!-- <div class="divider"></div> -->

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
                            <div class="value column-2">NA</div>
                        </div>
                    </div>
                </template>
            </adm-sidebar>
        </div>
        <!-- <csv-view ref="errors-preview" class="errors-preview"></csv-view> -->
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
        font-family: 'Inter';
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

.line-2 {
    color: #41434c !important;
    font-size: 14px !important;
}

.total {
    align-self: center;
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
    ::v-deep .nitrozen-dropdown-container .nitrozen-select__trigger {
        opacity: 0.5 !important;
    }
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
                    font-family: 'Inter';
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
    border-radius: 3px;
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
.divider {
    border: 1px solid #e0e0e0;
    margin: 24px;
}
.status-buttons {
    display: flex;
}
.notify {
    // color: #2e31be;
    // font-size: 12px;
    // line-height: 160%;
    // text-align: center;
    // font-weight: 400;
    // border: 1px solid #2e31be;
    cursor: pointer;
    align-self: center;
    // align-self: center;
    // padding: 2px 5px 2px 5px;
    // border-radius: 2px;
    img {
        width: 30px;
    }
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
.ml-16 {
    margin-left: 16px;
}
</style>
<script>
import Jumbotron from '@/components/common/jumbotron';
// import InlineSvg from '@/components/common/inline-svg.vue';

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
        setPlaceholder: function() {
            let text = 'Search by Batch ID';
            return this.type === 'catalogue' ? `${text} or Template` : text;
        },
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
            departmentList: [],
            pagination: {
                ...PAGINATION
            },
            filter: FILTER,
            selectedFilter: 'all',
            selectedAction: '',
            tempList: [],
            userObj: {},
            inProgress: false,
            isError: false,
            companyId: this.$route.params.company_id,
            stages: [
                { text: 'All', value: 'all' },
                { text: 'Completed', value: 'completed' },
                { text: 'Running', value: 'running' },
                { text: 'In-Progress', value: 'in-progress' },
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
            history: {}
        };
    },
    mounted() {
        this.loadHistory(true);
        console.log(this.userData);
    },
    methods: {
        closeOverlay: function(index) {
            this.isSidebarTogle = !this.isSidebarTogle;
        },
        goBack() {
            this.$router.go(-1);
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
            console.log('hist', history);
            if (history) {
                this.history = history;
            }
            this.isSidebarTogle = !this.isSidebarTogle;
            // this.getErrorsTable();
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
            console.log(this.pagination)
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
                'in-progress': 'disable',
                running: 'info', // if not need now, remove it
                completed: 'success',
                cancelled: 'info',
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
            return moment(date).format('Do MMM, YYYY, HH:mm:ss');
        },
        successCountMessage(history) {
            console.log('path', history.file_path);
            // NOTE: history messages.
            const pending = () => {
                return (
                    history.total -
                    history.succeed -
                    history.failed -
                    history.cancelled
                );
            };
            if (history.succeed === history.total) {
                return `All  ${history.total} successful`;
            }
            let message = `Total: ${history.total} | `;
            const subMessage = [];

            if (history.succeed) {
                subMessage.push(` Success: ${history.succeed} |`);
            }
            if (pending()) {
                subMessage.push(` ${history.stage}: ${pending()}  |`);
            }
            if (history.failed) {
                subMessage.push(` Failed: ${history.failed} |`);
            }
            if (history.cancelled) {
                subMessage.push(`Cancelled : ${history.cancelled} |`);
            }
            let str = message + subMessage.join(', ');
            if (str.charAt(str.length - 1) == '|') str = str.replace(/.$/, '');
            return str;
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
        getErrorsArray() {
            let arr = [
                {
                    keyword: 'required',
                    dataPath: '/data/2',
                    schemaPath: '#/definitions/_Department/required',
                    params: {
                        missingProperty: 'slug'
                    },
                    message: "should have required property 'slug'",
                    schema: {
                        name: {
                            title: 'Name',
                            description: 'Name of the deplartment.',
                            type: 'string'
                        },
                        slug: {
                            title: 'Slug',
                            description: 'Slug of the department.',
                            type: 'string'
                        },
                        uid: {
                            title: 'UID',
                            description: 'Uique identifier for department.',
                            type: 'integer'
                        },
                        logo: {
                            title: 'Logo',
                            description: 'URL of logo for department.',
                            minLength: 1,
                            maxLength: 2083,
                            format: 'uri',
                            type: 'string'
                        },
                        is_active: {
                            title: 'Is Active',
                            description:
                                'Boolean value to track weather the department is active or not',
                            type: 'boolean'
                        },
                        priority_order: {
                            title: 'Priority',
                            description:
                                'Priority of the department in listing.',
                            type: 'string'
                        },
                        synonyms: {
                            title: 'Synonyms',
                            description: 'Synonyms of the departments.',
                            type: 'string'
                        }
                    },
                    parentSchema: {
                        title: '_Department',
                        type: 'object',
                        properties: {
                            name: {
                                title: 'Name',
                                description: 'Name of the deplartment.',
                                type: 'string'
                            },
                            slug: {
                                title: 'Slug',
                                description: 'Slug of the department.',
                                type: 'string'
                            },
                            uid: {
                                title: 'UID',
                                description: 'Uique identifier for department.',
                                type: 'integer'
                            },
                            logo: {
                                title: 'Logo',
                                description: 'URL of logo for department.',
                                minLength: 1,
                                maxLength: 2083,
                                format: 'uri',
                                type: 'string'
                            },
                            is_active: {
                                title: 'Is Active',
                                description:
                                    'Boolean value to track weather the department is active or not',
                                type: 'boolean'
                            },
                            priority_order: {
                                title: 'Priority',
                                description:
                                    'Priority of the department in listing.',
                                type: 'string'
                            },
                            synonyms: {
                                title: 'Synonyms',
                                description: 'Synonyms of the departments.',
                                type: 'string'
                            }
                        },
                        required: [
                            'name',
                            'slug',
                            'logo',
                            'is_active',
                            'priority_order'
                        ]
                    },
                    data: {
                        name: 'sdhvb',
                        logo:
                            'https://hdn-1.addsale.com/x0/brands/pictures/square-logo/original/VIiKH16Qj-Logo.jpeg',
                        priority_order: '3',
                        is_active: true
                    },
                    index: '2',
                    property: '2'
                }
            ];
            return arr;
        },
        getErrorsTable() {
            // if (this.showErrorsTable) {
            //     this.showErrorsTable = false;
            //     return;
            // }
            // this.showErrorsTable = true;
            debugger;
            this.$refs['errors-preview'].createGrid(
                {
                    column: this.errorsTable().meta.fields.map((e) => ({
                        headerName: e,
                        field: e,
                        resizable: true,
                        width: e == 'Errors' ? 600 : 120
                    })),
                    rows: this.errorsTable().data
                },
                { rowClass: 'error-row' }
            );
        },
        errorsTable() {
            const mappedErrors = this.getErrorsArray().map((err) => {
                const msgs = [];
                err.map((e) => {
                    if (e.keyword == 'enum') {
                        msgs.push(`${e.property}: '${e.data}' ${e.message}`);
                    } else if (
                        [
                            'type',
                            'maxLength',
                            'minLength',
                            'pattern',
                            'minItems',
                            'size-meta'
                        ].includes(e.keyword)
                    ) {
                        msgs.push(`${e.property}: ${e.message}`);
                    } else {
                        msgs.push(`${e.property}: ${e.message}`);
                    }
                });
                const index = err[0].index;
                return {
                    index,
                    Errors: msgs.join(', \n')
                };
            });

            return {
                meta: { fields: ['Errors'] },
                data: values(mappedErrors)
            };
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
                    this.$snackbar.global.showSuccess('Notified');
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
                    this.$snackbar.global.showError('Cancelled');
                    this.loadHistory();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
};
</script>
