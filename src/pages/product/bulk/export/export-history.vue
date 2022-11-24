<template>
    <div class="panel">
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
                            v-if="history.template"
                            :src="history.template.logo"
                        />
                        <!-- <adm-text-avatar
                        v-else
                        :text="type != 'assets' ? history.created_by.full_name : ''"
                    ></adm-text-avatar> -->
                    </div>
                    <div class="card-content-section">
                        <div class="card-content-line-1">
                            {{
                                history.template
                                    ? history.template.name
                                    : history.id
                            }}

                            <div class="svg-icons">
                                <a
                                    v-if="history.file_path"
                                    class="download-source-file"
                                    :href="history.file_path"
                                    download
                                    @click.stop=""
                                >
                                    <inline-svg :src="'download'"></inline-svg>
                                </a>
                            </div>
                        </div>

                        <div class="card-content-line-2 line-2">
                            {{ successCountMessage(history) }}
                        </div>
                        <div class="card-content-line-3">
                            {{ getFormattedDate(history.created_on) }}
                        </div>
                    </div>
                    <div class="card-badge-section">
                        <nitrozen-badge
                            v-if="history.stage"
                            :state="getBadgeState(history.stage)"
                        >
                            {{ history.stage }}
                        </nitrozen-badge>
                    </div>
                </div>
                <nitrozen-pagination
                    v-if="!isError && !inProgress"
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
                :title="'Batch Details'"
                :footer="false"
                :detailType="'batch'"
                :history="history"
            >
                <div class="sidebar-container">
                    <div class="card-badge-section">
                        <div class="header">Batch Status</div>
                        <nitrozen-badge
                            v-if="history.stage"
                            :state="getBadgeState(history.stage)"
                        >
                            {{ history.stage }}
                        </nitrozen-badge>
                    </div>
                    <div>
                        <div class="header">Total</div>
                        <div class="value">{{ history.total }}</div>
                    </div>
                    <div>
                        <div class="header">Success</div>
                        <div class="value">{{ history.succeed }}</div>
                    </div>
                    <div>
                        <div class="header">Failed</div>
                        <div class="value">{{ history.failed }}</div>
                    </div>
                    <div>
                        <div class="header">Cancelled</div>
                        <div class="value">{{ history.cancelled }}</div>
                    </div>
                </div>
                <div class="batch-details">
                    <div>
                        <div class="header">Batch Number</div>
                        <div class="value">{{ history.id }}</div>
                    </div>
                </div>
                <div class="batch-details">
                    <div>
                        <div class="header">Completed On</div>
                        <div class="value">
                            {{ getFormattedDate(history.modified_on) }}
                        </div>
                    </div>
                    <div>
                        <div class="header">Batch Started On</div>
                        <div class="value">
                            {{ getFormattedDate(history.created_on) }}
                        </div>
                    </div>
                </div>
                <div class="batch-details">
                    <div>
                        <div class="header">Processing Time</div>
                        <div class="value">
                            {{
                                `${(new Date(history.modified_on) -
                                    new Date(history.created_on)) /
                                    1000} seconds`
                            }}
                        </div>
                    </div>
                    <div>
                        <div class="header">Uploaded By</div>
                        <div class="value">
                            {{ history.created_by.username }}
                        </div>
                    </div>
                </div>
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
    margin: 15px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

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
        margin: 5px;
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
/deep/.sidebar {
    width: 40%;
    .sidebar-body {
        display: block;
        .sidebar-container {
            display: flex;
            justify-content: space-between;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            margin: 24px;
            padding: 15px;
            display: flex;
            text-align: center;

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
                font-size: 16px;
                line-height: 140%;
                color: #41434c;
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
    current: 0,
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
        'adm-page-header': admpageheader
    },
    props: {
        title: {
            type: String,
            default: 'Export History'
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
        }
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
                total: 0,
                current: 1,
                limit: 10
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
                { text: 'Running', value: 'pending' },
                { text: 'Failed', value: 'failed' }
                // { text: 'Processing', value: 'processing' },
                // { text: 'Cancelled', value: 'cancelled' }
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
    },
    methods: {
        closeOverlay: function(index) {
            this.isSidebarTogle = !this.isSidebarTogle;
        },
        goBack() {
            this.$router.go(-1);
        },
        openSidebar(history) {
            console.log('hist', history);
            if (history) {
                this.history = history;
            }
            this.isSidebarTogle = !this.isSidebarTogle;
        },
        loadHistory(initial) {
            this.getBulkHistory(
                CatalogService.bulkHistory,
                initial,
                this.productType
            );
        },
        getBulkHistory(caller, initial, type) {
            this.inProgress = true;

            return caller(this.productType, {
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
                end_date: this.getQueryParamDateString(this.historyDateRange[1])
            })
                .then(({ data }) => {
                    this.historyData = data.items.map((o) => {
                        o.type = '';
                        return o;
                    });
                    this.isError = false;
                    this.pagination = {
                        limit: this.pagination.limit,
                        total: this.historyData.total,
                        current: this.historyData.current
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
                processing: 'warn',
                pending: 'warn', // if not need now, remove it
                completed: 'success',
                cancelled: 'info',
                terminated: 'error',
                failed: 'error'
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
        }
    }
};
</script>
