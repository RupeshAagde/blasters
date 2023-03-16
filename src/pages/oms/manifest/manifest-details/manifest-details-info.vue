<template>
    <div class="manifest-info-container" v-if="showDetails">
        <div class="items" id="dp-image">
            <img
                v-if="data.meta && !isEmpty(data.meta.filters) && data.meta.filters.logo"
                :src="data.meta.filters.logo"
                :alt="`Delivery Partner: ${deliveryPartnerName}`"
            />
        </div>

        <div class="items" v-if="deliveryPartnerName" id="dp-name">
            <div class="text-container">
                <div class="greyed-text">Delivery Partner</div>
                <div class="strong-text">
                    <span>{{ deliveryPartnerName }}</span>
                </div>
            </div>
        </div>

        <div class="items" v-if="salesChannel" id="sales-channel">
            <div class="text-container">
                <div class="greyed-text">Channel</div>
                <div class="strong-text">
                    <span id="sales-channel-text">{{ salesChannel }}</span>
                </div>
            </div>
        </div>

        <div class="items" v-if="totalPrice" id="total-price">
            <div class="text-container">
                <div class="greyed-text">Total Price</div>
                <div class="strong-text">
                    <span>₹{{ totalPrice.toFixed(2) }}</span>
                </div>
            </div>
        </div>

        <div class="items" id="shipments-count">
            <div class="text-container">
                <div class="greyed-text">Shipments</div>
                <div class="strong-text" v-if="data && data.meta && data.meta.total_shipment_prices_count && data.meta.total_shipment_prices_count.shipment_count">
                    <span>{{ data.meta.total_shipment_prices_count.shipment_count }}</span>
                </div>
                <div class="strong-text" v-else>
                    <span>0</span>
                </div>
            </div>
        </div>

        <div class="items" v-if="pickupSlot" id="pickup-slot">
            <div class="text-container">
                <div class="greyed-text">Pickup Slot</div>
                <div class="strong-text">
                    <span v-if="data.pickup_slot">
                        {{ pickupSlot }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import isEmpty from 'lodash/isEmpty';

export default {
    name: 'manifest-details-info',
    props: {
        data: {
            type: [Array, Object]

        },
        manifestDetailsShipmentCount: {
            required: true, 
            default: 0
        }
    },
    computed: {
        deliveryPartnerName() {
            if(
                !isEmpty(this.data) &&
                this.data.meta &&
                !isEmpty(this.data.meta.filters) &&
                this.data.meta.filters.dp_name
            ) return this.data.meta.filters.dp_name;
            else return null;
        },
        pickupSlot() {
            if(!isEmpty(this.data) && !isEmpty(this.data.pickup_slot)) {
                let day = moment(this.data.pickup_slot.date).format('DD MMM, YYYY');
                let fromTime = moment(this.data.pickup_slot.lower_bound).format('LT');
                let toTime = moment(this.data.pickup_slot.upper_bound).format('LT');

                return `${day} ${fromTime} -  ${toTime}`;
            } else return null;
        },
        salesChannel() {
            if(
                !isEmpty(this.data) &&
                this.data.meta &&
                !isEmpty(this.data.meta.filters) &&
                this.data.meta.filters.sales_channel_name
            ) {
                return this.data.meta.filters.sales_channel_name;
            } else return null;
        },
        showDetails() {
            return this.deliveryPartnerName || this.salesChannel || this.totalPrice ||
            this.totalShipments || this.pickupSlot;
        },
        totalPrice() {
            if(
                !isEmpty(this.data) &&
                this.data.meta &&
                !isEmpty(this.data.meta.total_shipment_prices_count) &&
                this.data.meta.total_shipment_prices_count.total_price
            ) return this.data.meta.total_shipment_prices_count.total_price;
            else return null;
        },
        totalShipments() {
            if(
                !isEmpty(this.data) &&
                this.data.meta &&
                !isEmpty(this.data.meta.total_shipment_prices_count) &&
                this.data.meta.total_shipment_prices_count.shipment_count) {
                    return this.data.meta.total_shipment_prices_count.shipment_count;
            } else return null;
        }
    },
    methods: {
        isEmpty
    }
}
</script>

<style lang="less" scoped>
.manifest-info-container {
    background: #f5f8ff;
    width: 100%;
    display: flex;
    column-gap: 50px;
    padding: 1rem;
    margin-bottom: 4vh;

    .items {
        // padding-top: 10px;
        font-size: 15px;
        font-family: Inter;

        .text-container {
            border-right: 1px solid #eaeaea;
            height: 60px;
            margin-top: 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .greyed-text {
                color: #9b9b9b;
                font-weight: 400;
            }

            .strong-text {
                color: #41434c;
                font-weight: 600;
                padding-top: 1rem;
            }
        }

        img {
            width: 60px;
            height: 60px;
            object-fit: contain;
        }
    }

    .items:last-child .text-container {
        border: none;
    }
}

#sales-channel-text {
    text-transform: capitalize;
}

#dp-image {
    width: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#dp-name,
#sales-channel,
#total-price,
#shipments-count {
    width: 15%;
}

#pick-slot {
    width: auto;
}
</style>
