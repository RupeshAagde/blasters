import {ANALYTICS_PAGES} from '@/components/generic-graphs/data/constants';
import {ANALYTICS_FILTER_TYPES, FILTER_RETURN_TYPES} from '../constants/constants';
import {mapGetters} from 'vuex';
import {GET_GLOBAL_SEED_FILTERS} from '@/store/getters.type';
import {ANALYTICS_STATE, FILTER_TYPES} from "../../../store/modules/admin-analytics.module";
import {GET_ALL_FILTERS, GET_GLOBALLY_STAGED_FILTER} from "../../../store/getters.type";
import {
    ADMIN_RESET_ALL_REFRESH_TOKENS,
    ADMIN_RESET_DROPDOWN_SEED_FILTERS_FOR_DUNZO_DASHBOARD,
    ADMIN_SAVE_FILTERS
} from "../../../store/action.type";
import {pickValues} from "@/helper/utils";


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
        filterIndex: {type: Number, default: null}
       
    },
};
const filtersSharedValueMixins = {
    methods: {
        saveValueToStore: function (val) {
            if (!this.chartId) {
                this.$store.dispatch(ADMIN_SAVE_FILTERS, {
                    pageName: this.pageName,
                    saveOnStaging: !this.applyFilter,
                    [FILTER_TYPES.GLOBAL_FILTERS]: {
                        [this.seedData.id]: val,
                    },
                });
            } else {
                this.$store.dispatch(ADMIN_SAVE_FILTERS, {
                    pageName: this.pageName,
                    saveOnStaging: !this.applyFilter,
                    isComponentSpecific: true,
                    filterId: this.chartId,
                    genericComponentSpecific: {
                        [this.seedData.id]: val,
                    },
                });
            }
        },

    },
    computed: {
        ...mapGetters({
            allFilters: GET_ALL_FILTERS,
            stagedFiltersFunction: GET_GLOBALLY_STAGED_FILTER,
        }),
        value: {
            get() {
                const locationUrl = this.chartId ? [FILTER_TYPES.COMPONENT_SPECIFIC, this.chartId] : [FILTER_TYPES.GLOBAL_FILTERS];
                if (this.applyFilter) {
                    const page =
                        this.pageName === ANALYTICS_PAGES.DASHBOARD
                            ? ANALYTICS_STATE.DASHBOARD_FILTERS
                            : ANALYTICS_STATE.REPORT_FILTERS;
                    if (
                        !pickValues(this.allFilters, [page, ...locationUrl])
                    ) {
                        return '';
                    }
                    return pickValues(this.allFilters, [page, ...locationUrl, this.seedData.id]) ? pickValues(this.allFilters, [page, ...locationUrl, this.seedData.id]) : FILTER_RETURN_TYPES[this.seedData.filterType];
                }
                return this.stagedFiltersFunction(
                    this.pageName,
                    this.seedData.id,
                    locationUrl
                );
            },
            set(val) {
                if (!this.forFirstTime && this.isDisabled){
                    return;
                }
                this.val = val;
                this.saveValueToStore(val);
                if (this.applyFilter) {
                    if (this.seedData.dependency) {
                        this.$store.dispatch(ADMIN_RESET_DROPDOWN_SEED_FILTERS_FOR_DUNZO_DASHBOARD, {
                            pageName: this.pageName,
                            panelIndex: 1,
                            cardIndex: 0,
                            filterIndex: this.filterIndex,
                            dependency: this.seedData.dependency.clearFilters,
                            chartId: this.chartId,
                            values: this.seedData.values && !this.seedData.dataSource ? this.seedData.values: null
                        });
                    }
                    if (this.chartId) {
                        this.$emit('reset-data');
                        return;
                    }
                    const context = this;
                    context.$store.dispatch(ADMIN_RESET_ALL_REFRESH_TOKENS, {
                        toggle: true,
                        page: context.pageName,
                    });
                }
            },
        },
    }
};
const isGlobalLoadingProps = {
    props: {isGlobalLoading: {type: Boolean}}
};

export {filterMixin, sharedDataMixins, filterComponentSharedProps, filtersSharedValueMixins, isGlobalLoadingProps};
