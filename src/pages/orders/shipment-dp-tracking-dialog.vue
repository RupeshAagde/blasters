<template>
    <nitrozen-dialog
        class="container"
        ref="dialog"
        :title="`Shipment Tracking: ${shipment_id}`"
    >
        <template slot="body">
            <div class="body-content">
                <!-- <div class="top-row">
                    <nitrozen-button
                        @click="shipmentDPTracking"
                        v-flatBtn
                        theme="secondary"
                    >
                        Refresh
                    </nitrozen-button>
                </div> -->
                <div class="tracking-details">
                    <div
                        v-for="(track, i) in trackingDetails"
                        :key="i"
                        class="tracking-entry"
                    >
                        <div class="date">{{ track.updated_at }}</div>
                        <div class="description">
                            <div>
                                <div class="status">
                                    {{ convertSnakeCaseToString(track.status) }}
                                </div>
                                <div class="location">
                                    {{ track.last_location_recieved_at }}
                                </div>
                            </div>
                            <div class="reason">{{ track.reason }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>
import {
    NitrozenBadge,
    NitrozenButton,
    NitrozenDialog,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import OrderService from '@/services/orders.service';
import { convertSnakeCaseToString } from '@/helper/utils';

export default {
    name: 'shipment-dp-tracking-dialog',
    components: { NitrozenBadge, NitrozenButton, NitrozenDialog },
    props: {
        shipment_id: {
            type: String,
            required: true
        }
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {},
    data: function() {
        return {
            isLoading: false,
            isError: false,

            trackingDetails: []
        };
    },
    mounted() {},
    methods: {
        convertSnakeCaseToString,
        open() {
            if (!this.trackingDetails.length) {
                this.shipmentDPTracking();
            }
            this.$refs.dialog.open({
                width: '700px',
                height: '500px',
                showCloseButton: true
            });
        },
        close(reason) {
            this.$refs.dialog.close(reason);
            this.$emit('close', reason);
        },
        shipmentDPTracking() {
            this.isLoading = true;
            OrderService.shipmentDPTracking(this.shipment_id)
                .then(({ data }) => {
                    // console.log(data);
                    this.trackingDetails = data.results;
                })
                .catch(err => console.error)
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }
};
</script>

<style lang="less" scoped>
.container {
    ::v-deep .nitrozen-dialog {
        min-width: 600px;
        max-width: 90%;
        max-height: 90%;
        .nitrozen-dialog-body {
            overflow: auto;
            .mirage-scrollbar;
        }
    }
}

.body-content {
    display: flex;
    flex-direction: column;

    .top-row {
        display: flex;
        justify-content: flex-end;
    }

    .tracking-details {
        color: @Mako;
        display: flex;
        flex-direction: column;
        .tracking-entry {
            width: 100%;
            display: flex;
            align-items: center;
            min-height: 36px;
            padding: 8px 0;
            border-bottom: 1px solid @Iron;
            .date {
                width: 160px;
                font-weight: bold;
            }
            .description {
                display: flex;
                width: calc(100% - 160px);
                flex-direction: column;
                & > div {
                    display: flex;
                }
                .status {
                    width: 50%;
                }
                .location {
                    width: 50%;
                    font-style: italic;
                }
                .reason {
                    font-size: 12px;
                    line-height: 16px;
                    font-style: italic;
                }
            }
        }
    }
}
</style>
