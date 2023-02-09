import {mapGetters} from "vuex";
import {
    ANALYTICS_STATE,
    FILTER_TYPES,
    GLOBAL_FILTERS_MODEL, REPORT_FILTERS
} from "../../../../store/modules/admin-analytics.module";
import {ADMIN_SAVE_FILTERS} from "../../../../store/action.type";
import {ANALYTICS_PAGES} from "../../data/constants";
import {REPORT_GRAPH_FILTER_INDEX, REPORT_SELECTED_DATE_FILTERS} from "../../../../store/getters.type";
import moment from "moment";
import {TIME_FILTERS, TIME_FILTERS_THRESH_HOLDS} from "../../../../constants/chart/reportConstants";

const graphFilterMixins = {
    computed: {
        ...mapGetters({
            seedData: ANALYTICS_STATE.REPORT_FILTERS_SEED_DATA,
            allFilters: REPORT_SELECTED_DATE_FILTERS,
            filterIndex: REPORT_GRAPH_FILTER_INDEX
        }),
        filteredDates() {
            if (!this.allFilters || !this.allFilters[FILTER_TYPES.GLOBAL_FILTERS]) {
                return {startDate: null, endDate: null};
            }
            return {
                startDate: this.allFilters[FILTER_TYPES.GLOBAL_FILTERS][GLOBAL_FILTERS_MODEL.START_DATE],
                endDate: this.allFilters[FILTER_TYPES.GLOBAL_FILTERS][GLOBAL_FILTERS_MODEL.END_DATE]
            }
        },
        graphFilter() {
            if (!this.seedData || !this.seedData.graphFilters) {
                return [];
            }
            return this.mapToDropDownFormat(this.seedData.graphFilters);
        },
        timeFilters() {
            // console.log('length of timeFilter: ', this.seedData.timeFilters.length)
            if (!this.seedData || !this.seedData.timeFilters) {
                return [];
            }
            const dayDifference = moment(this.filteredDates.endDate).diff(moment(this.filteredDates.startDate), 'days');
            return this.filterTimeFilters(this.mapToDropDownFormat(this.seedData.timeFilters), dayDifference);
        },
        shouldShowTimeFilters() {
            // console.log('length of timeFilter: ', this.timeFilters.length)
            return this.timeFilters.length > 0;
        }
    },
    mounted() {
        // console.log("bef create: ", this.graphFilter[0].value, this.timeFilters[0].value);
        // console.log('is reports? ', this.pageName, ANALYTICS_PAGES.REPORTS)
        if (this.pageName === ANALYTICS_PAGES.REPORTS) {
            // console.log('gFilter: ', this.graphFilter[0].value, 'tFilter: ', this.timeFilters[0].value)
            // console.log('index: ', this.filterIndex);
            this.selectedFilters.selectedGraphFilter = this.graphFilter.length > 0 ? this.graphFilter[this.filterIndex].value : '';
            this.selectedFilters.selectedTimeFilter = this.timeFilters.length > 0 ? this.timeFilters[0].value : '';
            if (this.allFilters[FILTER_TYPES.TIME_FILTERS]) {
                this.selectedFilters.selectedTimeFilter = this.allFilters[FILTER_TYPES.TIME_FILTERS];
            }
            // console.log('selected filters: ', this.selectedFilters, this.allFilters);
            this.saveFiltersToStore();
        }
    },
    methods: {
        mapToDropDownFormat(data) {
            // console.log("data: ", data);
            if (!data || !data.length) {
                return [];
            }
            return data.map((x, index) => ({
                text: x.text,
                value: x.id || x.name
            }));
        },
        saveFiltersToStore() {
            this.$store.dispatch(ADMIN_SAVE_FILTERS, {
                pageName: this.pageName,
                graphFilter: this.selectedFilters.selectedGraphFilter,
                timeFilter: this.selectedFilters.selectedTimeFilter
            });
        },
        filterTimeFilters(timeFilters, dayDifference) {
            // console.log('timeFilters', dayDifference);
            const excludedFilters = [];
            if (dayDifference < TIME_FILTERS_THRESH_HOLDS.MONTHLY) {
                excludedFilters.push(TIME_FILTERS.MONTHLY)
            }
            // console.log('timeFilters filtered: ', timeFilters.filter(x => !excludedFilters.includes(x.value)));
            return timeFilters;
            // return timeFilters.filter(x => !excludedFilters.includes(x.value))
        }

    },
    props: {
        pageName: {type: String, required: true}
    },
    watch: {
        filteredDates: {
            handler(value) {
                // console.log('value changed: ', value);
            },
            deep: true
        },
        seedData: {
            handler(val) {
                // console.log('triggered: ', val);
                if (val && val.timeFilters && val.timeFilters.length && !this.selectedFilters.selectedTimeFilter) {
                    this.selectedFilters.selectedTimeFilter = val.timeFilters[0].id;
                    // console.log('shouldShowTimeFilters', this.selectedFilters.selectedTimeFilter);
                }
            }, deep: true
        }
    }
};

export {graphFilterMixins};
