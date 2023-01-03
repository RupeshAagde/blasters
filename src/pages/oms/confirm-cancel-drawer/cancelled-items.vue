<template>
    <div class="cancelled-items-container">
        <div
            v-for="item in items" 
            :key="item.bag_id"
        >
            <div class="cancelled-items" v-if="showItemCancellation || (!showItemCancellation && item.rejected > 0) || (!cancelClicked && item.rejected > 0)" >
                <div 
                    class="cancelled-items-content">
                    <div class="left-container">
                        <div class="item-header">
                            <span>
                                {{ item.entity_type == 'set' ? item.products[0].item.name : item.item.name }} ({{ item.quantity }} {{ item.quantity === 1 ? 'item' : 'items'}})
                            </span>
                        </div>
                        <div class="item-content">
                            <div class="item-image-container">
                                <img v-if="item.entity_type == 'set'"
                                    class="item-img"
                                    :src="item.products[0].item.images[0]" 
                                    :alt="item.products[0].item.name">
                                <img v-else
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
                                <div class="detail" v-if="item.entity_type == 'set' && item.products[0].item.code">
                                    <span class="label">Item code:</span>
                                    <span class="value">{{ item.products[0].item.code }}</span>
                                </div>
                                <div class="detail" v-if="item.entity_type != 'set' && item.item.code">
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
                            <span class="header-text">Enter the quantity for which you want to specify reason</span>
                        </div>

                        <rejection-reason-box
                            class="reason-rejection-box"
                            :total_quantity="cancelClicked ? (!showItemCancellation ? item.rejected : item.quantity) : item.rejected"
                            :rejected_quantity="item.rejected"
                            :isSet="item.entity_type == 'set'"
                            :id="item.entity_type == 'set' ? item.products[0].bag_id : item.bag_id"
                            @bagReasonsAdded="bagReasonsAdded"
                            :full_cancellation="fullCancellation"
                        ></rejection-reason-box>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';

/* Component imports */
import RejectionReasonBox from './rejection-reason-box.vue';

export default {
    name: 'cancelled-items',
    props: {
        items: Array,
        cancelClicked: Boolean,
        fullCancellation: Boolean
    },
    components: {
        'rejection-reason-box': RejectionReasonBox
    },
    computed: {
        showItemCancellation() {
            if(this.cancelClicked) {
                let allRejectedItems = this.items.every(item => item.rejected === 0);
                if(allRejectedItems) return true;
                else return false;
            }
        }
    },
    methods: {
        bagReasonsAdded(allQty, id, reasons) {
            if(allQty) {
                let updatedReasons = cloneDeep(reasons);
                updatedReasons.forEach(reason => delete reason.max);
                let updatedBag = this.items.find(bag => {
                    if(bag.entity_type == 'set') return bag.products[0].bag_id == id;
                    else return bag.bag_id === id;
                });
                updatedBag.reasons = updatedReasons;
    
                if(this.cancelClicked) {
                    /* We are on this component because the user has specifically clicked on Cancel button */

                    /* 
                        We check if the user has come to the component without choosing any rejected items, i.e.,
                        the user has not added any rejected items and directly clicked on Cancel with the intention
                        to either cancel all or decide which items should be cancelled in this component.
                    */
                    let cancelAll = this.items.every(item => item.rejected === 0);

                    if(cancelAll) {
                        let allReasonsAdded = this.items.every(item => {
                            let totalReasons = item.reasons.reduce((total, reason) => {
                                return total + reason.quantity;
                            }, 0);
                            return totalReasons === item.quantity;
                        });
                        if(allReasonsAdded) {
                            this.$emit('allReasonsAdded', true);
                        } else {
                            this.$emit('allReasonsAdded', false);
                        }
                    } else {
                        /* If the user has not chosen to cancel all items */
                        
                        /* Filter out bags which have rejected values */
                        let toBeRejectedBags = this.items.filter(item => item.rejected > 0);

                        /* Check if all the reasons are rejected */
                        let allReasonsAdded = toBeRejectedBags.every(item => {
                            let totalReasons = item.reasons.reduce((total, reason) => {
                                return total + reason.quantity;
                            }, 0);
                            return totalReasons === item.rejected;
                        });

                        if(allReasonsAdded) {
                            this.$emit('allReasonsAdded', true);
                        } else {
                            this.$emit('allReasonsAdded', false);
                        }

                    }
                } else {
                    /* 
                        We are on this component because the user has clicked on Confirm button but 
                        has selected a few items to reject.
                    */

                    let toBeRejectedBags = this.items.filter(item => item.rejected > 0);

                    // let allReasonsAdded = this.items.every(item => {
                    let allReasonsAdded = toBeRejectedBags.every(item => {
                        let totalReasons = item.reasons.reduce((total, reason) => {
                            return total + reason.quantity;
                        }, 0);
                        return totalReasons === item.rejected;
                    });
                    if(allReasonsAdded) {
                        this.$emit('allReasonsAdded', true);
                    } else {
                        this.$emit('allReasonsAdded', false);
                    }
                }
            } else {
                this.$emit('allReasonsAdded', false);
            }
        }
    }
}
</script>

<style lang="less" scoped>
.cancelled-items-container {
    .cancelled-items {
        padding: 16px;
        border-bottom: 1px solid #E0E0E0;

        &:last-child {
            border-bottom: none;
        }

        .cancelled-items-content {
            display: grid;
            grid-template-columns: repeat(2, 1fr);

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
                    margin-bottom: 16px;

                    .header-text {
                        font-size: 14px;
                    }
                }
            }
        }
    }
}
</style>
