<template>
    <div class="panel panel-oms">
        <adm-page-header
            :class="announcements && announcements.length ? 'titlize oms-page-header' : 'titlize'"
            :showBackButton="isFPApp"
            @backClick="isFPApp ? onAppBack() : () => {}"
            :title="'My Orders'"
            :noContextMenu="true"
        ></adm-page-header>

        <div class="main-container">
            <div class="page-container">
                <div class="search-box">
                    <div
                        v-if="inProgress && isInitialLoad"
                        class="input-shimmer shimmer"
                    ></div>
                    <template v-else>
                        <div class="filter-row search-div">
                            <nitrozen-dropdown
                                class="filter-type filter-input-sm filter-item"
                                label="Search Type"
                                @change="changeFilterType"
                                :items="searchShipmentFilter"
                                v-model="filterType"
                                :searchable="true"
                                @searchInputChange="
                                    findSearchTypes($event.text)
                                "
                                :placeholder="filterType"
                                
                            />
                            <div class="inside-date-picker">
                                <div v-if="search" @click="clearSearchNCall" class="date-picker-sqaure">.</div>
                                <nitrozen-input
                                    label="Search"
                                    :showSearchIcon="true"
                                    class="search filter-input-lg filter-item"
                                    type="search"
                                    :placeholder="searchPlaceholder"
                                    v-model="search"
                                    @keyup="onSearchInput"
                                />
                            </div>
                            <date-picker
                                label="Date Range"
                                class="date-picker filter-input-dr filter-item"
                                picker_type="date"
                                date_format="MMM D, YYYY"
                                v-model="orderDateRange"
                                :clearable="false"
                                :range="true"
                                :not_before="notBefore"
                                :shortcuts="dateRangeShortcuts"
                                :not_after="new Date().toISOString()"
                                :useNitrozenTheme="true"
                                @input="dateRangeChange"
                            />
                            

                            <div class="companies-dropdown" v-if="!companiesError">
                                <div class="companies-dropdown-list">
                                    <nitrozen-dropdown 
                                        label="Company"
                                        ref="search-company-dropdown"
                                        class="filter-dropdown filter-item filter-input-sm"
                                        :searchable="true"
                                        :items="companiesList"
                                        v-model="selectedCompany"
                                        @change="onCompanyChange"
                                        @searchInputChange="searchCompany($event.text)"
                                    />
                                </div>
                            </div>

                            <nitrozen-dropdown
                                label="Fulfilment Location"
                                class="filter-dropdown filter-input-sm filter-item"
                                ref="search-store-dropdown"
                                :searchable="true"
                                :items="filteredStores"
                                v-model="selectedStore"
                                @change="filterChange"
                                @searchInputChange="
                                    searchStore($event.text)
                                "
                                :disabled="selectedCompany.length === 0"
                                :placeholder="'Select fulfilment location'"
                            >
                                <template slot="option" slot-scope="slotProps">
                                    <div
                                        class="custom-store-dropdown-option"
                                        :class="{
                                            selected: slotProps.selected,
                                        }"
                                    >
                                        <div
                                            class="custom-store-dropdown-option"
                                            :class="{
                                                selected: slotProps.selected,
                                            }"
                                        >
                                            <div class="option-content">
                                                <div class="text">
                                                    {{ slotProps.item.text }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </nitrozen-dropdown>
                        </div>
                    </template>
                </div>

                <div class="tab-row">
                    <div class="left-container" v-if="orderLaneData && orderLaneData.length">
                        <!-- #IMPORTANT: Do not use nitrozen-tab in the below fashion, this is only for OMS v3 design.  -->
                        <div class="nitrozen-tab-container">
                            <ul class="nitrozen-tab">
                                <nitrozen-tab-item
                                    v-for="(item, index) in orderLaneData"
                                    :class="{ 'nitrozen-tab-active': selectedStageTabIndex == index }"
                                    :key="index"
                                    class="tab-item-custom"
                                    @click="selectStageTab(index, item)"
                                    :active-index="selectedStageTabIndex">
                                    <span class="tab-item-text-custom">{{ item.text }}</span>
                                    <span v-if="enterTapValue && item.value !== 'action_centre'"> &nbsp; ({{ numberToThousandString(item.total_items) }})</span>
                                    <span class="tab-item-count-custom-ac" v-if="item.value === 'action_centre'">{{ numberToThousandString(item.total_items) }}</span>
                                </nitrozen-tab-item>
                            </ul>
                        </div>
                    </div>
                    <div class="right-container" v-if="orderLaneData && orderLaneData.length">
                        <div class="select-view">
                            <nitrozen-dropdown
                                class="views"
                                :items="viewOptions"
                                v-model="selectedView"
                                @change="changeView">
                            </nitrozen-dropdown>
                        </div>
                    </div>
                </div>

                <div class="display-sub-tabs">
                    <div class="sub-tabs" v-if="orderLaneData && orderLaneData.length">
                        <div v-for="(subTab, index) in orderLaneData[selectedStageTabIndex].options"
                            :key="'lane'+index"
                            class="lane-types"
                            @click="changeLaneType(subTab, index)">
                            <nitrozen-badge
                                v-if="subTab.value != 'action_centre'"
                                :state="lane == subTab.value ? 'info': 'none'"
                                :fill="false"
                            >
                            {{ subTab.text }} {{(!superLaneChangeFetchInProgress) ? `(${numberToThousandString(subTab.total_items)})`:`(...)`}}
                            </nitrozen-badge>
                        </div>
                    </div>
                    <div class="right-side" v-if="orderLaneData && orderLaneData.length && selectedStageTab !== 'action_centre'">
                        <div 
                            v-if="this.selectedStageTabIndex != 3" 
                            class="advanced-filter" 
                            @click="advancedFilterSection()" 
                            title="Advanced Filters">
                            <ukt-inline-svg src="filter-oms" />
                            <div class="filter-applied-indicator" v-if="isAdvancedFilterApplied()"/>
                        </div>
                        <div class="menu-item" v-if="!isApplicationLevel">
                            <nitrozen-menu class="actions-menu" mode="vertical">
                                <nitrozen-menu-item 
                                    class="debug-shipment-menu-item" 
                                    @click="toggleDebugShipment(true)">
                                    Debug Shipment
                                </nitrozen-menu-item>
                            </nitrozen-menu>
                        </div>
                    </div>
                </div>

                <div class="content-container">
                    <!-- <div class="all-items" v-if="pagination.total > 0">{{selectedView == 'orders' ? orders.length : shipmentData.length}} {{selectedView == 'orders' ? 'Orders': 'Shipments'}} ({{pagination.total}} items)</div> -->

                    <adm-shimmer
                        v-if="inProgress && !pageError"
                        :count="4"
                    ></adm-shimmer>
                    <!-- <div v-else-if="selectedStageTab === 'action_centre'">
                        <action-centre-item
                            :dataList="actionCentreData"
                        />
                    </div> -->
                    <div v-else-if="!inProgress && pageError">
                        <page-error
                            ref="call-api-function"
                            :errorText="errorText"
                            @tryAgain="callApiFunctions(selectedView)"
                        ></page-error>
                    </div>
                    <div v-else-if="selectedView == 'orders' && orders && orders.length">
                        <order-list-item
                            :view="selectedView"
                            class="item"
                            :data="orders"
                            :readOnlyMode="!!isApplicationLevel"
                        ></order-list-item>
                    </div>
                    <div v-else-if="selectedView == 'shipment' && shipmentData && shipmentData.length">
                        <shipment-list-item
                            :view="selectedView"
                            :lane="lane"
                            class="shipment-item"
                            :shipmentList="shipmentData"
                            :readOnlyMode="!!isApplicationLevel">
                        </shipment-list-item>
                    </div>
                    <!-- <div v-else-if="selectedView == 'bulk' && shipmentData && shipmentData.length" class="empty-state">
                        <order-bulk-picklist
                            ref="order-bulk-picklist"
                            :activeLane="orderLaneData && orderLaneData[selectedStageTabIndex].options[activeLaneIndex] || {}"
                            :shipmentList="shipmentData"
                            :selectedStore="selectedStore"
                            :lane="lane"
                            :selectedStageTab="selectedStageTab"
                            @refreshView="changeView('bulk')"
                        ></order-bulk-picklist>
                    </div> -->
                    <div class="empty-state" v-if="selectedView == 'orders' ? orders && !orders.length && !inProgress && !pageError : shipmentData && !shipmentData.length && !inProgress && !pageError">
                        <adm-no-content :helperText="`We couldn't find any shipments or orders matching your search. Please try adjusting the timeline by using the date range option located above, or try modifying the filters.`" />
                    </div>
                    <div
                        class="pagination-div"
                        v-if="!inProgress && selectedView == 'orders' ? orders && orders.length : shipmentData && shipmentData.length"
                    >
                        <nitrozen-pagination
                            class="pagination-main"
                            :name="selectedView == 'orders' ? 'Orders' : 'Shipments'"
                            v-model="pagination"
                            @change="paginationChange"
                            :pageSizeOptions="[5, 10, 20, 50, 100, 200]"
                        ></nitrozen-pagination>
                    </div>
                </div>
            </div>
        </div>


        <transition name="slide">
            <template v-if="advancedFilterView">
                <div class="slide-fade" ref="slide-fade" @click="close($event)">
                    <div class="container">
                        <advanced-filter-drawer
                            class="slide-adv-filter"
                            v-if="advancedFilters"
                            :advancedFilters="advancedFilters"
                            :advancedSelectedFilters="selectedAdvancedFilters"
                            @applyFilters="applyAdvancedFilters($event,{},true,false)"
                        >
                        </advanced-filter-drawer>
                        <a class="cancel-btn" @click="close($event)">
                            <ukt-inline-svg
                                :src="'cross-black'"
                            ></ukt-inline-svg>
                        </a>
                    </div>
                </div>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="debugShipmentView">
                <side-drawer
                    :title="debugOrderId.length ? `Debug Order Info for ${debugOrderId}` : `Debug Shipment`"
                    @close="toggleDebugShipment(false)"
                    :css="{width: '50%'}"
                >
                    <global-debug-shipment @changeOrderId="changeDebugOrderId"/>
                </side-drawer>
            </template>
        </transition>
    </div>
</template>

<script>
/* Package imports */
import { mapGetters } from 'vuex';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import mapValues from 'lodash/mapValues';
import {
    NitrozenButton, NitrozenToggleBtn, flatBtn,
    strokeBtn, clickOutside, NitrozenDropdown,
    NitrozenInput, NitrozenPagination, NitrozenTab,
    NitrozenMenu, NitrozenMenuItem, NitrozenBadge,
    NitrozenError, NitrozenTabItem
} from '@gofynd/nitrozen-vue';

/* Component imports */
import loader from '@/components/common/loader.vue';
import AdmShimmer from '@/components/common/shimmer.vue';
import PageError from '@/components/common/page-error';
import AdmNoContent from '@/components/common/adm-no-content.vue';
import OrderListItem from './order-list-item.vue';
import ShipmentListItem from './shipment-list-item.vue'; 
import admncomingsoon from '@/components/common/coming-soon.vue';
import DatePicker from '@/components/common/date-picker.vue';
import AdmPageHeader from '@/components/common/layout/adm-page-header.vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import BagsDialog from '@/pages/oms/bags-dialog/index.vue';
import AdvancedFilter from './advanced-filter-drawer.vue';
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';
import GlobalDebugShipment from '@/pages/oms/global-debug-shipment/global-debug-shipment.vue';

/* Service imports */
import OrderService from '@/services/orders.service';
import {
    LocalStorageService,
    STORAGE_KEYS,
} from '@/services/localstorage.service';
import CompanyAdminService from '@/services/company-admin.service.js';

/* Helper imports */
import { dateRangeShortcuts } from '@/helper/datetime.util';
import { detectFPApp, debounce, numberToThousandString } from '@/helper/utils';
import { goBack } from '@/helper/actions';
import { returnNextStates } from '@/pages/oms/fixtures/dropdown-items.js';

/* Store imports */
import {
    GET_USER_INFO,
    GET_USER_PERMISSIONS
} from '@/store/getters.type';

const PAGINATION = {
    limit: 10,
    current: 1,
    total: 0,
};

const VIEW_OPTIONS = [
    {
        text: 'Shipment View',
        value: 'shipment',
    },
    {
        text: 'Order View',
        value: 'orders'
    },
    // {
    //     text: 'Bulk view',
    //     value: 'bulk'
    // }
];


const LANE_MAPPER = {
    "0": "All"
}

export default {
    components: {
        'adm-coming-soon': admncomingsoon,
        'advanced-filter-drawer': AdvancedFilter,
        AdmShimmer,
        AdmNoContent,
        OrderListItem,
        ShipmentListItem,
        loader,
        PageError,
        DatePicker,
        AdmPageHeader,
        NitrozenButton,
        NitrozenDropdown,
        NitrozenError,
        NitrozenInput,
        NitrozenPagination,
        NitrozenTab,
        NitrozenMenu,
        NitrozenMenuItem,
        InlineSvg,
        UktInlineSvg,
        NitrozenToggleBtn,
        BagsDialog,
        NitrozenBadge,
        SideDrawer,
        NitrozenTabItem,
        'global-debug-shipment': GlobalDebugShipment
    },
    directives: { flatBtn, strokeBtn, clickOutside },

     /**
     * The beforeRouteLeave lifecycle method is utilised to check
     * for route changes that will go out of the OMS environment.
     * In that case, we shall delete the list of orders stored in
     * the local storage.
     *
     * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
     */
    beforeRouteLeave(to, from, next) {
        if(to.name !== 'company-order-details-v2') {
            this.removeOrdersFromLocalStorage();
        }
        next();
    },


    data() {
        return {
            viewOptions: cloneDeep(VIEW_OPTIONS),
            // viewOptions: [],
            selectedView: VIEW_OPTIONS[0].value,
            // selectedView: '',
            inProgress: false,
            pageError: false,
            errorText: undefined,
            orders: [],
            shipmentData: [],
            orderLaneData: [],
            analyticsData:"",
            searchShipmentFilter: [],
            fulfillingStoreFilter: [],
            advancedFilters: [],
            updatedAdvancedFilters: {},
            advancedFilterView: false,
            active_but: 0,
            companyId: this.$route.params.company_id,
            applicationId: this.$route.params.applicationId,
            dp_ids: "",
            sales_channel: "",
            status: "",
            payment_mode: "",
            sla: "",
            sort: "",
            advancedFiltersFromQuery: {},
            filters: null,
            applied_filters: null,
            storeList: [],
            filteredStores: [],
            deploymentStoreList: [],
            filteredDeploymentStores: [],
            viewMoreFilters: false,

            selectedStageTabIndex: 0,
            selectedStageTab: 'all',
            lane: "all",
            activeLaneIndex: 0,
            selectedStore: '',
            selectedDeploymentStore: '',
            search: '',
            pagination: cloneDeep(PAGINATION),
            isInitialLoad: true,

            notBefore: moment().subtract(3, 'months').toISOString(),
            orderDateRange: [
                moment().subtract(1, 'weeks').toISOString(),
                moment().toISOString(),
            ],
            dateRangeShortcuts: [...dateRangeShortcuts],
            filterType: '',
            searchPlaceholder:
                'Search by Order ID, Shipment ID, Bag ID, Mobile & Email',
            filterShipmentTypeList: [],
            autoRefresh: false,
            autoRefreshId: null,
            selectedAdvancedFilters:{},
            noFilterSelectionError: false,
            superLaneChangeFetchInProgress:false, // Useed to watch Superlane changes
            metricsDateOptions: [...dateRangeShortcuts],
            metricLists: [],

            announcements:[],
            returnNextStates: cloneDeep(returnNextStates),
            selectedReturnNextState: '',
            returnStateErrorSubmit: false,
            actionCentreData: [],

            salesChannels: [],
            selectedReturnSalesChannel: '',
            forwardShipmentId: '',
            emptyForwardShipmentId: false,
            returnSalesChannelError: false,
            searchValueActive: false,
            filterTypeMinSize: '',
            allAdvancedFilters: [],
            laneMap: cloneDeep(LANE_MAPPER),
            enterTapValue: false,

            debugShipmentView: false,
            debugOrderId: '',
            searchTypesClone:[],
            companiesList: [],
            companiesError: false,
            companiesListLoading: false,
            selectedCompany: ''
        };
    },
    computed: {
        /** As of January 3, 2023, we are currently keeping access full open to all users */
        ...mapGetters({
            userinfo: GET_USER_INFO,
            // accessDetail: GET_EMPLOYEE_ACCESS_DETAIL,
            accessDetail: {},
            currentUserPermission: GET_USER_PERMISSIONS
        }),
        isFPApp() {
            if (detectFPApp()) {
                return true;
            }
            return false;
        },
        isApplicationLevel() {
            return this.applicationId ? true : false;
        },
    },

    mounted() {
        if(this.isApplicationLevel) {
            this.viewOptions = [{
                text: 'Shipment view',
                value: 'shipment',
            },
            {
                text: 'Orders view',
                value: 'orders'
            }
            ]
        }
        this.populateFromURL();
        this.fetchCompanies();
    },
    methods: {
        numberToThousandString,
        laneMapper() {
            const index = this.laneMap[this.selectedStageTabIndex];
            this.advancedFilters = this.allAdvancedFilters[index];
        },
        callApiFunctions(view) {
            if(view == 'orders') {
                this.fetchOrders();
            }
            else if(view == "shipment") {
                this.fetchShipments();
            }
            this.fetchFilters();
        },
        onSalesChannelSelection() {
            this.returnSalesChannelError = false;
        },
        onKeyUpForwardShipmentID(event) {
            this.emptyForwardShipmentId = event.target.value.length > 0 ? true : false;
        },
        getFulfillmentCenter(params) {
            let centerOfFulfillment = [];
             let param = {
                page_no: 1,
                page_size: 10,
                ...params
            };

            OrderService.getFulfillmentCenterV2(param, this.selectedCompany)
                .then(({ data }) => {
                    centerOfFulfillment = data.items.map(center => ({ value: center.uid, name: center.display_name, code: center.code, text: center.display_name.concat(" (", center.code, ")") }));
                    if(
                        this.accessDetail && 
                        this.accessDetail.store_access &&
                        this.accessDetail.store_access.values &&
                        this.accessDetail.store_access.values.length > 0
                    ) {
                        centerOfFulfillment = centerOfFulfillment.filter((item)=>  this.accessDetail.store_access.values.includes(item.value))
                    }
                    this.filteredStores = centerOfFulfillment;
                    this.fulfillingStoreFilter = centerOfFulfillment;
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Unable to fetch fulfillment centres');
                    console.error("Error in fetching the fulfillment centres:   ", err);
                })
        },
        fetchFilters() {
            const params = {
                group_entity: this.selectedView == "orders" ? "orders" : "shipments",
                view: "my_orders"
            }
            const get_filters_promise = this.isApplicationLevel
                ? OrderService.fetchApplicationV2Filters(
                      this.companyId,
                      this.applicationId,
                      params
                  )
                : OrderService.fetchV2Filters(this.companyId,null, params);
            return get_filters_promise
            .then(({ data }) => {
                this.searchShipmentFilter = cloneDeep(data.global[1].options);
                this.searchTypesClone = cloneDeep(data.global[1].options);
                // this.fulfillingStoreFilter = cloneDeep(data.filters.global[0].options);
                // this.filteredStores = cloneDeep(data.filters.global[0].options);
                this.allAdvancedFilters = cloneDeep(data.advance);
                this.laneMapper();
                if(!this.filterType){
                        this.filterType = this.$route.query.search_type || this.searchShipmentFilter.length && this.searchShipmentFilter[0].value;
                        this.searchPlaceholder = this.searchShipmentFilter.length && this.searchShipmentFilter[0].placeholder_text || this.searchShipmentFilter.length && this.searchShipmentFilter[0].text || 'Search by Shipment ID';
                        this.filterTypeMinSize = this.searchShipmentFilter.length && this.searchShipmentFilter[0].min_search_size;
                    }

            })
            .catch((error) => {
                this.$snackbar.global.showError('Unable to fetch filters');
                console.error("Error in fetching the filters:   ", error);
            })
        },
        advancedFilterSection: function () {
            if(!this.isAdvancedFilterApplied()){
                this.selectedAdvancedFilters = {};
            }
            this.advancedFilterView = !this.advancedFilterView;
        },
        close: function (e) {
            e.stopPropagation();
            this.advancedFilterView = false;
        },
        // activate: function(idNum) {
        //     this.active_but = idNum;
        // },
        // changedAdvancedFilters(data) {
        //     if (data == true) {
        //         this.advancedFilterView = false;
        //         this.setRouteQuery({});
        //     } else {
        //         this.advancedFilterView = false;
        //         data = JSON.stringify(data);
        //         // Clean selected filters while putting up
        //         this.setRouteQuery({selected_filters:data});
        //     }
        //     this.fetchSuperLanes();
        // },
        getShipmentRequestParams() {
            if(this.searchValueActive == false || this.search == '') {
                this.filterType = '';
            }
            let params = {
                group_entity: 'shipments',
                page_no: this.pagination.current,
                page_size: this.pagination.limit,
                from_date: moment(this.orderDateRange[0]).format('DD-MM-YYYY'),
                to_date: moment(this.orderDateRange[1]).format('DD-MM-YYYY'),
                lane: this.lane,
                search_value: this.search,
                search_type: this.filterType,
                stores: this.selectedStore,
                // is_sla_sort: true
                // dp_ids: 30,
                // sales_channels: '62186fce51e60369e2b093e6'
            };
            if(this.selectedAdvancedFilters && Object.keys(this.selectedAdvancedFilters).length){
                params = {
                    ...params,
                    ...this.selectedAdvancedFilters
                }
            }
            for (let item in params) {
                if (Array.isArray(params[item])){
                    params[item] = params[item].join(",")
                }
            }
            return params;
        },
        fetchShipments() {
            this.inProgress = true;
            const params = this.getShipmentRequestParams();
            const get_shipment_promise = this.isApplicationLevel
                ? OrderService.fetchApplicationShipmentV2List(
                      this.companyId,
                      this.applicationId,
                      params
                  )
                : OrderService.fetchShipmentV2List(this.companyId,null, params);
            // const get_shipment_promise = new Promise((resolve) => {
            //     setTimeout(() => {
            //         resolve(cloneDeep(mockShipmentListingData));
            //     }, 500);
            // })


            return get_shipment_promise
            .then(({ data }) => {
                this.pageError = false;
                this.shipmentData = cloneDeep(data.items);
                // this.searchShipmentFilter = cloneDeep(data.filters.global[1].options);
                // this.fulfillingStoreFilter = cloneDeep(data.filters.global[0].options);
                // this.filteredStores = cloneDeep(data.filters.global[0].options);
                // this.advancedFilters = cloneDeep(data.filters.advance);
                this.pagination = {
                    limit: data.page ? data.page.size : 10,
                    current: data.page ? data.page.current : 1,
                    total: data.page.total,
                };
                if(this.searchValueActive) {
                    this.enterTapValue = true;
                }
                // if(!this.filterType){
                //     this.filterType = this.searchShipmentFilter.length && this.searchShipmentFilter[0].value || 'shipment_id';
                //     this.searchPlaceholder = this.searchShipmentFilter.length && this.searchShipmentFilter[0].placeholder_text || this.searchShipmentFilter.length && this.searchShipmentFilter[0].text || 'Search by Shipment ID';
                // }
            })
            .catch((error) => {
                this.$snackbar.global.showError('Unable to fetch shipment listing');
                this.pageError = true;
                this.errorText = 'Unable to fetch shipment listing';
                console.error("Error in fetching the list of shipments:   ", error);
            }).finally(() => {
                this.isInitialLoad && (this.isInitialLoad = false);
                this.inProgress = false;
                this.superLaneChangeFetchInProgress = false;
            })
        },
        fetchSuperLanes(query = {}) {
            const advanced_filters = {...this.selectedAdvancedFilters};
            for (let item in advanced_filters) {
                if (Array.isArray(advanced_filters[item])){
                    advanced_filters[item] = advanced_filters[item].join(",")
                }
            }
            if(this.searchValueActive == false || this.search == '') {
                this.filterType = '';
            }
            const params = {
                group_entity: this.selectedView == 'orders' ? 'orders' : 'shipments',
                ...this.$route.query,
                ...query,
                from_date: moment(this.orderDateRange[0]).format('DD-MM-YYYY'),
                to_date: moment(this.orderDateRange[1]).format('DD-MM-YYYY'),
                super_lane: this.selectedStageTab || 'all',
                ...advanced_filters,
                search_value: this.search,
                search_type: this.filterType,
                stores: this.selectedStore
            };
            delete params.selected_filters
            delete params.page
            delete params.limit
            delete params.lane
            delete params.filterType
            delete params.selected_view
            delete params.search
            delete params.stage
            delete params.index

            const get_lane_config_promise = this.isApplicationLevel
                ? OrderService.fetchApplicationLaneV2Config(
                      this.companyId,
                      this.applicationId,
                      params
                  )
                : OrderService.fetchLaneV2Config(this.companyId, null, params);

            // const get_lane_config_promise = new Promise(resolve => {
            //     setTimeout(() => {
            //         resolve(mockLaneConfig);
            //     }, 500);
            // })

            return get_lane_config_promise
            .then(response => {
                this.orderLaneData = cloneDeep(response.data.super_lanes);
                // if(response.data.views && response.data.views.length > 0) {
                //     this.viewOptions = cloneDeep(response.data.views);
                //     if(!this.selectedView) {
                //         this.selectedView = response.data.views[0].value;
                //     }
                // }
                const tabStageIndex = findIndex(this.orderLaneData, {
                    value: this.selectedStageTab,
                });
                this.selectedStageTabIndex = tabStageIndex || 0;
                // this.$nextTick(() => {
                //     this.$refs.tabs.activeTab = tabStageIndex || 0;
                // })
                this.lane = this.$route.query.lane || this.lane
                const laneIndex = findIndex(this.orderLaneData[tabStageIndex].options, {
                    value: this.lane
                });;
                this.activeLaneIndex = laneIndex || 0

                if(this.searchValueActive) {
                    this.enterTapValue = true;
                }
            })
            .catch((error) => {
                this.$snackbar.global.showError('Unable to fetch super lanes');
                console.error("Error in fetching the super lanes:   ", error);
            })
        },
        changeLaneType(laneData, laneIndex){
            if(this.lane == laneData.value){
                return;
            }
            let isSuperLane = false;
            if(this.$route.query.selected_filters && Object.keys(JSON.parse(this.$route.query.selected_filters)).length){
                isSuperLane = true;
            }
            this.activeLaneIndex = laneIndex;
            this.lane = laneData.value;
            this.pagination.current = 1;
            if(this.search.length == 0) {
                this.filterType = "auto";
            }
            this.setRouteQuery({lane: this.lane, page: 1, search_type: this.filterType });
        },
        changeView(e) {
            this.selectedView = e;
            this.pagination.current = 1;
            this.lane = "all";
            this.selectedStageTab = "all";
            this.applyAdvancedFilters({closeDrawer: true}, {selected_view: e, lane: "all", super_lane: "all", page: 1});
        },
          /**
         * Method to handle searches on the store
         *
         * @author: Rushabh Mulraj Shah
         */
         searchStore: debounce(function (text) {
        /**
         * Code is subject to change, currently if text length is zero,
         * we are removing the store from component data
         * */
        if (text && text.length === 0) {
            this.selectedStore = '';
            this.filterChange();
        }
        this.getFulfillmentCenter({ q: text });
        }, 300),
        findSearchTypes(text){
            if (text) {
                this.searchShipmentFilter = this.searchTypesClone.filter((s) =>
                    s.text.toLowerCase().includes(text.toLowerCase())
                );
            } else {
                this.filterType = '';
                this.searchShipmentFilter = this.searchTypesClone;
            }


        },
        getOrderRequestParams() {
            if(this.searchValueActive == false || this.search == '') {
                this.filterType = '';
            }
            let params = {
                group_entity: 'orders',
                page_no: this.pagination.current,
                page_size: this.pagination.limit,
                from_date: moment(this.orderDateRange[0]).format('DD-MM-YYYY'),
                to_date: moment(this.orderDateRange[1]).format('DD-MM-YYYY'),
                lane: this.lane,
                stores: this.selectedStore,
                search_value: this.search,
                search_type: this.filterType,
            };

            if(this.selectedAdvancedFilters && Object.keys(this.selectedAdvancedFilters).length){
                params = {
                    ...params,
                    ...this.selectedAdvancedFilters
                }
            }

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
            const get_order_promise = this.isApplicationLevel
                ? OrderService.fetchApplicationOrdersV2List(
                      this.companyId,
                      this.applicationId,
                      params
                  )
                : OrderService.fetchOrdersV2List(this.companyId,null, params);

            // const get_order_promise = new Promise((resolve) => {
            //     setTimeout(() => {
            //         resolve(cloneDeep(mockOrderListingData));
            //     }, 500);
            // })

            get_order_promise
                .then(({ data }) => {
                    this.pageError = false;
                    this.orders = data.items || data.orders || [];
                    // this.searchShipmentFilter = cloneDeep(data.filters.global[1].options);
                    // this.fulfillingStoreFilter = cloneDeep(data.filters.global[0].options);
                    // this.filteredStores = cloneDeep(data.filters.global[0].options);
                    // this.advancedFilters = cloneDeep(data.filters.advance);
                    this.pagination = {
                        limit: data.page ? data.page.size : 10,
                        current: data.page ? data.page.current : 1,
                        total: data.page ? data.page.total: 0,
                    };
                    // if(!this.filterType){
                    //     this.filterType = this.searchShipmentFilter.length && this.searchShipmentFilter[0].value || 'shipment_id';
                    //     this.searchPlaceholder = this.searchShipmentFilter.length && this.searchShipmentFilter[0].placeholder_text || this.searchShipmentFilter.length && this.searchShipmentFilter[0].text || 'Search by Shipment ID';
                    // }
                    if(this.searchValueActive) {
                        this.enterTapValue = true;
                    }
                })
                .catch((err) => {
                    console.error("Error in fetching list of orders:   ", err);
                    if (
                        err &&
                        err.response &&
                        err.response.data &&
                        err.response.data.message
                    ) {
                        this.errorText = err.response.data.message;
                    }else {
                        this.errorText = 'Unable to fetch order listing';
                    }
                    this.pageError = true;
                })
                .finally(() => {
                    this.inProgress = false;
                    this.isInitialLoad && (this.isInitialLoad = false);
                    this.superLaneChangeFetchInProgress = false;
                });
        },
        searchOrders(query = {}) {
            this.setRouteQuery({ search: this.search, page: 1, ...query });
            this.fetchSuperLanes({ search: this.search, page: 1, search_type: this.filterType, ...query });
        },
        selectStageTab(index, item) {
            let e = {
                index: index,
                item: item
            }
            if(this.selectedStageTabIndex == e.index){
                return
            }

            // Clear Advanced Applied Filters when changing any levels of lane
            if (this.orderLaneData[e.index]) {
                this.selectedStageTab = this.orderLaneData[e.index].value;
                this.selectedStageTabIndex = e.index;
                if(this.orderLaneData[e.index].options.length > 0) {
                    this.lane = this.orderLaneData[e.index].options[0].value
                } else {
                    this.lane = '';
                }
            } else {
                this.selectedStageTab = 'all';
                this.selectedStageTabIndex = 0;
                this.lane = 'all';
            }
            if(this.search.length == 0) {
                this.filterType = "auto";
            }
            this.superLaneChangeFetchInProgress = this.selectedStageTab !== this.$route.query.super_lane;
            this.pagination.current = 1;
            this.applyAdvancedFilters({closeDrawer: true}, {lane: this.lane, super_lane: this.selectedStageTab, search_type: this.filterType});
            // this.fetchSuperLanes({super_lane: this.selectedStageTab, page: 1})
            // this.setRouteQuery({ super_lane: this.selectedStageTab, lane: this.lane, page: 1 });
            // reset page number
        },
        dateRangeChange() {
            const to_date = moment(this.orderDateRange[1]).format('DD-MM-YYYY');
            const from_date = moment(this.orderDateRange[0]).format(
                'DD-MM-YYYY'
            );
            let date_diff = moment(to_date, 'DD-MM-YYYY').diff(
                moment(from_date, 'DD-MM-YYYY'),
                'days'
            );
            const date_range_diff = {
                from_date: moment(this.orderDateRange[0]),
                to_date: moment(this.orderDateRange[1]),
                date_diff
            }
            LocalStorageService.addOrUpdateItem(
                STORAGE_KEYS.ORDER_DATE_RANGE,
                date_range_diff
            );
            this.setRouteQuery({
                from_date,
                to_date,
                page: 1,
            });
            this.fetchSuperLanes();
        },
        filterChange() {
            this.pagination.current = 1;
            this.setRouteQuery({
                filterType: this.filterType,
                deployment_stores: this.selectedDeploymentStore,
                stores: this.selectedStore,
                search: this.search,
                page: 1,
            });
            this.fetchSuperLanes({stores: this.selectedStore});
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
                super_lane,
                lane,
                filterType,
                selected_view,
                selected_filters,
                search_type
            } = this.$route.query;
            this.pagination.current = +page || this.pagination.current;
            this.pagination.limit = +limit || this.pagination.limit;
            this.selectedStageTab = super_lane || 'all';
            this.lane = lane || 'all';
            this.search = search || this.search;
            this.filterType = search_type || this.filterType;
            this.selectedView = selected_view || this.selectedView;
            this.selectedAdvancedFilters = selected_filters?JSON.parse(selected_filters):{};

            this.populateFilters();

            let date_diff = 7; //default date diff
            let start_date = moment().subtract(date_diff, 'days').toISOString();
            let end_date = moment().toISOString();
            let date_range_diff = {
                from_date: start_date,
                to_date: end_date,
                date_diff
            }
            let threeMonthDateDiff = moment().subtract(3, 'months').toISOString();
            let lastDate = moment(this.$route.query.from_date, 'DD-MM-YYYY').toISOString();

            const lastSelectedDate = new Date(moment(lastDate).format('YYYY-MM-DD'));
            const threeDiff = new Date(moment(threeMonthDateDiff).format('YYYY-MM-DD'));

            /** Throwing an alert when either date is present and it is invalid */
            if(
                (this.$route.query.from_date && this.$route.query.to_date) &&
                (!moment(this.$route.query.from_date, 'DD-MM-YYYY').isValid() ||
                !moment(this.$route.query.to_date, 'DD-MM-YYYY').isValid())
            ) {
                setTimeout(() => {
                    if(this.$snackbar) {
                        this.$snackbar.global.showWarning(
                            `The date(s) entered in the URL were invalid. 
                            The date range has now been refreshed to the past one week.`,
                            3000
                        );
                    }
                }, 1000);
            }

            /** Throwing an alert when the difference is more than three months */
            if((lastSelectedDate.getTime() < threeDiff.getTime())) {
                setTimeout(() => {
                    if(this.$snackbar) {
                        this.$snackbar.global.showWarning(
                            `You can filter data only within a three months range from the current date. 
                            The date range has now been refreshed to the past one week.`,
                            3000
                        );
                    }
                }, 1000);
            }

            /** Throwing an alert when from_date is greater than to_date */
            if(moment(this.$route.query.from_date, 'DD-MM-YYYY') > moment(this.$route.query.to_date, 'DD-MM-YYYY')) {
                setTimeout(() => {
                    if(this.$snackbar) {
                        this.$snackbar.global.showWarning(
                            `The from date in the URL was greater than the to date. 
                            The date range has now been refreshed to the past one week.`,
                            3000
                        );
                    }
                }, 1000);
            }

            if (
                this.$route.query.from_date && 
                this.$route.query.to_date && 
                moment(this.$route.query.from_date, 'DD-MM-YYYY').isValid() && 
                moment(this.$route.query.to_date, 'DD-MM-YYYY').isValid() &&
                (lastSelectedDate.getTime() >= threeDiff.getTime()) &&
                (
                    moment(this.$route.query.from_date, 'DD-MM-YYYY') <= 
                    moment(this.$route.query.to_date, 'DD-MM-YYYY')
                )
            ) {
                date_diff = moment(to_date, 'DD-MM-YYYY').diff(
                    moment(from_date, 'DD-MM-YYYY'),
                    'days'
                );

                start_date = moment(from_date, 'DD-MM-YYYY').toISOString();
                end_date = moment(to_date,'DD-MM-YYYY').toISOString();

                date_range_diff = {
                    from_date: start_date,
                    to_date: end_date,
                    date_diff
                }
            }
            // if (
            //     from_date &&
            //     moment(from_date, 'DD-MM-YYYY').isValid() &&
            //     to_date &&
            //     moment(to_date, 'DD-MM-YYYY').isValid()
            // ) {
            //     date_diff = moment(to_date, 'DD-MM-YYYY').diff(
            //         moment(from_date, 'DD-MM-YYYY'),
            //         'days'
            //     );
            //     start_date = moment(from_date, 'DD-MM-YYYY').toISOString();
            //     end_date = moment(to_date,'DD-MM-YYYY').toISOString();
            //     date_range_diff = {
            //         from_date: start_date,
            //         to_date: end_date,
            //         date_diff
            //     }
            //     LocalStorageService.addOrUpdateItem(
            //         STORAGE_KEYS.ORDER_DATE_RANGE,
            //         date_range_diff
            //     );
            // } else if (
            //     LocalStorageService.getItem(STORAGE_KEYS.ORDER_DATE_RANGE)
            // ) {
            //     date_range_diff = LocalStorageService.getItem(
            //         STORAGE_KEYS.ORDER_DATE_RANGE
            //     )
            //     date_diff = date_range_diff.date_diff || 7;
            //     start_date = moment(date_range_diff.from_date);
            //     end_date = moment(date_range_diff.to_date);
            // } else {
            //     LocalStorageService.addOrUpdateItem(
            //         STORAGE_KEYS.ORDER_DATE_RANGE,
            //         date_range_diff
            //     );
            // }
            this.orderDateRange = [
                start_date,end_date
            ];

            if(this.search) {
                this.onSearchInput({"keyCode": 13});
            }
            else {
                this.setRouteQuery({
                    page: this.pagination.current,
                    limit: this.pagination.limit,
                    super_lane: this.selectedStageTab,
                    lane: this.lane,
                    search: this.search,
                    filterType: this.filterType,
                    selected_view: this.selectedView,
                    from_date: moment(this.orderDateRange[0]).format('DD-MM-YYYY'),
                    to_date: moment(this.orderDateRange[1]).format('DD-MM-YYYY'),
                })

                this.fetchSuperLanes();
            }
        },
        populateFilters() {
            const { stores, deployment_stores } = this.$route.query;

            const storesValueArray = this.fulfillingStoreFilter.map((f) =>
                f.value.toString()
            );
            if (storesValueArray.includes(stores)) {
                this.selectedStore = stores;
            }

            // const deploymentStoresValueArray = this.deploymentStoreList.map(
            //     (f) => f.value.toString()
            // );
            // if (
            //     deployment_stores &&
            //     deploymentStoresValueArray.includes(deployment_stores)
            // ) {
            //     this.selectedDeploymentStore = deployment_stores;
            // }
        },
        setRouteQuery: function (query) {
            if (
                query.search ||
                query.page ||
                query.limit ||
                query.from_date ||
                query.to_date ||
                query.selected_view ||
                query.lane ||
                query.super_lane ||
                query.stores ||
                // query.dp_ids ||
                // query.status ||
                // query.sales_channels ||
                // query.mop ||
                // query.sla ||
                // query.sort
                query.selected_filters ||
                query.search_type
            ) {
                for(let item in query) {
                    if(query[item] === undefined || query[item] === null || query[item].length === 0) {
                        // delete query[item];
                        query[item] = null;
                    }
                };

                let _query = {
                    ...this.$route.query,
                    ...query
                };

                for(let item in _query) {
                    if(_query[item] === undefined || _query[item] === null || _query[item].length === 0) {
                        delete _query[item];
                    }
                };

                this.$router
                .push({
                    path: this.$route.path,
                    query: _query
                })
                .catch(() => {});
            }
            if(this.selectedView == 'orders'){
                this.fetchOrders();
            } else if (this.selectedView == 'shipment'){
                this.fetchShipments();
            }
            this.fetchFilters();
        },
        // closeMoreFilters() {
        //     this.viewMoreFilters = false;
        // },
        onAppBack() {
            goBack();
        },
        changeFilterType() {
            // if (this.filterType === 'auto') {
            //     this.searchPlaceholder =
            //         'Search by Order ID, Shipment ID, Bag ID, Mobile & Email';
            // } else {
                const filterData = this.searchShipmentFilter.filter((ele) => {
                    return ele.value === this.filterType;
                })[0];
                this.searchPlaceholder = filterData.placeholder_text || filterData.text;
                this.filterTypeMinSize = filterData.min_search_size
                // this.setRouteQuery({search_type: this.filterType});
            // }
        },
        // resetFilter() {
        //     // function to reset search,date range,store,sales channel,status to empty
        //     this.filterType = '';
        //     this.search = '';
        //     this.selectedStore = '';
        //     this.selectedDeploymentStore = '';
        //     this.filterChange();
        // },
        navigateToManifest(){
            if(!this.selectedStore){
                this.$snackbar.global.showWarning('Please select a Fulfilment Location');
                return
            }
            let cleansedQuery = Object.keys(cloneDeep(this.$route.query))
            .filter(key => {
                let item = this.$route.query[key];
                return item !== undefined && item !== null && item.length > 0;
            }).reduce((finalObj, key) => {
                let value = this.$route.query[key];
                finalObj[key] = value;
                return finalObj;
            }, {});

            this.$router.push({
                name: 'company-order-manifest',
                params: {
                    storeId: this.selectedStore
                },
                query: {
                    ...cleansedQuery
                }
            })
        },
        applyAdvancedFilters(data_obj, query = {}, isSuperLane = true,overideBlock=true){
            if(overideBlock || !this.blockAdvancedFilterRequest(data_obj.data,this.selectedAdvancedFilters)){
                let data = data_obj && data_obj.data ? data_obj.data :{};
                let closeFilterDrawer = !!!data_obj.closeDrawer;
                this.selectedAdvancedFilters = data;
                let _data = JSON.stringify(data)
                if (data == true) {
                    this.advancedFilterView = closeFilterDrawer;
                    this.setRouteQuery({...query});
                } else {
                    this.advancedFilterView = closeFilterDrawer;
                    this.setRouteQuery({selected_filters:_data, ...query});
                }
                if(isSuperLane){
                    this.fetchSuperLanes()
                }
            }
        },
        blockAdvancedFilterRequest(newRequestObj){
            // Checks if differs from old request
            // Optimises and restricts extra api hits
            const data_rcvd = newRequestObj && Object.values(newRequestObj).find(asf=>asf&&asf.length)?true:false;
            const old_data_available = this.isAdvancedFilterApplied();
            return !data_rcvd && !old_data_available;
        },
        isAdvancedFilterApplied(){
            // Used to show the indicator for advanced applied filters
            const oldRequestObject = this.$route.query.selected_filters ? JSON.parse(this.$route.query.selected_filters) : {};
            if(oldRequestObject && Object.values(oldRequestObject).length){
                return Object.values(oldRequestObject).find(asf=>asf&&asf.length)?true:false;
            }else{
                return false;
            }
        },
        onSearchInput(event) {
            this.noFilterSelectionError = false;
            if(this.search.length == 0 || this.search.length >= this.filterTypeMinSize  && event.keyCode === 13) {
                this.searchValueActive = true;
                // this.selectedStageTab = 'all';
                // this.lane = 'all';
                this.selectedAdvancedFilters = {};
                this.pagination.current = 1;
                this.searchOrders({selected_filters: '{}', lane: this.lane, super_lane: this.selectedStageTab, search_type: this.filterType});
            }
            else if(event.keyCode === 13) {
                this.$snackbar.global.showError(`Search term should be more than  ${this.filterTypeMinSize}`);
            }
            if(this.search.length == 0) {
                this.searchValueActive = false;
                this.enterTapValue = false;
            }
        },
        onSearchBlur(event) {
            this.searchValueActive = true;
            if(this.search.length == 0 || this.search.length >= this.filterTypeMinSize  && event.target.value !== this.$route.query.search || !event.target.value) {
                // this.selectedStageTab = 'all';
                // this.lane = 'all';
                this.selectedAdvancedFilters = {};
                this.searchOrders({selected_filters: '{}', lane: this.lane, super_lane: this.selectedStageTab, search_type: this.filterType});
            }
            else if(event.target.value !== this.$route.query.search || !event.target.value) {
                this.searchValueActive = false;
                this.$snackbar.global.showError(`Search term should be more than ${this.filterTypeMinSize}`);
            }
            if(this.search.length == 0) {
                this.searchValueActive = false;
                this.enterTapValue = false;
            }
        },
        clearSearchNCall() {
            this.search = '';
            this.enterTapValue = false;
            this.searchValueActive = false;
            this.searchOrders({selected_filters: '{}', lane: this.lane, super_lane: this.selectedStageTab, search_type: this.filterType});
        },

        /**
         * This method will be called right before this component is to be destroyed.
         *
         * @author: Rushabh Mulraj Shah
         */
        removeOrdersFromLocalStorage() {
            LocalStorageService.removeItem('oms-orders');
        },

        /**
         * This method will toggle the display of debug shipment drawer.
         * 
         * @author: Rushabh Mulraj Shah
         */
        toggleDebugShipment(display) {
            this.debugShipmentView = display;
        },

        /**
         * This method will add the selected order ID from the 
         * debug shipment drawer to the data variable 'debugOrderId'
         * 
         * @author: Rushabh Mulraj Shah
         */
        changeDebugOrderId(orderId) {
            this.debugOrderId = orderId;
        },

        /**
         * Function to fetch the companies.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        fetchCompanies(params = {}) {
            this.companiesListLoading = true;

            return CompanyAdminService.getCompanyList(params)
            .then(response => {
                if(response.data && response.data.items) {
                    this.companiesList = cloneDeep(response.data.items).map(item => {
                        return {
                            ...item,
                            text: item.name,
                            value: item.uid
                        }
                    });
                    this.companiesError = false;
                }
            })
            .catch(error => {
                console.error("Error in fetching list of companies:   ", error);
                this.$snackbar.global.showError(
                    'We are unable to fetch the list of companies',
                    3000
                );
                this.companiesError = true;
            })
            .finally(() => {
                this.companiesListLoading = false;
            })
        },

        /**
         * Method to handle user selection of company from the companies
         * dropdown. As of January 9, 2023, the selected company will be
         * used for fetching a list of fulfillment centres for that
         * company.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        onCompanyChange() {
            this.getFulfillmentCenter({});
        },

        /**
         * Method to handle searching of companies by the user.
         * If the length of the text is 0, selected company will be deleted.
         * Else, the fetchCompanies function will be called with the typed
         * text.
         * This method uses 'debounce' to ensure that the function waits for
         * 300 ms before getting the text and hitting the API.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @param {String} text The text entered by the user.
         */
        searchCompany: debounce(function(text) {
            if(text.length === 0) {
                this.selectedCompany = '';
                this.selectedStore = '';
                if(this.selectedView == 'orders') {
                    this.fetchOrders();
                } else if(this.selectedView == "shipment") {
                    this.fetchShipments();
                }
            }
            this.fetchCompanies({q: text});
        }, 300)
    },
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
.lock-toggle {
    margin-top: 2%;
    @media @mobile {
        margin-left: auto;
        margin-top: 0px;
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
    box-sizing: border-box;
    height: 100%;
    @media @mobile {
        width: calc(100% - 48px);
        margin-top: 48px;
    }


    .tab-row {
        display: flex;
        align-items: baseline;
        width: 100%;
        border-bottom: 1px solid @Iron;

        .tabs {
            flex: 1;
            padding-left: 12px;
            ::v-deep .nitrozen-tab-container {
            border-bottom: 1px solid #e0e0e0;
        }
        ::v-deep .nitrozen-tab-item {
            padding: 12px 36px;
            font-size: 16px;
        }
            @media @mobile {
                padding-left: 0;
            }
            ::v-deep .nitrozen-tab-active {
                font-weight: 500;
            }
        }
        .bulk-actions-button {
            top: -10px;
            margin-right: 12px;
        }
        .refresh-icon {
            cursor: pointer;
            margin: 0px 12px;
            display: flex;
            align-items: center;
            justify-content: center;

            // background-color: red;
            ::v-deep svg {
                fill: @RoyalBlue;
                transition: all 0.6s ease;
            }

            &:hover {
                ::v-deep svg {
                    transform: rotate(120deg);
                }
            }
        }
        .select-view {
            ::v-deep .nitrozen-select-wrapper {
                min-width: 145px;
                width: 145px;
                .nitrozen-select {
                    border-color: @RoyalBlue;
                    .nitrozen-select__trigger {
                        color: @RoyalBlue;
                        padding: 3px 14px;
                        font-weight: 700;
                        font-size: 12px;
                        line-height: 160%;
                        color: #2E31BE;
                    }
                }
            }
        }
        .right-container {
            display: flex;
            align-items: center;
        }
    }

    .content-container {
        width: 100%;
        // margin-top: 12px;
    }
    .search-box {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-bottom: 24px;

        ::v-deep .nitrozen-select,
        ::v-deep .n-input,
        ::v-deep .nitrozen-select__trigger {
            border-radius: 4px;
        }

        .search {
            min-width: 400px;
            width: 40%;
            ::v-deep .n-input-label-container{
                padding-bottom: 8px;
            }
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
                background: @White;
                box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
                z-index: 1;
                .more-filter-item {
                    margin-bottom: 10px;
                }
            }

            .more-filter-item {
                width: 250px;
                @media @mobile {
                    width: 100%;
                    margin-left: 0px;
                }
            }
        }

        .filter-row {
            display: grid;
            grid-template-columns: 0.8fr 1fr 1fr 1fr 1fr;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            width: 100%;
            font-size: 14px;
            margin-top: 8px;

            @media @mobile {
                flex-direction: column;
            }

            .filter-input-sm {
                min-width: 120px;
                width: 20%;
                @media @mobile {
                    width: 100%;
                }
            }

            .filter-input-lg {
                min-width: 250px;
                width: 34%;
                @media @mobile {
                    width: 100%;
                }
            }

            .filter-input-dr {
                min-width: 120px;
                width: 20%;
                @media @mobile {
                    width: 100%;
                }
            }

            .filter-dropdown {
                min-width: 150px;
                width: 200px;
                ::v-deep .nitrozen-dropdown-label {
                    padding-bottom: 8px;
                }
                ::v-deep .nitrozen-select-wrapper {
                    height: 40px;
                    .nitrozen-select {
                        height: 40px;
                        .nitrozen-select__trigger {
                            .nitrozen-searchable-input-container {
                                ::-webkit-search-cancel-button {
                                    margin-right: -8px;
                                    margin-left: 20px;
                                }
                            }
                        }
                        .nitrozen-options {
                            .nitrozen-option {
                                .nitrozen-option-container {
                                    padding: 6px 14px;
                                }
                            }
                        }
                    }

                }
                ::v-deep .nitrozen-checkbox-container {
                    height: 30px !important;
                }
                &.channel-dropdown {
                    width: 120px;
                }
            }
        }
    }
}
::v-deep .nitrozen-options {
    z-index: @actionBar !important;
}
.custom-store-dropdown-option {
    display: flex;
    padding: 0 6px;

    .option-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 6px 0;
        .text {
            font-weight: normal;
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
::v-deep .titlize {
    text-transform: capitalize;
}
.sub-tabs {
    padding: 16px 0px;
    display: flex;
    .lane-types{
        margin-right: 16px;
        ::v-deep .nitrozen-badge {
            cursor: pointer;
            height: 24px;
            display: flex;
            align-items: center;
            border-radius: 4px;
            text-transform: capitalize !important;
        }
    }
}

.all-items {
    margin-bottom: 12px;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: @Mako;
}
.pagination-main {
    margin-top: 40px;
}

.date-picker {
    ::v-deep input {
        font-size: 12px !important;
    }
    ::v-deep .n-input-label {
        padding-bottom: 8px;
    }
}

// .date-picker {
//     min-width: 235px !important;
//     width: 240px !important;
// }
.slide-fade {
    height: 100%;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @shipmentDrawer;
    .container {
        position: absolute;
        right: 0px;
        width: 30%;
        height: 100%;
        background: @White;
        overflow-y: scroll;
        overflow-x: hidden;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
        &::-webkit-scrollbar {
            display: none;
        }
        @media @mobile {
            position: fixed;
            width: 100%;
        }
        .cancel-btn {
            position: absolute;
            top: 15px;
            right: 20px;
            margin: 13px 10px 0px 0px;
            cursor: pointer;
        }
    }
}
.display-sub-tabs {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .advanced-filter {
        position: relative;
        cursor: pointer;
        .filter-applied-indicator{
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 100%;
            background: #E9783D;
            top: -2px;
            right: -3px;
        }
    }
    .right-side {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
    }
}

// .orders-alert {
//     position: fixed;
//     top: 64px;
//     z-index: 6;
//     display: flex;
//     align-items: center;
//     padding: 16px 24px;
//     background: #FFF5D6;
//     font-weight: 600;
//     font-size: 12px;
//     color: @Black;
//     line-height: 17px;
//     width: calc(100vw - 250px);

//     .alert-icon {
//         margin-right: 8px;
//     }
// }

.filter-row {
    .filter-item {
        width: 100% !important;
        font-size: 12px !important;
    }
}

.return-state-container {
    min-height: 50vh;
}

.submit-btn-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.error-label {
    font-size: 12px;
    margin-top: 4px;
}

.nitrozen-tab-container {
  display: flex;
  width: 100%;

  .nitrozen-tab {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    list-style: none;
    justify-content: flex-start;
    background-color: @White;
    overflow-x: scroll;
    -ms-overflow-style: none;
    padding: 0;
    margin: 0;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.tab-item-custom {
    padding: 12px 36px !important;
    font-size: 16px;
    display: flex;
    align-items: center;
}

.tab-item-count-custom-ac {
    font-size: 10px;
    line-height: 21px;
    font-weight: 600;
    color: #FFFFFF;
    background: #EB5757;
    min-width: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    border-radius: 10px;
    box-sizing: content-box;
    padding: 0 4px;
}

.nitrozen-tab-active {
    font-weight: 500;
}

.request-return-field {
    margin-bottom: 1rem;
}

.panel-oms {
    position: relative;
}

.oms-page-header {
    margin-top: 56px;
}
.filter-type {
    ::v-deep .nitrozen-dropdown-label {
        padding-bottom: 8px;
    }
}
.inside-date-picker {
    width: 100%;
    position: relative;
    .date-picker-sqaure {
        color: black;
        background: black;
        width: 16px;
        position: absolute;
        bottom: 12px;
        z-index: 1;
        right: 22px;
        opacity: 0;
        cursor: pointer;
    }
}

.main-container {
    margin: 0 !important;
}

.loading-section-label {
    color: #9b9b9b;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    padding-bottom: 8px;
}

.dropdown-loader {
    height: 40px;
}
</style>


