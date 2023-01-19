<template>
    <div>
        <div class="side-drawer-header-box">
            <div class="side-drawer-heade-title">
                Shipment Activity: {{ shipment_id }}
            </div>
        </div>
        <loader v-if="inProgress"></loader>
        <div
            class="activity-history"
            v-if="activity_history.length && !inProgress"
        >
            <div
                class="activity"
                v-for="(activity, i) in activity_history"
                :key="i"
            >
                <div class="primary-content">
                    <div class="icon-container">
                        <adm-inline-svg
                            src="tick-grey"
                            class="tick-icon"
                        ></adm-inline-svg>
                        <div class="line"></div>
                    </div>
                    <div class="main-content">
                        <div class="message">
                            {{ getActivityMessage(activity) }}
                        </div>
                        <div class="time">{{ activity.createdat }}</div>
                    </div>
                </div>
                <!-- <div class="user">{{ activity.user }}</div> -->
            </div>
        </div>

        <div
            class="empty-state"
            v-else-if="!activity_history.length && !inProgress"
        >
            <adm-no-content
                :helperText="'No activity found'"
            ></adm-no-content>
        </div>
    </div>
    <!-- </template>
    </nitrozen-dialog> -->
</template>

<script>
/* Package imports */
import {
    NitrozenButton,
    NitrozenDialog,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';

/* Component imports */
import AdmInlineSvg from '@/components/common/inline-svg.vue';
import AdmNoContent from '@/components/common/adm-no-content.vue';
import Loader from '@/components/common/loader.vue';

/* Service imports */
import OrderService from '@/services/orders.service';

export default {
    name: 'shipment-activity-dialog',
    components: {
        NitrozenButton,
        NitrozenDialog,
        AdmInlineSvg,
        AdmNoContent,
        Loader,
    },
    props: {
        shipment_id: {
            type: String,
            required: true,
        },
        bag_id: {
            type: String,
            required: true,
        },
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            activity_history: [],
            inProgress: false,
        };
    },
    mounted() {
        this.viewHistory();
    },
    methods: {
        // open() {
        //     this.$refs.shipmentActivity.open({
        //         showCloseButton: true
        //     })
        // },
        // close(reason) {
        //     this.$refs.shipmentActivity.close(reason);
        //     this.$emit('close', reason);
        // },
        viewHistory() {
            this.inProgress = true;
            OrderService.bagActivityStatusV2(this.bag_id)
                .then(({ data }) => {
                    this.activity_history = data.activity_history;
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.inProgress = false;
                });
        },
        getActivityMessage(activity) {
            try {
                return JSON.parse(activity.message).message || '';
            } catch (e) {
                return activity.message;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.activity-history {
    margin-top: 24px;
    padding: 0 16px;
    .activity {
        display: flex;
        width: 100%;
        justify-content: space-between;

        &:last-child .line {
            display: none;
        }

        .primary-content {
            display: grid;
            grid-template-columns: 50px auto;
            // column-gap: 2%;

            .icon-container {
                display: flex;
                justify-content: center;
                align-items: flex-start;
                position: relative;
                margin-right: 8px;

                .tick-icon {
                    border: 1px solid #219653;
                    border-radius: 50%;
                    padding: 4px 3px;
                    z-index: 999;
                    position: absolute;
                    background: @White;
                }

                .tick-icon ::v-deep svg {
                    fill: #219653;
                    stroke: #219653;
                }

                .line {
                    height: 100%;
                    border: 1px solid #219653;
                    position: absolute;
                    z-index: 1;
                }
            }

            .main-content {
                padding-bottom: 24px;

                .message {
                    font-size: 14px;
                    color: #4d4d4e;
                }

                .time {
                    font-size: 12px;
                    color: #9b9b9b;
                    margin-top: 12px;
                }
            }
        }

        .user {
            padding-right: 12px;
            width: 15%;
            word-break: break-all;
            text-transform: capitalize;
            text-align: right;
            font-size: 14px;
        }
    }
}
</style>
