<template>
    <div class="full-width">
        <div class="applications" style="width: 98%">
            <div v-if="inProgress" class="shimmer"></div>
            <div
                class="search-box"
            >
                <div v-if="isInitialLoad" class="input-shimmer shimmer"></div>
                <template v-else>
                    <nitrozen-input
                        :showSearchIcon="true"
                        class="search"
                        type="search"
                        placeholder="Search by number..."
                        v-model="searchText"
                        @input="debounceInput({ number: searchText })"
                    ></nitrozen-input>

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

                    <!-- <div class="filter">
                        <label class="label">Filter</label>
                        <nitrozen-dropdown
                            class="filter-dropdown"
                            :items="filters"
                            v-model="selectedFilter"
                            @change="
                                fetchCompany(),
                                    setRouteQuery({ stage: selectedFilter })
                            "
                        ></nitrozen-dropdown>
                    </div> -->
                </template>
            </div>
            <div
                v-if="
                    !inProgress && applicationList && applicationList.length > 0
                "
            >
                <div
                    class="container"
                    v-for="(item, index) in applicationList"
                    :key="index"
                    :title="item.name"
                    @click="goToBillingPage(item._id)"
                >
                    <div class="line-1">
                        <div class="cust-head">
                            <a>Payment Status</a>
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
                    <div class="line-2" v-if="item.number">
                        <div class="cust-head">Number</div>
                        <div
                            class="cust-pointer"
                            :title="`${item.number} (Click to copy)`"
                            @click="copy(item.number)"
                        >
                            {{ item.number }}
                        </div>
                    </div>
                    <div class="line-2" v-if="item.receipt_number">
                        <div class="cust-head">Receipt No</div>
                        <div
                            class="cust-app cust-pointer"
                            :title="`${item.receipt_number} (Click to copy)`"
                            @click="copy(item.receipt_number)"
                        >
                            {{ item.receipt_number }}
                        </div>
                    </div>
                    <div class="line-2" v-if="item.period">
                        <div class="cust-head" v-if="item.period.start">
                            Start Date
                        </div>
                        <div
                            v-if="item.period.start"
                            :title="item.period.start"
                        >
                            {{ item.period.start | formatDate }}
                        </div>
                    </div>
                    <div class="line-2" v-if="item.period">
                        <div class="cust-head" v-if="item.period.start">
                            End Date
                        </div>
                        <div v-if="item.period.end" :title="item.period.end">
                            {{ item.period.end | formatDate }}
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
                            >{{ item.total }}
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
        </div>
    </div>
</template>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.top-badge {
    display: flex;
    justify-content: flex-start;
    margin-left: 24px;
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
.shimmer {
    display: block;
    width: 100%;
    height: 48px;
    margin-bottom: 24px;
}
.search-box {
    min-width: 400px;
}
.search-box {
    margin: 0 0 24px 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .search {
        min-width: 400px;
    }

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
        width: 200px;
        margin-left: 12px;
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
    font-size: 14px;
    color: #9b9b9b;
    font-weight: 100;
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
                font-weight: bold;
                cursor: pointer;
            }

            .cust-badge {
                margin-left: 6px;
                display: flex;
                align-items: center;
            }
        }
        .line-2 {
            margin: 12px 0;
            display: flex;
            font-size: 14px;
            line-height: 20px;
            color: #41434c;
            font-weight: 200;
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
} from '@gofynd/nitrozen-vue';
import { FETCH_METRICS } from '@/store/action.type';
import marketplaceChannels from './mkp-channels.vue';
import moment from 'moment';
import { titleCase, debounce } from '@/helper/utils';

import root from 'window-or-global';
const env = root.env || {};

const PAGINATION = {
    limit: 10,
    total: 0,
    current: 1,
};

export default {
    name: 'invoice-listing',
    components: {
        Shimmer,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-button': NitrozenButton,
        'nitrozen-tab': NitrozenTab,
        'mkp-channels': marketplaceChannels,
        'ukt-inline-svg': uktInlineSVG,
        'adm-inline-svg': admInlineSVG,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-input': NitrozenInput,
        NitrozenDropdown,
        'date-picker': DatePicker,
    },
    computed: {},
    data() {
        return {
            companyId: this.$route.params.companyId,
            inProgress: false,
            pageLoading: false,
            isInitialLoad: false,
            selectedFilter: 'all',
            profileDetails: {},
            applicationList: [],
            pagination: { ...PAGINATION },
            searchText: '',
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
            },
            contextMenuItems: [
                {
                    text: 'View Company',
                    action: 'edit',
                },
            ],
            currencyMap: {
                INR: '&#8377;',
            },
        };
    },
    mounted() {
        console.log(this.$route.params);
        this.fetchInvoiceList();
    },
    computed: {},
    filters: {
        formatDate(value) {
            if (value) {
                return moment(String(value)).format('ll');
            }
        },
    },
    methods: {
        goToBillingPage(id) {
            this.$router.push({ path: `/administrator/billing-details/${id}` });
        },
        dateChanged() {
            console.log(this.filters)
            this.fetchInvoiceList();
        },
        fetchInvoiceList() {
            BillingService.getInvoiceListing(this.requestQuery()).then(
                (res) => {
                    console.log('data', res.data);
                    this.applicationList = res.data.items;
                    this.pagination.total = res.data.page.item_total;
                    this.pageLoading = false;
                }
            );
        },
        getProfileDetails: function () {
            let params = {
                uid: this.companyId,
                // phase: 'company_detail'
            };
            this.inProgress = true;
            CompanyService.fetchCompanyProfile(params)
                .then((res) => {
                    this.inProgress = false;
                    console.log(res.data);
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
        debounceInput: debounce(function (e) {
            if (this.searchText.length === 0) {
                this.clearSearchFilter();
            } else {
                this.setRouteQuery({
                    number: { $regex: this.searchText, $options: 'ig' },
                });
            }
            this.fetchInvoiceList();
        }, 200),
        requestQuery() {
            const query = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit,
            };
            let filterQuery = {};
            if (this.searchText) {
                filterQuery.number = {
                    $regex: this.searchText,
                    $options: 'ig',
                };
            }
            if (this.companyId) {
                filterQuery.company_id = this.companyId;
            }
            if (this.validateDates() == 'valid'){
                let start = this.filters.start.value;
                let end = this.filters.end.value;
                if(start){
                    filterQuery['period.start']={$gte: start}
                }
                if(end){
                    filterQuery['period.end']={$lte: end} 
                }
            } else if (this.validateDates() == 'invalid') {
                this.$snackbar.global.showError('Invalid dates provided');
                return;
            } else if (this.validateDates() == 'notProvidedStart') {
                this.$snackbar.global.showError('Please provide start date');
                return;
            }
            query.query = JSON.stringify(filterQuery);
            // if (this.selectedFilter !== 'all') {
            //     query.stage = [this.selectedFilter];
            // }
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
                    ...query,
                },
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
    },
};
</script>
