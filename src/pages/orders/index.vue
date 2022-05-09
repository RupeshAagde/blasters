<template>
    <div class="panel">
        <adm-page-header
            class="titlize"
            :showBackButton="isFPApp"
            @backClick="isFPApp ? onAppBack() : () => {}"
            :title="'Orders'"
            :noContextMenu="true"
        >
            <div class="button-box">
                <!-- <label class="toggle-label">
                    <div class="cl-RoyalBlue bold-xxxs toggle-label-div">
                        Auto Refresh
                    </div>
                    <nitrozen-toggle-btn
                        class="pad-right"
                        @change="setAutoRefresh"
                        v-model="autoRefresh"
                    ></nitrozen-toggle-btn>
                </label> -->
                <label class="toggle-label">
                    <div
                        class="cl-RoyalBlue bold-xxxs status-text toggle-label-div"
                    >
                       Hide Locked Orders
                    </div>
                    <nitrozen-toggle-btn
                        class="pad-right"
                        @change="setLockShipment"
                        v-model="lockShipment"
                    ></nitrozen-toggle-btn>
                </label>
            </div>
            <template slot="page-slot-mobile">
                <div class="button-box">
                    <label class="toggle-label">
                        <div class="cl-RoyalBlue bold-xxxs toggle-label-div">
                            Auto Refresh
                        </div>
                        <nitrozen-toggle-btn
                            class="pad-right"
                            v-model="autoRefresh"
                        ></nitrozen-toggle-btn>
                    </label>
                    <label class="toggle-label">
                        <div
                            class="cl-RoyalBlue bold-xxxs status-text toggle-label-div"
                        >
                            Hide Locked Orders
                        </div>
                        <nitrozen-toggle-btn
                            class="pad-right"
                            v-model="lockShipment"
                        ></nitrozen-toggle-btn>
                </label>
                </div>
            </template>
            <nitrozen-menu class="order-menu" mode="vertical">
                <!-- <template v-if="!isApplicationLevel && storeList.length > 0">
                    <nitrozen-menu-item @click="goToPicklist">
                        Picklist
                    </nitrozen-menu-item>
                    <nitrozen-menu-item @click="exportOrders('invoices')">
                        Bulk Invoices
                    </nitrozen-menu-item>
                    <nitrozen-menu-item @click="exportOrders('manifest')">
                        Manifest
                    </nitrozen-menu-item>
                    <nitrozen-menu-item @click="goToExportList">
                        Exports
                    </nitrozen-menu-item>
                </template> -->
                <nitrozen-menu-item @click="$root.$emit('openHelp')">
                    Help
                </nitrozen-menu-item>
            </nitrozen-menu>
        </adm-page-header>
        <div class="main-container">
            <div class="page-container">
                <div class="tab-row" v-show="!pageError">
                    <nitrozen-tab
                        ref="tabs"
                        class="tabs"
                        @tab-change="selectStageTab"
                        :tabItem="stages.map((s) => getTabText(s))"
                        :active-index="selectedStageTabIndex"
                    ></nitrozen-tab>
                    <!-- <div
                        class="refresh-icon"
                        @click="searchOrders"
                        title="Refresh Orders"
                    >
                        <inline-svg src="refresh"></inline-svg>
                    </div> -->
                </div>
                <div class="content-container">
                    <div class="search-box" v-show="!pageError">
                        <div
                            v-if="inProgress && isInitialLoad"
                            class="input-shimmer shimmer"
                        ></div>
                        <template v-else>
                            <div class="filter-row search-div">
                                <nitrozen-dropdown
                                    class="filter-type filter-input-sm"
                                    label="Search Type"
                                    @change="changeFilterType"
                                    :items="filterTypeList"
                                    v-model="filterType"
                                >
                                </nitrozen-dropdown>
                                <nitrozen-input
                                    label="Search"
                                    :showSearchIcon="true"
                                    class="search filter-input-lg"
                                    type="search"
                                    :placeholder="`Search by ${searchPlaceholder}`"
                                    v-model="search"
                                    @keyup.enter="searchOrders()"
                                    @blur="searchOrders()"
                                ></nitrozen-input>
                                <div></div>
                                <!-- <div class="cl-Mako">
                                    {{
                                        `${
                                            pagination
                                                ? '' +
                                                  pagination.total +
                                                  ' orders found'
                                                : ''
                                        }`
                                    }}
                                </div> -->
                            </div>
                            <div class="filter-row">
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
                                    :not_after="new Date().toISOString()"
                                    :useNitrozenTheme="true"
                                    @input="dateRangeChange"
                                />

                                <nitrozen-dropdown
                                    v-if="storeList.length"
                                    label="Fulfillment Store"
                                    class="filter-dropdown filter-input-sm"
                                    :searchable="true"
                                    :items="filteredStores"
                                    v-model="selectedStore"
                                    @change="filterChange"
                                    @searchInputChange="
                                        searchStore($event.text)
                                    "
                                >
                                    <template slot="option" slot-scope="slotProps">
                                        <div
                                            class="custom-store-dropdown-option"
                                            :class="{ selected: slotProps.selected }"
                                        >
                                            <div class="option-content">
                                                <div class="text">
                                                    {{ slotProps.item.text }}
                                                </div>
                                                <div class="subtext">
                                                    {{ slotProps.item.store_code }}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </nitrozen-dropdown>
                                

                                 <nitrozen-dropdown
                                    v-if="deploymentStoreList.length"
                                    label="Deployment Store"
                                    class="filter-dropdown filter-input-sm deployment-dropdown"
                                    :searchable="true"
                                    :items="filteredDeploymentStores"
                                    v-model="selectedDeploymentStore"
                                    @change="filterChange"
                                    @searchInputChange="
                                        searchDeploymentStore($event.text)
                                    "
                                >
                                    <template slot="option" slot-scope="slotProps">
                                        <div
                                            class="custom-store-dropdown-option"
                                            :class="{ selected: slotProps.selected }"
                                        >
                                            <div class="option-content">
                                                <div class="text">
                                                    {{ slotProps.item.text }}
                                                </div>
                                                <div class="subtext">
                                                    {{ slotProps.item.store_code }}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </nitrozen-dropdown>

                                <!-- <nitrozen-button
                                            class="more-filters-button"
                                            theme="secondary"
                                            @click.stop="
                                                viewMoreFilters = !viewMoreFilters
                                            "
                                            v-show="stagesSubFilterItems.length"
                                        >
                                            More Filters
                                            <ukt-inline-svg
                                                src="dropdown-arrow-down"
                                            ></ukt-inline-svg>
                                        </nitrozen-button> -->
                                <!-- <div
                                            class="more-filters"
                                            v-show="viewMoreFilters"
                                            v-clickOutside="closeMoreFilters"
                                        > -->
                                <div
                                    class="more-filter-item filter-input-sm"
                                    v-for="(f, i) in stagesSubFilterItems"
                                    :key="i"
                                >
                                    <nitrozen-dropdown
                                        :label="f.text"
                                        class="filter-dropdown"
                                        :items="f.options"
                                        v-model="stagesSubFilter[f.value]"
                                        :multiple="f.type == 'multi_select'"
                                        @change="filterChange"
                                    ></nitrozen-dropdown>
                                </div>
                            </div>

                            <div class="filter-row">
                                <nitrozen-dropdown
                                    v-if="allCompanies"
                                    label="Company"
                                    class="filter-dropdown filter-input-sm company-dropdown"
                                    :searchable="true"
                                    :items="allCompanies"
                                    v-model="selectedCompany"
                                    @change="companyChange"
                                    @searchInputChange="searchCompany($event.text)"
                                >
                                </nitrozen-dropdown>
                                <nitrozen-error v-if="noCompanyFound">
                                    No companies found with {{ searchCompanyText }}
                                </nitrozen-error>

                                <nitrozen-dropdown
                                    v-if="selectedCompany && allSalesChannels.length"
                                    label="Sales Channel"
                                    class="filter-dropdown filter-input-sm apps-dropdown"
                                    :items="allSalesChannels"
                                    v-model="selectedSalesChannels"
                                    @change="filterChange"
                                    :multiple="true"
                                ></nitrozen-dropdown>
                            </div>

                            <!-- Adding reset btn to clear search field,sales channel,status-->
                            <div class="filter-row">
                                 <nitrozen-button :theme="'secondary'" @click="resetFilter">Reset Filter</nitrozen-button>
                            </div>
                        </template>
                    </div>
                    <adm-shimmer
                        v-if="inProgress && !pageError"
                        :count="4"
                    ></adm-shimmer>
                    <div v-else-if="!inProgress && pageError">
                        <page-error
                            v-if="apps.length > 0"
                            :errorText="errorText"
                            @tryAgain="fetchOrders"
                        ></page-error>
                        <adm-no-content
                            v-else
                            helperText="The order data is unavailable because there are no sales channels."
                        ></adm-no-content>
                    </div>
                    <div v-else-if="orders && orders.length">
                        <order-list-item
                            v-for="(order, index) in orders"
                            :key="order.id + index"
                            class="item"
                            :data="order"
                        ></order-list-item>
                    </div>
                    <div v-else class="empty-state">
                        <adm-no-content
                            helperText="No orders found for specified date range and filters"
                        ></adm-no-content>
                    </div>
                    <div
                        class="pagination-div"
                        v-if="orders && orders.length && !inProgress"
                    >
                        <nitrozen-pagination
                            name="Orders"
                            v-model="pagination"
                            @change="paginationChange"
                            :pageSizeOptions="[5, 10, 20, 50, 100, 200]"
                        ></nitrozen-pagination>
                    </div>
                </div>
            </div>
        </div>

 
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import loader from '@/components/common/loader.vue';
import AdmShimmer from '@/components/common/shimmer.vue';
import PageError from '@/components/common/page-error';
import AdmNoContent from '@/components/common/adm-no-content.vue';
import OrderListItem from './order-list-item.vue';
import DatePicker from '@/components/common/date-picker.vue';
import OrderService from '@/services/orders.service';
import AdminMarketplacesService from '@/services/admin-marketplaces.service'; // why its in marketplace?
import CompanyService from '@/services/company-admin.service';
import AdmPageHeader from '@/components/common/layout/page-header.vue';
import { dateRangeShortcuts } from '@/helper/datetime.util';
import InlineSvg from '@/components/common/adm-inline-svg.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import { GET_USER_INFO } from '@/store/getters.type';
import {
    LocalStorageService,
    STORAGE_KEYS,
} from '@/services/localstorage.service';
import APP_SERVICE_API from '@/services/app.service';
// import {
//     GET_COMPANY_APPLICATIONS,
//     GET_EMPLOYEE_ACCESS_DETAIL,
// } from '@/store/getters.type';
import moment from 'moment';
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';
import mapValues from 'lodash/mapValues';
import find from 'lodash/find';

import {
    NitrozenButton,
    NitrozenToggleBtn,
    flatBtn,
    strokeBtn,
    clickOutside,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenPagination,
    NitrozenTab,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenError
} from '@gofynd/nitrozen-vue';

const PAGINATION = {
    limit: 0,
    current: 0,
    total: 0,
};
// const extraDateRange = [
//     {
//         text: 'Last 6 Months',
//         start: moment().subtract(6, 'months'),
//         end: new Date(),
//     },
// ];
const AUTO_REFRESH_TIME = 10 * 60 * 1000; // 10 mins
export default {
    components: {
        AdmShimmer,
        AdmNoContent,
        OrderListItem,
        loader,
        PageError,
        DatePicker,
        AdmPageHeader,
        NitrozenButton,
        NitrozenError,
        NitrozenDropdown,
        NitrozenInput,
        NitrozenPagination,
        NitrozenTab,
        NitrozenMenu,
        NitrozenMenuItem,
        InlineSvg,
        UktInlineSvg,
        NitrozenToggleBtn,
    },
    directives: { flatBtn, strokeBtn, clickOutside },
    data() {
        return {
            inProgress: false,
            pageError: false,
            errorText: undefined,
            orders: [],
            companyId: this.$route.params.company_id,
            applicationId: this.$route.params.applicationId,
            lockShipment: false,
            stages: [{
                "text": "All",
                "value": "all",
                "count": 0
            }, {
                "text": "New",
                "value": "new",
                "count": 0
            }, {
                "text": "Processing",
                "value": "processing",
                "count": 0
            }, {
                "text": "Processed",
                "value": "processed",
                "count": 0
            }, {
                "text": "Returns",
                "value": "returns",
                "count": 0
            }, {
                "text": "Escalations",
                "value": "escalations",
                "count": 0
            }],
            filters: null,
            applied_filters: null,
            stagesSubFilter: {},
            storeList: [],
            filteredStores: [],
            deploymentStoreList: [],
            filteredDeploymentStores: [],
            viewMoreFilters: false,

            selectedStageTabIndex: 1,
            selectedStageTab: 'all',
            selectedStore: '',
            selectedDeploymentStore: '',
            search: '',
            pagination: { ...PAGINATION },
            isInitialLoad: true,

            notBefore: moment().subtract(3, 'months').toISOString(),
            orderDateRange: [
                moment().subtract(1, 'weeks').toISOString(),
                moment().toISOString(),
            ],
            dateRangeShortcuts: [...dateRangeShortcuts],
            filterType: 'auto',
            prioritySort: true,
            searchPlaceholder: 'Fynd Order ID, Shipment ID, Fynd Bag ID, Mobile & Email',
            filterTypeList: [
                {
                    text: 'Auto',
                    value: 'auto',
                },
                {
                    text: 'Company',
                    value: 'value'
                },
                {
                    text: 'Fynd Order ID',
                    value: 'order.fynd_order_id',
                },
                {
                    text: 'Shipment ID',
                    value: 'shipment_id',
                },
                {
                    text: 'Fynd Bag ID',
                    value: 'shipment_status.bag_list',
                },
                {
                    text: 'External Order ID',
                    value: 'affiliate_details.affiliate_order_id',
                },
                {
                    text: 'External Bag ID',
                    value: 'affiliate_details.affiliate_bag_id',
                },
                {
                    text: 'Customer Name',
                    value: 'delivery_address.name',
                },
                {
                    text: 'Customer Phone',
                    value: 'user.mobile',
                },
                {
                    text: 'Customer Email',
                    value: 'user.email',
                },

                {
                    text: 'AWB Number',
                    value: 'dp_details.awb_no',
                },
                {
                    text: 'Invoice ID',
                    value: 'invoice.store_invoice_id',
                },
                {
                    text: 'SKU Code',
                    value: 'bags.article.identifiers.sku_code',
                },
                {
                    text: 'EAN',
                    value: 'bags.article.identifiers.ean',
                },
            ],
            autoRefresh: false,
            autoRefreshId: null,
            allCompaniesInfo: [],
            allCompanies: null,
            selectedCompany: null,
            noCompanyFound: false,
            searchCompanyText: '',
            allSalesChannels: [],
            selectedSalesChannels: [],
            pageRefresh: false
        };
    },
    computed: {
        ...mapGetters({
            userinfo: GET_USER_INFO,
            apps: [],//GET_COMPANY_APPLICATIONS,
        }),

        stagesSubFilterItems() {
            try {
                const tabStageIndex = findIndex(this.stages, {
                    value: this.selectedStageTab,
                });
                const tabStage = this.filters.stage;
                this.stagesSubFilter = {};

                // this.selectedStageTab = tabStage.value;
                // this.selectedStageTabIndex = tabStageIndex;
                this.$refs.tabs.activeTab = tabStageIndex;
                tabStage.filters.map((f) => {
                    // f.options = sortBy(f.options, ['text']);
                    const appliedValue = this.applied_filters[f.value];
                    switch (f.type) {
                        case 'multi_select':
                            this.stagesSubFilter[f.value] = appliedValue || [];
                            break;
                        default:
                            this.stagesSubFilter[f.value] = appliedValue || '';
                    }
                });

                return tabStage.filters;
            } catch (err) {
                return [];
            }
        },
    },

    mounted() {
        // this.fetchStores();
        // if(this.applicationId){
        //     this.fetchDeploymentStores();
        // }
        if(!this.pageRefresh) {
            this.populateFromURL();
            this.fetchOrders();
        } else {
            this.pageRefresh = false;
        }
        this.populateFilters();
        this.fetchCompanyList();
        
        // this.fetchOrderLaneCount(true);
        const auto_refresh = LocalStorageService.getItem(
            STORAGE_KEYS.AUTO_REFRESH_ORDER
        );
        if (auto_refresh) {
            this.autoRefresh = auto_refresh;
            this.activateAutoRefresh();
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            /* In case of refresh button being clicked */
            if(from.path === '/') {
                vm.pageRefresh = true;
                vm.resetFilter();
            }
        })
    },
    methods: {
        fetchCompanyList(query) {
            return CompanyService.getCompanyList(query)
            .then(response => {
                if(response.data.items.length === 0) {
                    this.noCompanyFound = true;
                    this.allCompaniesInfo = [];
                    this.allCompanies = [];
                } else {
                    this.noCompanyFound = false;
                    this.allCompaniesInfo = response.data.items;
                    this.allCompanies = response.data.items.map(item => {
                        return {
                            text: item.name,
                            value: item.uid
                        }
                    });
                }
            })
        },
        fetchApplications() {
            return CompanyService.fetchApplication(this.selectedCompany, {page_size: 150})
            .then(response => {
                this.allSalesChannels = response.data.items.map(item => {
                    return {
                        text: item.name,
                        value: item.id
                    }
                });
            })
        },
        companyChange() {
            this.fetchApplications();
            this.filterChange();
        },
        searchCompany(e) {
            if(e.length === 0) {
                this.selectedCompany = null;
                this.selectedSalesChannels = [];
                this.fetchOrders();
            }
            this.searchCompanyText = e;
            this.fetchCompanyList({q: e});
        },
        getTabText(stage) {
            return stage && stage.text;
            // let tabText = stage && stage.text ? `${stage.text} ` : '';
            // if (stage.count) {
            //     let count = Number(stage.count) / 1000;
            //     tabText =
            //         count >= 1
            //             ? `${stage.text} (${count.toFixed(2)}K)`
            //             : `${stage.text} (${stage.count})`;
            // }
            // return tabText;
        },
        setLockShipment() {
            const status = this.lockShipment;
            setTimeout(() => {
                this.setRouteQuery({lock_status: status})
            },500)
        },
        // fetchStores() {
        //     this.inProgress = true;
        //     const params = {
        //         company_id: this.companyId,
        //         sku_opt_details: false,
        //         page_no: 1,
        //         page_size: 10000, // support of all or search required
        //         image_size: 'large',
        //     };
            // const caller = AdminMarketplacesService.getStoreDetails(params);
            // caller
            //     .then(({ data }) => {
            //         this.filteredStores = this.storeList = data.items.map(
            //             (store) => {
            //                 store.text = store.name;
            //                 store.value = store.uid;
            //                 store.store_code=store.store_code;
                            
            //                 return store;
            //             }
            //         );

            //         this.filteredStores = accessibleStoreIds


            //         this.filteredStores = this.storeList = sortBy(
            //             this.filteredStores,
            //             ['text']
            //         );
            //         this.populateFilters();
            //         this.fetchOrders();
            //     })
            //     .catch((err) => {
            //         console.error(err);
            //     })
            //     .finally(() => {
            //         // this.inProgress = false;
            //     });
        // },
        // fetchDeploymentStores() {
        //     this.inProgress = true;
        //     const params = {
        //         only_deployed:true,
        //         page_no: 1,
        //         page_size: 10000, // support of all or search required
               
        //     };
        //     const app_details ={_id:this.applicationId};
        //     APP_SERVICE_API.fetchfilteredDeploymentStoresStaffAccessible(params,app_details)
        //     .then(({ data }) => {
        //             this.filteredDeploymentStores = this.deploymentStoreList = data.items.map(
        //                 (store) => {
        //                     store.text = store.name;
        //                     store.value = store.uid;
        //                     store.store_code=store.store_code;
        //                     return store;
        //                 }
        //             );


        //             this.filteredDeploymentStores = this.deploymentStoreList = sortBy(
        //                 this.filteredDeploymentStores,
        //                 ['text']
        //             );
        //             this.populateFilters();
        //             this.fetchOrders();
        //         })
        //         .catch((err) => {
        //             console.error(err);
        //         })
        //         .finally(() => {
        //             // this.inProgress = false;
        //         });
        // },
        searchStore(text) {
            text = text ? text.toLowerCase():text;
            if (text) {
              
                this.filteredStores = this.storeList.filter( s => s.text.toLowerCase().includes(text) || s.uid.toString().toLowerCase().includes(text) || s.store_code.toString().toLowerCase().includes(text) ? true :false);
            } else {
                this.selectedStore = '';
                this.filteredStores = this.storeList;
                this.filterChange();
            }
        },
        searchDeploymentStore(text) {
            text = text ? text.toLowerCase():text;
            if (text) {
              
                this.filteredDeploymentStores = this.deploymentStoreList.filter( s => s.text.toLowerCase().includes(text) || s.uid.toString().toLowerCase().includes(text) || s.store_code.toString().toLowerCase().includes(text) ? true :false);
            } else {
                this.selectedDeploymentStore = '';
                this.filteredDeploymentStores = this.deploymentStoreList;
                this.filterChange();
            }
        },
        getOrderRequestParams() {
            let params = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit,
                from_date: moment(this.orderDateRange[0]).format('MM-DD-YYYY'),
                to_date: moment(this.orderDateRange[1]).format('MM-DD-YYYY'),
                stores: this.selectedStore,
                deployment_stores: this.selectedDeploymentStore,
                stage: this.selectedStageTab,
                is_priority_sort: this.prioritySort,
                lock_status: this.lockShipment,
                q: this.search,
                filter_type: this.filterType,
                company_id: this.selectedCompany,
                sales_channels: this.selectedSalesChannels,
                ...this.stagesSubFilter,
            };

            params = mapValues(params, (value, key) => {
                if (Array.isArray(value)) {
                    return value.toString();
                }
                return value;
            });
            return params;
        },
        fetchOrders() {
            this.inProgress = true;
            const params = this.getOrderRequestParams();
            
            const get_order_promise = OrderService.fetchOrders(params)
                get_order_promise.then(({ data }) => {
                    this.pageError = false;
                    this.errorText = undefined;
                    this.orders = data.items;

                    // Will handle New updated count in the lane
                    this.stages[this.selectedStageTabIndex].count =
                        data.page.total;

                    this.applied_filters = data.applied_filters;
                    this.filters = data.filters;

                    this.pagination = {
                        limit: data.page ? data.page.size : 10,
                        current: data.page ? data.page.current : 1,
                        total: data.page.total,
                    };

                    this.$router
                        .replace({
                            query: {
                                ...mapValues(
                                    this.applied_filters,
                                    (value, key) => {
                                        if (Array.isArray(value)) {
                                            return value.toString();
                                        }
                                        return value;
                                    }
                                ),
                            },
                        })
                        .catch(() => {});
                })
                .catch((err) => {
                    console.error(err);
                    if (
                        err &&
                        err.response &&
                        err.response.data &&
                        err.response.data.message
                    ) {
                        this.errorText = err.response.data.message;
                    }
                    this.pageError = true;
                })
                .finally(() => {
                    this.inProgress = false;
                    this.isInitialLoad && (this.isInitialLoad = false);
                });
        },
        fetchOrderLaneCount(isMounted = false) {
            this.inProgress = true;
            // const params = this.getOrderRequestParams();
            // OrderService.fetchOrderLanesCount(this.companyId, params)
            //     .then(({ data }) => {
            //         this.pageError = false;
            //         this.errorText = undefined;
            //         this.stages = data.stages;
            //         if(isMounted){
            //             this.populateFilters();
            //             this.fetchOrders();
            //         }
            //     })
            //     .catch((err) => {
            //         console.error(err);
            //         if (
            //             err &&
            //             err.response &&
            //             err.response.data &&
            //             err.response.data.message
            //         ) {
            //             this.errorText = err.response.data.message;
            //         }
            //         this.pageError = true;
            //     })
            //     .finally(() => {
            //         // this.inProgress = false;
            //         this.isInitialLoad && (this.isInitialLoad = false);
            //     });
        },
        searchOrders() {
            // this.fetchOrderLaneCount();
            this.setRouteQuery({ search: this.search, page: 1 });
        },
        selectStageTab(e) {
            if (this.stages[e.index]) {
                this.selectedStageTab = this.stages[e.index].value;
                this.selectedStageTabIndex = e.index;
            } else {
                this.selectedStageTab = 'all';
                this.selectedStageTabIndex = 0;
            }

            this.stagesSubFilter = {};

            // reset page number
            this.pagination.current = 1;

            this.setRouteQuery({ stage: this.selectedStageTab });

            //eventHelper.trackLanes()
        },
        dateRangeChange() {
            // this.fetchOrderLaneCount();
            const to_date = moment(this.orderDateRange[1]).format('MM-DD-YYYY')
            const from_date = moment(this.orderDateRange[0]).format('MM-DD-YYYY')
            let date_diff =  moment(to_date, 'MM-DD-YYYY').diff(moment(from_date, 'MM-DD-YYYY'), 'days');
            LocalStorageService.addOrUpdateItem(
                    STORAGE_KEYS.ORDER_DATE_RANGE,
                    date_diff
                );
            this.setRouteQuery({
                from_date,
                to_date,
                page: 1,
            });
        },
        filterChange() {
            this.pagination.current = 1;
            this.setRouteQuery({
                deployment_stores:this.selectedDeploymentStore,
                stores: this.selectedStore,
                page: 1,
            });
            if (this.selectedStore) {
                LocalStorageService.addOrUpdateItem(
                    STORAGE_KEYS.USER_ORDER_STORE_PREFERENCE,
                    this.selectedStore
                );
            } else {
                LocalStorageService.removeItem(
                    STORAGE_KEYS.USER_ORDER_STORE_PREFERENCE
                );
            }
        },
        paginationChange(e) {
            this.pagination = e;
            this.setRouteQuery({
                page: this.pagination.current,
                limit: this.pagination.limit,
            });
        },
        populateFromURL() {
            const {
                search,
                page,
                limit,
                from_date,
                to_date,
                stage,
                filterType,
                is_priority_sort,
                lock_status,
                company_id,
                sales_channels
            } = this.$route.query;

            this.pagination.current = +page || this.pagination.current;
            this.pagination.limit = +limit || this.pagination.limit;
            this.selectedStageTab = stage || 'new';
            this.search = search || this.search;
            this.filterType = filterType || 'auto';
            this.prioritySort = is_priority_sort || true;
            this.lockShipment = lock_status === "true";
            this.selectedCompany = company_id;
            if(company_id) {
                this.selectedSalesChannels = sales_channels || [];
            }
            this.changeFilterType();
            this.populateFilters();
            // if (from_date && moment(from_date, 'MM-DD-YYYY').isValid()) {
            //     this.orderDateRange[0] = moment(
            //         from_date,
            //         'MM-DD-YYYY'
            //     ).toISOString();
            // }
            // if (to_date && moment(to_date, 'MM-DD-YYYY').isValid()) {
            //     this.orderDateRange[1] = moment(
            //         to_date,
            //         'MM-DD-YYYY'
            //     ).toISOString();
            // }
            let date_diff = 7 //default date diff
            if(from_date && moment(from_date, 'MM-DD-YYYY').isValid() && to_date && moment(to_date, 'MM-DD-YYYY').isValid()){
                date_diff = moment(to_date, 'MM-DD-YYYY').diff(moment(from_date, 'MM-DD-YYYY'), 'days');
                LocalStorageService.addOrUpdateItem(STORAGE_KEYS.ORDER_DATE_RANGE,date_diff);
            } else if(LocalStorageService.getItem(STORAGE_KEYS.ORDER_DATE_RANGE)){
                date_diff = LocalStorageService.getItem(STORAGE_KEYS.ORDER_DATE_RANGE)
            } else {
                LocalStorageService.addOrUpdateItem(STORAGE_KEYS.ORDER_DATE_RANGE,date_diff);
            }
            this.orderDateRange = [
                moment().subtract(date_diff, 'days').toISOString(),
                moment().toISOString()
            ]

            // TODO: make it dynamic
            // @NOTE Plan to cache from Backend
            const { status, dp } = this.$route.query;
            if (sales_channels) {
                this.stagesSubFilter['sales_channels'] = sales_channels.split(
                    ','
                );
            }
            if (status) {
                this.stagesSubFilter['status'] = status.split(',');
            }

            if (dp) {
                this.stagesSubFilter['dp'] = dp.split(",");
            }
        },
        populateFilters() {
            const { stores, deployment_stores, sales_channels } = this.$route.query;

            // store state manage for filter preference: query over localstorage
            const ls_stores = LocalStorageService.getItem(
                STORAGE_KEYS.USER_ORDER_STORE_PREFERENCE
            );
            const storesValueArray = this.storeList.map((f) =>
                f.value.toString()
            );
            if (storesValueArray.includes(stores)) {
                this.selectedStore = stores;
            } else if (
                ls_stores &&
                storesValueArray.includes(ls_stores.toString())
            ) {
                this.selectedStore = ls_stores.toString();
            }

            if(this.selectedCompany) {
                this.fetchApplications()
                .then(() => {
                    this.selectedSalesChannels = sales_channels.split(',');
                })
            }

            const deploymentStoresValueArray = this.deploymentStoreList.map((f) =>
                f.value.toString()
            );
            if(deployment_stores && deploymentStoresValueArray.includes(deployment_stores)){
                this.selectedDeploymentStore = deployment_stores;
            }
        },
        setRouteQuery: function (query) {
            if (
                query.search ||
                query.status ||
                query.page ||
                query.limit ||
                query.from_date ||
                query.to_date ||
                query.lock_status
            ) {
                this.$router
                    .push({
                        path: this.$route.path,
                        query: {
                            ...this.$route.query,
                            ...query,
                        },
                    })
                    .catch(() => {});
            }
            this.fetchOrders();
        },
        // goToPicklist() {
        //     const { from_date, to_date, stage, stores } = this.$route.query;
        //     this.$router.push({
        //         name: this.applicationId
        //             ? 'application-order-picklist'
        //             : 'company-order-picklist',
        //         query: { from_date, to_date, stage, stores },
        //     });
        // },
        // goToExportList() {
        //     let store;
        //     try {
        //         store = find(this.storeList, {
        //             uid: parseInt(this.selectedStore),
        //         });
        //         if (!store) {
        //             throw 'select store';
        //         }
        //     } catch (e) {
        //         this.$snackbar.global.showInfo(
        //             'Please select store to export data'
        //         );
        //         return;
        //     }
        //     const params = {
        //         storeCode: store.store_code,
        //         type: 0,
        //     };
        //     this.$router.push({
        //         name: this.applicationId
        //             ? 'application-order-export-list'
        //             : 'company-order-export-list',
        //         params: params,
        //     });
        // },
        // closeMoreFilters() {
        //     this.viewMoreFilters = false;
        // },
        // getUid() {
        //     return new Date().valueOf().toString(36);
        // },
        // getExportPayload(store_code, store_id) {
        //     let payload = {
        //         filters: {
        //             from_date: moment(this.orderDateRange[0]).toISOString(),
        //             to_date: moment(this.orderDateRange[1]).toISOString(),
        //             page_no: this.pagination.current,
        //             page_size: this.pagination.limit,
        //             store_id,
        //             stage: this.selectedStageTab,
        //             company_id: this.companyId,
        //         },
        //         is_fplt: true,
        //         document_type: "a4",
        //         uid: this.getUid(),
        //         store_code,
        //     };
        //     if(this.stagesSubFilter['status'].length > 0){
        //         payload['filters']['status'] = this.stagesSubFilter['status'];
        //     }
        //     return payload;
        // },
        // exportOrders(type) {
        //     if(this.selectedStageTab == 'processing' || this.selectedStageTab == 'processed') {
        //         // check whenther store is selected before exporting data
        //         let store;
        //         try {
        //             store = find(this.storeList, {
        //                 uid: parseInt(this.selectedStore),
        //             });
        //             if (!store) {
        //                 throw 'select store';
        //             }
        //         } catch (e) {
        //             this.$snackbar.global.showInfo(
        //                 'Please select store to export data'
        //             );
        //             return;
        //         }
        //         const payload = this.getExportPayload(store.store_code, store.uid);
        //         this.showExportSuccessMessage(type, store.store_code, payload);
        //     } else {
        //         this.$snackbar.global.showInfo(
        //             `Please go to Processing or Processed tab for ${type}`
        //         );
        //         return;
        //     }
        // },
        // showExportSuccessMessage(type, storeCode, payload) {
        //     if (type == 'invoices') {
        //         this.$refs.exporting.open({
        //             kind: 'Bulk Invoice',
        //             storeCode: storeCode,
        //             payload: payload,
        //         });
        //     } else {
        //         this.$refs.exporting.open({
        //             kind: 'Manifest',
        //             storeCode: storeCode,
        //             payload: payload,
        //         });
        //     }
        // },
        // $exportingDialogClose(reason) {
        //     console.log(reason);
        // },
        onAppBack() {
            this.$goBack('/administrator/orders/list');
        },
        changeFilterType() {
            if (this.filterType === 'auto') {
                this.searchPlaceholder =
                    'Fynd Order ID, Shipment ID, Fynd Bag ID, Mobile & Email';
            } else {
                const filterData = this.filterTypeList.filter((ele) => {
                    return ele.value === this.filterType;
                })[0];
                this.searchPlaceholder = filterData.text;
            }
        },
        // setAutoRefresh() {
        //     if (this.autoRefresh) {
        //         LocalStorageService.addOrUpdateItem(
        //             STORAGE_KEYS.AUTO_REFRESH_ORDER,
        //             this.autoRefresh
        //         );
        //         this.activateAutoRefresh();
        //     } else {
        //         LocalStorageService.removeItem(STORAGE_KEYS.AUTO_REFRESH_ORDER);
        //         this.clearAutoRefresh();
        //     }            
        // },
        // handleNewOrderUpdates(){
            // const params = this.getOrderRequestParams();
            // OrderService.fetchOrderLanesCount(this.companyId, params)
            //     .then(({ data }) => {
            //         this.stages = data.stages;
            //         if(this.stages[this.selectedStageTabIndex].count!==this.pagination.total){
            //             this.fetchOrders();
            //         }
            //     })
        // },
        // activateAutoRefresh() {
        //     this.clearAutoRefresh();
        //     this.autoRefreshId = setInterval(() => {
        //         this.handleNewOrderUpdates()
        //     }, AUTO_REFRESH_TIME);
        // },
        // clearAutoRefresh() {
        //     clearInterval(this.autoRefreshId);
        // },
        resetFilter(){  // function to reset search,date range,store,sales channel,status to empty
            this.filterType = 'auto';
            this.changeFilterType();
            this.search='';
            this.selectedStore='';
            this.selectedDeploymentStore='';
            this.selectedCompany = null;
            this.selectedSalesChannels = [];
            this.stagesSubFilter={};
            this.filterChange();
            this.fetchOrders();
        },
    },
    // beforeDestroy: function () {
    //     // this.clearAutoRefresh();
    // },
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';
.input-shimmer {
    height: 40px;
    width: 400px;
}
.item {
    background-color: @White;
    border: 1px solid @LightGray;
    &:hover {
        box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
    }
}
.empty-state {
    width: 100%;
}
.order-menu {
    ::v-deep ul.nitrozen-menu-vertical-dropdown {
        max-height: unset;
    }
}
.lock-toggle{
    margin-top: 2%;
    @media @mobile {
        margin-left: auto;
        margin-top: 0px
    }
}
.button-box {
    display: flex;
    align-items: center;
    @media @mobile {
        margin-left: 24px;
    }
    .toggle-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        .toggle-label-div {
            display: flex;
            align-items: center;
        }
    }
}
.pad-right {
    margin-right: 8px;
}
.page-container {
    // margin-top: 56.5px;
    margin: 0;

    @media @mobile {
        width: calc(100% - 48px);
        margin-top: 48px;
    }
    .tab-row {
        display: flex;
        width: 100%;
        border-bottom: 1px solid @Iron;
        .tabs {
            flex: 1;
            padding-left: 12px;
            @media @mobile {
                padding-left: 0;
            }
            ::v-deep .nitrozen-tab-item {
                width: auto;
                margin-right: 48px;
                box-sizing: border-box;
                @media @mobile {
                    margin-right: 36px;
                }
            }
            ::v-deep .nitrozen-tab-active {
                font-weight: bold;
            }
        }
        .bulk-actions-button {
            top: -10px;
            margin-right: 12px;
        }
        .refresh-icon {
            cursor: pointer;
            margin: 0px 12px;
            ::v-deep svg {
                fill: @RoyalBlue;
                transition:all 0.6s ease;
            }
            

            &:hover{
                ::v-deep svg{
                    transform: rotate(120deg);
                }
            }
        }
        // .order-menu {
        //     ::v-deep ul.nitrozen-menu-vertical-dropdown {
        //         max-height: unset;
        //     }
        // }
    }

    .content-container {
        width: 100%;
        margin-top: 12px;
    }
    .search-box {
        margin: 0 0 24px;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .search {
            min-width: 400px;
            @media @mobile {
                min-width: 100%;
            }
        }
 
            .filter-group {
             
                .more-filters-button {
                    margin: 20px 0 0 12px;
                }
                .more-filters {
                    position: absolute;
                    right: 48px;
                    top: 230px;
                    border: 1px solid @Iron;
                    border-radius: 4px;
                    padding: 12px;
                    background: white;
                    box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
                    z-index: 1;
                    .more-filter-item {
                        margin-bottom: 10px;
                    }
                }

                .more-filter-item{
                     width: 250px;
                     @media @mobile {
                        width: 100%;
                        margin-left: 0px;
                    }
                }



              
            }

        .filter-row {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            gap:15px;
            width: 100%;
            font-size: 14px;
            margin-top:8px;

            @media @mobile {
                    flex-direction: column;
                }

            .filter-input-sm {
                min-width: 250px;
                width: 250px;
                @media @mobile {
                    width: 100%;
                }
            }

            .filter-input-lg {
                min-width: 250px;
                width: 780px;
                @media @mobile {
                    width: 100%;
                }
            }

              .filter-dropdown {
                   
                    ::v-deep .nitrozen-select-wrapper {
                        height: 40px;
                        .nitrozen-select {
                            height: 40px;
                        }
                    }
                    ::v-deep .nitrozen-checkbox-container {
                        height: 30px !important;
                    }
                    ::v-deep .nitrozen-option-image {
                        height: 20px;
                    }
                    &.channel-dropdown {
                        width: 120px;
                    }
                    // &.store-dropdown {
                    //     width: 200px;
                    // }
                }
        }
            // .search-div {
            //     justify-content: unset;
            //     @media @mobile {
            //         display: block;
            //     }
            //     .filter-type {
            //         width: 250px;
            //         margin-right: 64px;
            //         @media @mobile {
            //             width: 100%;
            //             margin-right: 0;
            //         }
            //     }
            // }
    }
}
.ss-container {
    width: 100%;
}
::v-deep .nitrozen-options {
    z-index: @actionBar !important;
}
.custom-store-dropdown-option {
    display: flex;
    padding-left: 12px;
    .option-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 6px 0;
        .text {
            font-weight: bold;
        }
        .subtext {
            font-weight: normal;
        }
    }
    &.selected {
        color: @White;
        background-color: @RoyalBlue;
    }
}
::v-deep .titlize{
    text-transform: capitalize;
    position: initial;
    width: auto;
    z-index: 6;
}
</style>
