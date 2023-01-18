<template>
    <div class="panel">
        <div class="page-container">
            <div style="logs-container">
                <jumbotron
                    :title="'Reports'"
                    :desc="'View All Reports'"
                ></jumbotron>
                <div class="main-container">
                    <div class="flex">
                        <template class="flex fil-1">
                            <div class="flex app">
                                <nitrozen-dropdown
                                    :label="'Search Type'"
                                    class="filter-dropdown"
                                    :items="typeFilterList"
                                    v-model="filters.type"
                                    @change="changeType"
                                ></nitrozen-dropdown>
                            </div>
                            <div class="app">
                                <nitrozen-input
                                    class="search-input"
                                    :showSearchIcon="true"
                                    type="search"
                                    :label="searchLabel"
                                    :placeholder="placeHolder"
                                    v-model="filters.plainTextSearch"
                                    @input="changeSearch"
                                ></nitrozen-input>
                                <nitrozen-error v-if="emailphoneErr.showerror">
                                    {{ emailphoneErr.value }}
                                </nitrozen-error>
                            </div>
                            <div class="app ex-app">
                                <nitrozen-dropdown
                                    :label="'Status'"
                                    class="filter-dropdown"
                                    :items="statusFilterList"
                                    v-model="filters.status"
                                ></nitrozen-dropdown>
                            </div>
                        </template>
                    </div>
                    <div class="flex date">
                        <template class="fil-2">
                            <div class="app">
                                <nitrozen-dropdown
                                    :label="'Sales Channels'"
                                    placeholder="Search sales channels"
                                    :items="application"
                                    v-model="filters.application"
                                    @change="changeApplication"
                                    :searchable="true"
                                    @searchInputChange="
                                        applicationDropdownSearchInputChange
                                    "
                                ></nitrozen-dropdown>
                            </div>

                            <div class="app">
                                <nitrozen-dropdown
                                    :label="'Search Entity'"
                                    class="filter-dropdown"
                                    :items="typeFilterList2"
                                    v-model="filters.entity"
                                    @change="updateEntity"
                                ></nitrozen-dropdown>
                            </div>

                            <div
                                v-if="filters.entity == 'template'"
                                class="app ex-app"
                            >
                                <nitrozen-input
                                    class="search-input"
                                    :showSearchIcon="true"
                                    type="search"
                                    :label="'Template'"
                                    placeholder="Search by template"
                                    v-model="filters.templateSearch"
                                    @keyup.enter="fieldChanged"
                                ></nitrozen-input>
                            </div>

                            <div
                                v-if="filters.entity == 'campaign'"
                                class="app ex-app"
                            >
                                <nitrozen-dropdown
                                    class="campaign-dropdown"
                                    placeholder="Search campaign"
                                    :items="campaigns"
                                    :label="'Campaign'"
                                    v-model="filters.campaign"
                                    :searchable="true"
                                    @searchInputChange="
                                        campaignDropdownSearchInputChange
                                    "
                                ></nitrozen-dropdown>
                            </div>

                            <div
                                v-if="filters.entity == 'jobid'"
                                class="app ex-app"
                            >
                                <nitrozen-input
                                    class="search-input"
                                    :showSearchIcon="true"
                                    type="search"
                                    :label="'JobId'"
                                    placeholder="Search by job id"
                                    v-model="filters.job"
                                ></nitrozen-input>
                            </div>
                        </template>
                    </div>
                    <div class="third-row">
                        <date-picker
                            label="Select Date Range"
                            class="date-picker filter-input-sm"
                            picker_type="date"
                            date_format="MMM Do, YY"
                            v-model="orderDateRange"
                            :clearable="false"
                            :range="true"
                            :not_before="notBefore"
                            :shortcuts="dateRangeShortcuts"
                            :useNitrozenTheme="true"
                        />
                        <nitrozen-button :disabled="emailphoneErr.showerror" :theme="'secondary'" v-strokeBtn class="search-but" @click="changePage">Search</nitrozen-button>
                        <nitrozen-button
                            :theme="'secondary'"
                            @click="resetfilters"
                            class="search-but"
                            >Reset Filters</nitrozen-button
                        >
                    </div>
                    <adm-shimmer
                        v-if="pageLoading && !pageError"
                        :count="4"
                    ></adm-shimmer>
                    <page-error
                        v-else-if="pageError && !pageLoading"
                        @tryAgain="changePage"
                    ></page-error>
                    <ul
                        class="logs-lists-container"
                        ref="searchbar"
                        v-else-if="logs.items && logs.items.length > 0"
                    >
                        <li v-for="(log, index) in logs.items" :key="index">
                            <logs-listing-card
                                v-bind:log="log"
                                @openLog="onLogCardClicked"
                            ></logs-listing-card>
                        </li>
                    </ul>
                    <adm-no-content
                        v-else
                        :helperText="'No results found'"
                    ></adm-no-content>
                    <div
                        class="pagination"
                        v-if="
                            !pageLoading && logs.items && logs.items.length > 0
                        "
                    >
                        <nitrozen-pagination
                            name="Logs"
                            v-model="pagination"
                            @change="changePage"
                            :pageSizeOptions="[5, 10, 20, 50]"
                        >
                        </nitrozen-pagination>
                    </div>
                </div>
            </div>
            <ukt-modal
                :isOpen="showPreviewModal"
                :title="'Show Preview'"
                :childHandleFocus="true"
                @closedialog="showPreviewModal = !showPreviewModal"
            >
                <div class="json-container">
                    <no-ssr>
                        <vue-json-pretty :path="'res'" :data="previewData">
                        </vue-json-pretty>
                    </no-ssr>
                </div>
            </ukt-modal>
        </div>
    </div>
</template>
<script>
import Jumbotron from '@/components/common/jumbotron';
import FormInput from '@/components/common/form-input.vue';
import loader from '@/components/common/loader.vue';
import DatePicker from '@/components/common/date-picker.vue';
import shimmer from '@/components/common/shimmer.vue';
import PageEmpty from '@/components/common/page-empty.vue';
import PageError from '@/components/common/page-empty.vue';
import uktModal from '@/components/common/utk-modal.vue';
import { debounce } from '@/helper/utils';
import logsListingCard from './logs-listing-card.vue';
import cloneDeep from 'lodash/cloneDeep';
import { validatePhone, validateEmail } from '../../helper/utils';
import CommunicationServices from '../../services/pointblank.service';
import CompanyService from '@/services/company-admin.service';
import moment from 'moment';

//import './less/common.less';

import {
    NitrozenPagination,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenBadge,
    NitrozenButton,
    NitrozenError,
    strokeBtn
} from '@gofynd/nitrozen-vue';
const VueJsonPretty = () =>
    import(/*webpackChunkName:"vue-json-pretty" */ 'vue-json-pretty');
import NoSSR from 'vue-no-ssr';

export default {
    name: 'report-listing',
    components: {
        jumbotron: Jumbotron,
        loader,
        'ukt-modal': uktModal,
        'vue-json-pretty': VueJsonPretty,
        'no-ssr': NoSSR,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-input': NitrozenInput,
        'date-picker': DatePicker,
        'page-error': PageError,
        'adm-no-content': PageEmpty,
        'adm-shimmer': shimmer,
        'logs-listing-card': logsListingCard,
        'nitrozen-button': NitrozenButton,
        NitrozenError,
    },
    directives: {
        strokeBtn
    },
    data() {
        return {
            typeFilterList: [
                {
                    text: 'SMS',
                    value: 'phone',
                },
                {
                    text: 'Email',
                    value: 'email',
                },
                {
                    text: 'Identifier',
                    value: 'identifier',
                },
            ],
            typeFilterList2: [
                {
                    text: 'Choose Search Entity',
                    value: '',
                },
                {
                    text: 'Template',
                    value: 'template',
                },
                {
                    text: 'Campaign',
                    value: 'campaign',
                },
                {
                    text: 'Job ID',
                    value: 'jobid',
                },
            ],
            statusFilterList: [
                {
                    text: 'All',
                    value: 'all',
                },
                {
                    text: 'Success',
                    value: 'success',
                },
                {
                    text: 'Error',
                    value: 'error',
                },
            ],
            filters: {
                plainTextSearch: '',
                type: 'phone',
                entity: '',
                status: 'all',
                templateSearch: '',
                job: '',
                campaign: '',
                application: this.$route.query.application,
            },
            pagination: {
                limit: 10,
                current: 1,
                total: 11,
            },
            description: 'Use this section to view logs of SMS and Email',
            campaigns: [],
            currentPage: 0,
            pageLoading: false,
            showPreviewModal: false,
            previewData: {},
            logIds: [],
            isInitialLoad: false,
            pageError: false,
            logs: {},
            application: [],
            placeHolder: 'Search by phone',
            notBefore: moment().subtract(1, 'months').toISOString(),
            dateRangeShortcuts: [
                {
                    text: 'Today',
                    start: new Date(),
                    end: new Date(),
                },
                {
                    text: 'Last 3 Days',
                    start: moment().subtract(3, 'days'),
                    end: new Date(),
                },
            ],
            orderDateRange: [
                moment().subtract(3, 'days').toISOString(),
                moment().toISOString(),
            ],
            emailphoneErr: {
                value: false,
                showerror: false,
            },
            searchLabel: 'Phone',
        };
    },
    methods: {
        resetPagination() {
            this.pagination = {
                limit: 10,
                current: 1,
                total: 11,
            };
            this.currentPage = 1;
            this.logIds = [];
        },
        onLogCardClicked(val) {
            this.previewData = val;
            this.showPreviewModal = true;
        },
        fieldChanged() {
            this.searchTemplate();
        },
        // inputEntity() {
        //     if (
        //         this.filters.entity == 'template' &&
        //         this.filters.templateSearch == ''
        //     ) {
        //         this.changePage();
        //     }
        //     if (this.filters.entity == 'jobid' && this.filters.job == '') {
        //         this.changePage();
        //     }
        // },
        changeType() {
            if (this.filters.type == 'email' || this.filters.type == 'phone') {
                this.filters.plainTextSearch = '';
                this.emailphoneErr.showerror = false;
            }
            this.searchLabel =
                this.filters.type.charAt(0).toUpperCase() +
                this.filters.type.slice(1);
            //this.fieldChanged();
        },
        changeSearch() {
            if (this.filters.plainTextSearch == '') {
                this.emailphoneErr.showerror = false;
                return;
            } else if (
                this.filters.type == 'email' &&
                !validateEmail(this.filters.plainTextSearch)
            ) {
                this.emailphoneErr.showerror = true;
                this.emailphoneErr.value = 'Enter Valid Email';
            } else if (
                this.filters.type == 'phone' &&
                !validatePhone(this.filters.plainTextSearch)
            ) {
                this.emailphoneErr.showerror = true;
                this.emailphoneErr.value = 'Enter Valid Phone';
            } else {
                this.emailphoneErr.showerror = false;
            }
        },
        searchTemplate() {
            this.placeHolder = 'Search by ' + this.filters.type;
            this.resetPagination();
            this.changePage();
        },
        campaignDropdownSearchInputChange(e) {
            this.filters.campaign = '';
            this.fetchCampaigns(e.text);
        },
        applicationDropdownSearchInputChange(e) {
            this.filters.application = '';
            this.fetchApplication(e.text);
        },
        fetchCampaigns(name = '', id = '') {
            CommunicationServices.getCampaigns({ name: name, application: id })
                .then((res) => {
                    this.getCampaignDropdown(res.data.items);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getCampaignDropdown(data) {
            let dropdown = [];
            for (let i = 0; i < data.length; i++) {
                let temp = { text: '', value: '' };
                temp.text = data[i].name;
                temp.value = data[i]._id;
                dropdown.push(temp);
            }
            this.campaigns = dropdown;
        },
        getApplicationDropdown(data) {
            let dropdown = [];
            for (let i = 0; i < data.length; i++) {
                let temp = { text: '', value: '' };
                temp.text = data[i].name;
                temp.value = data[i]._id;
                dropdown.push(temp);
            }
            this.application = dropdown;
        },
        validateDates() {
            var date1 = new Date(this.orderDateRange[0]);
            var date2 = new Date(this.orderDateRange[1]);
            var diffDays = parseInt(
                (date2 - date1) / (1000 * 60 * 60 * 24),
                10
            );
            if (diffDays > 3) {
                return 'outRange';
            }
            if (this.orderDateRange[0] && this.orderDateRange[1]) {
                return 'valid';
            } else {
                return;
            }
        },
        changePage(e) {
            let params = {
                query: {},
                sort : JSON.stringify({"created_at":-1}),
                page_size: this.pagination.limit,
            };
            if (e && this.currentPage > 0) {
                if (e.current > this.currentPage) {
                    let last = this.logIds[this.logIds.length - 1];
                    this.currentPage++;
                    params.page_id = last;
                } else if (e.current < this.currentPage) {
                    this.logIds.pop();
                    this.logIds.pop();
                    let last = this.logIds[this.logIds.length - 1];

                    this.currentPage--;
                    if (last) {
                        params.page_id = last;
                    }
                }
            }
            if (this.filters.status != 'all') {
                params.query.status = this.filters.status;
            }

            if (
                this.filters.type == 'identifier' &&
                this.filters.plainTextSearch
            ) {
                params.query['meta.identifier'] = this.filters.plainTextSearch;
            }
            if (this.filters.type == 'phone') {
                params.query['sms.phone_number'] = { $ne: null };
                if (validatePhone(this.filters.plainTextSearch)) {
                    delete params.query.sms;
                    params.query['sms.phone_number'] =
                        this.filters.plainTextSearch;
                }
            }
            if (this.filters.type == 'email') {
                params.query['email.to'] = { $ne: null };
                if (validateEmail(this.filters.plainTextSearch)) {
                    delete params.query.email;
                    params.query['email.to'] = this.filters.plainTextSearch;
                }
            }

            if (
                this.filters.templateSearch &&
                this.filters.entity == 'template'
            ) {
                if (this.filters.type == 'phone') {
                    delete params.query.sms;
                    params.query['sms.template'] = this.filters.templateSearch;
                } else if (this.filters.type == 'email') {
                    delete params.query.email;
                    params.query['email.template'] =
                        this.filters.templateSearch;
                }
            }

            if (this.filters.job && this.filters.entity == 'jobid') {
                params.query['meta.job'] = this.filters.job;
            }
            if (this.filters.campaign && this.filters.entity == 'campaign') {
                params.query['meta.campaign'] = this.filters.campaign;
            }
            if (this.filters.application) {
                params.query['application'] = this.filters.application;
            }
            if (this.validateDates() == 'outRange') {
                this.$snackbar.global.showError(
                    'Date range is more than 3 days'
                );
                return;
            }
            if (this.validateDates() == 'valid') {
                params.query.created_at = {
                    $gte: this.orderDateRange[0],
                    $lte: this.orderDateRange[1],
                };
            }

            let filters = cloneDeep(this.filters);
            filters.start = JSON.stringify(this.orderDateRange[0]);
            filters.end = JSON.stringify(this.orderDateRange[1]);
            this.$router
                .push({
                    path: this.$route.path,
                    query: { ...this.$route.query, ...filters },
                })
                .catch((err) => {})
                .catch((err) => {
                    console.log(err);
                });
            params.query = JSON.stringify(params.query);
            this.pageLoading = true;
            CommunicationServices.getLog(params)
                .then((res) => {
                    this.logs = res.data;
                    if (res.data.items.length == this.pagination.limit) {
                        this.pagination.total =
                            this.pagination.limit * this.pagination.current +
                            this.pagination.limit;
                    } else {
                        this.pagination.total =
                            this.pagination.limit *
                                (this.pagination.current - 1) +
                            res.data.items.length;
                    }
                    if (res.data.items && res.data.items.length > 0) {
                        let last =
                            res.data.items[res.data.items.length - 1]._id;
                        this.logIds.push(last);
                    }
                    this.currentPage = this.pagination.current;
                    this.pageLoading = false;
                    this.pageError = false;
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                })
                .finally(() => {
                    this.isInitialLoad && (this.isInitialLoad = false);
                });
        },
        fetchApplication(name = '') {
            CompanyService.fetchAllApplication({ page_size: 50, q: name }).then(
                (res) => {
                    this.getApplicationDropdown(res.data.items);
                }
            );
        },
        changeApplication() {
            this.fetchCampaigns('', this.filters.application);
        },
        updatefilters() {
            let q = this.$route.query;
            this.filters.entity = q.entity;
            this.filters.templateSearch = q.templateSearch;
            if (q.type) {
                this.filters.type = q.type;
                this.searchLabel =
                    this.filters.type.charAt(0).toUpperCase() +
                    this.filters.type.slice(1);
                this.placeHolder = 'Search by ' + this.filters.type;
            }
            this.filters.campaign = q.campaign;
            this.filters.job = q.job;
            this.filters.plainTextSearch = q.plainTextSearch;
            this.filters.application = q.application;
            if (q.type) {
                this.filters.status = q.status;
            }
            
        if (q.start) {
            this.orderDateRange[0] = JSON.parse(q.start);
        }
        if (q.end) {
            this.orderDateRange[1] = JSON.parse(q.end);
        }
        },
        updateEntity() {
            this.$router
                .push({
                    path: this.$route.path,
                    query: {
                        ...this.$route.query,
                        ...{ entity: this.filters.entity },
                    },
                })
                .catch((err) => {});
        },
        resetfilters() {
            this.filters.application = '';
            this.filters.entity = '';
            this.filters.templateSearch = '';
            this.filters.job = '';
            this.filters.plainTextSearch = '';
            this.filters.status = 'all';
            this.filters.type = 'phone';
            this.searchLabel = 'Phone',
            this.placeHolder = 'Search by phone'
            this.orderDateRange = [
                moment().subtract(3, 'days').toISOString(),
                moment().toISOString(),
            ];
            this.filters.campaign = '';
            this.emailphoneErr.showerror = false;
            this.changePage();
        },
    },
    mounted() {
        let filters = cloneDeep(this.$route.query);
        if (filters.start) {
            this.orderDateRange[0] = JSON.parse(filters.start);
        }
        if (filters.end) {
            this.orderDateRange[1] = JSON.parse(filters.end);
        }
        this.updatefilters();
        this.resetPagination();
        this.fetchCampaigns();
        this.fetchApplication();
        this.changePage();
    },
};
</script>
<style lang="less" scoped>
//@import './../less/page-header.less';
//@import './../less/page-ui.less';
.third-row {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.filter-input-sm {
    width: 32.1%;
    margin-right: 1.8%;
    margin-bottom: 12px;

    @media @mobile {
        width: 100%;
    }
}
.search-but{
    margin-right: 12px;
    margin-top: 6px;
}

::v-deep .vue-date-picker {
    display: flex;
    flex-direction: column;
}

::v-deep .main-container {
    margin-top: 14px;
}

.custom-header {
    ::v-deep .n-flat-button-secondary {
        margin-top: 110px !important;
    }
}
.json-container {
    margin: 24px;
}
.jumbotron-h {
    min-height: 263px;
    @media @mobile {
        min-height: initial;
    }
}
.flex {
    display: flex;
    @media @mobile {
        display: block;
    }
    .flex-1 {
        flex: 1;
        @media @mobile {
            margin-top: 12px;
        }
    }
    .flex-2 {
        flex: 2;
    }
}
.flex-end {
    align-items: flex-end;
}
.m-b-24 {
    margin-bottom: 14px;
}
.m-r-24 {
    margin-right: 24px;
    @media @mobile {
        margin-right: 0;
        margin-top: 12px;
    }
}
.vue-date-picker {
    display: flex;
    /deep/.mx-input {
        height: 40px;
        box-sizing: border-box;
    }
}
.page-container {
    display: block;
    margin: 24px;
    width: auto;
    @media @mobile {
        margin: 0;
    }
    .logs-container {
        width: 100%;
        .main-container {
            background-color: @White;
            display: block;
            margin: 24px 0px;
            .input-shimmer {
                flex-basis: 400px;
                height: 40px;
                margin: 24px 0 0 0;
            }
            .date-shimmer-wrapper {
                display: flex;
                .input-shimmer-date-from {
                    width: 188px;
                    height: 40px;
                }
                .input-shimmer-date-to {
                    width: 188px;
                    height: 40px;
                    margin: 0 0 0 24px;
                }
            }
            .date-wrapper {
                flex-basis: 400px;
            }
            .line-1 {
                margin-bottom: 12px;
            }
            .campaign-dropdown {
                ::v-deep .nitrozen-dropdown-label {
                    display: none;
                }
            }
            .outer-container {
                display: flex;
                align-items: flex-end;
                .filter-right {
                    justify-content: space-between;
                    width: 100%;
                }
                .inner-container {
                    align-items: flex-end;
                    display: flex;

                    .filter-dropdown {
                        width: 230px;
                    }
                }
                .label {
                    font-family: Inter, sans-serif;
                    color: @Mako;
                    font-size: 14px;
                    line-height: 20px;
                    width: 44px;
                    margin: 0 12px;
                    font-weight: 500;
                }
                .template-search {
                    .search-input {
                        width: 200px;
                    }
                    margin-left: 24px;
                }
                .type-filter {
                    width: 125px;
                    margin-left: 24px;
                }
                .status-filter {
                    margin-left: 12px;
                }
                .date-container {
                    margin-right: 24px;
                }
            }

            .select-wrapper {
                margin-top: 5px;
                width: 50%;
            }
            .search-box {
                width: 80%;
                height: 40px;
                justify-content: space-between;
                .search-input {
                    width: 100px;
                }
                .filter {
                    display: flex;
                }
                .label {
                    font-family: Inter, sans-serif;
                    color: @Mako;
                    font-size: 14px;
                    line-height: 20px;
                    width: 44px;
                    margin: auto 0;
                    font-weight: 500;
                }
            }
            .generic-button-container {
                margin-top: 15px;
            }
            .logs-lists-container {
                width: 100%;
            }
            .no-results {
                margin-top: 24px;
            }
            /deep/.pagination {
                margin-top: 40px;
            }
        }
    }
}
/deep/.nitrozen-pagination__left {
    visibility: hidden;
}
.date-container {
    @media @mobile {
        margin-bottom: 12px;
    }
}
.search {
    /deep/.search-box {
        width: 80%;
    }
}
.date {
    /deep/.date-wrapper {
        max-width: 80%;
    }
    margin: 12px 0px;
}
.application-dropdown {
    margin-top: 14px;
    width: 265px;
}
.fil-1 {
    align-items: flex-end;
}
.temp {
    margin-right: 1%;
    margin-left: 1%;
    width: 22.9%;
}
.app {
    margin-right: 1.8%;
    width: 32.1%;
}
.job {
    width: 32%;
}
.ex-app {
    margin-right: 0px;
}
</style>
