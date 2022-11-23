import {graphFilterMixins} from "./graphFilter.mixins";
import {mapGetters} from "vuex";
import {GET_ALL_FILTERS} from "../../../../store/getters.type";
import {ANALYTICS_PAGES} from "../../data/constants";
import {ANALYTICS_STATE, FILTER_TYPES} from "../../../../store/modules/admin-analytics.module";

const timeFiltersMixins = {
    props: {pageName: {type: String}, chartId: {type: String}},
    mixins: [graphFilterMixins],
    computed: {
        ...mapGetters({
            allFilters: GET_ALL_FILTERS
        }),
        timeFilters() {
            if (!this.extraProps || !this.extraProps.hideGraphOptions || !this.extraProps.hideGraphOptions.timeFilters) {
                return [];
            }
            return {
                ...this.extraProps.hideGraphOptions.timeFilters,
                values: this.mapToDropDownFormat(this.extraProps.hideGraphOptions.timeFilters.values)
            };
        }, doesTimeFiltersExists() {
            return this.timeFilters && Object.keys(this.timeFilters).length;
        },
        cleanedChartId() {
            return this.chartId.toLowerCase().split('chartid-')[1];
        },
        selectedFilter() {
            if (!this.allFilters) {
                return '';
            }
            const selectedFilters = this.allFilters[this.pageName === ANALYTICS_PAGES.DASHBOARD ? ANALYTICS_STATE.DASHBOARD_FILTERS : ANALYTICS_STATE.REPORT_FILTERS];
            if (!selectedFilters[FILTER_TYPES.COMPONENT_SPECIFIC] || !selectedFilters[FILTER_TYPES.COMPONENT_SPECIFIC][this.cleanedChartId]) {
                return null
            }
            return selectedFilters[FILTER_TYPES.COMPONENT_SPECIFIC][this.cleanedChartId][FILTER_TYPES.TIME_FILTERS];
        }
    },
}

export {timeFiltersMixins}