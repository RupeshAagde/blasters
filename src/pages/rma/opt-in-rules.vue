<template>
    <div class="rules-history-table-container">
        <div class="product-list">
            <div
                v-for="salesChannel in tableData"
                :key="salesChannel.id"
                class="container"
            >
                <div
                    class="card-wrapper"
                    @click="redirectToPlatformDetails(salesChannel)"
                >
                    <div class="card-header">
                        <div class="sales-channel-name">
                            {{ salesChannel.name }}
                        </div>
                        <div class="config">
                            <nitrozen-badge
                                v-if="salesChannel.qc_config === 'global'"
                                state="success"
                                >{{ salesChannel.qc_config }}</nitrozen-badge
                            >
                            <nitrozen-badge
                                v-if="salesChannel.qc_config === 'custom'"
                                state="warn"
                                >{{ salesChannel.qc_config }}</nitrozen-badge
                            >
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="sales-channel-content">
                            <div class="details">
                                <div class="txt-description-heading">
                                    Created By :-
                                    {{
                                        salesChannel.created_by === null
                                            ? '-'
                                            : salesChannel.created_by
                                    }}
                                    on
                                    {{
                                        salesChannel.created_at === null
                                            ? '-'
                                            : new Date(
                                                  salesChannel.created_at
                                              ).toLocaleString()
                                    }}
                                </div>
                            </div>
                            <div class="details">
                                <div class="txt-description-heading">
                                    Modified By :-
                                    {{
                                        salesChannel.updated_by === null
                                            ? '-'
                                            : salesChannel.updated_by
                                    }}
                                    on
                                    {{
                                        salesChannel.updated_at === null
                                            ? '-'
                                            : new Date(
                                                  salesChannel.updated_at
                                              ).toLocaleString()
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InlineSvg from '@/components/common/ukt-inline-svg';
import { NitrozenButton, NitrozenBadge, strokeBtn } from '@gofynd/nitrozen-vue';

export default {
    name: 'opt-in-rules',
    components: {
        'nitrozen-button': NitrozenButton,
        NitrozenBadge,
        InlineSvg
    },
    directives: { strokeBtn },
    props: {
        tableData: {
            type: Array,
            required: true
        }
    },
    methods: {
        redirectToPlatformDetails(salesChannel) {
            const channelType = salesChannel.qc_config;
            const STORAGE_KEY = 'rma_sales_channel_data';
            const {id, name, type, qc_enabled, qc_config, meta} = salesChannel;
            const channelData = JSON.stringify({
                id,
                name,
                type,
                qc_enabled,
                qc_config,
                meta
            });
            localStorage.getItem(STORAGE_KEY) && localStorage.removeItem(STORAGE_KEY);
            localStorage.setItem(STORAGE_KEY, channelData);
            this.$router.push({
                path: `/administrator/rma/rules/${channelType}/${salesChannel.id}` 
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.rules-history-table-container {
    margin-top: 16px;
    display: flex;
    flex-direction: column;

    .container {
        border: 1px solid #e4e5e6;
        cursor: pointer;
        padding: 0px 24px;
        border-radius: 3px;
        margin-bottom: 16px;
        transition: box-shadow 0.3s;
        &:hover {
            box-shadow: 0px 9px 13px 0px rgba(221, 221, 221, 0.5);
        }
        .disabled {
            background: @WhiteSmoke;
            opacity: 0.5;
            pointer-events: none;
        }
        .text-ellipsis {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .card-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-top: 24px;
            margin-bottom: 12px;
            .card-header {
                display: flex;
                margin-bottom: 12px;
                .sales-channel-name {
                    width: 80%;
                    color: #2e31be;
                    font-weight: 600;
                    font-size: 16px;
                    -webkit-font-smoothing: antialiased;
                    line-height: 22px;
                    margin-bottom: 6px;
                }
                .config {
                    width: 20%;
                    text-align: end;
                }
            }
            .card-content {
                display: flex;
                justify-content: space-between;
                .sales-channel-content {
                    display: flex;
                    .details {
                        display: flex;
                        flex-direction: column;
                        margin-right: 36px;
                        .txt-description-heading {
                            color: #9b9b9b;
                            line-height: 22px;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
}
</style>
