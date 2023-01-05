<template>
    <div class="shipment-details-container">
        <div class="alert" v-if="isShipmentLock && lockMessage.length > 0"> 
            <warn-alert class="alert-sys" :display="isShipmentLock && lockMessage.length > 0">
                <template v-slot:text>
                    {{ lockMessage }}
                </template>
            </warn-alert>
        </div>
        <div class="alert" v-if="showAlert && displayAlert && alertText && !isShipmentLock">
            <alert-box class="alert-sys" @close="closeAlert" :display="showAlert">
                <template v-slot:icon>
                    <adm-inline-svg class="warn-icon" :src="alertText.icon"></adm-inline-svg>
                </template>
                <template v-slot:text>
                    {{ alertText.message }}
                </template>
            </alert-box>
        </div>
        <div class="content">
            <shipment-items
                class="content-sys"
                :data="data.shipments"
                :activeId="shipmentId"
                v-if="data.shipments"
                @statusUpdated="statusUpdated($event)"
                :readOnlyMode="readOnlyMode"
                :shipmentProcessing="shipmentProcessing"
                @updateOrderDetails="() => $emit('updateOrderDetails')"
            ></shipment-items>
        </div>
    </div>
</template>

<script>
/* Package imports */
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

/* Component imports */
import AlertBox from '@/pages/oms/common/alert-box.vue'; 
import ShipmentItems from '@/pages/oms/shipment-table/index.vue';
import WarnAlert from '@/pages/oms/common/warn-alert.vue';
import AdmInlineSvg from '@/components/common/inline-svg.vue';

export default {
    name: 'shipments-list',
    components: {
        AlertBox,
        ShipmentItems,
        WarnAlert,
        AdmInlineSvg
    },
    props: {
        data: {
            type: Object
        },
        shipmentId: {
            type: String
        },
        readOnlyMode: {
            type: Boolean,
            default: false
        },
        shipmentProcessing:{
            type: Boolean,
            default: false
        }
    },
    mounted() {
        /**
         * Here in mount hook we are preparing text arrray which would be in for loop inside html and
         * based on the status mentioned in the alertsMap object we will display it's corresponding text
         * in the ui which would be in mirage alert.
         * for eg: we have order which have status of placed then we will show the text
         * 'Adjust reject quantity to cancel, and please verify all items before confirming.',
         * @author Sameer Shaikh
         */
        if(!isEmpty(this.data)) {
            let alerts = {};
            let alertsMap = {
                placed:  { message: 'Adjust the ‘Cancel Qty’ to cancel item(s), and verify before you confirm', icon: 'alerts-blue-icon' },
                bag_confirmed: { message: 'Enter invoice number and click the update button to process the shipment',  icon: 'alerts-blue-icon' },
                bag_invoiced: { message: 'Wait! We are assigning a delivery partner (DP) for your shipment',  icon: 'alerts-blue-icon' },
                ready_for_dp_assignment: { message: 'Wait, we are assigning a delivery partner for your shipment.',  icon: 'blue-circle-icon' },
                dp_assigned: { message: 'Please download invoice and label to pack your shipment',  icon: 'alerts-blue-icon' },
                bag_packed: {message: 'Proceed further by dispatching shipments from the Manifest section', icon: 'alerts-blue-icon' }
            }
            for(let shipment of this.data.shipments) {
                let status = shipment.status.current_shipment_status
                if(Object.keys(alertsMap).includes(status)){
                    alerts[status] = alertsMap[status]
                }
                // commented as to make this below code concise
                // if(status === 'placed' && !Object.keys(alerts).includes(status)) {
                //     alerts[status] = 'Adjust reject quantity to cancel, and please verify all items before confirming.';
                // } else if(status === 'bag_confirmed' && !Object.keys(alerts).includes(status)) {
                //     alerts[status] = 'Enter invoice number and click on update to process the shipment.';
                // } else if(
                //     (status === 'bag_invoiced' || status === 'ready_dp_assign') &&
                //     !Object.keys(alerts).includes(status)
                // ) {
                //     alerts[status] = 'Wait, we are assigning a delivery partner for your shipment.';
                // } else if(status === 'dp_assigned' && !Object.keys(alerts).includes(status)) {
                //     alerts[status] = 'Download invoice, label then pack your shipment.';
                // }
            }
            this.alertBoxes = cloneDeep(alerts);
        }
    },
    computed: {
        showAlert() {
            if(this.activeShipment) {
                let showAlertStates = ['placed', 'bag_confirmed', 'bag_invoiced', 'ready_for_dp_assignment', 'dp_assigned', 'bag_packed'];
                return showAlertStates.includes(this.activeShipment.status.status);
            }
            return false;
        },
        alertText() {
            if(this.activeShipment) {
                return this.alertBoxes[this.activeShipment.status.status]
            }
            return
        },
        isShipmentLock(){
            if(this.activeShipment) {
                return this.activeShipment.lock_status
            }
            return
        },
        activeShipment(){
            if(!isEmpty(this.data) && this.data.shipments && this.shipmentId) {
                return this.data.shipments.find(shipment => shipment.shipment_id == this.shipmentId)
            }
            return
        },
        lockMessage(){
            if(this.activeShipment) {
                return this.activeShipment.meta.lock_message || ''
            }
            return ''
        }
    },
    data() {
        return {
            displayAlert: true,
            activeShipmentId: null,
            alertBoxes: {},
        }
    },
    methods: {
        closeAlert() {
            this.displayAlert = false;
        },
        statusUpdated(event) {
            this.$emit('statusUpdated',event);
        }
    }
}
</script>

<style lang="less" scoped>
.shipment-details-container {
    padding: 24px;
    background: #FFFFFF;
    ::v-deep .content {
        max-width: none;
    }
}
</style>
