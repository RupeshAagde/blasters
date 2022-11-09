import {ANALYTICS_PAGES} from '../../../generic-graphs/data/constants';
import {ANALYTICS_FILTER_TYPES} from '../constants/constants';
import {mapGetters} from 'vuex';
import {GET_GLOBAL_SEED_FILTERS} from '../../../../store/getters.type';

const filterMixin = {
    props: {
        pageName: {type: String, default: ANALYTICS_PAGES.DASHBOARD},
    },
    data: () => ({
        ANALYTICS_FILTER_TYPES: ANALYTICS_FILTER_TYPES,
    }),
};
const sharedDataMixins = {
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
            return this.sortedFilters.slice(0, 2);
        }, restOfFilters() {
            return this.sortedFilters.slice(2);
        },
    },
};

const filterComponentSharedProps = {
    props: {
        seedData: { type: [Object, Array], required: true },
        showName: { type: Boolean, default: false },
        showTags: { type: Boolean, default: false },
        showClear: { type: Boolean, default: false },
        applyFilter: { type: Boolean, default: true },
        collapsed: { type: Boolean, default: false },
    },
};

export { filterMixin, sharedDataMixins, filterComponentSharedProps };
