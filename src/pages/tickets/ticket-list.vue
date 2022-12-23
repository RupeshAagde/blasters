<template>
    <div class="coupon-list-container">
        <div class="coupon-filters">
            <nitrozen-input
                :value="
                    filter_data.query.title.trim() ||
                        filter_data.query.code.trim()
                "
                :showSearchIcon="true"
                class="search"
                :placeholder="'Search Ticket'"
                v-model="searchText"
                @input="debounceInput"
            />
            <div class="dropdown-filters">
                <nitrozen-dropdown
                    :searchable="false"
                    ref="company-dropdown"
                    class="archived-filter"
                    v-model="selectedCompany"
                    :label = "'Company'"
                    :placeholder="'Company'"
                    :items="companies"
                    @change="fetchTickets"
                    @searchInputChange="companySearch"
                    @scroll="companyScroll"
                ></nitrozen-dropdown>

                <nitrozen-dropdown
                    :searchable="false"
                    class="type-filter"
                    v-if="filter_data.filters"
                    v-model="defaultStatus"
                    :label = "'Status'"
                    :placeholder="'Status'"
                    :items="filter_data.filters.statuses"
                    @change="fetchTickets"
                ></nitrozen-dropdown>

                <nitrozen-dropdown
                    :searchable="false"
                    class="applicable-on-filter"
                    v-if="filter_data.filters"
                    v-model="defaultPriority"
                    :label = "'Priority'"
                    :placeholder="'Priority'"
                    :items="filter_data.filters.priorities"
                    @change="fetchTickets"
                ></nitrozen-dropdown>

                <nitrozen-dropdown
                    class="archived-filter"
                    :searchable="false"
                    v-if="filter_data.filters"
                    v-model="defaultCategory"
                    :label = "'Category'"
                    :placeholder="'Category'"
                    :items="filteredCategory"
                    @searchInputChange="categorySearch"
                    @change="fetchTickets"
                ></nitrozen-dropdown>
            </div>
        </div>
        <adm-shimmer v-if="loading" :count="4"></adm-shimmer>
        <div v-else-if="initial_data.length" class="coupon-card-list">
            <div
                v-for="(ticket, index) in initial_data"
                v-bind:key="index"
                class="bombshell-list-card-container"
                @click="onTicketSelection(ticket)"
            >
                <div class="card-content-section">
                    <div class="card-content-line-1">
                        {{ ticket.content.title }}
                        <!-- <inline-svg  :src="'kapture'"></inline-svg> -->
                        <div v-if="ticket.integration && ticket.integration.freshdesk_synced" class="in-sync">
                            <inline-svg
                                :src="'freshdesk-grey-icon'"
                            ></inline-svg>
                            <span class="in-sync-decs">in-sync</span>
                        </div>
                    </div>
                    <div class="card-content-line-2">
                        <div class="left-container-content">
                            <div class="date-content">
                                <span class="content-label">Date</span>
                                <span class="content-value">{{
                                    readableDate(new Date(ticket.createdAt))
                                }}</span>
                            </div>
                            <div class="priority-content">
                                <span class="content-label">Priority</span>
                                <span class="content-value">{{
                                    ticket.priority.display
                                }}</span>
                            </div>
                            <div class="category-content">
                                <span class="content-label">Category</span>
                                <span class="content-value">{{
                                    ticket.category.display
                                }}</span>
                            </div>
                        </div>
                        <div class="right-container">
                            <nitrozen-badge
                                v-if="ticket.status.key === 'pending'"
                                state="warn"
                            >
                                {{ ticket.status.display }}
                            </nitrozen-badge>
                            <nitrozen-badge
                                v-if="ticket.status.key === 'closed'"
                                state="default"
                            >
                                {{ ticket.status.display }}
                            </nitrozen-badge>
                            <nitrozen-badge
                                v-if="ticket.status.key === 'resolved'"
                                state="success"
                            >
                                {{ ticket.status.display }}
                            </nitrozen-badge>
                            <nitrozen-badge
                                v-if="ticket.status.key === 'in_progress'"
                                state="info"
                            >
                                {{ ticket.status.display }}
                            </nitrozen-badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <adm-no-content :helperText="'No Tickets found'"></adm-no-content>
        </div>
        <nitrozen-pagination
            v-if="initial_data.length"
            name="tickets"
            v-model="filter_data.pagination"
            :pageSizeOptions="perPageValues"
            @change="pageOptionChange"
        ></nitrozen-pagination>
    </div>
</template>

<style lang="less" scoped>
@import '../less/page-ui.less';

.coupon-list-container {
    width: 100%;
    word-break: break-all;
    position: relative;
    .coupon-filters {
        display: flex;
        background: #f8f8f8;
        border-radius: 4px;
        padding: 12px;
        .search {
            flex: 1;
            // max-width: 409px;
        }
        .dropdown-filters {
            display: flex;
            flex: 1;
            justify-content: flex-end;
            > div {
                padding-left: 10px;
            }
            .type-filter {
                // width: 130px;
            }
            .applicable-on-filter {
                // width: 130px;
            }
            .archived-filter {
                // width: 180px;
            }
        }
    }

    .nitrozen-pagination-container,
    .coupon-card-list {
        margin-top: 12px;
    }
}

.card-content-section {
    display: flex;
    flex: 1;
    flex-direction: column;
    .card-content-line-1 {
        display: flex;
        margin-bottom: 12px;
        .in-sync {
            color: #9b9b9b;
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 20px;
            margin-left: 12px;
            display: flex;
            .in-sync-decs {
                margin-left: 4px;
            }
        }
    }
    .card-content-line-2 {
        display: flex;
        justify-content: space-between;
        .left-container-content {
            position: relative;
            display: flex;
            .category-content {
                display: flex;
                flex-direction: column;
            }
            .date-content {
                margin-right: 72px;
                display: flex;
                flex-direction: column;
            }

            .priority-content {
                margin-right: 72px;
                display: flex;
                flex-direction: column;
            }
            .content-label {
                font-family: 'Inter';
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 20px;
                color: #9b9b9b;
            }
            .content-value {
                font-family: 'Inter';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 22px;
                color: #41434c;
            }
        }
    }
}

::v-deep .nitrozen-dropdown-label {
    display: none;
}
</style>

<script>
import uktInlineSvg from '@/components/common/ukt-inline-svg';
import admInlineSvg from '@/components/common/adm-inline-svg';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import admNoContent from '@/components/common/page-empty';
import { debounce } from '@/helper/utils';
import admShimmer from '@/components/common/shimmer';
import SupportService from './../../services/support.service';
import CompanyService from '@/services/company-admin.service';
import moment from 'moment';

const PAGINATION = {
    limit: 20,
    total: 0,
    next_page: true,
    current: 1
};

import {
    NitrozenInput,
    NitrozenButton,
    NitrozenDropdown,
    NitrozenPagination,
    NitrozenBadge,
    flatBtn
} from '@gofynd/nitrozen-vue';
import _ from 'lodash';
export default {
    name: 'ticket-list',
    components: {
        'ukt-inline-svg': uktInlineSvg,
        'adm-inline-svg': admInlineSvg,
        'nitrozen-input': NitrozenInput,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-pagination': NitrozenPagination,
        'adm-no-content': admNoContent,
        'adm-shimmer': admShimmer,
        'inline-svg': inlineSvgVue
    },
    props: {},
    data() {
        return {
            query_string: '',
            initial_data: [],
            companies: [
                {
                    text: 'All',
                    value: 'All'
                }
            ],
            checkingValue : "checking",
            selectedCompany: '',
            isCompanyFromRoute: false,
            defaultStatus: '',
            defaultCategory: '',
            defaultPriority: '',
            loading: false,
            show_schedule_modal: false,
            pagination: { ...PAGINATION },
            showSelectModal: false,
            filter_data: {
                query: {
                    title: ' ',
                    code: ' ',
                    type_slug: ' ',
                    scope: ' ',
                    is_display: ' '
                },
                pagination: {
                    limit: 10,
                    current: 1,
                    total: this.initial_count
                }
            },
            perPageValues: [1, 2, 5, 10, 25, 50, 100, 200],
            current_schedule: {},
            companySearchText: '',
            isFirstTime: true,
            searchText: '',
            filteredCategory: []
        };
    },
    mounted() {
        this.getFilterDataFromRoute();
        this.loadCompanies();
    },
    methods: {
        onSearch() {
            this.filter_data.query.title = this.searchText;
            this.filter_data.query.code = this.searchText;
            this.fetchTickets();
        },
        debounceInput: debounce(function(e) {
            this.onSearch();
        }, 200),
        categorySearch(e) {
            if (e && e.text) {
                this.filteredCategory = this.filter_data.filters.categories.filter(
                    (a) =>
                        a.text.toLowerCase().indexOf(e.text.toLowerCase()) > -1
                );
            } else {
                this.filteredCategory = this.filter_data.filters.categories;
            }
        },
        fetchTickets() {
            this.loading = true;

            const params = {
                page_size: this.filter_data.pagination.limit,
                page_no: this.filter_data.pagination.current
            };

            if (this.searchText != '') {
                params['search_text'] = this.searchText;
            }

            if (this.defaultStatus != 'All' && this.defaultStatus != '') {
                params['status'] = this.defaultStatus;
            }

            if (this.defaultPriority != 'All' && this.defaultPriority != '') {
                params['priority'] = this.defaultPriority;
            }

            if (this.defaultCategory != 'All' && this.defaultCategory != '') {
                params['category'] = this.defaultCategory;
            }

            if (this.selectedCompany != 'All' && this.selectedCompany != '') {
                params['company_id'] = this.selectedCompany;
            }

            return SupportService.fetchTickets(params)
                .then((res) => {
                    this.initial_data = res.data.items;
                    this.filter_data.pagination.total =
                        res.data.page.item_total;
                    this.filter_data.filters = res.data.filters;

                    this.filter_data.filters.statuses = [
                        {
                            display: 'All',
                            key: 'All'
                        },
                        ...this.filter_data.filters.statuses
                    ];

                    this.filter_data.filters.statuses.forEach((element) => {
                        element.text = element.display;
                        element.value = element.key;
                    });

                    this.filter_data.filters.priorities = [
                        {
                            display: 'All',
                            key: 'All'
                        },
                        ...this.filter_data.filters.priorities
                    ];

                    this.filter_data.filters.priorities.forEach((element) => {
                        element.text = element.display;
                        element.value = element.key;
                    });

                    this.filter_data.filters.categories = [
                        {
                            display: 'All',
                            key: 'All'
                        },
                        ...this.filter_data.filters.categories
                    ];

                    this.filter_data.filters.categories.forEach((element) => {
                        element.text = element.display;
                        element.value = element.key;
                    });

                    this.filteredCategory = this.filter_data.filters.categories;
                })
                .catch((err) => {
                    console.log(err && err.message);
                })
                .finally(() => {
                    this.loading = false;
                    this.setFilterForRoute();
                });
        },
        getFilterDataFromRoute() {
            this.searchText = this.$route.query.search_text || this.searchText;
            this.defaultStatus = this.$route.query.status || this.defaultStatus;
            this.defaultPriority =
                this.$route.query.priority || this.defaultPriority;
            this.defaultCategory =
                this.$route.query.category || this.defaultCategory;
            this.selectedCompany =
                this.$route.query.company_id || this.selectedCompany;
            var selectedCompanyName = this.$route.query.company_name || '';
            this.filter_data.pagination.current =
                this.$route.query.page || this.filter_data.pagination.current;
            this.filter_data.pagination.limit =
                this.$route.query.limit || this.filter_data.pagination.limit;
            if (this.selectedCompany != 'All' && selectedCompanyName != '') {
                this.companies.push({
                    value: this.selectedCompany,
                    text: selectedCompanyName
                });
                this.isCompanyFromRoute = true;
            }
        },
        setFilterForRoute() {
            const params = {
                limit: this.filter_data.pagination.limit,
                page: this.filter_data.pagination.current
            };
            if (this.searchText != '') {
                params['search_text'] = this.searchText;
            }

            if (this.defaultStatus != 'All' && this.defaultStatus != '') {
                params['status'] = this.defaultStatus;
            }

            if (this.defaultPriority != 'All' && this.defaultPriority != '') {
                params['priority'] = this.defaultPriority;
            }

            if (this.defaultCategory != 'All' && this.defaultCategory != '') {
                params['category'] = this.defaultCategory;
            }

            if (this.selectedCompany != 'All' && this.selectedCompany != '') {
                params['company_id'] = this.selectedCompany;
                var selectedObj = this.companies.find((obj) => {
                    return obj.value == this.selectedCompany;
                });
                if (selectedObj) {
                    params['company_name'] = selectedObj.text;
                }
            }

            this.$router
                .replace({
                    query: params
                })
                .catch(() => {});
        },
        onTicketSelection(ticket) {
            this.$router.push({
                path: `/administrator/support/ticket/${ticket._id}/edit`
            });
        },
        readableDate(date) {
            return moment(date).format('DD/MM/YYYY');
        },
        ticketSubtitle(ticket) {
            let subtitle = 'Created by ';

            if (ticket.created_by && ticket.created_by.user) {
                const username =
                    ticket.created_by.user.first_name +
                    ' ' +
                    ticket.created_by.user.last_name;
                subtitle = subtitle + username;
            } else if (ticket.created_by && ticket.created_by.details) {
                subtitle =
                    subtitle + ticket.created_by.details.name || 'Anonymous';
            } else {
                subtitle = subtitle + 'Anonymous';
            }

            return subtitle;
        },
        requestQuery() {
            const query = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit
            };

            if (this.companySearchText.length) {
                query.name = this.companySearchText;
            }

            return query;
        },
        loadCompanies(refresh) {
            if (refresh) {
                this.pagination = { ...PAGINATION };
            }
            CompanyService.getCompanyList(this.requestQuery())
                .then((res) => {
                    if (refresh) {
                        this.companies = [
                            {
                                text: 'All',
                                value: 'All'
                            }
                        ];
                    }
                    if (this.isCompanyFromRoute) {
                        this.isCompanyFromRoute = false;
                        this.companies.push(
                            ...res.data.items
                                .filter((v) => v.uid != this.selectedCompany)
                                .map((v) => {
                                    return {
                                        text: v.name,
                                        value: v.uid
                                    };
                                })
                        );
                        this.$refs['company-dropdown'].selectItem(
                            1,
                            this.companies[1]
                        );
                    } else {
                        this.companies.push(
                            ...res.data.items.map((v) => {
                                return {
                                    text: v.name,
                                    value: v.uid
                                };
                            })
                        );
                    }

                    this.pagination.total = res.data.page.item_total;
                    this.pagination.current = this.pagination.current + 1;
                    this.pagination.next_page = res.data.page.has_next;
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    if (!this.isFirstTime) {
                        return;
                    }
                    this.isFirstTime = false;
                    this.fetchTickets()
                        .then(() => {
                            //
                        })
                        .finally(() => {
                            this.loading = false;
                            this.isInitialLoad && (this.isInitialLoad = false);
                            this.initial_count = this.initial_data.count;
                        });
                });
        },
        companySearch(e) {
            let vm = this;
            this.companySearchText = e.text;

            _.debounce(function() {
                vm.loadCompanies(true);
            }, 400)();
        },
        companyScroll(event) {
            if (
                this.pagination.next_page &&
                event.scrollHeight - event.scrollTop <= 200
                // diff between scroll top and scroll end should be more than 200
            ) {
                this.loadCompanies();
            }
        },
        pageOptionChange(pageOptions) {
            this.fetchTickets();
        }
    }
}
</script>
