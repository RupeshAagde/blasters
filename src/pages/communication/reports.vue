<template>
    <div class="panel">
        <div class="page-container">
            <div style="logs-container">
                <jumbotron
                    :title="'Reports'"
                    :desc="'View All Reportss'"
                ></jumbotron>
                 <div class="main-container">
                    <div class="flex flex-end m-b-24">
                        <div
                            v-if="pageLoading && isInitialLoad && !pageError"
                            class="input-shimmer shimmer"
                        ></div>
                        <template v-else>
                            <div class="flex-1 flex search">
                                <div class="search-box">
                                    <nitrozen-input
                                        class="search-input"
                                        :showSearchIcon="true"
                                        type="search"
                                        placeholder="Search log by email, phone, type, step, template, identifier"
                                        v-model="filters.plainTextSearch"
                                        @keyup.enter="searchTemplate()"
                                        @input="debounceInput"
                                    ></nitrozen-input>
                                </div>
                            </div>
                            <div class="flex-1 flex flex-end">
                                <div class="flex-1 m-r-24">
                                    <nitrozen-dropdown
                                        :label="'Type'"
                                        class="filter-dropdown"
                                        :items="typeFilterList"
                                        v-model="filters.type"
                                        @change="fieldChanged"
                                    ></nitrozen-dropdown>
                                </div>
                                <div class="flex-2 m-r-24">
                                    <nitrozen-input
                                        class="search-input"
                                        :showSearchIcon="true"
                                        type="search"
                                        placeholder="Search by template"
                                        v-model="filters.templateSearch"
                                        @keyup.enter="searchTemplate()"
                                        @input="debounceInput"
                                    ></nitrozen-input>
                                </div>
                                <div class="flex-1">
                                    <nitrozen-dropdown
                                        :label="'Status'"
                                        class="filter-dropdown"
                                        :items="statusFilterList"
                                        v-model="filters.status"
                                        @change="fieldChanged"
                                    ></nitrozen-dropdown>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="flex flex-end date">
                        <div
                            v-if="pageLoading && isInitialLoad && !pageError"
                            class="date-shimmer-wrapper date-wrapper"
                        >
                            <div class="input-shimmer-date-from shimmer"></div>
                            <div class="input-shimmer-date-to shimmer"></div>
                        </div>
                        <template v-else>
                            <div class="flex-1 flex">
                                <div class="flex date-wrapper">
                                    <div class="date-container m-r-24">
                                        <date-picker
                                            v-on:input="
                                                e => dateChanged(e, 'start')
                                            "
                                            :date_format="
                                                'YYYY-MM-DD hh:mm:ss a'
                                            "
                                            :picker_type="'datetime'"
                                            v-model="filters.start.value"
                                            :not_before="
                                                new Date(0).toISOString()
                                            "
                                            :placeholder="
                                                'Created at start date'
                                            "
                                        />
                                    </div>
                                    <div class="inner-container">
                                        <date-picker
                                            :date_format="
                                                'YYYY-MM-DD hh:mm:ss a'
                                            "
                                            v-on:input="
                                                e => dateChanged(e, 'end')
                                            "
                                            :picker_type="'datetime'"
                                            v-model="filters.end.value"
                                            :not_before="
                                                new Date(0).toISOString()
                                            "
                                            :placeholder="'Created at end date'"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-1 flex-end">
                                <div class="flex-1 m-r-24">
                                    <nitrozen-dropdown
                                        :label="'Campaign'"
                                        class="campaign-dropdown"
                                        :items="campaigns"
                                        v-model="filters.campaign"
                                        @change="changePage"
                                        :searchable="true"
                                        @searchInputChange="
                                            campaignDropdownSearchInputChange
                                        "
                                    ></nitrozen-dropdown>
                                </div>
                                <div class="flex-1">
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
                            </div>
                        </template>
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
                            !pageLoading && (logs.items && logs.items.length > 0)
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

import CommunicationServices from '../../services/pointblank.service';


//import './less/common.less';


import {
    NitrozenPagination,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenBadge
} from '@gofynd/nitrozen-vue';
const VueJsonPretty = () =>
    import(/*webpackChunkName:"vue-json-pretty" */ 'vue-json-pretty');
import NoSSR from 'vue-no-ssr'

export default {
    name: 'report-listing',
     components:{
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
                    text: 'All',
                    value: 'all'
                },
                {
                    text: 'SMS',
                    value: 'sms'
                },
                {
                    text: 'Email',
                    value: 'email'
                }
            ],
            statusFilterList: [
                {
                    text: 'All',
                    value: 'all'
                },
                {
                    text: 'Success',
                    value: 'success'
                },
                {
                    text: 'Error',
                    value: 'error'
                }
            ],
            filters: {
                plainTextSearch: '',
                type: 'all',
                status: 'all',
                templateSearch: '',
                start: {
                    value: ''
                },
                end: {
                    value: ''
                },
                job: '',
                campaign: ''
            },
            pagination: {
                limit: 10,
                current: 1,
                total: 11
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
        };
    },
    methods: {
         debounceInput: debounce(function(e) {
            if (this.filters.plainTextSearch.length === 0) {
                this.resetPagination();
                this.changePage();
            }
        }, 200),
         resetPagination() {
            this.pagination = {
                limit: 10,
                current: 1,
                total: 11
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
            this.resetPagination();
            this.changePage();
        },
        campaignDropdownSearchInputChange(e) {
            console.log(e.text);
            this.filters.campaign = '';
            this.fetchCampaigns(e.text);
        },
        fetchCampaigns(name='') {
           CommunicationServices.getCampaigns({"name":name})
           .then(res=>{
             this.getCampaignDropdown(res.data.items)
             this.changePage()
        
           }).catch(err=>{
               console.log(err);
           })
        },
        getCampaignDropdown(data){
                let dropdown = [];
                for (let i = 0; i < data.length; i++) {
                    let temp = { text: '', value: '' };
                    temp.text = data[i].name;
                    temp.value = data[i]._id;
                    dropdown.push(temp);
                }
                this.campaigns = dropdown;
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
        changePage(e){
        let params = {
                query: {},
                page_size: this.pagination.limit,
                sort: '{"_id":-1}'
            };
            if (e && this.currentPage > 0) {
                if (e.current > this.currentPage) {
                    let last = this.logIds[this.logIds.length - 1];
                    this.currentPage++;
                    params.page_id = last
                } else if (e.current < this.currentPage) {
                    this.logIds.pop();
                    this.logIds.pop();
                    let last = this.logIds[this.logIds.length - 1];

                    this.currentPage--;
                    if (last) {
                        params.page_id = last
                    }
                }
            }
            if (this.filters.type != 'all') {
                params.query[this.filters.type] = { $exists: true };
            }
            if (this.filters.status != 'all') {
                params.query.status = this.filters.status;
            }
            if (this.filters.templateSearch) {
                params.query.$or = params.query.$or || [];
                params.query.$or.push({
                    'email.template': {
                        $regex: this.filters.templateSearch,
                        $options: 'ig'
                    }
                });
                params.query.$or.push({
                    'sms.template': {
                        $regex: this.filters.templateSearch,
                        $options: 'ig'
                    }
                });
            }
            if (this.filters.job) {
                params.query["meta.job"] = this.filters.job;
            }
            if (this.filters.campaign) {
                params.query["meta.campaign"] = this.filters.campaign;
            }
            if (this.filters.plainTextSearch) {
                params.query.$or = params.query.$or || [];
                if (this.filters.plainTextSearch.indexOf('email:') != -1) {
                    let email = this.filters.plainTextSearch.split('email:')[1];
                    params.query.$or.push({
                        'email.to': { $regex: email, $options: 'ig' }
                    });
                } else if (
                    this.filters.plainTextSearch.indexOf('phone:') != -1
                ) {
                    let phone = this.filters.plainTextSearch.split('phone:')[1];
                    params.query.$or.push({
                        'sms.phone_number': {
                            $regex: phone,
                            $options: 'ig'
                        }
                    });
                } else {
                    params.query.$or.push({
                        'email.to': {
                            $regex: this.filters.plainTextSearch,
                            $options: 'ig'
                        }
                    });
                    params.query.$or.push({
                        'sms.phone_number': {
                            $regex: this.filters.plainTextSearch,
                            $options: 'ig'
                        }
                    });
                    params.query.$or.push({
                        'email.template': {
                            $regex: this.filters.plainTextSearch,
                            $options: 'ig'
                        }
                    });
                    params.query.$or.push({
                        'sms.template': {
                            $regex: this.filters.plainTextSearch,
                            $options: 'ig'
                        }
                    });
                    params.query.$or.push({
                        step: {
                            $regex: this.filters.plainTextSearch,
                            $options: 'ig'
                        }
                    });
                    params.query.$or.push({
                        service: {
                            $regex: this.filters.plainTextSearch,
                            $options: 'ig'
                        }
                    });
                    params.query.$or.push({
                        status: {
                            $regex: this.filters.plainTextSearch,
                            $options: 'ig'
                        }
                    });
                    params.query.$or.push({
                        'meta.identifier': {
                            $regex: this.filters.plainTextSearch,
                            $options: 'ig'
                        }
                    });
                    if (this.filters.job) {
                        params.query["meta.job"] = this.filters.job;
                    }
                    if (this.filters.campaign) {
                        params.query["meta.campaign"] = this.filters.campaign;
                    }
                }
            }
            if (this.validateDates() == 'valid') {
                let start = this.filters.start.value;
                let end = this.filters.end.value;
                params.query.created_at = {
                    $gte: start,
                    $lte: end
                };
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
            this.$router.push({
                path: this.$route.path,
                query: { ...this.$route.query, ...filters }
            })
             .catch(()=>{})
            params.query = JSON.stringify(params.query);
            this.pageLoading = true;
            CommunicationServices.getLog(params)
            .then(res=>{
                console.log("1234567890",res,);
                this.logs = res.data
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
                        let last = res.data.items[res.data.items.length - 1]._id;
                        this.logIds.push(last);
                    }
                    this.currentPage = this.pagination.current;
                    this.pageLoading = false;
                    this.pageError = false;
            })
             .catch(err => {
                    this.pageLoading = false;
                    this.pageError = true;
                })
                .finally(() => {
                    this.isInitialLoad && (this.isInitialLoad = false);
                });
        }

    },
    mounted() {
    this.resetPagination();

        this.fetchCampaigns()
        this.changePage()
    }
}
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
    margin-bottom: 24px;
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
                        width: 130px;
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
.search{

    
    /deep/.search-box {
      width: 80%;
    }
}
.date {
    /deep/.date-wrapper{
        max-width: 80%;
    }
}
</style>