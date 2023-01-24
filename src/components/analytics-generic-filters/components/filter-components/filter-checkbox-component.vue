<template>
    <div class="wrapper">
        <collapse @collapse-state="toggleState" :selected="collapsed">
            <div slot="collapse-header">
                <h3 class="header-name">{{ seedData.name }}</h3>
                <span
                    v-if="seedData.hasClearOption"
                    class="clear"
                    @click.stop=""
                    >Clear</span
                ><uktInlineSvg
                    :class="['arrow', collapse_state ? 'rotate' : '']"
                    :src="'arrow-collapse'"
                ></uktInlineSvg>
            </div>
            <div slot="collapse-body">
                <nitrozen-radio
                    v-for="item in seedData.values"
                    :key="item"
                    v-model="value"
                    name="Hello"
                    :radioValue="item"
                    class="width radio"
                    >{{ item }}</nitrozen-radio
                >
            </div>
        </collapse>

        <applied-filter
            class="dropdown-tags"
            v-if="shouldShowTags"
            :tags="value ? value : []"
            :showClearAll="true"
            :TAGS_THRESHOLD="3"
        >
        </applied-filter>
    </div>
</template>

<script>
import { NitrozenRadio } from '@gofynd/nitrozen-vue';
import collapse from '@/components/common/collapse.vue';
import uktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import {
    ADMIN_RESET_ALL_REFRESH_TOKENS,
    ADMIN_SAVE_FILTERS,
} from '@/store/action.type';
import {
    filterComponentSharedProps,
    filterMixin,
} from '../../mixins/filter.mixin';
import { mapGetters } from 'vuex';
import {
    GET_ALL_FILTERS,
    GET_GLOBALLY_STAGED_FILTER,
} from '@/store/getters.type';
import {
    ANALYTICS_STATE,
    FILTER_TYPES,
} from '@/store/modules/admin-analytics.module';
import { ANALYTICS_PAGES } from '@/components/generic-graphs/data/constants';
import { ANALYTICS_FILTER_TYPES } from '../../constants/constants';
import AppliedFilter from '@/components/common/tags/applied-filter.vue';
export default {
    name: 'filter-checkbox-components',
    components: { NitrozenRadio, AppliedFilter, collapse, uktInlineSvg },
    mixins: [filterMixin, filterComponentSharedProps],
    data: () => ({ val: '', collapse_state: null }),
    beforeMount() {
        this.collapse_state = this.collapsed;
    },
    methods: {
        toggleState(state) {
            this.collapse_state = state;
        },
    },
    props: {
        seedData: { type: Object, required: true },
    },
    computed: {
        ...mapGetters({
            allFilters: GET_ALL_FILTERS,
            stagedFiltersFunction: GET_GLOBALLY_STAGED_FILTER,
        }),
        getValues() {
            return this.seedData.values.map((x) => ({ text: x, value: x }));
        },
        isMultiSelect() {
            return (
                this.seedData.filterType ===
                ANALYTICS_FILTER_TYPES.MULTI_SELECT_DROPDOWN
            );
        },
        value: {
            get() {
              // if we have to apply the filter right away, we are dealing with the live store values
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
              // if we do not have to apply the filter right away, we are dealing with the staged filters store values
                return this.stagedFiltersFunction(
                    this.pageName,
                    this.seedData.id
                );
            },
            set(val) {
                this.val = val;
                this.$store.dispatch(ADMIN_SAVE_FILTERS, {
                    pageName: this.pageName,
                    saveOnStaging: !this.applyFilter,
                    globalFilters: {
                        [this.seedData.id]: val,
                    },
                });
                if (this.applyFilter) {
                    this.$store.dispatch(ADMIN_RESET_ALL_REFRESH_TOKENS, {
                        toggle: true,
                        page: this.pageName,
                    });
                }
            },
        },
      shouldShowTags() {
        return this.showTags && typeof this.value !== "string";
      }
    },
};
</script>

<style scoped lang="less">
.arrow {
    transition: all 300ms ease-in-out;
    transform: rotate(180deg);
}

.rotate {
    transform: rotate(0deg);
    transition: all 300ms ease-in-out;
}
.header-name {
    margin-right: auto;
}
.clear {
    color: #2e31be;
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    margin-right: 8px;
}
.radio {
    margin: 10px 0;
}
</style>
