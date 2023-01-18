<template>
    <div>
        <div class="side-drawer-header-box">
            <div class="side-drawer-heade-title">
                Shipment Tracking: {{ shipment_id }}
            </div>
        </div>
        <div class="body-content">
            <loader v-if="isLoading"></loader>
            <div class="tracking-details" v-if="!isLoading">
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

            <adm-no-content 
                v-if="!isLoading && !trackingDetails.length" 
                :helperText="`No Shipment Tracking found`"></adm-no-content>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenBadge,
    NitrozenButton,
    NitrozenDialog,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';

/* Component imports */
import Loader from '@/components/common/loader.vue';
import AdmNoContent from '@/components/common/adm-no-content.vue';

/* Service imports */
import OrderService from '@/services/orders.service';

/* Helper imports */
import { convertSnakeCaseToString } from '@/helper/utils';

export default {
    name: 'shipment-dp-tracking-dialog',
    components: { NitrozenBadge, NitrozenButton, NitrozenDialog, Loader, AdmNoContent },
    props: {
        shipment_id: {
            type: String,
            required: true,
        },
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    computed: {},
    data: function () {
        return {
            isLoading: false,
            isError: false,
            trackingDetails: [],
        };
    },
    mounted() {
        if (!this.trackingDetails.length) {
            this.shipmentDPTracking();
        }
    },
    methods: {
        convertSnakeCaseToString,
        // open() {
        //     if (!this.trackingDetails.length) {
        //         this.shipmentDPTracking();
        //     }
        //     this.$refs.dialog.open({
        //         width: '700px',
        //         height: '500px',
        //         showCloseButton: true,
        //     });
        // },
        // close(reason) {
        //     this.$refs.dialog.close(reason);
        //     this.$emit('close', reason);
        // },
        shipmentDPTracking() {
            this.isLoading = true;
            return OrderService.shipmentDPTrackingV2(this.shipment_id)
                .then(({ data }) => {
                    this.trackingDetails = data.items;
                })
                .catch((err) => console.log(err))
                .finally(() => {
                    this.isLoading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
.body-content {
    margin-top: 24px;
    padding: 0 16px;
    .tracking-details {
        color: @Mako;
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
