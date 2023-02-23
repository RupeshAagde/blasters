<template>
    <div class="global-debug-shipment-container">
        <div class="filter-section">
            <div class="filters">
                <nitrozen-input
                    :label="'Mobile Number'"
                    class="filter-item"
                    v-model="mobileNumber"
                    :placeholder="'Enter Number'"
                />
                <nitrozen-input
                    :label="'Fynd Order ID'"
                    class="filter-item"
                    v-model="orderId"
                    :placeholder="'Enter ID'"
                    @change="onAddingOrderID"
                />
                <date-picker
                    label="Date Range"
                    class="date-picker filter-item"
                    picker_type="date"
                    date_format="MMM Do, YY"
                    v-model="dateRange"
                    :clearable="false"
                    :range="true"
                    :not_before="notBefore"
                    :shortcuts="dateRangeShortcuts"
                    :not_after="new Date().toISOString()"
                    :useNitrozenTheme="true"
                />
            </div>
            <div class="filters-action-section">
                <nitrozen-button
                    theme="secondary"
                    v-flatBtn
                    @click="applyDebugFilters"
                    :disabled="this.orderId === undefined || this.orderId.length === 0"
                >
                    Submit
                </nitrozen-button>
            </div>
        </div>
        <div class="list-section">
            <debug-shipment-list 
                v-if="
                    orderId !== undefined && 
                    orderId.length > 0 && 
                    shipmentInfo && 
                    shipmentInfo.length > 0 &&
                    !shipmentInfoError
                "
                :data="shipmentInfo"
            />
            <shimmer :count="4" v-if="loadingShipmentInfo" />
            <adm-no-content 
                :helperText="`No shipments found for order ID: ${this.orderId}`" 
                v-if="shipmentInfo && shipmentInfo.length === 0 && !shipmentInfoError" />
            <page-error
                :errorText="`Unable to fetch debug information for order ID: ${this.orderId}`"
                v-if="shipmentInfoError"
                @tryAgain="fetchDebugShipmentInfo"
            />
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    flatBtn, NitrozenButton, NitrozenInput
} from '@gofynd/nitrozen-vue';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';

/* Component imports */
import AdmNoContent from '@/components/common/adm-no-content.vue';
import DebugShipmentList from '@/pages/oms/global-debug-shipment/global-debug-shipment-list.vue';
import DatePicker from '@/components/common/date-picker.vue';
import PageError from '@/components/common/page-error';
import Shimmer from '@/components/common/shimmer.vue';

/* Helper imports */
import { dateRangeShortcuts } from '@/helper/datetime.util';

/* Mock imports */
import GlobalDebugShipmentMock from '@/pages/oms/mocks/global-debug-shipment.json';


export default {
    name: 'global-debug-shipment',
    components: {
        AdmNoContent,
        DatePicker,
        'debug-shipment-list': DebugShipmentList,
        NitrozenButton,
        NitrozenInput,
        PageError,
        Shimmer
    },
    directives: { flatBtn },
    data() {
        return {
            dateRange: [
                moment().subtract(1, 'weeks').toISOString(),
                moment().toISOString(),
            ],
            dateRangeShortcuts: [...dateRangeShortcuts],
            loadingShipmentInfo: false,
            mobileNumber: '',
            notBefore: moment().subtract(3, 'months').toISOString(),
            orderId: '',
            shipmentInfo: undefined,
            shipmentInfoError: false
        }
    },
    methods: {
        /**
         * Event handler for the submit button click
         * 
         * @author: Rushabh Mulraj Shah
         */
        applyDebugFilters() {
            if(this.orderId) {
                this.fetchDebugShipmentInfo();
            }            
        },

        /**
         * Method to make an API request to fetch shipment-level
         * debug information for an order
         * 
         * @author: Rushabh Mulraj Shah
         */
        fetchDebugShipmentInfo() {
            /* Set parameters to be sent to the request */
            let params = {
                from_date: this.dateRange[0],
                to_date: this.dateRange[1]
            };
            if(this.orderId !== undefined) params['order_id'] = this.orderId;
            if(this.mobileNumber !== undefined) params['mobile_number'] = this.mobileNumber;

            /* Start the loading */
            this.loadingShipmentInfo = true;

            /* Make the API reqeuest */
            let request = new Promise(resolve => {
                setTimeout(() => resolve(GlobalDebugShipmentMock), 1000);
            });

            request
            .then(response => {
                console.log("response:   ", response);
                if(response.data && response.data.items) {
                    this.shipmentInfo = cloneDeep(response.data.items);
                } else {
                    console.error("Error in fetching shipment information for debug shipment:  (Data is not received in the correct format from the API)", response);
                    this.$snackbar.global.showError(
                        `Unable to fetch the debug information for Order ID: ${this.orderId}`,
                        3500
                    );
                    this.shipmentInfoError = true;
                }
            })
            .catch(error => {
                console.error("Error in fetching shipment information for debug shipment:  ", error);
                this.$snackbar.global.showError(
                    `Unable to fetch the debug information for ${this.orderId}`,
                    3500
                );
                this.shipmentInfoError = true;
            })
            .finally(() => {
                this.loadingShipmentInfo = false;
            })
        },

        /**
         * Event to handle addition of order ID by the user
         * 
         * @author: Rushabh Mulraj Shah
         */
        onAddingOrderID() {
            this.$emit('changeOrderId', this.orderId);
        }
    }
}
</script>

<style lang="less" scoped>
.global-debug-shipment-container {
    .filter-section {
        .filters {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            column-gap: 1rem;
            align-items: center;
            margin-bottom: 1rem;
            
            ::v-deep .n-input {
                font-size: 12px;
            }
        }

        .filters-action-section {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
