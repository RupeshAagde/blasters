<template>
    <nitrozen-dialog
        ref="more-filters-dialog"
        class="more-filters-dialog"
        :title="'Filters'"
        @close="onCloseAction"
    >
        <template slot="header"> </template>
        <template slot="body">
            <filter-components
                ref="filters"
                :align-vertically="true"
                :apply-filter="false"
                :page-name="pageName"
                :seed-data="sortedFilters"
                :show-name="true"
                :show-tags="true"
                class="components-arrangement"
            ></filter-components>
        </template>
        <template slot="footer"> </template>
    </nitrozen-dialog>
</template>

<script>
import {
    flatBtn,
    NitrozenButton,
    NitrozenDialog,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
import { filterMixin } from '../../mixins/filter.mixin';
import filterComponents from '../filter-components';
import {
    ADMIN_CLEAR_FILTERS,
    ADMIN_MAKE_STAGING_FILTERS_LIVE,
    ADMIN_RESET_ALL_REFRESH_TOKENS,
} from '@/store/action.type';

export default {
    name: 'index',
    components: { NitrozenDialog, NitrozenButton, filterComponents },
    mixins: [filterMixin],
    directives: { strokeBtn, flatBtn },
    props: { sortedFilters: { type: Array } },
    data: () => ({
        negativeButtonLabel: 'Clear all',
        positiveButtonLabel: 'Apply',
    }),
    methods: {
        open() {
            const config = {
                width: '23.3%',
                negativeButtonLabel: this.negativeButtonLabel,
                positiveButtonLabel: this.positiveButtonLabel,
                showCloseButton: true,
                neutralButtonLabel: false,
                height: '100%',
                'border-radius': '12px',
                dismissible: true,
            };
            this.$refs['more-filters-dialog'].open(config);
        },
        onCloseAction(actionName) {
            if (actionName === this.negativeButtonLabel) {
                this.clearAllFilters();
                this.clearSearchSlugs();
                return;
            }
            if (actionName === this.positiveButtonLabel) {
                this.applyFilters();
                return;
            }
        },
        clearSearchSlugs(){
            this.$refs.filters.callDropdownFunc();
        },
        applyFilters() {
            this.$store
                .dispatch(ADMIN_MAKE_STAGING_FILTERS_LIVE, {
                    page: this.pageName,
                })
                .then((x) => {
                    this.$store.dispatch(ADMIN_RESET_ALL_REFRESH_TOKENS, {
                        toggle: true,
                        page: this.pageName,
                    });
                });
        },
        clearAllFilters() {
            console.log(this.negativeButtonLabel);
            this.$store
                .dispatch(ADMIN_CLEAR_FILTERS, { page: this.pageName })
                .then((x) => {
                    this.$store.dispatch(ADMIN_RESET_ALL_REFRESH_TOKENS, {
                        toggle: true,
                        page: this.pageName,
                    });
                });
        },
    },
};
</script>

<style lang="less" scoped>
.more-filters-dialog {
    background: #ffffff;
    border-radius: 12px;
}

.components-arrangement {
    width: 100%;
}

::v-deep .component-wrapper:not(:last-child) {
    border-bottom: 1px solid #f2f2f2;
}
::v-deep .nitrozen-dialog-backdrop {
    justify-content: flex-end;

    .nitrozen-dialog-footer {
        justify-content: space-between;
        padding: 0.9em 0 0 0;
        gap: 0.5em;
        background: #ffffff;
        box-shadow: 0px -1px 12px rgba(0, 0, 0, 0.05);

        button {
            width: 50%;

            &:last-child {
                order: -1;
                border: none !important;
                text-decoration: none;

                &:focus,
                &:hover {
                    text-decoration: none !important;
                    background-color: #fff !important;
                }
            }
        }

        .n-button-flat-secondary .n-button-content {
            font-size: 15px !important;
        }

        .n-button .n-button-content {
            font-family: 'Inter', sans-serif !important;
            font-style: normal !important;
            font-weight: 700 !important;
        }

        .n-button-stroke-secondary .n-button-content {
            font-size: 14px !important;
            line-height: 21px !important;
            /* identical to box height, or 150% */

            text-align: center;

            /* colour/text/button */

            color: #2e31be;
        }
    }
}
::v-deep .nitrozen-dialog-body .rest-of-filters .questionmark-icon{
    display: none;
}
</style>
