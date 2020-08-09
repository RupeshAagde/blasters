<template>
    <div class="plans-list main-container">
        <div class="page-container">
            <jumbotron
                :title="jumbotronData ? `${jumbotronData.jumbotronTitle}` : ''"
                :desc="jumbotronData ? jumbotronData.jumbotronBody : ''"
                btnLabel="Create"
                @btnClick="choosePlanType"
            >
            </jumbotron>
            <div class="plans-list-container">
                <div class="plans-filters">
                    <nitrozen-input
                        :showSearchIcon="true"
                        :placeholder="'Search Name'"
                        @input="debounceInput"
                        v-model="searchText"
                        class="search"
                    />
                    <div class="dropdown-filters">
                        <!-- <nitrozen-dropdown
                            class="type-filter"
                            :label="'Country'"
                            :searchable="true"
                            v-model="filter_data.query['country']"
                            :items="countries"
                            @change="fetchPlans"
                            @searchInputChange="
                                (e) => {
                                    searchCountry = e && e.text ? e.text : '';
                                }
                            "
                        ></nitrozen-dropdown> -->
                        <nitrozen-dropdown
                            class="type-filter"
                            :label="'Plan Type'"
                            v-model="filter_data.query['type']"
                            :items="
                                getDropdownValues({
                                    private: 'Private',
                                    public: 'Public',
                                    company_specific: 'Company Specific'
                                })
                            "
                            @change="fetchPlans"
                        ></nitrozen-dropdown>
                        <nitrozen-dropdown
                            class="archived-filter"
                            :label="'Status'"
                            v-model="filter_data.query['is_active']"
                            :items="
                                getDropdownValues({
                                    true: 'Active',
                                    false: 'Inactive'
                                })
                            "
                            @change="fetchPlans"
                        ></nitrozen-dropdown>
                    </div>
                </div>
                <shimmer v-if="loading" :count="4"></shimmer>
                <page-error
                    v-else-if="pageError && !loading"
                    @tryAgain="onSearch"
                ></page-error>
                <div v-if="plansList.length" class="plans-card-list">
                    <list-card
                        v-for="plan in plansList"
                        :key="plan._id"
                        :plan="plan"
                        @click="editPlan(plan._id, $event)"
                    ></list-card>
                </div>
                <page-empty v-else :helpText="'No Plans found'"></page-empty>
                <nitrozen-pagination
                    v-if="plansList.length"
                    name="plans"
                    v-model="filter_data.pagination"
                    :pageSizeOptions="perPageValues"
                    @change="pageOptionChange"
                ></nitrozen-pagination>
            </div>
        </div>
        <type-modal :ref="'plan-type-modal'" @close="createPlan"></type-modal>
    </div>
</template>

<style lang="less" scoped>
.pad-left {
    margin-left: 24px;
}
.plans-list-container {
    width: 100%;
    word-break: break-all;
    position: relative;
    .search {
        width: 400px;
        height: 40px;
        margin-top: 24px;
    }
    .jumbotron-container {
        margin-bottom: 24px;
    }
    .loading {
        position: absolute;
    }

    .plans-filters {
        display: flex;
        .dropdown-filters {
            display: flex;
            flex: 1;
            justify-content: flex-end;
            > div {
                padding-left: 10px;
            }
            .type-filter {
                width: 200px;
            }
            .archived-filter {
                width: 100px;
            }
        }
    }

    .nitrozen-pagination-container,
    .plans-card-list {
        margin-top: 24px;
    }
}
</style>

<script>
import BillingPlansService from '@/services/billing.service';
import listCard from '@/components/plan-creator/plan-list-card.vue';
import typeModal from '../../components/plan-creator/plan-type-modal.vue';
import { debounce } from '@/helper/utils';
import { getFilterToQuery } from '@/helper/plan-creator-helper';
import {
    NitrozenInput,
    NitrozenButton,
    NitrozenDropdown,
    NitrozenPagination,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import _ from 'lodash';
import {
    PageEmpty,
    PageError,
    Shimmer,
    Jumbotron
} from '../../components/common/';
import LocationService from '../../services/location.service';

export default {
    name: 'plans-list',
    components: {
        'page-empty': PageEmpty,
        'nitrozen-input': NitrozenInput,
        'nitrozen-button': NitrozenButton,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-pagination': NitrozenPagination,
        'list-card': listCard,
        shimmer: Shimmer,
        jumbotron: Jumbotron,
        'page-error': PageError,
        'type-modal': typeModal
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            plansList: [],
            countryList: [],
            searchCountry: '',
            jumbotronData: {
                jumbotronTitle: 'Subscription Plans'
            },
            loading: false,
            show_schedule_modal: false,
            showSelectModal: false,
            filter_data: {
                query: {
                    name: ' ',
                    type: ' ',
                    is_active: ' ',
                    country: ' '
                },
                pagination: {
                    limit: 10,
                    current: 1,
                    total: 0
                }
            },
            perPageValues: [10, 25, 50, 100, 200],
            searchText: '',
            pageError: false
        };
    },
    created() {
        let queryObj = this.$route.query;
        if (queryObj.query) {
            _.merge(this.filter_data.query, JSON.parse(queryObj.query));
        }
        if (this.filter_data.query.name) {
            this.searchText = this.filter_data.query.name.trim();
        }
        if (queryObj.limit) {
            this.filter_data.pagination.limit = queryObj.limit;
        }
        if (queryObj.offset > 0) {
            this.filter_data.pagination.current = parseInt(
                queryObj.offset / queryObj.limit
            );
        }
        this.fetchPlans();
        LocationService.getCountries()
            .then(({ data }) => {
                this.countryList.push({ text: 'All', value: ' ' });
                this.countryList.push(
                    ...data.map((ctry) => {
                        return {
                            text: `${ctry.name} (${ctry.iso2})`,
                            value: ctry.iso2
                        };
                    })
                );
            })
            .catch((err) => {
                console.log(err);
            });
    },
    computed: {
        countries() {
            if (this.searchCountry) {
                const regexSrch = new RegExp(this.searchCountry, 'gi');
                return this.countryList.filter((it) => {
                    return regexSrch.test(it.text);
                });
            }
            return this.countryList;
        }
    },
    methods: {
        fetchPlans() {
            let query = getFilterToQuery(this.filter_data);
            if (query) {
                this.$router
                    .replace({
                        query: query
                    })
                    .catch((err) => {});
            }
            this.loading = true;
            return BillingPlansService.getPlans(query, '')
                .then(({ data }) => {
                    this.loading = false;
                    this.filter_data.pagination.total = data.total;
                    this.plansList = data.docs;
                })
                .catch((err) => {
                    this.pageError = true;
                });
        },
        onSearch() {
            this.filter_data.query.name = this.searchText;
            this.fetchPlans();
        },
        debounceInput: debounce(function(e) {
            this.onSearch();
        }, 500),
        get_option_values(options) {
            let option_map = [];
            Object.keys(options).forEach((key) => {
                option_map
                    .push({
                        id: key,
                        text: options[key]
                    })
                    .catch((err) => {});
            });
            return option_map;
        },
        choosePlanType() {
            this.$refs['plan-type-modal'].open();
        },
        createPlan(type) {
            if (!type) {
                return;
            }
            this.$router.push({
                path: '/administrator/subscription-plans/create',
                query: {
                    plan_type: type
                }
            });
        },
        editPlan(id, event) {
            this.$router.push({
                path: `/administrator/subscription-plans/edit/${id}`
            });
        },
        clonePlan(id, event) {
            this.$router.replace({
                path: `/administrator/subscription-plans/edit/${id}`,
                query: { clone: true }
            });
        },
        pageOptionChange(pageOptions) {
            this.fetchPlans();
        },
        getDropdownValues(option_dict) {
            option_dict[' '] = 'All';
            return Object.keys(option_dict).map((key) => {
                return {
                    text: option_dict[key],
                    value: key
                };
            });
        }
    }
};
</script>
