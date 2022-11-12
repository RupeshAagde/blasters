import {ANALYTICS_PAGES} from '@/components/generic-graphs/data/constants';
import {ANALYTICS_FILTER_TYPES} from '../constants/constants';
import {mapGetters} from 'vuex';
import {GET_GLOBAL_SEED_FILTERS} from '@/store/getters.type';
import {ANALYTICS_STATE} from "../../../store/modules/admin-analytics.module";
import {GET_ALL_FILTERS, GET_GLOBALLY_STAGED_FILTER} from "../../../store/getters.type";

const filterMixin = {
    props: {
        pageName: {type: String, default: ANALYTICS_PAGES.DASHBOARD},
        chartId: {type: String, default: null},
    },
    data: () => ({
        ANALYTICS_FILTER_TYPES: ANALYTICS_FILTER_TYPES,
    }),
};
const sharedDataMixins = {
    data: () => ({
        FILTER_COUNT_TO_SHOW_UPFRONT: 3
    }),
    computed: {
        ...mapGetters({
            seedFiltersFunction: GET_GLOBAL_SEED_FILTERS,
        }),
        seedFilterData() {
            if (!this.seedFiltersFunction) {
                return [];
            }
            return this.seedFiltersFunction(this.pageName);
        },
        sortedFilters() {
            if (!this.seedFilterData) {
                return [];
            }
            return this.seedFilterData.sort((a, b) => a.priority - b.priority);
        },
        displayFilters() {
            return this.sortedFilters.slice(0, this.FILTER_COUNT_TO_SHOW_UPFRONT);
        }, restOfFilters() {
            return this.sortedFilters.slice(this.FILTER_COUNT_TO_SHOW_UPFRONT);
        },
    },
};

const filterComponentSharedProps = {
    props: {
        seedData: {type: [Object, Array], required: true},
        showName: {type: Boolean, default: false},
        showTags: {type: Boolean, default: false},
        showClear: {type: Boolean, default: false},
        applyFilter: {type: Boolean, default: true},
        collapsed: {type: Boolean, default: false},
    },
};
const filtersSharedValueMixins = {
    computed: {
        ...mapGetters({
            allFilters: GET_ALL_FILTERS,
            stagedFiltersFunction: GET_GLOBALLY_STAGED_FILTER,
        }),
        value: {
            get() {
                if (this.applyFilter) {
                    const page =
                        this.pageName === ANALYTICS_PAGES.DASHBOARD
                            ? ANALYTICS_STATE.DASHBOARD_FILTERS
                            : ANALYTICS_STATE.REPORT_FILTERS;
                    if (
                        !this.allFilters[page] ||
                        !this.allFilters[page][FILTER_TYPES.GLOBAL_FILTERS]
                    ) {
                        return '';
                    }
                    return this.allFilters[page][FILTER_TYPES.GLOBAL_FILTERS][
                        this.seedData.id
                        ]
                        ? this.allFilters[page][FILTER_TYPES.GLOBAL_FILTERS][
                            this.seedData.id
                            ]
                        : '';
                }
                return this.stagedFiltersFunction(
                    this.pageName,
                    this.seedData.id
                );
            },
            set(val) {
                this.val = val;
                this.saveValueToStore(val);
                if (this.applyFilter) {
                    const context = this;
                    context.$store.dispatch(ADMIN_RESET_ALL_REFRESH_TOKENS, {
                        toggle: true,
                        page: context.pageName,
                    });
                }
            },
        },
    }
}

export {filterMixin, sharedDataMixins, filterComponentSharedProps, filtersSharedValueMixins};
