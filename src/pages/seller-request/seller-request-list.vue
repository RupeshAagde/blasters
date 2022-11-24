<template>
    <div class="panel">
        <div class="page-container">
             <div class="text-heading">
                <label>Downgrade Requests {{
                        '(' + (pagination.total || RequestList.length) + ')'
                    }}</label>
                <nitrozen-tooltip
                    :position="'top'"
                    :tooltipText="'Seller Plan downgrade request for review'"
                ></nitrozen-tooltip> 
            </div>
            <!--Search Bar-->
            <template>
                <div class="search-filter">
                    <nitrozen-input
                        :showSearchIcon="true"
                        class="search-box"
                        type="search"
                        placeholder="Search by name"
                        ref="search-box"
                        v-model="searchText"
                        @input="debounceInput({ name: searchText })"
                    ></nitrozen-input>

                    <div class="filter">
                        <label class="label">Filter</label>
                        <nitrozen-dropdown
                            class="filter-dropdown"
                            :items="filters"
                            v-model="selectedFilter"
                            ref="filter-dropdown"
                            @change="
                                setRouteQuery({
                                    status: selectedFilter
                                })
                            "
                        ></nitrozen-dropdown>
                    </div>
                </div>
            </template>

            <!--Staff List-->
            <div class="seller-request-card-list">
                <list-shimmer
                    v-if="pageLoading && !pageError"
                    :count="4"
                ></list-shimmer>
                <page-error
                    v-else-if="pageError && !pageLoading"
                    @retry="fetchDowngradeRequest()"
                ></page-error>

                <div
                    v-for="(request, index) in RequestList"
                    :key="request._id"
                >
                    <seller-request-card
                        @updateStatus="(status)=>updateDowngradeRequestStatus(request._id, status)"
                        :sellerRequest="request"
                        :ref="'seller-request-' + index"
                    >
                    </seller-request-card>
                </div>
            </div>
            <page-empty
                v-if="RequestList.length == 0"
                text="No request for review"
            ></page-empty>
            <div v-if="RequestList.length" class="pagination">
                <nitrozen-pagination
                    name="Downgrade requests"
                    v-model="pagination"
                    ref="ext-paginagtion"
                    @change="paginationChange"
                    :pageSizeOptions="[5, 10, 20, 50]"
                ></nitrozen-pagination>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.main-container {
    height: 100%;
    .page-container {
        width: 100%;
    }
}
.text-heading {
    font-size: 18px;
    color: #41434c;
    font-weight: bold;
    // margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;

    .nitrozen-tooltip {
        margin-left: 6px;
    }
}
.seller-requests-jmbtrn {
    width: 100%;
}

.seller-request-card-list {
    width: 100%;
    background-color: @White;

    .seller-request-card {
        & + .seller-request-card {
            margin-top: 24px;
        }
    }
}

.seller-request-filters {
    display: flex;
    .dropdown-filters {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        > div {
            padding-left: 10px;
        }
        .type-filter {
            width: 100px;
        }
        .applicable-on-filter {
            width: 200px;
        }
        .archived-filter {
            width: 100px;
        }
    }
}

.nitrozen-pagination-container,
.seller-request-card-list {
    margin-top: 20px;
}
.search-filter {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    align-items: center;
    width: 100%;
    .search-box {
        min-width: 400px;
    }
    .filter-dropdown {
        width: 200px;
        margin-left: 12px;
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

    .filter {
        display: flex;
        flex-direction: row;
        .filter-text {
            color: @Mako;
            font-size: 14px;
            line-height: 20px;
            font-weight: 500;
        }
        select {
            background-color: @White;
            border: 1px solid @Iron;
            border-radius: 3px;
            height: 40px;
            color: @Mako;
            font-size: 14px;
            padding: 5px 10px;
        }
    }
}
.pagination {
    width: 100%;
    float: right;
}
</style>

<script>
import jumbotronVue from '@/components/common/jumbotron.vue';
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenPagination,
    NitrozenBadge,
    NitrozenDropdown,
    NitrozenTooltip
} from '@gofynd/nitrozen-vue';

import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import listShimmer from '@/components/common/shimmer.vue';
import sellerRequestCard from '../company-admin/seller-request-card.vue';
import { debounce } from '@/helper/utils';
import BillingService from '@/services/billing.service';
import { GET_CURRENT_ACTIVE_SUBSCRIPTION } from '@/store/getters.type';
import {
    FETCH_CURRENT_ACTIVE_SUBSCRIPTION
} from '@/store/action.type';
import { mapGetters } from 'vuex';
import get from 'lodash/get';

const PAGINATION = {
    current: 1,
    limit: 10,
    total: 0
};

const ROLE_FILTER = [
    { value: 'pending', text: 'Pending' },
    { value: 'cancelled', text: 'Cancelled' },
    { value: 'approved', text: 'Approved' }
];

export default {
    name: 'seller-request-list',
    components: {
        jumbotron: jumbotronVue,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-tooltip': NitrozenTooltip,
        'page-empty': pageEmpty,
        'page-error': pageError,
        'list-shimmer': listShimmer,
        'seller-request-card': sellerRequestCard
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            pageLoading: false,
            searchText: '',
            RequestList: [],
            filters: [...ROLE_FILTER],
            pagination: {
                current: 1,
                limit: 10,
                total: 0
            },
            selectedFilter: 'pending',
            company_id: this.$route.params.companyId,
            currentPlan:"",
        };
    },
    mounted() {
        this.pageLoading = true;
        this.populateFromURL();
        this.$store
                .dispatch(FETCH_CURRENT_ACTIVE_SUBSCRIPTION, {
                    params: {
                        unique_id: this.company_id,
                        product_suite: 'fynd-platform',
                        type: 'company'
                    }
                })
                .then((val)=>{
                    this.currentPlan=val.subscription;
                    return this.fetchDowngradeRequest();
                })
    },
    computed:{
        ...mapGetters({
            currentActivePlan: GET_CURRENT_ACTIVE_SUBSCRIPTION
        }),
    },
    methods: {
        populateFromURL() {
            const { search, page, limit, status } = this.$route.query;
            this.searchText = search || this.searchText;
            this.selectedFilter = status || 'pending';
        },
        debounceInput: debounce(function(e) {
            if (this.searchText.length === 0) {
                this.clearSearchFilter();
            } else {
                this.setRouteQuery({ name: this.searchText });
            }
            this.fetchDowngradeRequest();
        }, 500),
        clearSearchFilter() {
            this.searchText = '';
            this.setRouteQuery({ name: undefined });
        },
        fetchDowngradeRequest() {
            let subscription_id = this.safeGet(this.currentPlan,'subscriber_id')
            let params = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit,
                status: this.selectedFilter,
                // name: this.searchText,
                subscriber_id: subscription_id
            };
            this.pageLoading = true;
            this.pageError = false;
            return BillingService.getDowngradeRequestList(params,this.company_id)
                .then(({ data }) => {
                    this.RequestList = data.items;
                    this.pagination.total = data.page.item_total;
                    this.pageLoading = false;
                })
                .catch((err) => {
                    this.pageError = true;
                    this.$snackbar.global.showError("Failed to fetch downgrade plan requests");
                    console.log(err);
                });
        },
        updateDowngradeRequestStatus(requestId, status) {
            this.pageLoading = true;
            this.pageError = false;
             BillingService.updateSubscriptionOnRequest(requestId,this.company_id, {status})
                .then(() => {
                    this.fetchDowngradeRequest();
                    this.$snackbar.global.showSuccess("Updated downgrade plan request successfully");
                })
                .catch((err) => {
                    this.pageError = true;
                    this.$snackbar.global.showError("Failed to fetch downgrade plan requests");
                    console.log(err);
                });
        },
        paginationChange(e) {
            this.pagination = e;
            this.fetchDowngradeRequest();
        },
        safeGet(obj, path, defaultValue) {
            return get(obj, path, defaultValue);
        },
        setRouteQuery(query) {
            if (query.search) {
                // clear pagination if search or filter applied
                this.pagination = { ...PAGINATION };
                query.page = undefined;
                query.limit = undefined;
            }
            this.$router.push({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    ...query
                }
            });
            if (query.status) {
                // clear pagination if search or filter applied
                //this.selectedFilter=query.status;
                this.pagination = { ...PAGINATION };
                query.page = undefined;
                query.limit = undefined;
            }

            this.fetchDowngradeRequest();
        }
    }
};
</script>
