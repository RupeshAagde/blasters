<template>
    <div class="shipment-actions-card" v-if="checkUpdateRole">
        <div class="bulk-shipment-actions">
            <template>
                <div class="multicheck" v-if="shipments.length > 1">
                    <span
                        v-if="
                            shipmentBagCount &&
                            shipmentBagCount.shipment != shipments.length
                        "
                        @click="selectAllShipments"
                    > Select All
                    </span>
                    <span
                        v-if="
                            shipmentBagCount && shipmentBagCount.shipment != 0
                        "
                        @click="unselectAllShipments"
                    >Clear All</span>
                </div>
                <div class="shipment-bag-count">
                    <span>
                        {{ shipmentBagCount.shipment }} shipment{{
                            shipmentBagCount.shipment > 1 ? 's' : ''
                        }}
                    </span>
                    <span>|</span>
                    <span>
                        {{ shipmentBagCount.bag }} bag{{
                            shipmentBagCount.bag > 1 ? 's' : ''
                        }}
                    </span>
                </div>
                <div class="action-btns">
                    <nitrozen-button
                        @click="updateMultipleShipment('bag_confirmed')"
                        class="multicheck"
                        v-flatBtn
                        theme="secondary"
                    >
                        Confirm
                    </nitrozen-button>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenButton,
    NitrozenCheckBox,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';
// import { GET_EMPLOYEE_ACCESS_DETAIL } from '@/store/getters.type';

export default {
    name: 'shipment-actions',
    components: {
        NitrozenButton,
        'nitrozen-checkbox': NitrozenCheckBox
    },
    props: {
        shipments: {
            type: Array,
            default: []
        },
        shipmentBagCount: {
            type: Object
        },
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {
        // ...mapGetters({
        //     accessDetail: GET_EMPLOYEE_ACCESS_DETAIL,
        // }),
        checkUpdateRole() {
            const role =
                this.accessDetail &&
                this.accessDetail.order_role &&
                (this.accessDetail.order_role == 'store_manager' ||
                    this.accessDetail.order_role == 'full_access');
            return role;
        }
    },
    methods: {
        selectAllShipments() {
            this.$emit('selectAllShipments');
        },
        unselectAllShipments() {
            this.$emit('unselectAllShipments');
        },
        updateMultipleShipment(status) {
            this.$emit('updateMultipleShipment', status);
        }
    }
}
</script>

<style lang="less" scoped>
.shipment-actions-card {
    background-color: @White;
    border-radius: 4px;
    padding: 24px;
    margin-top: 24px;
    .bulk-shipment-actions {
        display: flex;
        align-items: center;
        .multicheck {
            margin-right: 24px;
            & > span {
                color: @DustyGray2;
                font-size: 14px;
                padding: 0 4px;
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
        .shipment-bag-count {
            & > span {
                color: @DustyGray2;
                font-size: 14px;
                padding: 0 4px;
            }
        }
        .action-btns {
            margin-left: auto;
        }
    }
}
</style>
