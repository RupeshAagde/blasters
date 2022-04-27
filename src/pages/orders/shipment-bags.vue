<template>
    <div class="shipment-items">
        <div class="title bold-xs">Bag Items ({{ bags.length }})</div>
        <div class="bag-items">
            <div class="bag-item" v-for="(bag, i) in bags" :key="i">
                <nitrozen-check-box
                    ref="bag-selector"
                    class="bag-selector"
                    v-if="bags.length > 1 && (isNew || isReturnInitiated)"
                    v-model="value[i]"
                    :disabled = !canBreak
                    @change="selectionChange(value)"
                ></nitrozen-check-box>

                <div class="bag-img">
                    <a
                        v-if="orderDomain"
                        :href="`${orderDomain}/product/${bag.item.slug_key}`"
                        title="Open in new tab"
                        target="_blank"
                    >
                        <img :src="bag.item.image[0]" />
                    </a>
                    <img v-else :src="bag.item.image[0]" />
                </div>
                <div class="bag-info">
                    <div class="shipment-details">
                        <div class="shipment-line-1">
                            <div class="shipment-stats">
                                <span>{{ bag.item.name }}</span>
                                <span>|</span>
                                <span>{{ bag.item.brand }}</span>
                            </div>
                        </div>

                        <div class="shipment-line-1">
                            <div class="shipment-stats">
                                <span>
                                   Size: {{ bag.item.size }}
                                </span>
                                <span>|</span>
                                <!-- <span v-if="bag.prices">
                                    {{
                                        bag.prices.price_effective
                                            | currencyformat
                                    }}
                                </span> -->
                                <span v-if="bag.gst_details">
                                    Price: {{
                                        bag.gst_details.brand_calculated_amount
                                            | currencyformat
                                    }}
                                </span>
                            </div>
                        </div>

                        <div class="shipment-line-1">
                            <div class="shipment-stats">
                                <span v-if="bag.gst_details">
                                    {{ bag.gst_details.gst_tag }}: {{ bag.gst_details.gst_tax_percentage }}%
                                </span>
                            </div>
                        </div>

                        <div class="shipment-line-1" v-if="bag.article">
                            <div class="shipment-stats">
                                <span class="margin">
                                    Bag ID: {{ bag.id }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="shipment-line-1"
                            v-if="bag.item && bag.item.code"
                        >
                            <div class="shipment-stats">
                                <span class="margin">
                                    Item Code: {{ bag.item.code }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="shipment-line-1"
                            v-if="
                                bag.article &&
                                bag.article.identifiers &&
                                bag.article.identifiers.ean
                            "
                        >
                            <div class="shipment-stats">
                                <span class="margin">
                                    EAN: {{ bag.article.identifiers.ean }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="shipment-line-1"
                            v-if="
                                bag.article &&
                                bag.article.identifiers &&
                                bag.article.identifiers.sku_code
                            "
                        >
                            <div class="shipment-stats">
                                <span class="margin">
                                    SKU Code:
                                    {{ bag.article.identifiers.sku_code }}
                                </span>
                            </div>
                        </div>

                        <div class="shipment-line-1" v-if="bag.article">
                            <div class="shipment-stats">
                                <span class="margin">
                                    Article ID: {{ bag.article.uid }}
                                </span>
                            </div>
                        </div>


                        <div
                            class="shipment-line-1"
                            v-if="
                                bag.prices &&
                                (bag.prices.price_marked !=
                                bag.prices.price_effective)
                            "
                        >
                            <div class="shipment-stats">
                                <span class="margin">
                                    {{
                                        (
                                            ((bag.prices.price_marked -
                                                bag.prices.price_effective) /
                                                bag.prices.price_marked) *
                                            100
                                        ).toFixed(2)
                                    }}% Off
                                </span>
                            </div>
                        </div>

                        <div
                            class="shipment-line-1"
                            v-if="
                                shipmentStatus &&
                                shipmentStatus.status &&
                                shipmentStatus.status == 'delivery_done'
                            "
                        >
                            <div class="shipment-stats">
                                <span class="margin">
                                    Delivered
                                    {{
                                        toDateTimeString(
                                            shipmentStatus.created_at
                                        )
                                    }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="return-label"
                            v-if="
                                bag.article &&
                                bag.article.return_config &&
                                bag.article.return_config.returnable
                            "
                        >
                            <div>
                                Returnable (Upto
                                {{ bag.article.return_config.time
                                }}{{ bag.article.return_config.unit }})
                            </div>
                        </div>

                        <!-- <div class="shipment-line-1">
                            <div class="shipment-stats">
                                Sold by: {{ bag.seller_name }}
                            </div>
                        </div>  -->
                    </div>
                </div> 
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.shipment-items {
    max-height: 356px;
    overflow-x: auto;
    .mirage-scrollbar;
    .title {
        margin-bottom: 12px;
    }
    .bag-items {
        display: flex;
        flex-wrap: wrap;
    }
    .bag-item {
        display: flex;
        width: calc(50% - 24px);
        margin-bottom: 12px;
        position: relative;
        .bag-selector {
            position: absolute;
            top: 5px;
            left: 5px;
        }
        .bag-img {
            display: flex;
            align-items: center;
            img {
                width: auto;
                height: 80px;
                cursor: pointer;
            }
        }
        .bag-info {
            width: 90%;
            display: flex;
            .shipment-details {
                margin-left: 24px;
                .shipment-stats {
                    color: #9b9b9b;
                    line-height: 22px;
                    font-size: 12px;
                }
                .shipment-line-1 {
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
    }
    .return-label {
        max-width: 215px;
        font-size: 11px;
        position: relative;
        margin-top: 4px;
        margin-bottom: 20px;
    }
    .return-label > div {
        position: absolute;
        top: 0;
        padding: 1px 8px;
        display: inline-block;
        line-height: 18px;
        color: #382f2f;
        font-weight: bold;
        background-color: #f1ea16;
    }

    .return-label > div:before {
        content: '';
        position: absolute;
        top: 0px;
        right: -15px;
        display: block;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 20px 20px 0 0;
        border-color: #f1ea16 transparent transparent transparent;
    }

    .return-label > div:after {
        content: '';
        position: absolute;
        top: 0px;
        right: -15px;
        display: block;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 20px 0 0 20px;
        border-color: transparent transparent transparent #f1ea16;
    }
}
</style>

<script>
import { NitrozenCheckBox } from '@gofynd/nitrozen-vue';
import { getPrimaryDomain } from '@/helper/domains.util';
import { getAppInfo } from '@/services/utils.service';
import root from 'window-or-global';
import moment from 'moment';

const config = root.config || {};
export default {
    name: 'company-bag-items',
    components: { NitrozenCheckBox },
    props: {
        bags: {
            type: Array,
            required: true,
        },
        shipmentStatus: {
            type: Object,
        },
        value: {
            type: Array,
            default: () => {
                return [];
            },
        },
        isNew: {
            type: Boolean,
            default: false,
        },
        isReturnInitiated: {
            type: Boolean,
            default: false,
        },
        orderDomain: {
            type: String,
        },
        canBreak: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    computed: {
        productLink() {
            return ""// `${getPrimaryDomain(getAppInfo().domains)}/product/${ this.bag.item.slug_key }`;
        }
    },
    mounted() {
        if (this.value.length == 0 && (this.isNew || this.isReturnInitiated)) {
            this.$emit(
                'input',
                this.bags.map(() => true)
            );
        }
    },
    methods: {
        toDateTimeString(date) {
            // @NOTE: Converting GMT to Current Timezone Date value
            return moment(date).add(new Date().getTimezoneOffset(), 'minutes').fromNow();
        },
        selectionChange(status) {
            this.$emit('selectionChange', status);
        },
    },
};
</script>
