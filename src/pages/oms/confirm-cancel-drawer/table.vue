<template>
    <div class="table-container">
        <table class="mirage-table list-table">
            <tr>
                <th
                    v-for="column in columns"
                    :key="column.value"
                    class="no-wrap"
                >
                    <div class="row-content">
                        <span class="table-header">
                            {{ column.text }}
                        </span>
                    </div>
                </th>
            </tr>
            <template
                v-for="item in bags"
            >
             <tr
                :key="item.bag_id"
                v-if="showCancelledItems ? item.quantity - item.rejected : item.quantity"
                class="line-break"
            >
                <td class="item-details-container">
                    <div class="item-cell">
                        <img :src="item.item.images[0]" class="item-logo" />
                        <div class="details">
                            <span class="item-name">{{ item.item.name }}</span>
                            <div class="variants-container" v-if="item.variants && item.variants.length > 0">
                                <div class="variant-tag" v-for="variant in item.variants" :key="`${item.bag_id}-${variant.text}`">
                                    {{ variant.text }}
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="seller-cell">
                        <span id="sku" v-if="item.article.identifiers.sku_code">SKU: {{ item.article.identifiers.sku_code }}</span>
                        <span id="ean" v-if="item.article.identifiers.ean">EAN: {{ item.article.identifiers.ean }}</span>
                    </div>
                </td>
                <td>
                    <span v-if="item.quantity">
                        {{ 
                            showCancelledItems ?
                            item.quantity - item.rejected :
                            item.quantity
                        }}
                    </span>
                </td>
                <td>
                   <span>₹{{ formatPrice(item.financial_breakup.brand_calculated_amount * (item.quantity - item.rejected)) }}</span>
                </td>
             </tr>
            </template>
        </table>
    </div>
</template>

<script>
/* Helper imports */
import { formatPrice } from '@/helper/utils.js';

export default {
    name: 'confirmation-table',
    props: {
        columns: Array,
        bags: Array,
        showCancelledItems: Boolean
    },
    methods: {
        formatPrice 
    }
}
</script>

<style lang="less" scoped>
@import './../less/table.less';

table {
    font-size: 12px !important;
    font-weight: 400 !important;
    line-height: 17px !important;
}

tr:first-child {
    height: 34px;

    th {
        font-size: 12px !important;
        font-weight: 400 !important;
        line-height: 17px !important;
    }
}

.details {
    display: flex;
    flex-direction: column;

    .item-name {
        margin-bottom: 4px;
    }
}

.variants-container {
    display: flex;
    column-gap: 8px;

    .variant-tag {
        background: #F6F6F6;
        border-radius: 24px;
        padding: 3px 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10px;
        font-weight: 400;
        line-height: 130%;
        color: #4D4D4E;
    }
}
</style>
