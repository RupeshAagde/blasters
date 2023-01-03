<template>
    <nitrozen-dialog
        class="cancel-shipment"
        ref="cancelShipment"
        :title="title"
    >
        <template slot="body">
            <div
                v-for="shipment in cancellingShipments"
                :key="shipment.id"
                class="shipment"
            >
                <div class="shipment-id">Shipment ID: {{ shipment.id }}</div>
                <!-- multiple if else are due to there is different bag object in order details and picklist bags -->
                <div
                    v-for="(bag, i) in shipment.bags"
                    :key="shipment.id + '' + (bag.id || bag.bag_id)"
                    class="bag"
                >
                    <div class="bag-details">
                        <div class="name" v-if="bag.item">
                            {{ bag.item.name }}
                        </div>
                        <div class="name" v-else>{{ bag.item_name }}</div>
                        <div class="other">
                            <div v-if="bag.item">
                                <img :src="bag.item.image[0]" />
                            </div>
                            <div>
                                <div class="id">
                                    <label> Bag ID: </label
                                    ><span>{{ bag.id || bag.bag_id }}</span>
                                </div>
                                <div
                                    class="id"
                                    v-if="
                                        (bag.item && bag.item.code) ||
                                            bag.item_code
                                    "
                                >
                                    <label> Item Code: </label>
                                    <span v-if="bag.item">{{
                                        bag.item.code
                                    }}</span>
                                    <span v-else>{{ bag.item_code }}</span>
                                </div>
                                <div
                                    class="id"
                                    v-if="bag.article || bag.article_code"
                                >
                                    <label> Article ID: </label>
                                    <span>{{
                                        bag.article_code || bag.article.uid
                                    }}</span>
                                </div>
                                <div class="id" v-if="bag.prices || bag.price">
                                    <label> Effective Price: </label>
                                    <span>{{
                                        (bag.prices
                                            ? bag.prices.price_effective
                                            : bag.price) | currencyformat(2)
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <nitrozen-dropdown
                            label="Cancellation reason"
                            placeholder="Choose reason"
                            :items="cancellationReasons"
                            v-model="bag.shipmentCancellationReason.value"
                            @change="
                                () => {
                                    $forceUpdate();
                                }
                            "
                        ></nitrozen-dropdown>
                        <nitrozen-error
                            v-if="bag.shipmentCancellationReason.showerror"
                        >
                            {{ bag.shipmentCancellationReason.errortext }}
                        </nitrozen-error>
                        <span
                            v-if="shipment.bags.length > 1 && i == 0"
                            class="copy-reason"
                            @click="copyReason"
                        >
                            Apply this reason to all bags
                        </span>
                    </div>
                </div>
                <div class="form-row reason">
                    <nitrozen-input
                        type="textarea"
                        label="Comment"
                        placeholder="Brief description for the cancellation"
                        v-model="shipment.cancelDescription.value"
                    ></nitrozen-input>
                    <nitrozen-error v-if="shipment.cancelDescription.showerror">
                        {{ shipment.cancelDescription.errortext }}
                    </nitrozen-error>
                </div>
            </div>
        </template>
        <template slot="footer">
            <nitrozen-button
                theme="secondary"
                v-flat-btn
                @click="cancelShipment"
            >
                Confirm
            </nitrozen-button>
        </template>
    </nitrozen-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import {
    NitrozenButton,
    NitrozenDialog,
    NitrozenRadio,
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import OrderService from '@/services/orders.service';
import { GET_USER_INFO } from '@/store/getters.type';
// import _ from 'lodash';
import find from 'lodash/find';
import { CANCELLATION_REASONS } from '@/helper/constants';

export default {
    name: 'shipment-cancellation-dialog',
    components: {
        NitrozenButton,
        NitrozenDialog,
        NitrozenRadio,
        NitrozenInput,
        NitrozenError,
        NitrozenDropdown
    },
    props: {
        title: {
            type: String,
            default: 'Cancel shipment'
        }
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {
        ...mapGetters({
            accessDetail: {}
        })
    },
    data: function() {
        return {
            cancellationReasons: [],
            cancellingShipments: [],
            cancelDescription: this.getInitialValue('')
        };
    },
    mounted() {
        if(this.accessDetail && this.accessDetail.order_role) {
            this.cancellationReasons = CANCELLATION_REASONS[this.accessDetail.order_role]
        }
        this.resetForm([]);
    },
    methods: {
        open({ shipments, originalData }) {
            this.originalData = originalData;
            this.resetForm(shipments);
            this.$refs.cancelShipment.open({
                showCloseButton: true,
                width: '800px'
            });
        },
        close(reason) {
            this.$refs.cancelShipment.close(reason);
            this.$emit('close', reason);
        },
        resetForm(shipments) {
            this.shipmentCancellationReason = [];
            this.cancellingShipments = [];
            this.cancellingShipments = shipments.map(shipment => {
                shipment['cancelDescription'] = this.getInitialValue('');
                shipment.bags = shipment.bags.map(bag => {
                    bag['shipmentCancellationReason'] = this.getInitialValue(
                        ''
                    );
                    return bag;
                });
                return shipment;
            });
        },
        copyReason() {
            for (let i = 0; i < this.cancellingShipments.length; i++) {
                const shipment = this.cancellingShipments[i];
                if (
                    shipment.bags.length &&
                    shipment.bags[0].shipmentCancellationReason.value !== ''
                ) {
                    const reason =
                        shipment.bags[0].shipmentCancellationReason.value;

                    for (let j = 0; j < shipment.bags.length; j++) {
                        const bag = shipment.bags[j];
                        bag.shipmentCancellationReason.value = reason;
                    }
                    this.$forceUpdate();
                }
            }
        },
        getInitialValue(value) {
            return {
                value,
                showerror: false,
                errortext: ''
            };
        },
        checkEmpty(key, obj = this) {
            const emptyErorrs = {
                shipmentCancellationReason: 'Please select reason',
                cancelDescription: `Description is required`
            };
            if (obj[key].value.toString().trim() === '') {
                obj[key].showerror = true;
                obj[key].errortext = emptyErorrs[key] || 'Enter ' + key;
                return false;
            }
            obj[key].showerror = false;
            return true;
        },
        validateCancellationPayload() {
            let formValid = true;
            for (let i = 0; i < this.cancellingShipments.length; i++) {
                const shipment = this.cancellingShipments[i];

                for (let j = 0; j < shipment.bags.length; j++) {
                    const bag = shipment.bags[j];

                    formValid =
                        this.checkEmpty('shipmentCancellationReason', bag) &&
                        formValid;
                }
                shipment.cancelDescription.showerror = false;
                if (shipment.cancelDescription.value.trim().length < 10) {
                    formValid = false;
                    shipment.cancelDescription.showerror = true;
                    shipment.cancelDescription.errortext =
                        'Cancellation Comment should be at lest 10 characters long';
                }
            }

            return formValid;
        },
        cancelShipment() {
            if (!this.validateCancellationPayload()) {
                return;
            }

            const shipments = {};
            for (let i = 0; i < this.cancellingShipments.length; i++) {
                const shipment = this.cancellingShipments[i];

                const reason = {};
                for (let j = 0; j < shipment.bags.length; j++) {
                    const bag = shipment.bags[j];

                    // const bagId = (bag.id || bag.bag_id).toString();
                    const bagId = bag.id || bag.bag_id;
                    if (reason[bag.shipmentCancellationReason.value]) {
                        reason[bag.shipmentCancellationReason.value].push(
                            bagId
                        );
                    } else {
                        reason[bag.shipmentCancellationReason.value] = [bagId];
                    }
                }

                shipments[shipment.id] = {
                    reason,
                    reason_text: shipment.cancelDescription.value
                };
            }

            const cancelReason = {
                cancel: true,
                shipments,
                originalData: this.originalData
            };
            this.close(cancelReason);
        }
    }
};
</script>

<style lang="less" scoped>
.cancel-shipment {
    ::v-deep .nitrozen-dialog {
        max-height: 90%;
        .nitrozen-dialog-body {
            overflow: auto;

            .form-row {
                margin-left: 12px;
                width: 260px;
            }
            .reason {
                width: auto;
            }
            .copy-reason {
                color: @RoyalBlue;
                font-size: 12px;
                cursor: pointer;
                margin-left: 12px;
                &:hover {
                    text-decoration: underline;
                }
            }
            .shipment {
                color: @Mako;
                padding-bottom: 12px;
                margin-bottom: 12px;
                border-bottom: 1px solid @DoveGray;
                .shipment-id {
                    font-size: 16px;
                    margin-bottom: 6px;
                    font-weight: 600;
                }
            }
            .bag {
                display: flex;
                justify-content: space-between;
                padding-bottom: 6px;
                margin-bottom: 6px;
                border-bottom: 1px solid @Iron;
                .bag-details {
                    display: flex;
                    flex-direction: column;
                    overflow-wrap: anywhere;
                    .name {
                        font-weight: 500;
                    }
                    .other {
                        display: flex;
                        img {
                            max-height: 80px;
                            max-width: 80px;
                            margin-right: 12px;
                        }
                        .id {
                            font-size: 12px;
                            label {
                                font-weight: 600;
                            }
                        }
                    }
                }
            }
        }
        .nitrozen-dialog-footer {
            padding-top: 12px;
        }
    }
}
</style>
