<template>
    <div class="global-debug-shipment-list">
        <p class="header-title">
            Shipment Level Information
        </p>
        <div class="shipments">
            <div 
                class="shipment-info"
                v-for="shipment in data"
                :key="shipment.shipment_id">

                <div class="shipment-header-line">
                    <p class="shipment-id-container" v-if="shipment.shipment_id">
                        Shipment ID: 
                        <span class="shipmentId shipment-header-value">{{ shipment.shipment_id }}</span>
                    </p>
                    <p class="shipment-status-container" v-if="shipment.status && shipment.status.status">
                        Status:
                        <span class="status shipment-header-value">{{ shipment.status.display_name }}</span>
                    </p>
                </div>
                <div class="remark-container">
                    <p class="remark-label">Remark</p>
                    <textarea class="remark" v-model="shipment.remark" readonly />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'debug-shipment-list',
    props: {
        data: {
            type: Array,
            required: true
        }
    }
}
</script>

<style lang="less" scoped>
.global-debug-shipment-list {
    .header-title {
        font-size: 14px;
        line-height: 160%;
        font-weight: 600;
        color: #4D4D4E;
        border-bottom: 1px solid #E0E0E0;
        padding-bottom: 8px;
    }

    .shipments {
        .shipment-info {
            position: relative;
            padding: 16px 0 24px 0;
            border-bottom: 1px solid #E0E0E0;

            &:last-child {
                border-bottom: none;
            }

            .shipment-header-line {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #9B9B9B;
                line-height: 160%;
                font-weight: 400;
                margin-bottom: 1rem;

                .shipment-header-value {
                    font-weight: 400;
                    color: #000000;
                }
            }

            .remark-container {
                .remark-label {
                    font-size: 12px;
                    line-height: 160%;
                    font-weight: 400;
                    color: #9B9B9B;
                }

                .remark {
                    height: 52px;
                    overflow: auto;
                    padding: 14px;
                    width: calc(100% - 14px - 14px);
                    background: #F5F5F5;
                    border-radius: 4px;
                    border: 1px solid #E0E0E0;
                    cursor: default;
                }
            }
        }
    }
}
</style>
