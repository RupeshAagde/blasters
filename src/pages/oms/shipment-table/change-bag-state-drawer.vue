<template>
    <div class="change-bag-state-container">
        <loader v-if="fetchingBagStates" />

        <adm-no-content 
            class="no-states"
            v-if="bagStates.length === 0 || bagStateFetchError"
            :helperText="'No states available'" />

        <div class="change-bag-state-body" v-else>
            <div class="dropdowns">
                <nitrozen-dropdown
                    class=""
                    label="Next Bag State"
                    @change="onStateChange"
                    :items="bagStates"
                    v-model="selectedState"
                />
                <nitrozen-dropdown
                    class=""
                    label="Reason"
                    @change="onReasonChange"
                    :items="reasons"
                    v-model="selectedReason"
                    v-if="showReasons"
                />
            </div>

            <div class="user-input">
                <nitrozen-input
                    :type="'textarea'"
                    label="Remark"
                    v-model="note"
                    placeholder="(Min. 10 characters)"
                    :disabled="false"
                    @change="onRemarkChange"
                />
            </div>
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

/* Service imports */
import OrdersService from '@/services/orders.service.js';

export default {
    name: "change-bag-state",
    props: {
        shipment: Object
    },
    data() {
        return {
            bagStates: [],
            bagStateFetchError: false,
            fetchingBagStates: false,
            note: '',
            reasons: [],
            selectedReason: '',
            selectedState: '',
        }
    },
    components: {
        AdmNoContent,
        InlineSvg,
        Loader,
        NitrozenDropdown,
        NitrozenInput
    },
    mounted() {
        this.fetchBagStates();
        this.fetchReasons();
    },
    computed: {
        showReasons() {
            let validStates = ['bag_not_confirmed', 'cancelled_fynd', 'cancelled_seller', 'cancelled_customer'];
            return validStates.includes(this.selectedState);
        }
    },
    methods: {
        /**
         * Method to emit changes of the input boxes to the parents.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        emitChange() {
            this.$emit(
                'change',
                {
                    state: this.state,
                    reason: this.reason,
                    remark: this.note
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
                if(response.data && response.data.items) {
                    this.bagStates = cloneDeep(response.data.items);
                    this.bagStateFetchError = false;
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
                return OrdersService.fetchReassignedStoreReasons(this.shipment.shipment_id, this.shipment.bags[0].bag_id)
                .then(response => {
                    if(response.data && response.data.success) {
                        this.reasons = response.data.reasons.map(reason => {
                            reason['text'] = reason.display_name;
                            reason['value'] = reason.id;
                            return reason;
                        });
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
         * Event handler for change in remarks.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        onRemarkChange() {
            this.emitChange();
        },

        /**
         * Event handler for change in state.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        onStateChange() {
            this.emitChange();
        }
    }
}
</script>

<style lang="less" scoped> 
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