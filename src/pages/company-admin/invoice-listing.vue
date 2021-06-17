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
                        <div class="flex flex-2" style="margin-top:6px;">
                            <nitrozen-input
                                :showSearchIcon="true"
                                class="search flex-1"
                                type="search"
                                id="search-by-number"
                                placeholder="Search by number..."
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
                    </div>
                </div>
            </div>
            <div
                v-if="
                    !inProgress && applicationList && applicationList.length > 0
                "
            >
                <div
                    class="container m-t-24"
                    v-for="(item, index) in applicationList"
                    :key="index"
                    :title="item.name"
                    @click="goToBillingPage(item._id)"
                >
                    <div class="line-1">
                        <div
                            v-if="item.client && item.client.name"
                            class="cust-head"
                        >
                            <div @click.stop="routeToCompanyProfile(item)">
                                {{ item.client.name }}
                            </div>
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
                    
                </div>
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

::v-deep .page-slot {
    display: flex;
    flex: 1;
    justify-content: flex-start !important;
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
    NitrozenDropdown
} from '@gofynd/nitrozen-vue';
import { FETCH_METRICS } from '@/store/action.type';
import marketplaceChannels from './mkp-channels.vue';
import moment from 'moment';
import { titleCase, debounce } from '@/helper/utils';
import pageempty from '@/components/common/page-empty.vue';
import root from 'window-or-global';
import companyListVue from './company-list.vue';

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
        'date-picker': DatePicker
    },
    computed: {},
    data() {
        return {
            companyList: [{value:'all',text:'All'}],
            attempList: [
                {value:'all',text:'all'},
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
                    api_query.collection_method &&
                    api_query.collection_method
                ) {
                    this.filters.collection_method =
                        api_query.collection_method;
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
    computed: {},
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
        routeToCompanyProfile(item) {
            let companyId = item.subscriber.unique_id;
            if (companyId) {
                this.$router.push({
                    path: `/administrator/company-details/${companyId}`
                });
            }
        },
        goToBillingPage(id) {
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
            this.fetchInvoiceList();
        },
        dateChanged() {
            this.fetchInvoiceList();
        },
        dateRangeChange() {
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
            let filterQuery = {};
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
                let end = this.orderDateRange[1];
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
        }
    }
};
</script>
