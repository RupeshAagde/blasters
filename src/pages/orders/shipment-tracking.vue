<template>
    <div class="tracking-container">
        <div class="shipment-tracking">
            <div class="bold-xs">Tracking Details</div>
            <div v-if="awb" class="bold-xs awb flex-item">
                AWB:
                <span @click="copyURLToClipboard(awb)" title="Click to copy">
                    {{ awb }}
                </span>
                <span @click="openDPTrackingPage(track_url)" title="Open DP Page">
                    <ukt-inline-svg src="track"></ukt-inline-svg>
                </span>
            </div>
            <div v-if="dp_name" class="bold-xs awb">
                DP Name:
                <span @click="copyURLToClipboard(dp_name)" title="Click to copy">
                    {{ dp_name }}
                </span>
            </div>
            <div v-if="invoiceId" class="bold-xs awb">
                Invoice ID:
                <span @click="copyURLToClipboard(invoiceId)" title="Click to copy">
                    {{ invoiceId }}
                </span>
            </div>
            <div v-if="ewayBillNumber" class="bold-xs awb">
                EwayBill Number:
                <span @click="copyURLToClipboard(ewayBillNumber)" title="Click to copy">
                    {{ ewayBillNumber }}
                </span>
            </div>
            <div class="awb">
                <div
                    class="track-item"
                    v-for="(item, index) in tracking"
                    v-bind:class="{
                        active: item.is_current || item.is_passed,
                        'track-height':
                            item.status === 'Delivery Partner Assigned'
                    }"
                    :key="index"
                >
                    <div
                        class="timeline"
                        :class="{
                            'track-height':
                                item.status === 'Delivery Partner Assigned'
                        }"
                    >
                        <div class="top-line"></div>
                        <div class="tick-icon"></div>
                        <div class="bottom-line"></div>
                    </div>
                    <div class="track-info">
                        <div>{{ item.status }}</div>
                        <div class="time light-xxs">
                            {{ getDateTime(item.time) }}
                        </div>
                        <div
                            v-if="
                                item.status == 'Delivery Partner Assigned' &&
                                    item.is_passed
                            "
                            class="track-shipment-link"
                        >
                            <!-- <a
                                v-if="false"
                                :href="''"
                                target="_blank"
                                rel="noopener"
                            >
                                Track Shipment
                            </a> -->
                            <span
                                class="opener"
                                @click="openShipmentTracking"
                            >
                                Track Shipment
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <shipment-dp-tracking-dialog
            :shipment_id="shipment_id"
            ref="tracking"
            @close="onCloseShipmentTracking"
        >
        </shipment-dp-tracking-dialog>
    </div>
</template>

<script>
import { copyToClipboard } from '@/helper/utils.js';
import { NitrozenBadge, NitrozenButton } from '@gofynd/nitrozen-vue';
import ShipmentDpTrackingDialog from './shipment-dp-tracking-dialog.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';

import moment from 'moment';

export default {
    name: 'shipment-tracking',
    components: { NitrozenBadge, NitrozenButton, ShipmentDpTrackingDialog, UktInlineSvg },
    props: {
        tracking: {
            type: Array
        },
        awb: { type: [String,Number] },
        dp_name: { type: String },
        track_url: { type: String },
        invoiceId: { type: String },
        ewayBillNumber: { type: String },
        shipment_id: {
            type: String,
            required: true
        }
    },
    computed: {},
    data() {
        return {
            copyId: null
        };
    },
    methods: {
        copyURLToClipboard(text) {
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
        },
        getDateTime(time) {
            const dateTime = moment(time);
            if (dateTime.isValid()) {
                 // @NOTE: Converting GMT to Current Timezone Date value
                return dateTime.add(new Date().getTimezoneOffset(), 'minutes').format('LLLL');
            } else {
                return '';
            }
        },
        openShipmentTracking() {
            this.$refs.tracking.open({});
        },
        onCloseShipmentTracking(reason) {
            console.log(reason);
        },
        openDPTrackingPage(url) {
            window.open(url, "_blank")
        }
    }
};
</script>

<style lang="less" scoped>
.tracking-container {
    width: 100%;
}
.shipment-tracking {
    .awb {
        margin: 12px 0;
        span {
            cursor: pointer;
            color: @RoyalBlue;
        }
    }

    .flex-item{
        display: flex;
        align-items: center;
    }

    .status {
        display: flex;
        padding: 0 0 20px;
        border-bottom: 1px solid @LightGray;
        position: relative;
        align-items: center;
        justify-content: space-between;
        .sub-title {
            margin-top: 12px;
            color: @DustyGray2;
        }
        .info {
            position: absolute;
            right: 20px;
            text-align: center;
            color: @White;
            padding: 10px;
            display: inline-flex;
            border-radius: @BorderRadius;
        }
    }
    .track-item {
        display: flex;
        color: @DustyGray2;
        align-items: center;
        &:first-child {
            .timeline {
                .top-line {
                    width: 0;
                }
            }
        }
        &:last-child {
            .timeline {
                .bottom-line {
                    width: 0;
                }
            }
        }
        &.active {
            font-weight: bold;
            color: @Mako !important;
            .timeline {
                height: 58px;
                .top-line,
                .bottom-line,
                .tick-icon {
                    background-color: #00c853;
                }
                &.track-height {
                    height: 75px;
                }
            }
        }
        .timeline {
            display: flex;
            flex-direction: column;
            height: 31px;
            .top-line {
                flex: 1;
                width: 2px;
                background-color: @DustyGray2;
                left: 5px;
                position: relative;
            }
            .bottom-line {
                flex: 1;
                width: 2px;
                background-color: @DustyGray2;
                left: 5px;
                position: relative;
            }
            .tick-icon {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: @DustyGray2;
            }
        }
        .track-info {
            margin-left: 24px;
            font-size: 14px;
            padding: 6px 0;
            .time {
                margin-top: 5px;
                color: @DustyGray2;
            }
        }
    }
}

.track-shipment-link {
    margin-top: 4px;
    a {
        font-size: 12px;
        color: @RoyalBlue;
        &:hover {
            text-decoration: underline;
        }
    }
    .opener {
        font-size: 12px;
        &:hover {
            text-decoration: underline;
        }
    }
}
.copy-icon {
    display: inline;
    ::v-deep svg {
        cursor: pointer;
        width: 14px;
        height: 14px;
        margin-left: 16px;
    }
}
</style>
