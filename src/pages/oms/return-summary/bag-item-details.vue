<template>
    <div class="bag-item-details">
        <p class="item-title">
            {{ item.item.name  }}
        </p>
        <div class="item-details">
            <div class="item-img">
                <img :src="item.item.images[0]" />
            </div>
            <div class="item-info-container">
                <p v-if="item.article.identifiers.sku_code" class="item-info">
                    SKU: {{ item.article.identifiers.sku_code }}
                </p>
                <p v-if="item.item.slug_key" class="item-info">
                    Item Code: {{ item.item.slug_key }}
                </p>
                <p class="variants item-info" v-if="item.variants && item.variants.length">
                    Variants: {{ item.variants.map(variant => variant.text).join(',') }}
                </p>
                <p v-if="item.quantity" class="item-info">
                    Quantity: {{ item.quantity }}
                </p>
                <p v-if="item.financial_breakup && item.financial_breakup[0].price_marked" class="item-info">
                    MRP: ₹{{ formatPrice(item.financial_breakup.price_marked * item.quantity) }}
                </p>
                <p v-if="item.financial_breakup && item.financial_breakup[0].brand_calculated_amount" class="item-info">
                    Price: ₹{{ formatPrice(item.financial_breakup.brand_calculated_amount * item.quantity) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
/* Helper imports */
import { formatPrice } from '@/helper/utils.js';

export default {
    name: 'return-summary-bag-item-details',
    props: {
        item: {
            type: Object
        }
    },
    methods: {
        formatPrice
    }
}
</script>

<style lang="less" scoped>
.item-details {
    display: flex;
    column-gap: 1rem;
}

.item-title {
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
    color: #41343C;
    margin-bottom: 1rem;
}

.item-img {
    img {
        width: 70px;
        height: auto;        
    }
}

.item-info {
    color: #41343C;
    font-size: 12px;
    line-height: 130%;
    font-weight: 400;
    margin-bottom: 8px;

    &:last-child {
        margin-bottom: 0;
    }
}
</style>
