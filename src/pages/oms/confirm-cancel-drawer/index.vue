<template>
    <div class="confirm-drawer-container">
        <div class="header">
            <div class="title-container">
                <div 
                    class="serial-number-back-arrow" 
                    @click="goToPartialConfirmation" 
                    v-if="requireSerialNumbers && showSerialNumberForm">
                    <ukt-inline-svg :src="'oms-back-arrow'"></ukt-inline-svg>
                </div>
                <span class="title">{{ title }}</span>
            </div>
            <a class="cancel-btn" @click="close($event)">
                <ukt-inline-svg
                    :src="'cross-black'"
                ></ukt-inline-svg>
            </a>
        </div>

        <div class="content">
            <div class="cancel-confirm-summary">
                <p class="shipmentId">
                    Shipment ID : {{ shipmentId }}
                </p>
                <p class="info">
                    {{ infoMessage }}
                </p>
            </div>

            <div class="serial-numbers-container" v-if="requireSerialNumbers && showSerialNumberForm">
                <serial-numbers
                    :bags="bags"
                    @change="onSerialNumberChange"
                />
            </div>

            <div class="search-bar-container" v-if="!showSerialNumberForm">
                <nitrozen-input
                    type="text"
                    placeholder="Search by Seller Identifier, Item Code, Name"
                    v-model="searchText"
                    :showSearchIcon="true"
                    class="search-bar"
                />
            </div>

            <div class="rejection-container" v-if="showCancellation && !showSerialNumberForm">
                <cancelled-items 
                    class="container-rejection"
                    :items="bags"
                    :cancelClicked="this.cancel"
                    @allReasonsAdded="allReasonsAdded"
                    :fullCancellation="fullCancellation"
                ></cancelled-items>
            </div>

            <div class="confirmation-container" v-if="!cancel && !showSerialNumberForm">
                <p class="confirmation-container-title">
                    Confirmed Item(s)
                </p>
                
                <confirmation-table 
                    :columns="tableColumns"
                    :bags="bags"
                    :showCancelledItems="showCancellation"
                ></confirmation-table>
            </div>
        </div>

         <div class="footer" :id="requireSerialNumbers ? 'multiple-sections': null">
            <div v-if="requireSerialNumbers" class="multipe-sections-count">
                <span>
                    {{ showSerialNumberForm ? 2 : 1 }}/2
                </span>
            </div>
            <nitrozen-button
                class="apply-filter-button"
                v-flatBtn
                :theme="'secondary'"
                @click="goToSerialNumbersScreen"
                :disabled="disabled"
                v-if="requireSerialNumbers && !showSerialNumberForm"
            >Next</nitrozen-button>

            <nitrozen-button
                class="apply-filter-button"
                v-flatBtn
                :theme="'secondary'"
                @click="onSubmitClick()"
                :disabled="disabled"
                v-if="!requireSerialNumbers || (requireSerialNumbers && showSerialNumberForm)"
            >Submit</nitrozen-button>
        </div>
    </div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import {
    flatBtn, NitrozenButton, NitrozenInput
} from '@gofynd/nitrozen-vue';

/* Component imports */
import ConfirmationTable from './table.vue';
import CancelledItems from './cancelled-items.vue';
import SerialNumberItems from '@/pages/oms/confirm-cancel-drawer/serial-numbers.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';

/* Helper imports */
import { cancellationReasons } from '@/pages/oms/fixtures/cancellation-reasons.js';


const TABLE_COLUMNS = [
    {
        value: 'items_details',
        text: 'Item Details',
        sort: false
    },
    {
        value: 'seller_identifier',
        text: 'Seller Identifiers',
        sort: false
    },
    {
        value: 'quantity',
        text: 'Confirmed Quantity',
        sort: false
    },
    {
        value: 'total_price',
        text: 'Price',
        sort: false
    }
]

export default {
    name: 'confirm-cancel-drawer',
    props: {
        cancel: {
            type: Boolean,
            default: false
        },
        bags: {
            type: Array
        },
        shipmentId: {
            type: String
        }
    },
    components: {
        CancelledItems,
        ConfirmationTable,
        NitrozenButton,
        NitrozenInput,
        'serial-numbers': SerialNumberItems,
        UktInlineSvg
    },
    computed: {
        title() {
            if(this.bags) {
                let rejectedItems = this.bags.some(bag => bag.rejected !== 0);

                if(this.requireSerialNumbers && this.showSerialNumberForm) {
                    return `Serial Number`;
                }

                if(this.cancel) {
                    return `Cancellation Summary`;
                } else if(!this.cancel && rejectedItems) {
                    return `Summary of Partial Confirmation`;
                } else if(!this.cancel && !rejectedItems) {
                    return `Confirmation Summary`;
                }
            }
            // return this.cancel ? 'Cancel Shipment' : 'Confirm Shipment';
        },
        infoMessage() {
            let message = '';

            if(this.bags) {
                let rejectedItems = this.bags.some(bag => bag.rejected !== 0);
    
                if(this.cancel || rejectedItems) {
                    message = 'Please provide the reason for the cancelled items';
                } else {
                    message = 'Please check confirmation summary before you proceed';
                }
            }

            if(this.requireSerialNumbers && this.showSerialNumberForm) {
                message = `Please provide the serial number for below items`;
            }

            return message;
        },
        showCancellation() {
            if(this.cancel) return true;
            else {
                let rejectedItems = this.bags.some(bag => bag.rejected !== 0);
                if(!this.cancel && rejectedItems) return true;
                else return false;
            }
        },
        disabled() {
            if(!this.cancel && !this.onSubmission) {
                let noRejectedItems = this.bags.every(bag => bag.rejected === 0);
                if(noRejectedItems) {
                    return false;
                } else {
                    return this.allRejectionReasonsAdded ? false : true;
                }
            } else if(this.cancel && !this.onSubmission) {
                return this.allRejectionReasonsAdded ? false : true;
            } else if(this.onSubmission) {
                return true;
            }
        },
        fullCancellation() {
            let noRejectedItems = this.bags.every(bag => bag.rejected === 0);
            if(this.cancel && noRejectedItems) {
                return true;
            }
            return false;
        }
    },
    data() {
        return {
            allRejectionReasonsAdded: false,
            onSubmission: false,
            searchText: '',
            tableColumns: cloneDeep(TABLE_COLUMNS),
            requireSerialNumbers: false,
            showSerialNumberForm: false
        }
    },
    directives: {
        flatBtn
    },
    methods: {
        /**
         * Method to close the drawer by emitting close to the parent component
         * 
         * @author: Rushabh Mulraj Shah
         * @param {object} event The native event object
         */
        close(event) {
            this.$emit('close');
        },

        /**
         * A method to modify the flag which holds the boolean value to see if all the reasons for rejection
         * are added.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {boolean} flag A boolean value to change the data allRejectionReasonsAdded
         */
        allReasonsAdded(flag) {
            this.allRejectionReasonsAdded = flag;
        },

        /**
         * A method to create the shipment status payload for four scenarios (in the given order):
         * a) No bags are rejected by the user and the user has clicked on confirm
         * b) No bags are rejected by the user and the user has clicked on cancel
         * c) Some bags are rejected by the user and the user has clicked on cancel
         * d) Some bags are rejected by the user and the user has clicked on confirm
         * 
         * This method adds the products and the reasons to a shipment ID object that will be further emitted 
         * to the parent to wrap it with more information.
         * 
         * @author: Rushabh Mulraj Shah
         */
        getShipmentStatusPayload() {
            let statusArr = [];

            /**
             * Guidelines:
             * As per the latest structure shared by Rahul Rathod as of December 7, 2022,
             * The shipments payload that will be sent to the API for bag state change will contain
             * the following:
             * a) The 'shipments' key {Array} which will contain one or more shipments for bag-state change.
             *  - Every object inside the 'shipments' array will be a particlar shipment. It will have
             *  the following keys:
             *  a1) The 'identifier' key {String} which will contain the shipment ID.
             *  a2) The 'products' key {Array} will contain an array of objects storing every bag
             *  a3) The 'reasons' key {Object} will contain products divided by reasons and entities. 
             * b) The 'status' key {String} which will contain the next state
             * c) The 'exclude_bags_next_state' key {String} which will contain the excluding state.
             */

            let noRejectedBags = this.bags.every(bag => bag.rejected === 0);
            if(noRejectedBags && !this.cancel) {
                /* Case: No bags are rejected by user and he/she has clicked on confirm */

                /**
                 * Since there will be no cancellations, there will be no 'reasons' object,
                 * and the 'products' object will be empty
                 */
                let shipmentPayload = {
                    shipments: [
                        {
                            identifier: this.shipmentId,
                            products: []
                        }
                    ],
                    status: 'bag_confirmed',
                    exclude_bags_next_state: null
                };

                statusArr.push(shipmentPayload);
            } else if(noRejectedBags && this.cancel) {
                /* Case: No bags are rejected by user and he/she has clicked on cancel */
                let finalReasonsObj = {
                    products: [],
                    entities: []
                };

                if(this.bags.length === 1) {
                    /** 
                     * If there is only one bag, then no need to add data in the filters and 
                     * there will be only one reason 
                     * */
                    finalReasonsObj.products.push({
                        filters: [{}],
                        data: {
                            reason_id: this.bags[0].reasons[0].reason,
                            reason_text: cancellationReasons.store_manager.find(r => r.value === this.bags[0].reasons[0].reason).text
                        }
                    })
                } else if(this.bags.length > 1) {
                    /**
                     * If there are more than one bags, then we can have multiple reasons.
                     */
                    this.bags.forEach(bag => {
                        bag.reasons.forEach(reason => {
                            /** Check if the current reason is already created */
                            let currentReasonObj = finalReasonsObj.products.find(item => item.data.reason_id === reason.reason);
    
                            if(!isEmpty(currentReasonObj)) {
                                currentReasonObj.filters.push({
                                    line_number: bag.line_number,
                                    quantity: reason.quantity,
                                    identifier: bag.seller_identifier
                                });
                            } else {
                                let reasonObj = {
                                    filters: [
                                        {
                                            line_number: bag.line_number,
                                            quantity: reason.quantity,
                                            identifier: bag.seller_identifier
                                        }
                                    ],
                                    data: {
                                        reason_id: reason.reason,
                                        reason_text: cancellationReasons.store_manager.find(r => r.value === reason.reason).text
                                    }
                                }
                                finalReasonsObj.products.push(reasonObj);
                            }
                        })
                    })
                }

                let shipmentPayload = {
                    shipments: [
                        {
                            identifier: this.shipmentId,
                            products: [],
                            reasons: finalReasonsObj
                        }
                    ],
                    status: 'bag_not_confirmed',
                    exclude_bags_next_state: null
                }

                statusArr.push(shipmentPayload);
            } else if(!noRejectedBags && this.cancel) {
                /* Case: Some bags are rejected by user and he/she has clicked on cancel */

                /**
                 * As mentioned earlier, there will be a 'products' key and 'reasons' key. 
                 * a) The 'products' key will be an array of objects containing every bag identification and its 
                 * quantity of rejected items.
                 * b) The 'reasons' key will be an object having two keys 'products' and 'entities'.
                 *   - The 'products' inside 'reasons' will be an array of objects that is divided by reasons. 
                 *  Every object will have a key called 'data' that describes the reason, and another key called
                 *  'filters' which will have every bag's information like the bag info and the quantity of rejected items.
                 */

                let finalProductsObj = [];

                let finalReasonsObj = {
                    products: [],
                    entities: []
                };

                this.bags.forEach(bag => {
                    if(bag.rejected > 0) {
                        finalProductsObj.push({
                            line_number: bag.line_number,
                            quantity: bag.rejected,
                            identifier: bag.seller_identifier
                        });
                    }

                    bag.reasons.forEach(reason => {
                        /** Check if the current reason is already created */
                        let currentReasonObj = finalReasonsObj.products.find(item => item.data.reason_id === reason.reason);

                        if(!isEmpty(currentReasonObj)) {
                            currentReasonObj.filters.push({
                                line_number: bag.line_number,
                                quantity: reason.quantity,
                                identifier: bag.seller_identifier
                            });
                        } else {
                            let reasonObj = {
                                filters: [
                                    {
                                        line_number: bag.line_number,
                                        quantity: reason.quantity,
                                        identifier: bag.seller_identifier
                                    }
                                ],
                                data: {
                                    reason_id: reason.reason,
                                    reason_text: cancellationReasons.store_manager.find(r => r.value === reason.reason).text
                                }
                            }
                            finalReasonsObj.products.push(reasonObj);
                        }
                    })
                });

                let shipmentPayload = {
                    shipments: [
                        {
                            identifier: this.shipmentId,
                            products: finalProductsObj,
                            reasons: finalReasonsObj
                        }
                    ],
                    status: 'bag_not_confirmed',
                    exclude_bags_next_state: null
                };

                statusArr.push(shipmentPayload);
            } else if(!noRejectedBags && !this.cancel) {
                /* Case: Some bags are rejected by user and he/she has clicked on confirm */

                /**
                 * As mentioned earlier, there will be a 'products' key and 'reasons' key. 
                 * a) The 'products' key will be an array of objects containing every bag identification and its 
                 * quantity of rejected items.
                 * b) The 'reasons' key will be an object having two keys 'products' and 'entities'.
                 *   - The 'products' inside 'reasons' will be an array of objects that is divided by reasons. 
                 *  Every object will have a key called 'data' that describes the reason, and another key called
                 *  'filters' which will have every bag's information like the bag info and the quantity of rejected items.
                 */

                let finalProductsObj = [];

                let finalReasonsObj = {
                    products: [],
                    entities: []
                };

                this.bags.forEach(bag => {
                    if(bag.quantity - bag.rejected) {
                        finalProductsObj.push({
                            line_number: bag.line_number,
                            quantity: bag.quantity - bag.rejected,
                            identifier: bag.seller_identifier
                        });
                    }

                    bag.reasons.forEach(reason => {
                        /** Check if the current reason is already created */
                        let currentReasonObj = finalReasonsObj.products.find(item => item.data.reason_id === reason.reason);

                        if(!isEmpty(currentReasonObj)) {
                            currentReasonObj.filters.push({
                                line_number: bag.line_number,
                                quantity: reason.quantity,
                                identifier: bag.seller_identifier
                            });
                        } else {
                            let reasonObj = {
                                filters: [
                                    {
                                        line_number: bag.line_number,
                                        quantity: reason.quantity,
                                        identifier: bag.seller_identifier
                                    }
                                ],
                                data: {
                                    reason_id: reason.reason,
                                    reason_text: cancellationReasons.store_manager.find(r => r.value === reason.reason).text
                                }
                            }
                            finalReasonsObj.products.push(reasonObj);
                        }
                    })
                })

                let shipmentPayload = {
                    shipments: [
                        {
                            identifier: this.shipmentId,
                            products: finalProductsObj,
                            reasons: finalReasonsObj
                        }
                    ],
                    status: 'bag_confirmed',
                    exclude_bags_next_state: 'bag_not_confirmed'
                }

                statusArr.push(shipmentPayload);
            }

            return statusArr;
        },

        /**
         * A method to activate the flag to go back from the serial number form to
         * the summary page
         * 
         * @author: Rushabh Mulraj Shah
         */
        goToPartialConfirmation() {
            this.showSerialNumberForm = false;
        },

        /**
         * A method to activate the flag to go to the serial number form from the 
         * summary page
         * 
         * @author: Rushabh Mulraj Shah
         */
        goToSerialNumbersScreen() {
            this.showSerialNumberForm = true;
        },

        /**
         * A method handler when the user enters a serial number value
         * 
         * @author: Rushabh Mulraj Shah
         */
        onSerialNumberChange(bags) {
            console.log("onSerialNumberChange | bags:   ", bags);
        },

        /**
         * Create the final payload object and emit the parent about 
         * the shipment update
         * 
         * @author: Rushabh Mulraj Shah
         */
        sendShipmentUpdate() {
            let payload = {  
                statuses: this.getShipmentStatusPayload(),
                task: false,
                force_transition: false,
                lock_after_transition: false,
                unlock_before_transition: false
            }
            this.$emit('updateStatus', payload);
        },

        /**
         * A method to handle clicking of submit in the confirm-cancel-drawer.
         * It checks whether all the reasons have been added in case of cancellation before
         * creating the necessary object and sending it forth to the parent component for 
         * hitting the API.
         * 
         * It handles the following four scenarios (in the given order):
         * a) If the user has not clicked cancel and there are no rejected bags
         * b) If the user has not clicked cancel and there are a few rejected bags
         * c) If the user has clicked cancel and there are no rejected bags
         * d) If the user has clicked cancel and there are a few rejected bags.
         * 
         * @author: Rushabh Mulraj Shah
         */
        onSubmitClick() {
            let noRejectedBags = this.bags.every(bag => bag.rejected === 0);
            this.onSubmission = true;

            if(!this.cancel) {
                /* If cancel button is not clicked */
                if(noRejectedBags) {
                    /* If there are no rejected bags */
                    this.sendShipmentUpdate();
                } else {
                    /* If there are a few rejected bags */
                    let rejectedBags = this.bags.filter(bag => bag.rejected > 0);
                    let allReasonsAdded = rejectedBags.every(item => {
                        let totalReasons = item.reasons.reduce((total, reason) => {
                            return total + reason.quantity;
                        }, 0);
                        return totalReasons === item.rejected;
                    });
                    if(allReasonsAdded) {
                        this.sendShipmentUpdate();
                    } else {
                        this.$snackbar.global.showError('All reasons have not been added for rejections');
                    }
                }
            } else {
                /* If cancel button is clicked */
                if(noRejectedBags) {
                    /* If there are no rejected bags */
                    let allReasonsAdded = this.bags.every(item => {
                        let totalReasons = item.reasons.reduce((total, reason) => {
                            return total + reason.quantity;
                        }, 0);
                        return totalReasons === item.quantity;
                    });
                    if(allReasonsAdded) {
                        this.sendShipmentUpdate();
                    } else {
                        this.$snackbar.global.showError('All reasons have not been added for rejections');
                    }
                } else {
                    /* If there are a few rejected bags */
                    let rejectedBags = this.bags.filter(bag => bag.rejected > 0);
                    let allReasonsAdded = rejectedBags.every(item => {
                        let totalReasons = item.reasons.reduce((total, reason) => {
                            return total + reason.quantity;
                        }, 0);
                        return totalReasons === item.rejected;
                    });
                    if(allReasonsAdded) {
                        this.sendShipmentUpdate();
                    } else {
                        this.$snackbar.global.showError('All reasons have not been added for rejections');
                    }
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
.confirm-drawer-container {
    height: 100%;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
        border: 1px solid #E0E0E0;

        .title {
            font-size: 18px;
        }

        .cancel-btn {
            cursor: pointer;
        }
    }

    .content {
        height: calc(100% - 90px - 90px);
        padding: 24px;
        padding-bottom: 80px;
        overflow-y: scroll;

        .cancel-confirm-summary {
            display: flex;
            flex-direction: column;
            // border-bottom: 1px solid #E0E0E0;
            margin-bottom: 24px;

            .shipmentId {
                font-size: 14px;
                margin-bottom: 12px;
            }

            .info {
                font-size: 16px;
                margin-bottom: 1rem;
            }
        }

        .confirmation-container {
            // border: 1px solid #E0E0E0;
            // border-radius: 4px;
            // padding: 20px 16px;

            .confirmation-container-title {
                margin-bottom: 1rem;
            }
        }
    }

    .footer {
        position: fixed;
        width: inherit;
        bottom: 0;
        background: #FFFFFF;
        box-shadow: 0px -1px 12px rgba(0, 0, 0, 0.05);
        padding: 16px 24px;
        min-width: 60%;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}

.search-bar-container {
    margin-bottom: 24px;

    ::v-deep .n-input {
        border-radius: 4px;
    }
}

.multipe-sections-count {
    font-size: 12px;
    line-height: 21px;
    font-weight: 600;
    color: #979797;
}

#multiple-sections {
    justify-content: space-between;
}

.title-container {
    display: flex;
}

.serial-number-back-arrow {
    margin-right: 20px;
}
</style>
