<template>
    <div class="main-container">
        <div class="page-container">
                <div class="caption-container">
                    <span class="caption-title">RMA Rules History</span>
                    <span class="caption-description"
                        >Small description which is around 1 line</span
                    >
                </div>
            <adm-no-content
                v-if="rulesData.length === 0"
                helperText="No Company or Sales Channel Added. Add Sales Channel"
            ></adm-no-content>
            <rules-history-table v-else :tableData="rulesData" />
        </div>
    </div>
</template>

<script>
import { NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';
import AdmNoContent from '@/components/common/adm-no-content.vue';
import RulesHistoryTable from '@/pages/rma/rules-history-table.vue';

export default {
    name: 'rules',
    components: {
        AdmNoContent,
        'nitrozen-button': NitrozenButton,
        RulesHistoryTable
    },
    directives: {
        flatBtn
    },
    data() {
        return {
            rulesData: [
                {
                    platform: 'Amazon',
                    sales_channel: 34,
                    qc_config: 17
                },
                {
                    platform: 'FYND',
                    sales_channel: 32,
                    qc_config: 16
                },
                {
                    platform: 'Amazon',
                    sales_channel: 34,
                    qc_config: 16
                },
                {
                    platform: 'FYND',
                    sales_channel: 34,
                    qc_config: 17
                },
                {
                    platform: 'Flipkart',
                    sales_channel: 34,
                    qc_config: 17
                },
                {
                    platform: 'JioMart',
                    sales_channel: 34,
                    qc_config: 17
                },
                {
                    platform: 'FYND',
                    sales_channel: 34,
                    qc_config: 17
                },
                {
                    platform: 'Amazon',
                    sales_channel: 34,
                    qc_config: 17
                },
                {
                    platform: 'JioMart',
                    sales_channel: 34,
                    qc_config: 17
                },
                {
                    platform: 'Myntra',
                    sales_channel: 34,
                    qc_config: 16
                },
                {
                    platform: 'FYND',
                    sales_channel: 34,
                    qc_config: 16
                },
                {
                    platform: 'Amazon',
                    sales_channel: 34,
                    qc_config: 16
                },
                {
                    platform: 'Amazon',
                    sales_channel: 34,
                    qc_config: 17
                },
                {
                    platform: 'FYND',
                    sales_channel: 34,
                    qc_config: 17
                },
                {
                    platform: 'FYND',
                    sales_channel: 34,
                    qc_config: 17
                },
                {
                    platform: 'Flipkart',
                    sales_channel: 34,
                    qc_config: 16
                }
            ]
        };
    },
    methods: {
        redirectToNewSetup() {
            this.$router.push({ path: '/administrator/rma/setup/new' });
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
