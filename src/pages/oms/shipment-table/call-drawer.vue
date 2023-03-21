<template>
    <div class="call-drawer-head">
        <div class="caller-container">
            <nitrozen-input
                class="call-from"
                :type="'tel'"
                label="From"
                v-model="caller"
                placeholder="Caller"
                @change="onCallerChange"
            ></nitrozen-input>
            <nitrozen-error v-if="invalidNumber">
                You can only use digits 0-9 to enter a number
            </nitrozen-error>
        </div>

        <nitrozen-dropdown
            class="call-to"
            label="To"
            :items="receiversList"
            v-model="receiver"
            placeholder="Receiver"
            @change="onReceiverChange"
        />        
    </div>
</template>

<script>
/**
 * A method to call a user using Avis services.
 * 
 * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
 */

/* Package imports */
import { NitrozenDropdown, NitrozenError, NitrozenInput } from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

/* Components import */
import InlineSvg from '@/components/common/inline-svg.vue';

/* Service imports */
import OrderService from '@/services/orders.service.js';


export default {
    name: "call-drawer",
    data() {
        return {
            caller: '',
            callerId: '',
            checkForCallerId: '',
            invalidNumber: false,
            receiver: '',
            receiversList: []
        }
    },
    props: {
        shipment: {
            type: Object
        } 
    },
    components: {
        InlineSvg,
        NitrozenDropdown,
        NitrozenError,
        NitrozenInput
    },
    mounted() {
        this.addReceivers();
    },
    methods: {
        /**
         * Method to add receivers to dropdown.
         * Currently, as of January 10, 2023, we are taking only the
         * user's number and the fulfilling store's number.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        addReceivers() {
            if(this.shipment !== undefined && !isEmpty(this.shipment)) {
                let receivers = [];
                if(this.shipment.user && this.shipment.user.mobile) {
                    let user = this.shipment.user;
                    let text = `${this.shipment.user.mobile}`;
                    if(user.first_name && user.last_name) {
                        text += ` (${user.first_name} ${user.last_name} - User)`;
                    } else {
                        text += ` (User)`;
                    }

                    receivers.push({
                        text: text,
                        value: user.mobile
                    });
                }
                
                if(this.shipment.fulfilling_store && this.shipment.fulfilling_store.phone) {
                    let fulfillingStore = this.shipment.fulfilling_store;
                    let text = `${fulfillingStore.phone}`;
                    if(fulfillingStore.name) text += ` (${fulfillingStore.name} - Fulfilling Store)`;
                    else text += ` (Fulfilling Store)`;

                    receivers.push({
                        text: text,
                        value: fulfillingStore.phone
                    });
                }

                this.receiversList = cloneDeep(receivers);
            }
        },

        /**
         * Method to call the customer.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        callCustomer() {
            let firstBag = '';
            if(this.shipment && this.shipment.bags && this.shipment.bags.length) {
                firstBag = this.shipment.bags[0].bag_id;
            }
            let queryParams = {
                caller: this.caller,
                receiver: this.receiver,
                bag_id: firstBag,
                callingTo: 'to Customer'
            };

            return OrderService.callCustomer(queryParams)
            .then(() => {
                this.$snackbar.global.showSuccess(`Calling ${this.receiver} from ${this.caller}`, 3000);
            })
            .catch(error => {
                console.error(`Unable to place a call to ${this.receiver}`, error);
                this.$snackbar.global.showError(
                    `Unable to place a call to the ${this.receiver}`,
                    3000
                );
            })
        },

        /**
         * Method to check the validity of a number.
         * Currently, we are only checking if the user has entered digits and if 
         * the length of the number is 10.
         * If the user has entered any alphabet or a symbol, it will return false.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @param {Number} value The value entered by the user in the input for caller.
         * @returns A boolean value showing whether a number is valid.
         */
        checkValidityOfNumber(value) {
            let regExp = /^\d+$/;
            return value.toString().length === 10 && regExp.test(value);
        },

        /**
         * Method to emit the change of values to the parent.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        emitChange() {
            this.$emit('change', {
                caller: this.caller,
                receiver: this.receiver
            });
        },

        /**
         * Method to handle change in the value of caller input.
         * It will be triggered if the user has pressed the "Enter" key or
         * if the input box goes out of focus.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @param {Object} event The native event object shared by the native HTML element.
         */
        onCallerChange(event) {
            if(event.target.value.toString().length === 0) {
                /* If the user has cleared the text or if it is empty by default */
                this.invalidNumber = false;
                this.emitChange();
            } else {
                let validNumber = this.checkValidityOfNumber(event.target.value);
                if(validNumber) {
                    /* If the number is valid */
                    this.invalidNumber = false;
                    this.emitChange();
                } else {
                    /* If the number is invalid */
                    this.invalidNumber = true;
                    this.$snackbar.global.showError('The number you have entered is not valid', 3000);
                }
            }
        },

        /**
         * Method to handle the change in the value of the receiver dropdown.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        onReceiverChange() {
            this.emitChange();
        }
    }
}
</script>

<style lang="less" scoped> 
.call-drawer-head{
    display: flex;
    flex-direction: column;
    gap: 24px;
}

::v-deep .nitrozen-form-input {
    .nitrozen-input-grp {
        .n-input-textarea {
            height: unset;
        }
    }
}

</style>