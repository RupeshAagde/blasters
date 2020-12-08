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
                :placeholder="'Search Ticket ID or Title'"
                v-model="searchText"
                @input="debounceInput"
            />
            <div class="dropdown-filters">
                <nitrozen-dropdown
                    :searchable="true"
                    class="archived-filter"
                    style="width: 215px"
                    :label="'Company'"
                    v-model="selectedCompany"
                    :items="companies"
                    @change="fetchTickets"
                    @searchInputChange="companySearch"
                    @scroll="companyScroll"
                ></nitrozen-dropdown>

                <nitrozen-dropdown
                    :searchable="false"
                    class="type-filter"
                    :label="'Status'"
                    v-if="filter_data.filters"
                    v-model="defaultStatus"
                    :items="filter_data.filters.statuses"
                    @change="fetchTickets"
                ></nitrozen-dropdown>

                <nitrozen-dropdown
                    :searchable="false"
                    class="applicable-on-filter"
                    :label="'Priority'"
                    v-if="filter_data.filters"
                    v-model="defaultPriority"
                    :items="filter_data.filters.priorities"
                    @change="fetchTickets"
                ></nitrozen-dropdown>

                <nitrozen-dropdown
                    class="archived-filter"
                    :searchable="false"
                    :label="'Category'"
                    v-if="filter_data.filters"
                    v-model="defaultCategory"
                    :items="filter_data.filters.categories"
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
                        #{{ ticket.ticket_id }}
                        {{ ticket.content.title }}
                    </div>
                    <!-- <div class="card-content-line-2">
                        {{ ticket.content.description }}
                    </div> -->
                    <div class="card-content-line-3">
                        Created by {{ ticket.created_by.user.firstName }}
                        {{ ticket.created_by.user.lastName }}
                        {{ ` on ${readableDate(new Date(ticket.createdAt))}` }}
                    </div>
                </div>
                <div class="card-badge-section right-container">
                    <div class="states">
                        <nitrozen-badge
                            v-if="
                                ticket.assigned_to != null &&
                                ticket.assigned_to.source != null &&
                                ticket.assigned_to.source
                            "
                            state="default"
                        >
                            {{
                                ticket.assigned_to.source.firstName +
                                ' ' +
                                ticket.assigned_to.source.lastName
                            }}</nitrozen-badge
                        >
                        <nitrozen-badge state="default">{{
                            ticket.category.display
                        }}</nitrozen-badge>
                        <nitrozen-badge state="default">{{
                            ticket.priority.display
                        }}</nitrozen-badge>
                        <nitrozen-badge state="default">{{
                            ticket.status.display
                        }}</nitrozen-badge>
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
        .search {
            flex: 1;
            max-width: 400px;
            margin-top: 22px;
        }
        .dropdown-filters {
            display: flex;
            flex: 1;
            justify-content: flex-end;
            > div {
                padding-left: 10px;
            }
            .type-filter {
                width: 130px;
            }
            .applicable-on-filter {
                width: 130px;
            }
            .archived-filter {
                width: 180px;
            }
        }
    }

    .nitrozen-pagination-container,
    .coupon-card-list {
        margin-top: 12px;
    }
}
</style>

<script>
import uktInlineSvg from '@/components/common/ukt-inline-svg';
import admInlineSvg from '@/components/common/adm-inline-svg';
import admNoContent from '@/components/common/page-empty';
import { debounce } from '@/helper/utils';
import admShimmer from '@/components/common/shimmer';
import { getRoute } from '@/helper/get-route';
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
        'adm-shimmer': admShimmer
    },
    props: {},
    data() {
        return {
            query_string: '',
            initial_data: [],
            companies: [
                {
                    text: 'All',
                    value: 'All',
                }
            ],
            selectedCompany: 'All',
            defaultStatus: 'All',
            defaultCategory: 'All',
            defaultPriority: 'All',
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
            searchText: ''
        };
    },
    mounted() {
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
        fetchTickets() {
            this.loading = true;

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
            }

            return SupportService.fetchTickets(params)
                .then((res) => {
                    this.initial_data = res.data.docs;
                    this.filter_data.pagination.total = res.data.total;
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
                })
                .catch((err) => {
                    console.log(err && err.message);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onTicketSelection(ticket) {
            this.$router.push({
                path: `${getRoute(
                    this.$route
                )}/administrator/support/ticket/edit/${ticket._id}`
            });
        },
        readableDate(date) {
            return moment(date).format('MMM Do YYYY, h:mm a');
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
                                value: 'All',
                            }
                        ];
                    }

                    this.companies.push(
                        ...res.data.data.map((v) => {
                            return {
                                text: v.name,
                                value: v.uid
                            };
                        })
                    );

                    this.pagination.total = res.data.total_count;
                    this.pagination.current = this.pagination.current + 1;
                    this.pagination.next_page = res.data.next_page;
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
};
</script>
