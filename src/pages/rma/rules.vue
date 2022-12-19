<template>
    <div>
        <div class="breadcrumb-parent">
            <breadcrumb :routes="breadcrumbRoutes" />
        </div>
        <div class="main-container">
            <div class="page-container">
                <div class="header-container">
                    <div class="caption-container">
                        <span class="caption-title">Rules</span>
                        <span class="caption-description"
                            >Review configured rules</span
                        >
                    </div>
                    <nitrozen-button
                        :theme="'secondary'"
                        v-flatBtn
                        @click="redirectToGlobalRuleList"
                        >Global Rule</nitrozen-button
                    >
                </div>
                <div class="search-container">
                    <nitrozen-input
                        :id="'rma-platform-search'"
                        class="search-input"
                        :showSearchIcon="true"
                        type="search"
                        placeholder="Search by Channel Name"
                        v-model="optInSearchValue"
                        @input="searchPlatforms"
                    />
                    <nitrozen-dropdown
                        :items="filterValues"
                        :placeholder="'All'"
                        v-model="filterValue"
                        class="width"
                        @change="handleFilterValue"
                    ></nitrozen-dropdown>
                </div>
                <shimmer v-if="startLoader" :count="4"></shimmer>
                <adm-no-content
                    v-else-if="rulesData.length === 0"
                    helperText="No sales channel found."
                ></adm-no-content>
                <div v-else>
                    <opt-in-rules :tableData="rulesData" />
                    <nitrozen-pagination
                        name="RMA Rules History"
                        id="rma_ordering_channel"
                        v-model="pageObject"
                        @change="paginationChange"
                        :pageSizeOptions="[5, 10, 20, 50]"
                    ></nitrozen-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NitrozenButton,
    NitrozenPagination,
    NitrozenInput,
    NitrozenDropdown,
    flatBtn
} from '@gofynd/nitrozen-vue';
import AdmNoContent from '@/components/common/adm-no-content.vue';
import Shimmer from '@/components/common/shimmer';
import OptInRules from '@/pages/rma/opt-in-rules.vue';
import SearchContainer from '@/components/packaging/common/search-container.vue';
import RMAService from '@/services/rma.service';
import Breadcrumb from './common/breadcrumb.vue';
import { debounce } from '@/helper/utils';

export default {
    name: 'rules',
    components: {
        AdmNoContent,
        'nitrozen-button': NitrozenButton,
        OptInRules,
        NitrozenPagination,
        NitrozenInput,
        NitrozenDropdown,
        SearchContainer,
        Shimmer,
        Breadcrumb
    },
    directives: {
        flatBtn
    },
    data() {
        return {
            rulesData: [],
            platformSummary: [],
            startLoader: false,
            optInSearchValue: '',
            filterValues: [
                {
                    value: 'All',
                    text: 'All'
                },
                {
                    value: 'global',
                    text: 'Global'
                },
                {
                    value: 'custom',
                    text: 'Custom'
                }
            ],
            filterValue: 'All',
            pageObject: {
                total: 0,
                current: 1,
                limit: 5
            },
            breadcrumbRoutes: [
                {
                    name: 'Return Merchandise Authorisation',
                    path: ''
                }
            ]
        };
    },
    mounted() {
        this.fetchOptedSalesChannels();
    },
    methods: {
        redirectToGlobalRuleList() {
            this.$router.push({
                path: '/administrator/orders/rma/rules/global'
            });
        },
        searchPlatforms: debounce(function(inputValue) {
            this.optInSearchValue = inputValue;
            this.fetchOptedSalesChannels();
        }, 300),
        handleFilterValue() {
            this.fetchOptedSalesChannels();
        },
        fetchOptedSalesChannels() {
            this.startLoader = true;
            const query_param = {
                page_no: this.pageObject.current,
                page_size: this.pageObject.limit,
                q: this.optInSearchValue
            };
            if (this.filterValue !== 'All') {
                query_param['qc_config'] = this.filterValue;
            }
            RMAService.getOptedSalesChannelList(query_param)
                .then((res) => {
                    this.rulesData = res.data.items;
                    this.pageObject.total = res.data.page.item_total;
                    this.pageObject.current = res.data.page.current;
                    this.startLoader = false;
                })
                .catch(() => {
                    this.startLoader = false;
                    this.$snackbar.global.showError(
                        'Failed to receive Opted Rules',
                        { duration: 2000 }
                    );
                });
        },
        paginationChange(filter) {
            const { current } = filter;
            this.pageObject.current = current;
            this.pageObject = Object.assign({}, this.pageObject, filter);
            this.fetchOptedSalesChannels();
        }
    }
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.page-container {
    margin: 0;
    flex-direction: column;
    border-radius: 12px;

    @media @mobile {
        width: calc(100% - 48px);
        margin-top: 48px;
    }

    .header-container {
        display: flex;
        justify-content: space-between;

        .caption-container {
            display: flex;
            flex-direction: column;
            font-family: Inter;
            background-color: @White;

            .caption-title {
                color: @Mako;
                font-weight: bold;
                font-size: 24px;
                line-height: 40px;
                text-align: left;
            }
            .caption-description {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 16px;
            }
        }
    }

    .search-container {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.03);
        border-radius: 4px;
        margin-block: 10px;

        & > * {
            width: 100%;
        }

        .nitrozen-dropdown-container {
            max-width: 200px;
        }
    }
}
.breadcrumb-parent {
    margin-top: 60px;
    padding-top: 24px;
    padding-left: 24px;
}
</style>
