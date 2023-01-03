<template>
    <div class="bag-item-details">
        <p class="item-title">
            {{ item.entity_type == 'set' ? item.products[0].item.name : item.item.name  }}
        </p>
        <div class="item-details">
            <div class="item-img">
                <img v-if="item.entity_type == 'set'" :src="item.products[0].item.images[0]" />
                <img v-else :src="item.item.images[0]" />
            </div>
            <div class="item-info-container">
                <p v-if="item.article.identifiers.sku_code" class="item-info">
                    SKU: {{ item.article.identifiers.sku_code }}
                </p>
                <p v-if="item.entity_type == 'set' && item.products[0].item.slug_key" class="item-info">
                    Item Code: {{ item.products[0].item.slug_key }}
                </p>
                <p v-if="item.entity_type != 'set' && item.item.slug_key" class="item-info">
                    Item Code: {{ item.item.slug_key }}
                </p>
                <p class="variants item-info" v-if="item.variants && item.variants.length">
                    Variants: {{ item.variants.map(variant => variant.text).join(',') }}
                </p>
                <p v-if="item.entity_type == 'set' && item.article.set.quantity" class="item-info">
                    Quantity: {{ item.article.set.quantity }}
                </p>
                <p v-if="item.entity_type != 'set' && item.quantity" class="item-info">
                    Quantity: {{ item.quantity }}
                </p>
                <p v-if="item.entity_type == 'set' && item.financial_breakup && item.financial_breakup[0].price_marked" class="item-info">
                    MRP: ₹{{ item.financial_breakup.reduce((total, f ) => total + f.price_marked, 0).toFixed(2) }}
                </p>
                <p v-if="item.entity_type != 'set' && item.financial_breakup && item.financial_breakup[0].price_marked" class="item-info">
                    MRP: ₹{{ item.financial_breakup[0].price_marked.toFixed(2) }}
                </p>
                <p v-if="item.entity_type == 'set' && item.financial_breakup && item.financial_breakup[0].brand_calculated_amount" class="item-info">
                    Price: ₹{{ item.financial_breakup.reduce((total, f ) => total + f.brand_calculated_amount, 0).toFixed(2) }}
                </p>
                <p v-if="item.entity_type != 'set' && item.financial_breakup && item.financial_breakup[0].brand_calculated_amount" class="item-info">
                    Price: ₹{{ item.financial_breakup[0].brand_calculated_amount.toFixed(2) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'return-summary-bag-item-details',
    props: {
        item: {
            type: Object
        }
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
