<template>
    <div class="tags-container">
        <applied-filters
            :showClearAll="false"
            :tags="selectedFilters"
            @remove-filter="clear"
            @clear-all="clear(-1)"
            :should-wrap="true"
        ></applied-filters>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import AppliedFilters from './applied-filter.vue';
import {
  GET_ADDITIONAL_FILTER_NAMES,
  GET_ALL_FILTERS,
  GET_GLOBAL_SEED_FILTERS,
} from '@/store/getters.type';
import {ANALYTICS_PAGES} from '@/components/generic-graphs/data/constants';
import {ANALYTICS_STATE, FILTER_TYPES,} from "@/store/modules/admin-analytics.module";
import pick from 'lodash/pick';
import {ADMIN_CLEAR_FILTERS, ADMIN_RESET_ALL_REFRESH_TOKENS,} from '@/store/action.type';

export default {
  name: 'tags-container',
  components: {
    AppliedFilters,
  },
  props: {
    pageName: {
            type: String,
            required: true,
        },
    },
    computed: {
        ...mapGetters({
            seedFilters: GET_GLOBAL_SEED_FILTERS,
            allFilters: GET_ALL_FILTERS,
            filtersToShowFunction: GET_ADDITIONAL_FILTER_NAMES,
        }),
        filtersToShow() {
            return this.filtersToShowFunction(this.pageName);
        },
        selectedFiltersRaw() {
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
            return pick(
                this.allFilters[page][FILTER_TYPES.GLOBAL_FILTERS],
                this.filtersToShow
            );
        },
        selectedFilters() {
            return Object.keys(this.selectedFiltersRaw).reduce((a, key) => {
                a[key] = this.populateFilters(key);

                if (
                    !this.selectedFiltersRaw[key] ||
                    (Array.isArray(this.selectedFiltersRaw[key]) &&
                        this.selectedFiltersRaw[key].length === 0)
                ) {
                    delete a[key];
                }
                return a;
            }, {});
        },
    },
    methods: {
        clear(index) {
            this.$store
                .dispatch(ADMIN_CLEAR_FILTERS, {
                    page: this.pageName,
                    filterNames: index === -1 ? [] : [index],
                })
                .then((x) => {
                    this.$store.dispatch(ADMIN_RESET_ALL_REFRESH_TOKENS, {
                        toggle: true,
                        page: this.pageName,
                    });
                });
        },
        populateFilters(key) {
            let filter = this.seedFilters(this.pageName).filter(
                (item) => item.id === key
            );
            let returnVal = {
                name: filter[0].name,
                values: this.selectedFiltersRaw[key],
                default: filter[0].defaultValue,
            };
            return returnVal;
        },
    },
};
</script>

<style lang="less" scoped>
.tags-container {
    width: 100%;
    height: fit-content;
    margin-top: 15px;
}
</style>
