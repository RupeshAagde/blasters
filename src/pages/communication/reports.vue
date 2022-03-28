<template>
    <div class="panel">
        <div class="page-container">
            <div style="logs-container">
                <jumbotron
                    :title="'Reports'"
                    :desc="'View All Reports'"
                ></jumbotron>
                <div class="main-container">
                    <div class="flex flex-end">
                        <template class="flex fil-1">
                            <div class="flex drop">
                                <nitrozen-dropdown
                                    :label="'Search Type'"
                                    class="filter-dropdown"
                                    :items="typeFilterList"
                                    v-model="filters.type"
                                    @change="fieldChanged"
                                ></nitrozen-dropdown>
                            </div>
                            <div class="search">
                                <nitrozen-input
                                    class="search-input"
                                    :showSearchIcon="true"
                                    type="search"
                                    :placeholder="placeHolder"
                                    v-model="filters.plainTextSearch"
                                    @keyup.enter="searchTemplate()"
                                    @input="debounceInput"
                                ></nitrozen-input>
                            </div>
                            <div class="temp">
                                <nitrozen-input
                                    class="search-input"
                                    :showSearchIcon="true"
                                    type="search"
                                    placeholder="Search by template"
                                    v-model="filters.templateSearch"
                                    @change="changePage"
                                    @keyup.enter="searchTemplate()"
                                    @input="debounceInput"
                                ></nitrozen-input>
                            </div>
                            <div class="drop">
                                <nitrozen-dropdown
                                    :label="'Status'"
                                    class="filter-dropdown"
                                    :items="statusFilterList"
                                    v-model="filters.status"
                                    @change="fieldChanged"
                                ></nitrozen-dropdown>
                            </div>
                        </template>
                    </div>
                    <div class="flex flex-end date">
                        <template class="fil-2">
                            <div class="app">
                                <nitrozen-dropdown
                                    placeholder="Search Applications"
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
                                    class="campaign-dropdown"
                                    placeholder="Search Campaign"
                                    :items="campaigns"
                                    v-model="filters.campaign"
                                    @change="changeApplication"
                                    :searchable="true"
                                    @searchInputChange="
                                        campaignDropdownSearchInputChange
                                    "
                                ></nitrozen-dropdown>
                            </div>

                            <div class="job">
                                <nitrozen-input
                                    class="search-input"
                                    :showSearchIcon="true"
                                    type="search"
                                    placeholder="Search by job id"
                                    v-model="filters.job"
                                    @keyup.enter="fieldChanged()"
                                    @input="debounceInput"
                                ></nitrozen-input>
                            </div>
                        </template>
                    </div>
                    <div>
                        <div class="flex date-wrapper">
                            <div class="date-container m-r-24">
                                <date-picker
                                    v-on:input="(e) => dateChanged(e, 'start')"
                                    :date_format="'YYYY-MM-DD hh:mm:ss a'"
                                    :picker_type="'datetime'"
                                    v-model="filters.start.value"
                                    :not_before="new Date(0).toISOString()"
                                    :placeholder="'Created at start date'"
                                />
                            </div>
                            <div class="inner-container">
                                <date-picker
                                    :date_format="'YYYY-MM-DD hh:mm:ss a'"
                                    v-on:input="(e) => dateChanged(e, 'end')"
                                    :picker_type="'datetime'"
                                    v-model="filters.end.value"
                                    :not_before="new Date(0).toISOString()"
                                    :placeholder="'Created at end date'"
                                />
                            </div>
                        </div>
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

//import './less/common.less';

import {
    NitrozenPagination,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenBadge,
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
    },
    data() {
        return {
            typeFilterList: [
                {
                    text: 'Auto',
                    value: 'all',
                },
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
                type: 'all',
                status: 'all',
                templateSearch: '',
                start: {
                    value: '',
                },
                end: {
                    value: '',
                },
                job: '',
                campaign: '',
                application: '',
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
            placeHolder: 'Search by phone and email',
        };
    },
    methods: {
        debounceInput: debounce(function (e) {
            if (this.filters.plainTextSearch.length === 0) {
                this.resetPagination();
                this.changePage();
            }
        }, 400),
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
        dateChanged() {
            this.searchTemplate();
        },
        searchTemplate() {
            this.placeHolder = 'Search by ' + this.filters.type;
            if (this.filters.type == 'all') {
                this.placeHolder = 'Search by phone and email';
            }
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
                    this.changePage();
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
            var start,
                end = null;
            if (this.filters.start.value) {
                start = new Date(this.filters.start.value);
            }
            if (this.filters.end.value) {
                end = new Date(this.filters.end.value);
            }
            if ((start && end && start < end) || (start && !end)) {
                return 'valid';
            } else if (start && end && start > end) {
                return 'invalid';
            } else if (end && !start) {
                return 'notProvidedStart';
            } else {
                return;
            }
        },
        changePage(e) {
            let params = {
                query: {},
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
            if (this.filters.type == 'identifier') {
                params.query['meta.identifier'] = {
                    $regex: this.filters.plainTextSearch,
                    $options: 'ig',
                };
            }
            if (this.filters.type == 'phone') {
                params.query.sms = { $exists: true };
                params.query['sms.phone_number'] = this.filters.plainTextSearch;
            }
            if (this.filters.type == 'email') {
                params.query.email = { $exists: true };
                params.query['email.to'] = this.filters.plainTextSearch;
            }
            if (this.filters.type == 'all' && this.filters.plainTextSearch) {
                params.query.$or = params.query.$or || [];
                params.query.$or.push({
                    'email.to': {
                        $regex: this.filters.plainTextSearch,
                        $options: 'ig',
                    },
                });
                params.query.$or.push({
                    'sms.phone_number': {
                        $regex: this.filters.plainTextSearch,
                    },
                });
            }
            if (this.filters.templateSearch) {
                let validPhone = validatePhone(this.filters.plainTextSearch);
                let validEmail = validateEmail(this.filters.plainTextSearch);
                console.log("phone",validPhone);
                if (validPhone) {
                    params.query.$and = params.query.$and || [];
                    params.query.$and.push({
                        'sms.template': this.filters.templateSearch,
                    });
                }

               else if (validEmail) {
                    params.query.$and = params.query.$and || [];
                    params.query.$and.push({
                        'email.template': this.filters.templateSearch,
                    });
                } 
                else {
                    params.query.$and = params.query.$and || [];
                    params.query.$and.push({
                        $or: [
                            { 'sms.template': this.filters.templateSearch },
                            { 'email.template': this.filters.templateSearch },
                        ],
                    });
                }
            }
            if (this.filters.job) {
                params.query['meta.job'] = this.filters.job;
            }
            if (this.filters.campaign) {
                params.query['meta.campaign'] = this.filters.campaign;
            }
            if (this.filters.application) {
                params.query['application'] = this.filters.application;
            }
            if (
                this.filters.start.value == '' ||
                this.filters.start.value == undefined
            ) {
                params.sort = '{"_id":-1}';
            }

            if (this.validateDates() == 'valid') {
                let start = this.filters.start.value;
                let end = this.filters.end.value;

                if (this.filters.end.value !== '') {
                    params.query.created_at = {
                        $gte: start,
                        $lte: end,
                    };
                } else {
                    params.query.created_at = {
                        $gte: start,
                    };
                }
            } else if (this.validateDates() == 'invalid') {
                this.$snackbar.global.showError('Invalid dates provided');
                return;
            } else if (this.validateDates() == 'notProvidedStart') {
                this.$snackbar.global.showError('Please provide start date');
                return;
            } else if (this.validateDates() == 'notProvidedEnd') {
                this.$snackbar.global.showError('Please provide end date');
                return;
            }
            let filters = cloneDeep(this.filters);
            filters.start = JSON.stringify(filters.start);
            filters.end = JSON.stringify(filters.end);
            this.$router
                .push({
                    path: this.$route.path,
                    query: { ...this.$route.query, ...filters },
                })
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
                    this.changePage();
                }
            );
        },
        changeApplication() {
            this.fetchCampaigns('', this.filters.application);
            this.changePage();
        }
    },
    mounted() {
        this.resetPagination();

        this.fetchCampaigns();
        this.changePage();
        this.fetchApplication();
    },
};
</script>
<style lang="less" scoped>
//@import './../less/page-header.less';
//@import './../less/page-ui.less';
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
    align-items: center;
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
                    font-family: Inter;
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
                    font-family: Inter;
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
.drop {
    width: 18.5%;
}
.app {
    margin-right: 1.8%;
    width: 32.1%;
}
.search {
    width: 37%;
    margin-left: 1%;
}
.job {
    width: 32%;
}
</style>
