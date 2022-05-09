<template>
    <div class="billing">
        <div class="title bold-sm">Price Breakup</div>
        <div>
            <div
                v-for="(item, index) in prices"
                :key="index"
                class="prices-item"
                :class="{ total: index === prices.length - 1 }"
            >
                <template
                    v-if="
                        (index !== prices.length - 1 && item.value !== 0) ||
                            index === prices.length - 1
                    "
                >
                    <span v-if="index !== prices.length - 1">
                        <span>{{ item.text }}</span>
                        <span class="values">
                            {{ item.value | currencyformat }}
                        </span>
                    </span>
                    <span v-if="index === prices.length - 1">
                        <span>{{ item.text }}</span>
                        <span class="values">
                            {{ item.value | currencyformat }}
                        </span>
                    </span>
                </template>
            </div>
        </div>

        <div v-if="shipment && shipment.payments">
        <div class="title-internal bold-sm">{{ label }}</div>
        <div class="payment-details">
            <div class="payment-logo">
                <img :src="shipment.payments.logo" />
            </div>
            <div>{{ shipment.payments.display_name }}</div>
            <div class="right-align">{{ shipment.payment_status }}</div>
        </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.title {
    color: @Mako;
    font-size: 14px;
    margin-bottom: 5px;
}
.title-internal {
    color: @Mako;
    font-size: 14px;
    margin-top: 24px;
}
.billing {
    // padding: 10px;
    position: relative;
    width: 100%;
    .values {
        position: absolute;
        right: 6px;
    }
    .prices-item {
        color: #9b9b9b;
        line-height: 22px;
        font-size: 12px;
    }

    .total {
        padding-top: 10px;
        border-top: 1px solid @LightGray;
        font-weight: 600;
        color: @Mako;
    }
}
.payment-details {
    display: flex;
    align-items: center;
    line-height: 22px;
    font-size: 14px;
    color: #9b9b9b;
    margin-top: 12px;
    .payment-logo {
        margin: 0px !important;
        img {
            width: 50px;
        }
    }
    .right-align {
        margin-left: auto;
        margin-right: 24px;
    }
}
</style>

<script>
import { mapGetters } from 'vuex';
import { IS_LOGGED_IN } from '@/store/getters.type';
import sumBy from 'lodash/sumBy';

export default {
    name: 'company-shipment-prices',
    props: {
        shipment: {},
        label: {
            type: String,
            default: 'Payment Method'
        }
    },
    computed: {
        ...mapGetters({
            isloggedIn: IS_LOGGED_IN
        }),
        prices() {
            const couponSum = sumBy(this.shipment.bags, 'prices.coupon_value')
            return [
                {
                    text: 'Price Marked', // MRP
                    value: this.shipment.prices.price_marked
                },
                // {
                //     text: 'Sub Total',
                //     value: this.shipment.prices.price_effective
                // },
                {
                    text: 'Discount',
                    value: this.shipment.prices.discount ? -(this.shipment.prices.discount) : 0
                },
                {
                    text: `Coupon ${this.shipment.coupon ? `(${this.shipment.coupon.code})` : ''}`,
                    value: -(this.shipment.prices.coupon_value) 
                    || -(this.shipment.coupon && this.shipment.coupon.value)
                    || -(couponSum)
                    || 0
                },
                {
                    text: 'Fynd Credits Applied',
                    value: this.shipment.prices.fynd_credits ? -(this.shipment.prices.fynd_credits): 0
                },
                // {
                //     text: 'Credits Refund',
                //     value: this.shipment.prices.refund_credit
                // },
                // {
                //     text: 'Refund Amount',
                //     value: this.shipment.prices.refund_amount
                // },
                {
                    text: 'Cachback Applied',
                    value: this.shipment.prices.cashback_applied ? -(this.shipment.prices.cashback_applied) : 0
                },
                {
                    text: 'Delivery Charges',
                    value: this.shipment.prices.delivery_charge
                },
                {
                    text: 'COD Charges',
                    value: this.shipment.prices.cod_charges
                },
                {
                    text: 'Total', // Amount Paid
                    // value: this.shipment.prices.amount_paid
                    value: this.shipment.gst.brand_calculated_amount
                    + this.shipment.prices.cod_charges
                    + this.shipment.prices.delivery_charge
                    - this.shipment.prices.cashback_applied
                    - this.shipment.prices.fynd_credits
                }
            ];
        }
    },
    data() {
        return {};
    }
};
</script>
