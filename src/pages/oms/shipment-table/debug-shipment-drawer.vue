<template>
    <div class="debug-shipment-body">
        <div class="title">
            <span>Shipment Level Information</span>
        </div>
        <div 
            v-for="(data, index) in shipmentInfo"
            :key="index"
            class="info-container"
        >
            <hr class="line">
            <div class="shipment-info">
                <p>
                    <span class="keys">Shipment ID: </span>
                    <span class="value">{{ data.shipmentId }}</span>
                </p>
                <p>
                    <span class="keys">Status: </span>
                    <span class="value">{{ data.status }}</span>
                </p>
            </div>
            <div class="user-remark">
                <nitrozen-input
                    :type="'textarea'"
                    label="Remark"
                    v-model="data.remark"
                    :disabled="true"
                ></nitrozen-input>
            </div>
        </div>
    </div>
</template>

<script>
/* Components import */
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import admNoContent from '@/components/common/adm-no-content.vue';

export default {
    name: "debug-shipment-drawer",
    data() {
        return {
            checkForNote: "",
            shipmentInfo: [
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
                {
                    shipmentId: "123423424543534564732763",
                    status: "Placed",
                    remark: "This shipment is in lock state"
                },
            ]
        }
    },
    components: {
        InlineSvg,
        NitrozenDropdown,
        admNoContent,
        NitrozenInput,
    },
}
</script>

<style lang="less" scoped> 

.debug-shipment-body {
    .title {
        margin-bottom: 8px;
        font-weight: 600;
        font-size: 14px;
        line-height: 160%;
        color: #4D4D4E;
    }
    .info-container {
        .line {
            border: 1px solid #E0E0E0;
        }

        .shipment-info {
            margin-top: 16px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            .keys {
                font-weight: 400;
                font-size: 12px;
                line-height: 160%;
                color: #9B9B9B;
            }
            .value {
                font-weight: 400;
                font-size: 12px;
                line-height: 160%;
                color: #5C5C5C;
            }
        }

        .user-remark {
            padding-bottom: 24px;
            ::v-deep .nitrozen-form-input {
                .nitrozen-input-grp {
                    .n-input-textarea {
                        height: 52px;
                    }
                }
            }
        }
    }
}
</style>