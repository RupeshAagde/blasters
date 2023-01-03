<template>
    <div class="serial-number-wrapper">
        <div
            v-for="item in items" 
            :key="item.bag_id"
            class="serial-number-item"
        >
            <div class="content">
                <div class="left-container">
                    <div class="item-header">
                        <span>
                            {{ item.item.name }}
                        </span>
                    </div>

                    <div class="item-content">
                        <div class="item-image-container">
                            <img 
                                class="item-img"
                                :src="item.item.images[0]" 
                                :alt="item.item.name">
                        </div>
                        <div class="item-details">
                            <div class="detail" v-if="item.article.identifiers.sku_code">
                                <span class="label">SKU:</span>
                                <span class="value">{{ item.article.identifiers.sku_code }}</span>
                            </div>
                            <!-- <div class="detail" v-if="item.article.identifiers.ean">
                                <span class="label">EAN:</span>
                                <span class="value">{{ item.article.identifiers.ean }}</span>
                            </div> -->
                            <div class="detail" v-if="item.item.code">
                                <span class="label">Item code:</span>
                                <span class="value">{{ item.item.code }}</span>
                            </div>
                            <div class="detail variants item-info" v-if="item.variants && item.variants.length">
                                <span class="label">Variants: </span>
                                <span class="value">
                                    {{ item.variants.map(variant => variant.text).join(', ') }}
                                </span>
                            </div>
                            <div class="detail" v-if="item.quantity">
                                <span class="label">Quantity:</span>
                                <span class="value">{{ item.quantity }}</span>
                            </div>
                            <!-- <div class="detail" v-if="item.financial_breakup[0].price_effective">
                                <span class="label">Effective Price:</span>
                                <span class="value">₹{{ item.financial_breakup[0].price_effective }}</span>
                            </div> -->
                            <div class="detail" v-if="item.financial_breakup[0].price_marked">
                                <span class="label">MRP:</span>
                                <span class="value">₹{{ item.financial_breakup[0].price_marked.toFixed(2) }}</span>
                            </div>
                            <div class="detail" v-if="item.financial_breakup[0].brand_calculated_amount">
                                <span class="label">Price:</span>
                                <span class="value">₹{{ item.financial_breakup[0].brand_calculated_amount.toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="right-container">
                    <div class="header">
                        <span class="header-text">Serial Number</span>
                    </div>
                    <div class="right-container-content">
                        <div class="input-boxes-container">
                            <nitrozen-input
                                v-for="unit, index in item.serial_numbers"
                                :key="`${item.bag_id}-srno-${index}`"
                                :placeholder="`Enter serial number of item ${index+1}`"
                                @change="onAddingSerialNumber(item.bag_id, index, $event)"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { NitrozenInput } from '@gofynd/nitrozen-vue';

export default {
    name: 'serial-numbers',
    props: {
        bags: Array
    },
    components: {
        NitrozenInput
    },
    data() {
        return {
            items: []
        }
    },
    mounted() {
        if(!isEmpty(this.bags)) {
            this.items = cloneDeep(this.bags)
            .filter(item => item.require_serial_number)
            .map(item => {
                item['serial_numbers'] = new Array(item.quantity);
                return item;
            });
        }
    },
    methods: {
        onAddingSerialNumber(bag_id, index, event) {
            let selectedItem = this.items.find(item => item.bag_id === bag_id);
            selectedItem.serial_numbers[index] = event.target.value;

            let selectedBag = this.bags.find(bag => bag.bag_id === bag_id);
            if(!selectedBag.serial_numbers) {
                selectedBag['serial_numbers'] = [];
            } 

            selectedBag.serial_numbers[index] = event.target.value;

            this.$emit('change', this.bags);
        }
    }
}
</script>

<style lang="less" scoped>
.serial-number-item {
    border-bottom: 1px solid #E0E0E0;
    margin-bottom: 24px;

    &:last-child {
        border-bottom: none;
    }
}

.content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding-bottom: 24px;

    .left-container {
        color: #41343C;

        .item-header {
            font-size: 14px;
            margin-bottom: 16px;
        }

        .item-content {
            display: flex;

            .item-image-container {
                max-width: 77px;
                margin-right: 16px;

                .item-img {
                    width: 100%;
                    max-height: 92px;
                }
            }

            .item-details {
                .detail {
                    font-size: 12px;
                    font-weight: 400;
                    margin-bottom: 8px;
                }
            }
        }
    }

    .right-container {
        color: #41343C;

        .header {
            margin-bottom: 8px;

            .header-text {
                font-size: 12px;
                line-height: 17px;
                color: #9B9B9B;
                font-weight: 400;
            }
        }
    }
}
</style>