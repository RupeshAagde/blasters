<template>
    <div class="change-bag-state-container">
        <loader v-if="fetchingBagStates" />

        <adm-no-content 
            class="no-states"
            v-if="bagStates.length === 0 || bagStateFetchError"
            :helperText="'No states available'" />

        <div class="change-bag-state-body" v-else>
            <div class="dropdowns" v-if="showRemarkAndBagStateOptions">
                <nitrozen-dropdown
                    label="Next Bag State"
                    :searchable="true"
                    @change="onStateChange"
                    :items="bagStateOptions"
                    v-model="selectedState"
                    @searchInputChange="onSearchState($event)"
                />
                <nitrozen-dropdown
                    label="Reason"
                    :searchable="true"
                    @change="onReasonChange"
                    :items="reasonOptions"
                    v-model="selectedReason"
                    @searchInputChange="onSearchReason($event)"
                    v-if="showReasons"
                />
                <div class="user-input-first">
                    <nitrozen-input
                        v-if="checkForReturnInitiatedState"
                        :type="'textarea'"
                        label="Remark"
                        v-model="note"
                        placeholder="(Min. 10 characters)"
                        :disabled="false"
                        @input="onRemarkChange"
                    />
                </div>
            </div>

           <div class="invoice-input">
            <nitrozen-input
                    v-if="inputStates.includes(selectedState) && selectedState == 'bag_invoiced'"
                    :type="'textarea'"
                    label="Invoice"
                    v-model="invoiceId"
                    placeholder="Please enter invoice id"
                    :disabled="false"
                    @input="onInputChange"
                    @change="invoiceValidation"
                />

           </div>
            <div class="user-input" v-if="!checkForReturnInitiatedState">
                <nitrozen-input
                    :type="'textarea'"
                    label="Remark"
                    v-model="note"
                    placeholder="(Min. 10 characters)"
                    :disabled="false"
                    @input="onRemarkChange"
                />
            </div>
            <template v-if="checkForReturnInitiatedState">
                <return-journey-panel 
                    ref="return-journey-panel"
                    :status="shipment.status.status" 
                    @closeReturnPanel="closeReturnPanel" 
                    @updateStatusOfFooter="updateStatusOfFooter"
                    @isVerified="isVerified"
                    @openRefundDrawer="openRefundDrawer"
                    @callOrderDetails="callOrderDetails"
                    @isHide="isHide"></return-journey-panel>
            </template>
        </div>
    </div>
</template>

<script>
/**
 * Component for changing the state of a shipment.
 * 
 * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
 */

/* Package imports */
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

/* Components imports */
import AdmNoContent from '@/components/common/adm-no-content';
import InlineSvg from '@/components/common/inline-svg.vue';
import Loader from '@/components/common/loader.vue';
import ReturnJourneyPanel from '../credit-notes-pos/index.vue';

/* Service imports */
import OrdersService from '@/services/orders.service.js';

/* Helper imports */
import { convertSnakeCaseToString } from '@/helper/utils.js';

export default {
    name: "change-bag-state",
    props: {
        shipment: Object
    },
    data() {
        return {
            allBagStates: {},
            bagStates: [],
            bagStateOptions: [],
            bagStateFetchError: false,
            fetchingBagStates: false,
            note: '',
            reasons: [],
            reasonOptions: [],
            selectedReason: '',
            selectedState: '',
            inputStates: [],
            invoiceId: '',
            showRemarkAndBagStateOptions: true
        }
    },
    components: {
        AdmNoContent,
        InlineSvg,
        Loader,
        NitrozenDropdown,
        NitrozenInput,
        ReturnJourneyPanel
    },
    mounted() {
        this.$emit('showCreditNoteReturn', false);
        this.$emit('isHide', true);
        this.$emit('isVerified', true);
        if(this.shipment && this.shipment.next_possible_states){
            this.inputStates = Object.keys(this.shipment.next_possible_states)
        }
        this.fetchBagStates();
    },
    computed: {
        checkForReturnInitiatedState() {
            return this.shipment.status.current_shipment_status == 'delivery_done' && this.selectedState == 'return_initiated';
            // return ((this.shipment.status.current_shipment_status == 'handed_over_to_customer' || 
            // this.shipment.status.current_shipment_status == 'delivery_done') && this.selectedState == 'return_initiated');
        },
        showReasons() {
            let validStates = ['bag_not_confirmed', 'cancelled_fynd', 
                                'cancelled_seller', 'cancelled_customer', 
                                'return_initiated', "bag_lost", 
                                "return_bag_lost", "dead_stock", 
                                "deadstock","deadstock_defective"];
            
            if(this.checkForReturnInitiatedState) {
                this.$emit('showCreditNoteReturn', true);
                return false;
            }
            else {
                return validStates.includes(this.selectedState);
            }
        }
    },
    methods: {
        isHide(e) {
            this.$emit('isHide', e);
        },
        isVerified(e) {
            this.$emit('isVerified', e);
        },
        updateStatusOfFooter(e) {
            this.$emit('updateStatusOfFooter', e);
        },
        ProceedBtn() {
            this.showRemarkAndBagStateOptions = false;
            this.$refs['return-journey-panel'].ProceedBtn();
        },
        registerUser() {
            this.$refs['return-journey-panel'].registerUser();
        },
        closeReturnPanel() {
            this.$emit("closeDrawer", true)
        },
        openRefundDrawer(e) {
            this.$emit('openRefundDrawer', e)
        },
        callOrderDetails() {
            this.$emit('callOrderDetails', false);
        },
        /**
         * Method to emit changes of the input boxes to the parents.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        emitChange() {
            this.$emit(
                'change',
                {
                    state: this.selectedState ? this.selectedState : '',
                    reason: this.selectedReason ? this.selectedReason : '',
                    remark: this.note ? this.note : '',
                    store_invoice_id: this.invoiceId || ''
                }
            );
        },

        /**
         * Method to fetch the states of the bags.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        fetchBagStates() {
            this.fetchingBagStates = true;

            return OrdersService.getStatesForBagTranistion()
            .then(response => {
                if(response.data && response.data.fynd && !isEmpty(response.data.fynd)) {
                    this.allBagStates = cloneDeep(response.data.fynd);
                    if(
                        this.shipment &&
                        this.shipment.status &&
                        this.shipment.status.current_shipment_status
                    ) {
                        let currentState = response.data.fynd[this.shipment.status.current_shipment_status];
                        if(currentState.length) {
                            this.bagStates = currentState.map(state => {
                                return {
                                    text: convertSnakeCaseToString(state),
                                    value: state
                                }
                            });
                        } else this.bagStates = [];
                        this.bagStateOptions = this.bagStates;
                        this.bagStateFetchError = false;
                    } else {
                        console.error("Error in fetching the states for bag state transition:   ", "No status available in shipment");
                        this.$snackbar.global.showError(
                            `We are unable to fetch the states for bag transitions. Kindly try again after some time.`,
                            3000
                        );
                        this.bagStateFetchError = true;
                    }
                } else {
                    console.error("Error in fetching the states for bag state transition:   ", response);
                    this.$snackbar.global.showError(
                        `We are unable to fetch the states for bag transitions. Kindly try again after some time.`,
                        3000
                    );
                    this.bagStateFetchError = true;
                }
            })
            .catch(error => {
                console.error("Error in fetching the states for bag state transition:   ", error);
                this.$snackbar.global.showError(
                    `We are unable to fetch the states for bag transitions. Kindly try again after some time.`,
                    3000
                );
                this.bagStateFetchError = true;
            }).
            finally(() => {
                this.fetchingBagStates = false;
            })
        },

        /**
         * Method to fetch the list of reasons.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        fetchReasons() {
            if(
                this.shipment && 
                !isEmpty(this.shipment) && 
                this.shipment.shipment_id && 
                this.shipment.bags && 
                this.shipment.bags.length
            ) {
                return OrdersService.fetchSupportingReasons(this.shipment.shipment_id, this.shipment.bags[0].bag_id, this.selectedState)
                .then(response => {
                    if(response.data && response.data.success && response.data.reasons) {
                        if(response.data.reasons.length) {
                            this.reasons = response.data.reasons.map(reason => {
                                reason['text'] = reason.display_name;
                                reason['value'] = reason.id;
                                return reason;
                            });
                            this.reasonOptions = this.reasons
                        } else {
                            this.reasons = [];
                        }
                    } else {
                        /* If the success value received in the response is false */
                        console.error("Error in fetching the reasons for bag state change:   ", response);
                        this.$snackbar.global.showError(
                            `We are unable to fetch the reasons required for changing the state`,
                            3000
                        );
                    }
                })
                .catch(error => {
                    /* If the fetch request fails */
                    console.error("Error in fetching the reasons for bag state change:   ", error);
                    this.$snackbar.global.showError(
                        `We are unable to fetch the reasons required for changing the state`,
                        3000
                    );
                })
            } else {
                /* If the required data of shipment and bag doesn't exist */
                console.error(
                    "We are unable to fetch reasons as the received shipment does not have all the required information:  ", 
                    this.shipment
                );
                this.$snackbar.global.showError(
                    `Unable to fetch the reasons required for the bag state change`,
                    3000
                );
            }
        },

        /**
         * Event handler for change in reason.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        onReasonChange() {
            this.emitChange();
        },
        /**
         * Event handler for change in store invoice id.
         * 
         * @author Sameer Shaikh <rushabhmshah@gofynd.com>
         */

        onInputChange(){
            this.emitChange();
        },
        invoiceValidation(){
            let regex = new RegExp(/^([a-zA-Z1-9]{1}[a-zA-Z0-9\/-]{0,15})$/);
            if(!regex.test(this.invoiceId)){
                this.$snackbar.global.showError('Invalid Invoice no: Only A-Z, a-z, 0-9, /, - without spaces and max 16 length are allowed'
                );
            }

        },
        /**
         * Event handler for change in remarks.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        onRemarkChange() {
            this.emitChange();
        },
        onSearchState(event){
            let text = event.text.trim().toLowerCase();
            if(text){
                this.bagStateOptions = this.bagStates.filter(s => s.text.toLowerCase().includes(text));
            } else {
                this.bagStateOptions = this.bagStates;
            }
        },
        onSearchReason(event){
            let text = event.text.trim().toLowerCase();
            if(text){
                this.reasonOptions = this.reasons.filter(s => s.text.toLowerCase().includes(text));
            } else {
                this.bagStateOptions = this.reasons;
            }
        },
        /**
         * Event handler for change in state.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        onStateChange(e) {
            if(e == 'manual_refund'){
                this.$emit('showCreditNoteReturn', false);
            }
            this.emitChange();
            this.fetchReasons();
        }
    }
}
</script>

<style lang="less" scoped> 

.invoice-input ::v-deep .n-input-textarea{
    line-height: 21px;
    padding-top: 6px;
    height: 36px;
}
.user-input{
    margin-top: 10px;
}
.user-input-first {
    ::v-deep .n-input-textarea {
        height: 40px;
        line-height: 21px;
        padding-top: 10px;
    }
}
.change-bag-state-container {
    position: relative;
}

.change-bag-state-body {
    .dropdowns {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 1rem;

        ::v-deep .nitrozen-select__trigger {
            font-size: 12px;
        }
    }
}

.no-states {
    ::v-deep img {
        width: 100%;
        height: auto;
    }
}
</style>