<template>
    <div class="main-container">
        <loader v-if="startLoader" class="loading"></loader>
        <div class="page-container">
            <div class="caption-container">
                <span class="caption-title">RMA Rules History</span>
                <span class="caption-description"
                    >Small description which is around 1 line</span
                >
            </div>
            <search-container
                :placeholder="'Search by Platform name'"
                :id="'rma-platform-search'"
                :value="platformSearchValue"
                :handleChange="searchPlatforms"
                :disabled="false"
            />
            <adm-no-content
                v-if="rulesData.length === 0"
                helperText="No Company or Sales Channel Found."
            ></adm-no-content>
            <div v-else>
                <rules-history-table :tableData="rulesHistoryTableData" />
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
</template>

<script>
import {
    NitrozenButton,
    NitrozenPagination,
    flatBtn
} from '@gofynd/nitrozen-vue';
import AdmNoContent from '@/components/common/adm-no-content.vue';
import RulesHistoryTable from '@/pages/rma/rules-history-table.vue';
import SearchContainer from '@/components/packaging/common/search-container.vue';
import loader from '@/components/common/loader.vue';
import RMAService from '@/services/rma.service';
import { debounce } from '@/helper/utils';

export default {
    name: 'rules',
    components: {
        AdmNoContent,
        'nitrozen-button': NitrozenButton,
        RulesHistoryTable,
        NitrozenPagination,
        SearchContainer,
        loader
    },
    directives: {
        flatBtn
    },
    data() {
        return {
            rulesData: [],
            platformSummary: [],
            rulesHistoryTableData: [],
            startLoader: false,
            platformSearchValue: '',
            pageObject: {
                total: 0,
                current: 1,
                limit: 5
            }
        };
    },
    mounted() {
        this.fetchPlatformSummary();
    },
    methods: {
        redirectToNewSetup() {
            this.$router.push({ path: '/administrator/rma/setup/new' });
        },
        searchPlatforms: debounce(function(inputValue) {
            console.log(inputValue);
            this.platformSearchValue = inputValue;
            this.fetchOrderingChannels();
        }, 300),
        fetchOrderingChannels() {
            this.startLoader = true;
            const query_param = {
                page_number: this.pageObject.current,
                page_size: this.pageObject.limit,
                q: this.platformSearchValue
            };
            RMAService.getOrderingChannel(query_param)
                .then((res) => {
                    if (res.status === 200) {
                        this.rulesData = res.data.items;
                        this.rulesHistoryTableData = res.data.items.map(
                            (rule) => ({
                                ...rule,
                                ...this.platformSummary.find(
                                    (platform) =>
                                        platform.platform === rule.name
                                )
                            })
                        );
                        this.pageObject.total = res.data.page.item_total;
                        this.pageObject.current = res.data.page.current;
                    } else {
                        this.$snackbar.global.showError(
                            'Failed to receive RMA Rules History',
                            { duration: 2000 }
                        );
                    }
                    this.startLoader = false;
                })
                .catch(() => {
                    this.startLoader = false;
                    this.$snackbar.global.showError(
                        'Failed to receive RMA Rules History',
                        { duration: 2000 }
                    );
                });
        },
        fetchPlatformSummary() {
            this.startLoader = true;
            RMAService.getPlatformCounts()
                .then((platformCountsResponse) => {
                    this.platformSummary = platformCountsResponse.data.items;
                    this.fetchOrderingChannels();
                })
                .catch(() => {
                    this.startLoader = false;
                    this.$snackbar.global.showError(
                        'Failed to receive RMA Rules Summary',
                        { duration: 2000 }
                    );
                });
        },
        paginationChange(filter) {
            const { current } = filter;
            this.pageObject.current = current;
            this.pageObject = Object.assign({}, this.pageObject, filter);
            this.fetchOrderingChannels();
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
</style>
