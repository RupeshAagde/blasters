<template>
    <div class="panel">
        <adm-page-header
            class="titlize"
            :showBackButton="false"
            :title="'Manifest'"
            :noContextMenu="true"
        ></adm-page-header>

        <div class="main-container">
            <div class="page-container">
                <div class="manifest-listing-filters">
                    <div class="filter-row search-div">
                        <nitrozen-input
                            label="Search"
                            :showSearchIcon="true"
                            class="search filter-input-lg"
                            type="search"
                            :placeholder="'Search by delivery partner, manifest ID, or shipment ID'"
                            v-model="searchText"
                            @keyup.enter="onSearch"
                        ></nitrozen-input>

                        <date-picker
                            label="Date Range"
                            class="date-picker filter-input-dr"
                            picker_type="date"
                            date_format="MMM Do, YY"
                            v-model="orderDateRange"
                            :clearable="false"
                            :range="true"
                            :not_before="notBefore"
                            :shortcuts="dateRangeShortcuts"
                            :not_after="new Date().toISOString()"
                            :useNitrozenTheme="true"
                            @input="onDateRangeChange"
                        />

                        <nitrozen-dropdown
                            label="Company"
                            class="filter-dropdown filter-input-sm company-dropdown"
                            :searchable="true"
                            :items="companiesList"
                            v-model="selectedCompany"
                            @change="onCompanyChange"
                            @searchInputChange="searchCompany($event.text)"
                        />

                        <nitrozen-dropdown
                            :disabled="selectedCompany.length === 0"
                            label="Fulfilment Centre"
                            class="filter-dropdown filter-input-sm stores-dropdown"
                            :searchable="true"
                            :items="filteredStores"
                            v-model="selectedStore"
                            @change="onFulfillmentCenterChange"
                            @searchInputChange="searchStore($event.text)"
                        />
                    </div>
                </div>

                <div class="tab-row">
                    <div
                        class="left-container"
                        v-if="manifestLaneData && manifestLaneData.length"
                    >
                        <nitrozen-tab
                            ref="tabs"
                            class="tabs"
                            :tabItem="manifestLaneData.map((item) => item.text)"
                            :active-index="selectedStageTabIndex"
                            @tab-change="onTabChange"
                        ></nitrozen-tab>
                    </div>
                </div>

                <div
                    class="manifest-header-container"
                    v-if="
                        manifestLaneData &&
                        manifestLaneData.length &&
                        (selectedStageTabIndex === 0 ||
                        selectedStageTabIndex === 1 ||
                        !isEmpty(advancedFilters))">
                    <p class="manifest-header-text" v-if="manifestData.length">
                        List of Manifests
                    </p>

                    <div class="manifest-header-action-buttons">
                        <!-- <nitrozen-button
                            :disabled="false"
                            v-if="selectedStageTabIndex == 0"
                            v-flatBtn
                            theme="secondary"
                            class="shipment-action-button"
                            @click="genManifest()"

                        >
                            Generate Manifest
                        </nitrozen-button> -->

                        <div
                            class="advanced-filter"
                            @click="advancedFilterSection()"
                            v-if="!isEmpty(advancedFilters)"
                        >
                            <ukt-inline-svg src="filter-oms" />
                            <div
                                class="filter-applied-indicator"
                                v-if="filterApplied"
                            />
                        </div>
                    </div>
                </div>

                <div class="alert" v-if="isDocDownloading">
                    <inline-svg :src="'oms-loader'" class="loading-icon" />
                    <span class="alert-text">
                        Wait! Manifest file is being uploaded
                    </span>
                </div>

                <div class="content-container">
                    <shimmer v-if="fetchInProgress" :count="4" />
                    <manifest-list-item
                        v-if="manifestDataLoaded && !fetchInProgress"
                        class="shipment-item"
                        :manifestList="manifestData"
                        :readOnlyMode="false"
                        :tabIndex="selectedStageTabIndex"
                        @downloadingDoc="showInProgress($event)"
                        @openConsentEvent="openUploadConsentDrawer($event)"
                    />
                    <adm-no-content
                        v-if="manifestData.length === 0"
                        helperText="No manifests found"
                    ></adm-no-content>
                </div>

                <div
                    class="pagination-div"
                    v-if="manifestData && manifestData.length"
                >
                    <nitrozen-pagination
                        class="pagination-main"
                        name="Manifest"
                        v-model="pagination"
                        @change="paginationChange"
                        :pageSizeOptions="pageSizeOptions"
                    />
                </div>

                <transition name="slide">
                    <template v-if="advancedFilterView">
                        <div
                            class="slide-fade"
                            ref="slide-fade"
                            @click="close($event)"
                        >
                            <div class="container">
                                <advanced-filter-drawer
                                    ref="slide-adv-filter"
                                    class="slide-adv-filter"
                                    :advancedFilters="advancedFilters"
                                    :advancedSelectedFilters="
                                        selectedAdvancedFilters
                                    "
                                    @applyFilters="
                                        advanceFilterApplied(
                                            $event,'filter')
                                    "
                                />

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
                    <template v-if="uploadConsentView">
                        <div
                            class="slide-fade-upload"
                            ref="slide-fade-upload-consent"
                            @click="close($event)"
                        >
                            <div class="container">
                                <upload-consent-drawer
                                    class="upload-consent-drawer"
                                    @dispatch="closeConsent($event)"
                                    :entryPoint="'home'"
                                    :manifestId="manifestId"
                                    :manifestInfo="manifestData[0]"
                                ></upload-consent-drawer>
                                <a class="cancel-btn" @click="close($event)">
                                    <ukt-inline-svg
                                        :src="'cross-black'"
                                    ></ukt-inline-svg>
                                </a>
                            </div>
                        </div>
                    </template>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import moment from 'moment';
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
    NitrozenBadge,
} from '@gofynd/nitrozen-vue';

/* Component imports */
import AdmNoContent from '@/components/common/adm-no-content.vue';
import AdmPageHeader from '@/components/common/layout/adm-page-header.vue';
import AdmShimmer from '@/components/common/shimmer.vue';
import AdvancedFilter from '@/pages/oms/advanced-filter-drawer.vue';
import DatePicker from '@/components/common/date-picker.vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import Loader from '@/components/common/loader.vue';
import ManifestListItem from '@/pages/oms/manifest/manifest-list.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import UploadConsentDrawer from '@/pages/oms/manifest/upload-consent-drawer.vue';

/* Service imports */
import OrderService from '@/services/orders.service';
import CompanyAdminService from '@/services/company-admin.service.js';

/* Helper imports */
import { dateRangeShortcuts } from '@/helper/datetime.util';
import { mapGetters } from 'vuex';





export default {
    name: 'manifest-home-page',
    components: {
        NitrozenButton,
        NitrozenDropdown,
        NitrozenInput,
        NitrozenPagination,
        NitrozenTab,
        NitrozenMenu,
        NitrozenMenuItem,
        NitrozenToggleBtn,
        NitrozenBadge,
        AdmNoContent,
        AdmPageHeader,
        shimmer: AdmShimmer,
        'advanced-filter-drawer': AdvancedFilter,
        DatePicker,
        InlineSvg,
        loader: Loader,
        ManifestListItem,
        UktInlineSvg,
        'upload-consent-drawer': UploadConsentDrawer,
    },
    directives: { flatBtn, strokeBtn, clickOutside },
    computed: {
        ...mapGetters({
            // accessDetail: GET_EMPLOYEE_ACCESS_DETAIL,
            accessDetail: {},
        }),
        isApplicationLevel() {
            return this.applicationId ? true : false;
        },
    },
    data() {
        return {
            applicationId: this.$route.params.applicationId,
            activeStatus: true,
            advancedFilterView: false,
            advancedFilters: {},
            companiesError: false,
            companiesList: [],
            dateRangeShortcuts: [...dateRangeShortcuts],
            errorText: undefined,
            fetchInProgress: false,
            fetchFulFillmentStoresInProgress: false,
            fetchFulFillmentStoresFailure: false,
            filteredStores: [],
            isDocDownloading: false,
            isInitialLoad: true,
            manifestData: [],
            manifestDataLoaded: false,
            manifestFetchFailure: false,
            manifestLaneData: [
                {
                    text: 'Active',
                    value: 'active',
                },
                {
                    text: 'Closed',
                    value: 'closed',
                },
            ],
            notBefore: moment().subtract(3, 'months').toISOString(),
            orderDateRange: [
                moment().subtract(1, 'weeks').toISOString(),
                moment().toISOString(),
            ],
            pagination: {
                limit: 10,
                total: 1,
                current: 1,
            },
            pageSizeOptions: [10, 20, 50, 100, 200],
            selectedCompany: '',
            selectedStageTabIndex: 0,
            selectedStore: '',
            searchText: '',
            selectedAdvancedFilters: {},
            uploadConsentView: false,
            manifestId: '',
            globalParams: {},
            filterApplied: false,
        };
    },
    mounted() {
        this.globalParams['page_no'] = this.pagination.current;
        this.globalParams['page_size'] = this.pagination.limit;
        this.globalParams['status'] = 'active';
        this.globalParams['from_date'] = moment(this.orderDateRange[0]).format(
            'DD-MM-YYYY'
        );
        this.globalParams['to_date'] = moment(this.orderDateRange[1]).format(
            'DD-MM-YYYY'
        );
        this.fetchCompanies();

        this.fetchFilters();
        if(!isEmpty(this.$route.query)){
            let d = {}
            for(let item in this.$route.query ){
                d[item] = this.$route.query[item].split(',')
            }
            this.selectedAdvancedFilters = d

            this.filterApplied = true
            this.advanceFilterApplied({}, 'mounted')
        } else {
            this.filterApplied = false
            this.fetchManifestsList();
        }

    },
    watch: {
        searchText(newValue, oldValue) {
            if (newValue.length === 0 && oldValue.length > 0) {
                this.globalParams['search_value'] = '';
                this.fetchManifestsList();
            }
        }
    },
    methods: {
        isEmpty,

        advanceFilterApplied(e, location) {
            if (location == 'filter') {
                let query = {};
                if(!isEmpty(e.data)) {
                    this.selectedAdvancedFilters = e.data
                    for (let item in e.data) {
                        if(e.data[item] === undefined || e.data[item] === null || e.data[item].length === 0) {
                        delete e.data[item];
                        delete this.globalParams[item];

                    } else {
                        query[item] = e.data[item].toString();
                        this.globalParams[item] =  e.data[item].toString();
                    }
                  if(Object.keys(e.data).length == 0){
                    this.filterApplied = false;

                    this.$router.push({ path: this.$route.path, query }).catch(() => {});;
                  }else{
                    this.$router.push({ path: this.$route.path, query }).catch(() => {});;
                    this.filterApplied = true
                  }
                }

                this.fetchManifestsList();

                } else {
                    for(let item in this.$route.query) {
                    if(this.$route.query[item] === undefined || this.$route.query[item] === null || this.$route.query[item].length === 0) {
                        delete this.$route.query[item];
                    }
                }
                    this.$router.push({ path: this.$route.path, query }).catch(() => {});;
                    this.filterApplied = false
                }

            } else {
                for (let item in this.$route.query) {
                    let query = this.$route.query;
                    if(query[item] === undefined || query[item] === null || query[item].length === 0) {
                        delete query[item];
                    } else{
                        this.globalParams[item] =  this.$route.query[item];
                    }
                    this.$router.push({ path: this.$route.path, query }).catch(() => {});;

                }
                this.fetchManifestsList();

            }

            /* @author Sameer shaikh
             * this is a emission from advance filter component
             * and we will apply filter by adding it in the param
             */
            this.advancedFilterView = false;
            // if (!isEmpty(query)) {
            //     return query;
            // } else {
            //     this.fetchManifestsList();
            //     return query;
            // }
        },

        advancedFilterSection: function () {
            // if (!this.isAdvancedFilterApplied()) {
            //     this.selectedAdvancedFilters = {};
            // }
            this.advancedFilterView = !this.advancedFilterView;
        },

        close: function (e) {
            e.stopPropagation();
            this.advancedFilterView = false;
            this.uploadConsentView = false;
        },

        closeConsent() {
            this.uploadConsentView = false;
           setTimeout(()=>{
                this.fetchManifestsList();
           }, 1000)
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
         * Fetching the list of fulfillment centres for the filters
         */
        fetchFulfillmentCentres(params = {}) {
            params = {
                page_no: 1,
                page_size: 500,
                ...params,
            };
            return OrderService.getFulfillmentCenterV2(params, this.selectedCompany)
                .then((response) => {
                    if (response.data && response.data.items) {
                        this.filteredStores = response.data.items.map(
                            (item) => {
                                return {
                                    text: item.display_name || item.name,
                                    value: item.uid,
                                };
                            }
                        );
                        if(
                            this.accessDetail && 
                            this.accessDetail.store_access &&
                            this.accessDetail.store_access.values &&
                            this.accessDetail.store_access.values.length > 0) {
                            this.filteredStores = this.filteredStores.filter((item)=>  this.accessDetail.store_access.values.includes(item.value))
                        }
                    } else {
                        this.filteredStores = {};
                    }
                })
                .catch((error) => {
                    this.fetchFulFillmentStoresFailure = true;
                });
        },

        /**
         * Fetching the list of manifests and storing it in the local component
         *
         * @author: Rushabh Mulraj Shah
         * @param {object} params The object of parameters that need to be sent to the API request
         */
        fetchManifestsList() {
            this.fetchInProgress = true;

            // /* Set up the parameters that need to be sent to the API request */
            // let finalParams = {
            //     from_date: moment(this.orderDateRange[0]).format('DD-MM-YYYY'),
            //     to_date: moment(this.orderDateRange[1]).format('DD-MM-YYYY'),
            //     ...
            // }

            /* If a search term is already existing, add it to params */
            // if(this.searchText && this.searchText.length > 0) finalParams.search_value = this.searchText;

            // /* If a store is already selected, then it needs to be added to the params */
            // if(this.selectedStore) finalParams.store_id = this.selectedStore;

            // /* Delete the key search_value if it does not have length or doesn't exist */
            // if(!params.search_value) delete params.search_value;

            // /* Delete params which are not required in the final request to API */
            // if(params.current) delete finalParams.current;
            // if(params.size) delete finalParams.size;

            let fetchRequest = OrderService.fetchManifestList(
                this.globalParams
            );

            fetchRequest
                .then((res) => {
                    if(res && res.data && res.data.items) {
                        this.manifestData = res.data.items;
                        if (res.data.advanced_filters)
                            this.advancedFilters = res.data.advanced_filters;
                        if(res && res.data && res.data.page) {
                            this.pagination = {
                                ...res.data.page,
                                limit: res.data.page.size,
                            };
                        }
    
                        this.manifestDataLoaded = true;
                    }
                })
                .catch((err) => {
                    console.error(
                        'Error in fetching the manifest list:   ',
                        err
                    );
                    this.$snackbar.global.showError(
                        `Unable to fetch the list of manifests`,
                        3000
                    );
                    this.manifestFetchFailure = false;
                    this.manifestData = [];
                })
                .finally(() => {
                    this.fetchInProgress = false;
                });
        },


        fetchFilters() {
            const params = {
                view: 'manifest',
            };

            const get_filters_promise = this.isApplicationLevel
                ? OrderService.fetchApplicationV2Filters(
                      this.companyId,
                      this.applicationId,
                      params
                  )
                : OrderService.fetchV2Filters(this.companyId, null, params);
            return get_filters_promise
                .then(({ data }) => {
                    this.advancedFilters = data.advance;
                    // this.channelOptions = advFilters[0].options;
                    // this.orignalChannelOptions = advFilters[0].options;
                    // this.dpOptions = advFilters[1].options;
                    // this.orignalDpOptions = advFilters[1].options;
                })
                .catch((error) => {
                    this.$snackbar.global.showError('Unable to fetch filters');
                    console.error('Error in fetching the filters:   ', error);
                });
        },

        genManifest() {
            /* @author Sameer shaikh
             * this function is called on click on generate manifest button and this will
             * route us to manifest generate page
             */
            let cleansedQuery = Object.keys(cloneDeep(this.$route.query))
                .filter((key) => {
                    let item = this.$route.query[key];
                    return (
                        item !== undefined && item !== null && item.length > 0
                    );
                })
                .reduce((finalObj, key) => {
                    let value = this.$route.query[key];
                    finalObj[key] = value;
                    return finalObj;
                }, {});

            this.$router.push({
                name: 'company-manifest-generate',
                params: {},
                query: {
                    ...cleansedQuery,
                },
            });
        },

        /* @author Sameer shaikh
         *Used to show the indicator for advanced applied filters
         */
        isAdvancedFilterApplied() {
            const oldRequestObject = this.$route.query.selected_filters
                ? JSON.parse(this.$route.query.selected_filters)
                : {};
            if (oldRequestObject && Object.values(oldRequestObject).length) {
                return Object.values(oldRequestObject).find(
                    (asf) => asf && asf.length
                )
                    ? true
                    : false;
            } else {
                return false;
            }
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
            this.fetchFulfillmentCentres();
        },

        /**
         * Method to handle date range changes
         *
         * @author: Rushabh Mulraj Shah
         */
        onDateRangeChange() {
            (this.globalParams['from_date'] = moment(
                this.orderDateRange[0]
            ).format('DD-MM-YYYY')),
                (this.globalParams['to_date'] = moment(
                    this.orderDateRange[1]
                ).format('DD-MM-YYYY'));
            this.fetchManifestsList();
        },

        /**
         * Method to handle fulfillment centre change
         *
         * @author: Rushabh Mulraj Shah
         */
        onFulfillmentCenterChange() {
            this.globalParams['store_id'] = this.selectedStore;
            this.fetchManifestsList();
        },

        /**
         * Method to handle search inputs entered by the user
         *
         * @author: Rushabh Mulraj Shah
         */
        onSearch() {
            /**
             * If the user has entered text for search, it will send across the relevant parameters,
             * or else it will not send any parameters
             */
            this.globalParams['search_value'] = this.searchText;
            this.fetchManifestsList();
        },

        /**
         * Method to handle changing of tabs
         * If the index is the same, i.e., if the user has clicked the same tab that he
         * is currently on, the function will exit gracefully.
         * Else it will change the necessary variables and hit the fetch request.
         *
         * @author: Rushabh Mulraj Shah and Sameer Shaikh
         * @param {object} e The event object
         */
        onTabChange(e) {
            if (this.selectedStageTabIndex == e.index) {
                return;
            } else {
                this.selectedStageTabIndex = e.index;
                this.activeStatus = e.item === 'Active';
                this.globalParams['status'] =
                    e.item === 'Active' ? 'active' : 'closed';
                this.fetchManifestsList();
            }
        },

        openUploadConsentDrawer(manifestId) {
            this.manifestId = manifestId;
            this.uploadConsentView = true;
        },

        /**
         * Handling pagination change and forwarding it to fetchManifestList
         *
         * @author: Rushabh Mulraj Shah
         * @param {object} pageObj The event object received from nitrozen-pagination
         */
        paginationChange(pageObj) {
            let { current, limit, size } = cloneDeep(pageObj);

            this.globalParams['page_no'] = current;
            this.globalParams['page_size'] = limit;

            this.fetchManifestsList();
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
                this.fetchManifestsList();
            }
            this.fetchCompanies({q: text});
        }, 300),

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
            if (text.length === 0) this.selectedStore = '';
            this.fetchFulfillmentCentres({ q: text });
        }, 300),

        showInProgress(state) {
            /* @author Sameer shaikh
             *show mirage alert on for downloading file
             */
            this.isDocDownloading = state;
        },
    },
};
</script>

<style lang="less" scoped>
@import '../../less/page-header.less';
@import '../../less/page-ui.less';
::v-deep .titlize {
    text-transform: capitalize;
}

::v-deep .mirage-alert-plain {
    width: auto;
    margin-top: 1rem;
}

.page-container {
    box-sizing: border-box;
    height: 100%;
    margin: 0 !important;

    @media @mobile {
        width: calc(100% - 48px);
        margin-top: 48px;
    }

    .manifest-listing-filters {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-bottom: 24px;

        .filter-row {
            justify-content: space-between;
            align-items: center;
            width: 100%;
            font-size: 14px;
            margin-top: 8px;
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            column-gap: 1rem;

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

                @media @mobile {
                    width: 100%;
                }
            }

            .filter-input-dr {
                min-width: 120px;

                @media @mobile {
                    width: 100%;
                }
            }

            .filter-dropdown {
                min-width: 200px;

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

            ::v-deep .n-input,
            ::v-deep .nitrozen-select__trigger {
                border-radius: 4px;
            }
        }

        .search {
            min-width: 400px;

            @media @mobile {
                min-width: 100%;
            }

            ::v-deep .nitrozen-search-icon {
                svg {
                    stroke-width: 0;
                }
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
    }

    .pagination-div {
        width: 100%;

        .pagination-main {
            margin-top: 40px;
            width: 100%;
        }
    }

    .alert-content {
        width: 100%; //will be removed after removing close icon
        display: flex;
        justify-content: space-between;
        align-items: center;

        .retry-button {
            background-color: red;
            margin-right: 8px;
        }
    }
    .manifest-header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        min-height: 50px;
        padding-top: 10px;

        .advanced-filter {
            position: relative;
            padding-left: 20px;
            cursor: pointer;

            .filter-applied-indicator {
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 100%;
                background: #e9783d;
                top: -2px;
                right: -3px;
            }
        }
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
                    }
                }
            }
        }
    }

    .content-container {
        width: 100%;
        margin-top: 12px;
    }
}

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

.sub-tabs {
    padding: 16px 0px;
    display: flex;

    .lane-types {
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

.slide-fade-upload {
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
        width: auto;
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

    .right-side {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
    }
}

.date-picker {
    ::v-deep .n-input {
        font-size: 12px !important;
    }
}

.stores-dropdown {
    ::v-deep .nitrozen-option {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}

.alert {
    background: #f5f8ff;
    border: 1px solid #2e31be;
    border-radius: 4px;
    padding: 12px;
    font-size: 13px;
    line-height: 21px;
    color: #41434c;
    font-weight: 400;
    width: 100%;
    display: flex;
    margin-top: 1rem;

    .loading-icon {
        margin-right: 1rem;
    }
}

.manifest-header-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #000000;
}

.manifest-header-action-buttons {
    margin-left: auto;
    display: flex;
    align-items: center;
}
</style>
