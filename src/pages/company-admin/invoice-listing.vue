<template>
    <div
        class="full-width"
        :class="{ 'white-container': $route.name == 'company-details' }"
    >
        <div class="applications width-100">
            <div v-if="inProgress" class="shimmer"></div>
            <div class="search-box flex">
                <div v-if="isInitialLoad" class="input-shimmer shimmer"></div>
                <div v-else class="width-100">
                    <div class="width-100 flex">
                        <div class="flex flex-2" style="margin-top:6px;min-width: 477px;">
                            <nitrozen-input
                                :showSearchIcon="true"
                                class="search flex-1"
                                type="search"
                                id="search-by-number"
                                placeholder="Search by invoice number..."
                                v-model="searchText"
                                @input="debounceInput({ number: searchText })"
                            ></nitrozen-input>
                            
                            <div
                                class="flex date-wrapper flex-1"
                                style="margin-left:12px;"
                            >
                                <div class="width-100 m-r-12">
                                    <div class="date">
                                        <date-picker
                                            class="date-picker"
                                            @input="dateRangeChange"
                                            date_format="MMM Do, YY"
                                            :picker_type="'date'"
                                            :range="true"
                                            :clearable="true"
                                            :useNitrozenTheme="true"
                                            v-model="orderDateRange"
                                            :not_before="new Date(0).toISOString()"
                                            :placeholder="'Select Date Range'"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-3 m-r-12" style="margin-top:-13px">
                            <div>
                                <nitrozen-dropdown
                                    :label="'Status'"
                                    class="filter-dropdown"
                                    :useNitrozenTheme="true"
                                    :items="statusFilterList"
                                    v-model="filters.status"
                                    @change="fieldChanged"
                                ></nitrozen-dropdown>
                            </div>
                            <div>
                                <nitrozen-dropdown
                                    :label="'Collection Method'"
                                    class="m-l-12 filter-dropdown"
                                    :useNitrozenTheme="true"
                                    :items="collectionMethodFilterList"
                                    v-model="filters.collection_method"
                                    @change="fieldChanged"
                                ></nitrozen-dropdown>
                            </div>
                            <div>
                            <nitrozen-dropdown
                                    v-if="this.$route.name == 'invoices'"
                                    class="m-l-12 title-label"
                                    :searchable="true"
                                    :label="'Company'"
                                    :placeholder="'Search company'"
                                    @searchInputChange="companySearch"
                                    v-model="filters.selectedCompany"
                                    :items="companyList"
                                    @change="onCompanySelect"
                                ></nitrozen-dropdown>
                            </div>
                        </div>
                    </div>
                    <div class="width-100 flex">
                        <div class="flex flex-2" style="margin-top:6px;">
                            <div>
                                <nitrozen-dropdown
                                    :label="'Attempts'"
                                    class="filter-dropdown"
                                    :useNitrozenTheme="true"
                                    :items="attempList"
                                    v-model="filters.attemp"
                                    @change="fieldChanged"
                                ></nitrozen-dropdown>
                            </div>
                        </div>
                        <div class="flex flex-2" style="margin-top:6px; justify-content:flex-end;">
                            <nitrozen-button
                            style="margin-top:22px;"
                            v-strokeBtn
                            :theme="'secondary'"
                            @click="exportInvoiceList()"
                            >
                                Export CSV
                            </nitrozen-button>
                            <nitrozen-button
                            style="margin-top:22px; margin-left:22px"
                            v-strokeBtn
                            :theme="'secondary'"
                            @click="openUploadCSVDialog()"
                            >
                                Bulk Update
                            </nitrozen-button>
                        </div>

                    </div>
                </div>
            </div>
            <div
                v-if="
                    !inProgress && applicationList && applicationList.length > 0
                "
            >
                <a
                    class="card-container container m-t-24"
                    :href="getBillingPagePath(item._id)"
                    v-for="(item, index) in applicationList"
                    :key="index"
                    :title="item.name"
                    @click="(e)=>goToBillingPage(item._id,e)"
                >
                    <div class="line-1">
                        <div
                            v-if="item.client && item.client.name"
                            class="cust-head"
                        >
                            <a
                                :href="getCompanyProfileLink(item)"
                                @click.stop.prevent="e=>routeToCompanyProfile(e,item)"
                            >
                                {{ item.client.name }}
                            </a>
                        </div>
                        <div class="cust-badge">
                            <adm-inline-svg
                                class="cust-space"
                                :src="'eye-open'"
                                title="View"
                            ></adm-inline-svg>
                            <nitrozen-badge
                                :state="
                                    item.current_status === 'paid'
                                        ? 'success'
                                        : item.current_status == 'void'
                                        ?'error'
                                        : 'warn'
                                "
                                >{{ item.current_status }}</nitrozen-badge
                            >
                        </div>
                    </div>
                    <div class="line-2 m-t-12" v-if="item.number">
                        <div class="cust-head">Invoice Number</div>
                        <div
                            class="cust-pointer"
                            :title="`${item.number} (Click to copy)`"
                            @click="copy(item.number)"
                        >
                            {{ item.number }}
                        </div>
                    </div>
                    <div class="line-2" v-if="item.period">
                        <div class="cust-head" v-if="item.period.start">
                            Invoice Period
                        </div>
                        <div
                            v-if="item.period.start && item.period.end"
                            :title="'Invoice Period'"
                        >
                            {{ item.period.start | formatDate }} -
                            {{ item.period.end | formatDate }}
                        </div>
                    </div>
                    <div class="line-2" v-if="item.collection_method">
                        <div class="cust-head">Collection Method</div>
                        <div
                            class="cust-pointer"
                            style="text-transform: capitalize;"
                        >
                            {{ item.collection_method | removeUnderscore }}
                        </div>
                    </div>
                    <div class="line-2" v-if="item.hasOwnProperty('attemp')">
                        <div class="cust-head">Attempts</div>
                        <div
                            class="cust-pointer"
                        >
                            {{ item.attemp }}
                        </div>
                    </div>
                    <div class="line-2" v-if="item.total">
                        <div class="cust-head" v-if="item.total">Amount</div>
                        <div
                            v-if="item.total"
                            class="cust-domain"
                            :title="item.total"
                        >
                            <span v-html="currencyMap[item.currency]"></span
                            >{{ item.total.toFixed(2) }}
                        </div>
                    </div>
                    
                </a>
                <div class="pagination" v-if="applicationList.length > 0">
                    <nitrozen-pagination
                        name="Invoices"
                        v-model="pagination"
                        @change="paginationChange"
                        :pageSizeOptions="[5, 10, 20, 50]"
                    ></nitrozen-pagination>
                </div>
            </div>
            <div v-else>
                <page-empty text="No invoices present"></page-empty>
            </div>

            <nitrozen-dialog ref="dialog" class="csv-invoice-upload" title="Invoice Bulk Update" @close="close">
                <template slot="body">
                    <div class="m-b-18">
                        Total Records : {{this.uploadedInvoices.length}}
                    </div>
                    <div>
                        <div class="file-upload-box">
                            <nitrozen-button
                                class="upload-button"
                                v-stroke-btn
                                :rounded="true"
                                theme="secondary"
                                @click="$refs.inputFile.click()"
                            >
                                Choose file
                            </nitrozen-button>
                            <span v-if="selectedFileName" class="file-name">
                                File selected : {{selectedFileName}}
                            </span>
                            <input
                                style="display:none"
                                id="csvFileInput"
                                class="unit-input"
                                ref="inputFile"
                                type="file"
                                placeholder="auto"
                                @change="uploadCSVChange"
                                accept=".csv"
                            />
                            <nitrozen-inline
                                icon='cross'
                                class='nitrozen-icon'
                                @click="resetFileUploadInput"
                            ></nitrozen-inline>
                        </div>
                        <nitrozen-button
                            style="margin-top:22px;"
                            :theme="'secondary'"
                            v-flatBtn
                            @click="uploadCSV()"
                            >
                                Upload
                        </nitrozen-button>
                        <div class="csv-text-info regular-xxxs cl-DustyGray2">
                            - CSV must contain columns invoice_id, update_payment_intent_id, update_status, update_comment
                            <div style="text-align:center">
                                Or
                            </div>
                            - You can export CSV File from panel it will have all field that can be updated with prefix "update" (eg. update_payment_intent_id)
                        </div>
                    </div>
                    <div class="mar-top">
                        <label v-if="this.uploadedInvoices.length && showUpdateProgress>0" for="file">Update progress: <b>{{(showUpdateProgress*100/this.uploadedInvoices.length).toFixed(0)}}%</b></label>
                        <progress v-if="this.uploadedInvoices.length && showUpdateProgress>0" class="width-100" id="file" :value="showUpdateProgress" :max="this.uploadedInvoices.length-1"> {{showUpdateProgress*100/this.uploadedInvoices.length}} </progress>
                    </div>
                </template>
                <template slot="footer">
            </template>
            </nitrozen-dialog>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.white-container {
    background: white;
    padding: 24px;
    margin-right: 24px;
}
.top-badge {
    display: flex;
    justify-content: flex-start;
    margin-left: 24px;
}
.width-100{
    width: 100%;
}
.csv-text-info {
    padding: 24px;
    border: 1px dashed #d7d7d7;
    border-radius: 3px;
    margin-top:22px;
}
.file-name {
    color: #2E31BE;
    font-size: 14px;
}
.date {
    display: flex;
    margin-bottom: 12px;
    .date-picker {
        width: 100%;
        @media @mobile {
            width: 100%;
        }
    }
}
.mar-top {
    margin-top:22px
}
.file-upload-box {
    padding: 8px 0px;
}
.csv-invoice-upload{
        ::v-deep .nitrozen-dialog-footer{
            display: none;
        }
    }
.file-upload-box {
    ::v-deep .nitrozen-icon {
        float: right;
        cursor: pointer;
        margin-top:5px;
    }
}
::v-deep .page-slot {
    display: flex;
    flex: 1;
    justify-content: flex-start !important;
}
::v-deep .n-input {
    padding-top:7px;
}
.top-container {
    width: 100%;
    margin: 0 0 0 0;
    position: relative;
}
.m-l-12 {
    margin-left: 12px;
}
.m-t-12 {
    margin-top: 12px;
}
.m-b-18 {
    margin-bottom: 8px;
}
.m-t-24 {
    margin-top: 24px;
}
.cust-panel {
    margin-bottom: 60px;
}
.profile-container {
    margin-right: 0;
}
.custom-tab {
    ::v-deep .nitrozen-tab-item {
        padding-top: 15px;
        &:first-child {
            margin-left: 10px;
        }
    }
}
.main-container {
    // margin-right: 0;
    .full-width {
        width: 100%;
        display: flex;
        .feature-container {
            width: 60%;
        }
        .profile-container {
            width: 40%;
        }
        .common-container {
            width: auto;
            margin: 0 24px 24px 0;
            padding: 12px 24px 0 24px;
        }
    }
}
.m-r-12 {
    margin-right: 12px;
    @media @mobile {
        margin-right: 0;
    }
}
.m-r-24 {
    margin-right: 24px;
    @media @mobile {
        margin-right: 0;
        margin-top: 12px;
    }
}
.shimmer {
    display: block;
    width: 100%;
    height: 48px;
    margin-bottom: 24px;
}
.search-box {
    margin: 0 0 12px 0;
    width: 100%;
    justify-content: center;
    
    .filter {
        display: flex;
        align-items: center;
    }
    .label {
        font-family: Inter;
        color: @Mako;
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
    }
    .filter-dropdown {
        width: 180px;
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

.cust-pointer {
    cursor: pointer;
}
::v-deep .nitrozen-pagination {
    font-size: 11px !important;
}
::v-deep .nitrozen-pagination__select {
    margin-right: -24px !important;
}
::v-deep .page-error {
    img {
        width: 200px !important;
        height: 150px !important;
    }
}
.cust-space {
    margin-right: 12px;
    ::v-deep svg {
        width: 20px !important;
        height: 12px !important;
    }
    cursor: pointer;
}
.text-margin {
    margin: 12px 0 24px 0;
}
.cust-head {
    font-size: 12px;
    color: #9b9b9b;
}
.applications {
    .text-heading {
        font-size: 18px;
        color: #41434c;
        font-weight: bold;
        // margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
    }
    .search-div {
        width: 100%;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .label {
            color: #9b9b9b;
            font-size: 14px;
            margin-bottom: 12px;
        }

        .box-search {
            width: 65%;
        }

        .box-drop {
            width: 33%;
        }
    }
    .card-container{
        display: block;
    }
    .container {
        box-sizing: border-box;
        border: 1px solid @Iron;
        border-radius: 4px;
        background-color: @White;
        // padding: 24px 12px 24px 12px;
        padding: 12px;
        margin-bottom: 24px;

        &:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .line-1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // padding-bottom: 12px;

            .cust-head {
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 160px;
                overflow: hidden;
                line-height: 20px;
                font-size: 14px;
                color: #2e31be;
                font-weight: 600;
                cursor: pointer;
            }

            .cust-badge {
                margin-left: 6px;
                display: flex;
                align-items: center;
            }
        }
        .line-2 {
            display: flex;
            font-size: 12px;
            line-height: 22px;
            color: #9b9b9b;
            font-weight: 400;
            justify-content: space-between;

            .cust-app {
                text-overflow: ellipsis;
                max-width: 200px;
                white-space: nowrap;
                overflow: hidden;
            }

            .cust-domain {
                text-overflow: ellipsis;
                max-width: 200px;
                white-space: nowrap;
                overflow: hidden;
                color: #2e31be;
                font-weight: bold;
                cursor: pointer;
            }
        }
        .line-4 {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>

<script>
import Loader from '@/components/common/loader';
import admInlineSVG from '@/components/common/adm-inline-svg';
import uktInlineSVG from '@/components/common/ukt-inline-svg';
import admapplication from './application-list.vue';
import listdri from './list-dri.vue';
import PageHeader from '@/components/common/layout/page-header';
import admcompanydetails from './profile-details.vue';
import BillingService from '@/services/billing.service';
import CompanyService from '@/services/company-admin.service';
import Shimmer from '@/components/common/shimmer';
import DatePicker from '@/components/common/date-picker.vue';
import {
    NitrozenBadge,
    NitrozenTab,
    NitrozenButton,
    NitrozenPagination,
    NitrozenInput,
    NitrozenDropdown,
    NitrozenDialog,
    strokeBtn,
    flatBtn,
    NitrozenInline,
} from '@gofynd/nitrozen-vue';
import { FETCH_METRICS } from '@/store/action.type';
import marketplaceChannels from './mkp-channels.vue';
import moment from 'moment';
import { titleCase, debounce } from '@/helper/utils';
import pageempty from '@/components/common/page-empty.vue';
import root from 'window-or-global';
import companyListVue from './company-list.vue';
import * as BlueBird from 'bluebird';
import * as csv from "csvtojson";

const env = root.env || {};

const PAGINATION = {
    limit: 10,
    total: 0,
    current: 1
};

export default {
    name: 'invoice-listing',
    components: {
        Shimmer,
        'page-empty': pageempty,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-button': NitrozenButton,
        'nitrozen-tab': NitrozenTab,
        'mkp-channels': marketplaceChannels,
        'ukt-inline-svg': uktInlineSVG,
        'adm-inline-svg': admInlineSVG,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-input': NitrozenInput,
        NitrozenDropdown,
        Loader,
        'date-picker': DatePicker,
        'nitrozen-dialog': NitrozenDialog,
        NitrozenInline,
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            bulkApiResponse:[],
            uploadedCsv:null,
            selectedFileName:"",
            uploadedInvoices:[],
            updatedCSV:"",
            updateProgressValue:0,
            updateProgressBarValue:0,
            companyList: [{value:'all',text:'All'}],
            attempList: [
                {value:'all',text:'All'},
                {value:'0',text:'0'},
                {value:'1',text:'1'},
                {value:'2',text:'2'},
                {value:'3',text:'3'},
            ],
            companies: [],
            companyId: this.$route.params.companyId,
            inProgress: false,
            pageLoading: false,
            isInitialLoad: false,
            selectedFilter: 'all',
            profileDetails: {},
            applicationList: [],
            pagination: { ...PAGINATION },
            searchText: '',
            notBefore: moment()
                .subtract(2, 'years')
                .toISOString(),
            orderDateRange: [null, null],
            statusFilterList: [
                {
                    text: 'All',
                    value: 'all'
                },
                {
                    text: 'Draft',
                    value: 'draft'
                },
                {
                    text: 'Open',
                    value: 'open'
                },
                {
                    text: 'Paid',
                    value: 'paid'
                },
                {
                    text: 'Uncollectible',
                    value: 'uncollectible'
                },
                {
                    text: 'Void',
                    value: 'void'
                }
            ],
            collectionMethodFilterList: [
                {
                    text: 'All',
                    value: 'all'
                },
                {
                    text: 'Charge Automatically',
                    value: 'charge_automatically'
                },
                {
                    text: 'Send Invoice',
                    value: 'send_invoice'
                }
            ],
            filters: {
                selectedCompany: 'all',
                plainTextSearch: '',
                collection_method: 'all',
                status: 'all',
                templateSearch: '',
                start: {
                    value: ''
                },
                end: {
                    value: ''
                },
                attemp: 'all'
            },
            contextMenuItems: [
                {
                    text: 'View Company',
                    action: 'edit'
                }
            ],
            currencyMap: {
                INR: '&#8377;'
            }
        };
    },
    mounted() {
        let query = null;
        if (this.$route.query && this.$route.query.query) {
            query = JSON.parse(this.$route.query.query);
            if (query.searchText) {
                this.searchText = query.searchText;
            }
            if (query.query) {
                let api_query = JSON.parse(query.query);
                if (
                    api_query.current_status &&
                    api_query.current_status.$regex
                ) {
                    this.filters.status = api_query.current_status.$regex;
                }
                if (
                    api_query.company_id
                ) {
                    this.filters.selectedCompany = String(api_query.company_id);
                }
                else{
                    this.filters.selectedCompany = 'all'
                }
                if (
                    api_query.collection_method
                ) {
                    this.filters.collection_method =
                        api_query.collection_method;
                }
                if (
                    api_query.attemp
                ) {
                    this.filters.attemp =
                        api_query.attemp;
                }
                if (
                    api_query['period.start'] &&
                    api_query['period.start'].$gte &&
                    api_query['period.end'] &&
                    api_query['period.end'].$lte
                ) {
                    this.orderDateRange = [
                        api_query['period.start'].$gte,
                        api_query['period.end'].$lte
                    ];
                }
            }
        }
        this.fetchCompany();
        this.fetchInvoiceList(query)
    },
    computed: {
        showUpdateProgress(){
            return this.updateProgressBarValue;
        }
    },
    filters: {
        formatDate(value) {
            if (value) {
                return moment(String(value)).format('Do MMM YY');
            }
        },
        removeUnderscore(value) {
            if (value) {
                return value.replace(/_/g, ' ');
            }
        }
    },
    methods: {
        onCompanySelect(company_id) {
            this.pagination = Object.assign({},this.pagination,{current:1})
            this.filters.selectedCompany = String(company_id);
            this.fetchInvoiceList();
        },
        companySearch(e) {
            debounce((text) => {
                this.fetchCompany(text);
            }, 600)(e.text);
        },
        fetchCompany(searchCompany) {
            const query = {
                page_no: 0,
                page_size: 10
            };

            if (searchCompany) {
                query.q = searchCompany;
            }
            return CompanyService.getCompanyList(query)
                .then(({ data }) => {
                    this.companies = data.items;
                    let companies = this.companies.map((item) => {
                        return {
                            text: `${item.name} (${item.uid})`,
                            value: String(item.uid)
                        };
                    });
                    companies.unshift({
                        text: `All`,
                        value: 'all'
                    });
                    this.companyList = companies;
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to load companies');
                    console.log(err);
                });
        },
        getCompanyProfileLink(item){
            let companyId = item.subscriber.unique_id;
            if (companyId) {
                return `/administrator/company-details/${companyId}?tab=Invoices`
            }
        },
        routeToCompanyProfile(e,item) {
            e.preventDefault()
            let companyId = item.subscriber.unique_id;
            if (companyId) {
                this.$router.push({
                    path: `/administrator/company-details/${companyId}?tab=Invoices`
                });
            }
        },
        getBillingPagePath(id){
            if (!this.companyId) {
                return `/administrator/subscription/invoices/${id}`
            } else {
                return `/administrator/company-details/${this.companyId}/billing-details/${id}`
            }
        },
        goToBillingPage(id,e) {
            e.preventDefault();
            if (!this.companyId) {
                this.$router.push({
                    path: `/administrator/subscription/invoices/${id}`
                });
            } else {
                this.$router.push({
                    path: `/administrator/company-details/${this.companyId}/billing-details/${id}`
                });
            }
        },
        fieldChanged() {
            this.pagination = Object.assign({},this.pagination,{current:1})
            this.fetchInvoiceList();
        },
        dateChanged() {
            this.pagination = Object.assign({},this.pagination,{current:1})
            this.fetchInvoiceList();
        },
        dateRangeChange() {
            this.pagination = Object.assign({},this.pagination,{current:1})
            // this.setRouteQuery({
            //     from_date: moment(this.orderDateRange[0]).format('MM-DD-YYYY'),
            //     to_date: moment(this.orderDateRange[1]).format('MM-DD-YYYY'),
            //     page: 1,
            // });
            this.fetchInvoiceList();
        },
        fetchInvoiceList(query) {
            query = query || this.requestQuery();
            this.inProgress = true;
            BillingService.getInvoiceListing(query).then((res) => {
                this.applicationList = res.data.items;
                this.pagination.total = res.data.page.item_total;
                this.pageLoading = false;
                this.inProgress = false;
            });
        },
        exportInvoiceList(query) {
            query = query || this.requestQuery();
            BillingService.exportInvoiceListing(query).then((res) => {
                this.pageLoading = false;
                this.inProgress = false;
                const anchor = document.createElement('a');
                anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(res.data);
                anchor.target = '_blank';
                anchor.download = 'FP_Report_Invoices.csv';
                anchor.click();
            });
        },
        getProfileDetails: function() {
            let params = {
                uid: this.companyId
                // phase: 'company_detail'
            };
            this.inProgress = true;
            CompanyService.fetchCompanyProfile(params)
                .then((res) => {
                    this.inProgress = false;
                    this.profileDetails = res.data;
                    // this.fetchInvoiceList();
                })
                .catch((err) => {
                    this.inProgress = false;
                    console.error(err);
                });
        },
        populateFromURL() {
            const { number, pageId } = this.$route.query;
            if (number) this.searchText = number;
            if (pageId) this.pageId = pageId;
        },
        debounceInput: debounce(function(e) {
            if (this.searchText.length === 0) {
                this.clearSearchFilter();
            } else {
                this.setRouteQuery({
                    number: { $regex: this.searchText, $options: 'ig' }
                });
            }
            this.fetchInvoiceList();
        }, 200),
        requestQuery() {
            const query = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit
            };
            let filterQuery = {
                total:{$gt:0}
            };
            if (this.searchText) {
                filterQuery.number = {
                    $regex: this.searchText,
                    $options: 'ig'
                };
            }
            if (this.companyId) {
                filterQuery.company_id = this.companyId;
            }
            if (this.orderDateRange[0] && this.orderDateRange[1]) {
                let start = this.orderDateRange[0];
                let end = this.orderDateRange[1]
                end = moment(end).add(1, 'd').utc().format()
                if (start) {
                    filterQuery['period.start'] = { $gte: start };
                }
                if (end) {
                    filterQuery['period.end'] = { $lte: end };
                }
            }
            if (this.filters.status !== 'all') {
                filterQuery.current_status = {
                    $regex: this.filters.status,
                    $options: 'ig'
                };
            }
            if (this.filters.collection_method !== 'all') {
                filterQuery.collection_method = this.filters.collection_method
            }

            if (this.filters.attemp !== 'all') {
                filterQuery.attemp = Number(this.filters.attemp)
            }

            if (this.filters.selectedCompany !== 'all') {
                filterQuery.company_id = Number(this.filters.selectedCompany);
            }
            query.query = JSON.stringify(filterQuery);
            this.$router
                .replace({
                    name: this.$route.name,
                    query: {
                        ...this.$route.query,
                        query: JSON.stringify(
                            Object.assign(
                                {},
                                this.$route.query && this.$route.query.query
                                    ? JSON.parse(this.$route.query.query)
                                    : {},
                                query
                            )
                        )
                    }
                })
                .catch(() => {});
            return query;
        },
        paginationChange(filter, action) {
            const { current, limit } = filter;
            this.pagination.current = current;
            this.pagination = Object.assign({}, this.pagination, filter);
            this.fetchInvoiceList();
        },
        clearSearchFilter() {
            this.searchText = '';
            this.setRouteQuery({ number: undefined });
        },
        setRouteQuery(query) {
            if (query.number || query.stage !== 'all') {
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
        redirectToListing() {
            this.$router.push({ path: '/administrator/company-list' });
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
        openUploadCSVDialog() {
            this.$refs['dialog'].open({
                width: '700px',
                height: '550px',
                showCloseButton: true,
                dismissible: false,
            });
        },
        close(e) {
            this.$emit('close');
            this.resetFileUploadInput();
        },
        resetFileUploadInput(){
            document.querySelector('#csvFileInput').value=null;
            this.uploadedInvoices = [];
            this.selectedFileName="";
            this.updateProgressValue=0;
            this.updateProgressBarValue=0;
        },
        uploadCSVChange(e){
            this.selectedFileName = e.target.files[0].name;
            this.uploadedInvoices = [];
            this.updateProgressValue=0;
            this.updateProgressBarValue=0;
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const input=e.target.result;
                csv()
                .fromString(input)
                .then((csvRow)=>{ 
                    this.uploadedInvoices=csvRow
                })
            }
            reader.readAsText(file);
        },
        makePromise(invoice){
            return new Promise((resolve,reject)=>{
                BillingService.bulkUpdateOfflinePayment({
                    "invoice_id":invoice.invoice_id,
                    "payment_intent_id":invoice.update_payment_intent_id || "",
                    "status":invoice.update_status || "",
                    "comment":invoice.update_comment,
                    "invoice_number":invoice.update_invoice_number,
                }).then(res=>{
                    resolve(res);
                }).catch(err=>{
                    resolve(err)
                })
            })
        },
        uploadCSV(){
            this.updateProgressValue=0;
            this.updateProgressBarValue=0;
            let arr = [];
            if(this.uploadedInvoices.length){
            this.uploadedInvoices.forEach((element)=>{
                arr.push(this.makePromise(element));
            })

            let arrRes = BlueBird.map(arr, (res) => {
                            this.updateProgressBarValue++
                            return {
                                status:res.status,
                                ...res.response
                            }
                        },{concurrency: 1});

            arrRes.then(res=>{
                res.forEach((ele)=>{
                    if(ele.status===200){
                    this.uploadedInvoices[this.updateProgressValue].server_status="success";
                    this.uploadedInvoices[this.updateProgressValue].server_response="update successful";
                    }else{
                        this.uploadedInvoices[this.updateProgressValue].server_status="failure";
                        this.uploadedInvoices[this.updateProgressValue].server_response=ele.data.message;
                        if(!ele.data.message){
                            this.uploadedInvoices[this.updateProgressValue].server_response="Something went wrong"
                        }
                    }
                    this.updateProgressValue++;
                })
                if(this.updateProgressValue>=this.uploadedInvoices.length){
                    const items = this.uploadedInvoices
                        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
                        const header = Object.keys(items[0])
                        const csv = [
                        header.join(','), // header row first
                        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
                        ].join('\r\n')
                        const anchor = document.createElement('a');
                        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                        anchor.target = '_blank';
                        anchor.download = 'FP_Report_Invoices.csv';
                        anchor.click();
                }
            })
        }
        },
    }
};
</script>
