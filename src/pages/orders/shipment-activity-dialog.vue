<template>
    <!-- shipment activity -->
    <nitrozen-dialog
        class="shipment-activity"
        ref="shipmentActivity"
        :title="`Shipment Activity: ${shipment_id}`"
    >
        <template slot="body">
            <div class="activity-history">
                <div
                    class="activity"
                    v-for="(activity, i) in activity_history"
                    :key="i"
                >
                    <div class="time">{{ activity.createdat }}</div>
                    <div class="message">
                        {{ getActivityMessage(activity) }}
                    </div>
                    <div class="user">{{ activity.user }}</div>
                </div>
                <div v-if="activity_history.length === 0" class="no-activity">
                    No activity found
                </div>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>
import {
    NitrozenButton,
    NitrozenDialog,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import OrderService from '@/services/orders.service';

export default {
    name: 'shipment-activity-dialog',
    components: {
        NitrozenButton,
        NitrozenDialog
    },
    props: {
        shipment_id: {
            type: String,
            required: true
        },
        bag_id: {
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
            activity_history: []
        };
    },
    mounted() {
        this.viewHistory();
    },
    methods: {
        open() {
            this.$refs.shipmentActivity.open({
                showCloseButton: true
            });
        },
        close(reason) {
            this.$refs.shipmentActivity.close(reason);
            this.$emit('close', reason);
        },
        viewHistory() {
            OrderService.bagActivityStatus(this.bag_id)
                .then(({ data }) => {
                    this.activity_history = data.activity_history;
                })
                .catch(err => {
                    console.error(err);
                });
        },
        getActivityMessage(activity) {
            try {
                return JSON.parse(activity.message).message || '';
            } catch (e) {
                return activity.message;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.shipment-activity {
    ::v-deep .nitrozen-dialog {
        min-width: 600px;
        max-width: 90%;
        max-height: 90%;
        .nitrozen-dialog-body {
            .activity-history {
                display: flex;
                flex-direction: column;
                .activity {
                    display: flex;
                    width: 100%;
                    border: 1px solid @Iron;
                    border-radius: 3px;
                    padding: 12px 0;
                    margin-bottom: 12px;
                    &:hover {
                        background-color: @WhiteSmoke;
                    }
                    .time {
                        padding-left: 12px;
                        width: 15%;
                    }
                    .message {
                        width: 70%;
                    }
                    .user {
                        padding-right: 12px;
                        width: 15%;
                        word-break: break-all;
                    }
                }

                .no-activity {
                    border: 1px solid @Iron;
                    border-radius: 3px;
                    background-color: @WhiteSmoke;
                    padding: 6px;
                    text-align: center;
                }
            }
        }
    }
}
</style>
