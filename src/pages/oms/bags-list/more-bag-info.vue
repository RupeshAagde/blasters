<template>
    <div class="header">
        <span class="title">Item Info</span>
        <div class="main-details">
            <div class="logo">
                <img 
                    :src="articleData.item.images[0]" 
                    class="item-logo" />
            </div>

            <div class="item-general-info">
                <p>{{ articleData.item.brand }} | {{ articleData.item.name }}</p>
                <p>Qty: {{ articleData.quantity }}</p>
                <nitrozen-badge
                    class="right-align"
                    :style="{
                        color: '#E9783D',
                        'border-color': '#E9783D',
                    }"
                    v-if="articleData.can_return"
                >
                    Returnable ({{ noOfReturnableDays ? noOfReturnableDays + ' Day' + (noOfReturnableDays > 1 ? 's left' : ' left') : 'window closed' }})
                </nitrozen-badge>
            </div>
        </div>

        <div 
            class="extra-info"
            :class="{'ending-border': articleData.meta.custom_message}">
            <span class="title">Item Details</span>
            <div class="info">
                <div id="variants" v-if="articleData.item.size">
                    <span class="common-key-style">Size: </span>
                    <span class="common-value-style">
                        {{ articleData.article.size }}
                    </span>
                </div>

                <div 
                    id="hsn"
                    v-if="articleData.financial_breakup && 
                    articleData.financial_breakup &&
                    articleData.financial_breakup.hsn_code">
                    <span class="common-key-style">HSN: </span>
                    <span class="common-value-style">
                        {{ articleData.financial_breakup.hsn_code }}
                    </span>
                </div>

                <div 
                    id="service-taxes" 
                    v-if="articleData.gst_details">
                    <div 
                        id="cgst" 
                        v-if="
                            articleData.gst_details.cgst_tax_percentage !== undefined && 
                            articleData.gst_details.cgst_tax_percentage !== 0
                        ">
                        <span class="common-key-style">CGST: </span>
                        <span class="common-value-style">
                            {{ articleData.gst_details.cgst_tax_percentage }}%
                        </span>
                    </div>
                    <div id="sgst" 
                        v-if="
                            articleData.gst_details.sgst_tax_percentage !== undefined &&
                            +articleData.gst_details.sgst_tax_percentage !== 0
                        ">
                        <span class="common-key-style">SGST: </span>
                        <span class="common-value-style">
                            {{ articleData.gst_details.sgst_tax_percentage }}%
                        </span>
                    </div>
                    <div id="igst" 
                        v-if="
                            articleData.gst_details.igst_tax_percentage !== undefined &&
                            +articleData.gst_details.igst_tax_percentage !== 0
                        ">
                        <span class="common-key-style">IGST: </span>
                        <span class="common-value-style">
                            {{ articleData.gst_details.igst_tax_percentage }}%
                        </span>
                    </div>
                </div>

                <div id="bag-id" v-if="articleData.bag_id">
                    <span class="common-key-style">Bag ID: </span>
                    <span class="common-value-style">
                        {{ articleData.bag_id }}
                    </span>
                </div>

                <div id="external-bag-id" v-if="articleData.external_bag_id">
                    <span class="common-key-style">External Bag ID: </span>
                    <span class="common-value-style">
                        {{ articleData.external_bag_id }}
                    </span>
                </div>

                <div id="item-code" v-if="articleData.item.slug_key">
                    <span class="common-key-style">Item Code: </span>
                    <span class="common-value-style">
                        {{ articleData.item.code }}
                    </span>
                </div>

                <div id="article-id" v-if="articleData.article.uid">
                    <span class="common-key-style">Article ID: </span>
                    <span class="common-value-style">
                        {{ articleData.article.uid }}
                    </span>
                </div>

                <div 
                    id="mrp"
                    v-if="articleData.financial_breakup">
                    <span class="common-key-style">MRP: </span>
                    <span class="common-value-style">
                        ₹{{ formatPrice(articleData.financial_breakup.reduce((sum, f) => sum + f.price_marked, 0)) }}
                    </span>
                </div>

                <div
                    id="effective-price"
                    v-if="articleData.financial_breakup">
                    <span class="common-key-style">Price: </span>
                    <span class="common-value-style">
                        ₹{{ formatPrice(articleData.financial_breakup.brand_calculated_amount * articleData.quantity) }}
                    </span>
                </div>
            </div>
        </div>

        <div class="user-message" v-if="articleData.meta.custom_message">
            <div class="message-heading">
                <div class="title">Message</div>
                <inline-svg src="red-dot"></inline-svg>
            </div>
            <div class="box-message">
                <span class="message">{{ articleData.meta.custom_message }}</span>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import moment from 'moment';
import { NitrozenBadge } from '@gofynd/nitrozen-vue';

/* Component imports */
import InlineSvg from '@/components/common/inline-svg.vue';

/* Helper imports */
import { formatPrice } from '@/helper/utils.js';

export default {
    name: 'more-bag-info',
    props: {
        articleData: {
            type: Object,
        }
    },
    components: {
        InlineSvg,
        NitrozenBadge,
    },
    computed: {
        noOfReturnableDays () {
            let days = moment(this.articleData.returnable_date).diff(moment.utc(), 'days', true);
            return days > 0 && days < 1 ? Math.ceil(days) : days > 1 ? Math.ceil(days) : 0;
        }
    },
    methods: {
        formatPrice,
    }
}
</script>

<style lang="less" scoped>
.header {
    // border-bottom: 1px solid #E1E1E1;
    // margin-top: -2rem;
    // margin-left: -1.5rem;

    .title {
        font-weight: 600;
        font-size: 16px;
        line-height: 34px;
        color: #41434C;
        margin-bottom: 1rem;
    }

    .main-details {
        display: flex;

        .logo {
            // display: flex;
            // align-items: center;
            margin-right: 1rem;
            height: 72px;
            width: 72px;
            border: 0.5px solid #E4E5E6;
            border-radius: 4px;

            .item-logo {
                display: block;
                margin-left: auto;
                margin-right: auto;
                // margin-top: 15%;
                max-width: 50px;
                width: 100%;
            }
        }

        .item-general-info {
            display: flex;
            flex-direction: column;
            gap: 9px;
        }
    }
    .extra-info {
        margin-top: 2rem;

        .info {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .common-key-style {
            color: #9B9B9B;
            font-weight: 400;
            font-size: 12px;
        }

        .common-value-style {
            color: #41434C;
            font-weight: 400;
            font-size: 12px;
        }
    }

    .user-message {
        margin-top: 24px;

        .message-heading {
            display: flex;
            align-items: baseline;
            gap: 8px;
        }

        .box-message {
            border: 1px solid #F3F3F3;
            background: #F3F3F3;
            border-radius: 8px;
            height: auto;

            .message {
                font-weight: 500;
                font-size: 12px;
                line-height: 140%;
                display: flex;
                align-items: center;
                color: #41434C;
                margin: 1rem 1rem 1rem 1rem;
            }
        }
    }
}

#service-taxes {
    display: flex;
    column-gap: 1rem;
}

.ending-border {
    padding-bottom: 24px;
    border-bottom: 1px solid #E1E1E1;
}
</style>
