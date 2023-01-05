<template>
    <div class="price-breakup-container">
        <div class="price-breakup-box">
            <span class="style-header">Price Breakup</span>
            <div @click="toggleCollapse" class="headings-price-breakup" v-if="prices.amount_paid !== undefined">
                <span class="total-label">Total: </span>
                <span class="style-header total-value"> ₹{{ prices.amount_paid.toFixed(2) }}</span>
                <span
                    class="accordion-button"
                    v-bind:class="{
                        'filter-arrow-down': !isOpen,
                        'filter-arrow-up': isOpen
                    }">
                    <inline-svg class="accordion-arrow-down" src="accordion-arrow-down"></inline-svg>
                </span>
            </div>
        </div>

        <div class="price-details" :class="{ hide: !isOpen }">
            <div class="styling-price-details" v-if="prices.price_marked !== undefined && prices.price_marked !== 0">
                <span class="style-price-title">MRP: </span>
                <span class="style-price">
                    ₹{{ prices.price_marked.toFixed(2) }}
                </span>
            </div>
            <div class="styling-price-details" v-if="prices.discount !== undefined && prices.discount !== 0">
                <span class="style-price-title">Discount: </span>
                <span class="style-price">
                    {{prices.discount > 0 ? '-' : ''}} ₹{{ prices.discount.toFixed(2) }}
                </span>
            </div>
            <div v-if="
                    shipment && 
                    (shipment.coupon && shipment.coupon.payable_category !== 'fynd') || 
                    (prices.coupon_value > 0 && !shipment.coupon && shipment.order && shipment.order.ordering_channel == 'Ecomm')">
                <div class="styling-price-details" v-if="prices.coupon_value !== undefined && prices.coupon_value !== 0 && couponCode">
                    <span class="style-price-title">Coupon Value ({{ couponCode.toUpperCase() }}): </span>
                    <span class="style-price">
                        {{prices.coupon_value > 0 ? '-' : ''}} ₹{{ prices.coupon_value.toFixed(2) }}
                    </span>
                </div>
            </div>
            <div class="styling-price-details" v-if="prices.promotion_effective_discount !== undefined && prices.promotion_effective_discount !== 0">
                <span class="style-price-title">Promotion Discount: </span>
                <span class="style-price">
                    {{prices.promotion_effective_discount > 0 ? '-' : ''}} ₹{{ prices.promotion_effective_discount.toFixed(2) }}
                </span>
            </div>
            <!-- <div class="styling-price-details" v-if="prices.coupon_value !== undefined && +prices.coupon_value !== 0">
                <span class="style-price-title">Coupon Code: </span>
                <span class="style-price coupon-code">{{ couponCode }}</span>
            </div> -->

            <!-- The below commented out code will be used in blaster so do not delete it -->

            <!-- <div class="styling-price-details" v-if="prices.delivery_charge !== undefined && prices.delivery_charge !== 0">
                <span class="style-price-title">Delivery Charges: </span>
                <span class="style-price">
                    ₹{{ prices.delivery_charge.toFixed(2) }}
                </span>
            </div> -->
            <!-- <div class="styling-price-details" v-if="prices.fynd_credits !== undefined && prices.fynd_credits !== 0">
                <span class="style-price-title">FYND Credits: </span>
                <span class="style-price">
                    {{prices.fynd_credits > 0 ? '-' : ''}} ₹{{ prices.fynd_credits.toFixed(2) }}
                </span>
            </div> -->
            <!-- <div class="styling-price-details" v-if="prices.cashback_applied !== undefined && prices.cashback_applied !== 0">
                <span class="style-price-title">Cashback Applied: </span>
                <span class="style-price">
                    {{prices.cashback_applied > 0 ? '-' : ''}} ₹{{ prices.cashback_applied.toFixed(2) }}
                </span>
            </div> -->
            <div class="styling-price-details" v-if="prices.cod_charges !== undefined && prices.cod_charges !== 0">
                <span class="style-price-title">COD charges: </span>
                <span class="style-price">
                    ₹{{ prices.cod_charges.toFixed(2) }}
                </span>
            </div>
            <div class="styling-price-details" v-if="prices.amount_paid !== undefined && prices.amount_paid !== 0">
                <span class="style-price-title">Price: </span>
                <span class="style-price">₹{{ prices.amount_paid.toFixed(2) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
/* Component imports */
import InlineSvg from '@/components/common/inline-svg.vue';

export default {
    name: 'order-price-breakup',
    components: {
        'inline-svg': InlineSvg
    },
    props: {
        total: {
            type: Number
        },
        prices: {
            type: Object
        },
        couponCode: {
            type: String
        },
        shipment: {
            type: Object
        }
    },
    data() {
        return {
            isOpen: false
        }
    },
    methods: {
        toggleCollapse() {
            this.isOpen = !this.isOpen;
        },
    }
}
</script>

<style lang="less" scoped>
.price-breakup-box {
    display: flex;
    justify-content: space-between;
    padding: 16px 24px;
    border: 1px solid #E0E0E0;
    border-radius: 4px 4px 0px 0px;
    margin: 1rem 0rem 0rem 0rem;

    .style-header {
        font-weight: 600;
        font-size: 14px;
        color: #41434C;
    }

    .filter-arrow-up {
        transform: rotate(180deg);
    }

    .label {
        cursor: pointer;
    }
}

.headings-price-breakup {
    display: flex;
    align-items: center;

    .total-label {
        font-weight: 400;
        font-size: 14px;
        color: #9B9B9B;
        margin-right: 10px;
    }
}

.price-details {
    border: 1px solid #E0E0E0;
    border-top: none;
    text-align: right;
    padding: 1.2rem 3rem 1.2rem 0rem;

    .styling-price-details {
        display: grid;
        grid-template-columns: 88% 12%;
        margin-bottom: 1rem;
    }

    .style-price-title {
        font-weight: 400;
        font-size: 12px;
        color: #9B9B9B;
        margin-right: 1rem;
    }

    .style-price {
        font-weight: 400;
        font-size: 12px;
        color: #41434C;
    }
}

.hide {
    display: none;
}

.accordion-button {
    cursor: pointer;
}

.total-value {
    margin-right: 12px;
}

.coupon-code {
    text-transform: uppercase;
}
</style>
