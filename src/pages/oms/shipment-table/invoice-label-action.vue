<template>
    <div class="actions-container">
        <div class="print-actions">
            <!-- Print Invoice -->
            <template v-if="showInvoiceActions">
                <div class="print-invoice">
                    <span
                        tabindex="0"
                        class="header-icon"
                        @click="openInvoiceMenu"
                        title="Print Invoice"
                        @blur="closeInvoice"
                        :class="{disabled: !showInvoiceIcon}"
                    >
                        <adm-inline-svg class="svg-color-change" :src=" isInvoiceLock ? 'printer-icon-present': 'printer-icon' "> </adm-inline-svg>
                        <invoice-label-menu
                            v-show="toggleInvoice && showInvoiceIcon"
                            :toggleMenu="'invoice'"
                            :shipment="shipment"
                        ></invoice-label-menu>
                    </span>
                    <span
                        tabindex="0"
                        class="header-icon"
                        @click="openLabelMenu"
                        title="Print Label"
                        @blur="closeLabel"
                        :class="{disabled: !showLabelIcon}"
                    >
                        <adm-inline-svg :src="isLabelLock ? 'tag-icon-present' : 'tag-icon' "></adm-inline-svg>
                        <invoice-label-menu
                            v-show="toggleLabel && showLabelIcon"
                            :toggleMenu="'label'"
                            :shipment="shipment"
                        ></invoice-label-menu>
                    </span>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    clickOutside,
} from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';

/* Component imports */
import AdmInputWithButton from '@/components/common/adm-input-with-button.vue';
import AdmInlineSvg from '@/components/common/inline-svg.vue';
import InvoiceLabelMenu from '@/pages/oms/invoice-label-menu.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';

/* Services import */
import OrderService from '@/services/orders.service';

const RETURN_JOURNEY_STATUSES = [
    'return_request_cancelled',
    'return_initiated',
    'return_dp_assigned',
    'return_rejected_by_dp',
    'return_not_accepted',
    'return_bag_picked',
    'return_bag_out_for_delivery',
    'return_accepted',
    'return_dp_not_assigned',
    'return_bag_not_delivered',
    'return_to_origin',
    'return_completed',
    'return_rejected_by_store',
    'return_bag_in_transit',
    'return_dp_cancelled',
    'return_bag_lost',
    'assigning_return_dp',
    'return_cancelled_at_dp',
    'return_dp_out_for_pickup',
    'return_cancelled_failed_at_dp',
    'return_assigning_dp',
    'return_bag_packed',
    'return_bag_not_picked',
    'return_bag_delivered',
];
export default {
    name: 'invoice-label-actions',
    props: {
        locked: {
            type: Boolean,
            default: false,
        },
        ordering_channel: {
            type: String,
        },
        shipment: {
            type: Object,
        },
        rejectUpdate: {
            type: Array,
        },
        readOnlyMode: {
            type: Boolean,
            default: false,
        }
    },
    components: {
        'adm-button-input': AdmInputWithButton,
        AdmInlineSvg,
        InvoiceLabelMenu,
        NitrozenButton,
        UktInlineSvg,
    },
    directives: {
        flatBtn,
        strokeBtn,
        clickOutside,
    },
    data() {
        return {
            applicationId: this.$route.params.applicationId,
            toggleInvoice: false,
            invoiceNumber: '',
            toggleLabel: false,
            toggleCommon: false,
            quickTrackingDetailsView: false,
            popUp: false,
            showReturnSummary: false,
        };
    },
    computed: {
        ...mapGetters({
            accessDetail: {},
        }),
        currentStatus() {
            return this.shipment.status.status;
        },
        showInvoiceActions() {
            return (
                this.shipment &&
                this.shipment.invoice.store_invoice_id &&
                // !RETURN_JOURNEY_STATUSES.includes(this.shipment.status.status) &&
                this.shipment.status.status !== 'dp_not_assigned'
            );
        },
        showInvoiceIcon() {
            let flag = false;
            let invoiceOptions = [
                'invoice_a4', 
                'invoice_a6',
                'invoice_pos',
                'invoice',
                'delivery_challan_a4'
            ];
            let pdfLinks = Object.keys(this.shipment.affiliate_details.pdf_links);
            if(this.shipment && this.shipment.affiliate_details && this.shipment.affiliate_details.pdf_links) {
                for(let option of invoiceOptions) {
                    if(pdfLinks.includes(option)) {
                        flag = true;
                        break;
                    }
                }
            }
            return flag;
        },
        showLabelIcon() {
            let flag = false;
            let labelOptions = [
                'label_a4',
                'label_a6',
                'label_pos',
                'label',
                'parent_child_label'
            ];
            let pdfLinks = Object.keys(this.shipment.affiliate_details.pdf_links);
            if(this.shipment && this.shipment.affiliate_details && this.shipment.affiliate_details.pdf_links) {
                for(let option of labelOptions) {
                    if(pdfLinks.includes(option)) {
                        flag = true;
                        break;
                    }
                }
            }
            return flag;
        },
        isInvoiceLock() {
            return ( 
                this.shipment && 
                this.shipment.lock_status && 
                this.shipment.shipment_details && 
                this.shipment.shipment_details.action_to_status && 
                this.shipment.shipment_details.action_to_status.download_invoice &&  
                this.shipment.shipment_details.action_to_status.download_invoice == 'lock'
            )
        },
        isLabelLock() {
            return ( 
                this.shipment && 
                this.shipment.lock_status && 
                this.shipment.shipment_details && 
                this.shipment.shipment_details.action_to_status && 
                this.shipment.shipment_details.action_to_status.download_label &&  
                this.shipment.shipment_details.action_to_status.download_label == 'lock'
            )
        }
    },
    methods: {
        updateShipmentStatus(stage, data) {
            this.$emit('updateStatus', stage, data);
        },
        closeInvoice() {
            this.toggleInvoice = false;
        },
        closeLabel() {
            this.toggleLabel = false;
        },
        
        
        openInvoiceMenu() {
            this.toggleLabel = false;
            this.toggleCommon = false;
            this.toggleInvoice = !this.toggleInvoice;
        },
        openLabelMenu() {
            this.toggleInvoice = false;
            this.toggleCommon = false;
            this.toggleLabel = !this.toggleLabel;
        },
        openCommonMenu() {
            this.toggleInvoice = false;
            this.toggleLabel = false;
            this.toggleCommon = !this.toggleCommon;
        },
        // onInvoiceLabelDownload(docType) {
        //     let payload = {
        //         statuses: [
        //             {
        //                 shipments:[
        //                     {
        //                         identifier: this.shipment.shipment_id,
        //                         products: [],
        //                         data_updates: {
        //                             entities: [
        //                                 {
        //                                     filters: [{}],
        //                                     data:  {
        //                                     actionable_item_json: {}
        //                                     }
        //                                 }
        //                             ]
        //                         }
        //                     }
        //                 ]
        //             }
        //         ],
        //         lock_after_transition: true,
        //         unlock_before_transition: true
        //     }
        //     if(docType == 'invoice' && this.isInvoiceLock){
        //         payload.statuses[0].shipments[0].data_updates.entities[0].data.actionable_item_json['download_invoice'] = 'unlock'
        //         this.updateShipmentActionStatus(payload)
        //         .then(res => {
        //             if(res && !this.isLabelLock){
        //                 this.unLockShipment(this.shipment.shipment_id)
        //             }else{
        //                 this.$emit('statusUpdated')
        //             }
        //         })
        //     }
        //     if(docType == 'label' && this.isLabelLock){
        //         payload.statuses[0].shipments[0].data_updates.entities[0].data.actionable_item_json['download_label'] = 'unlock'
        //         this.updateShipmentActionStatus(payload)
        //         .then(res => {
        //             if(res && !this.isInvoiceLock){
        //                 this.unLockShipment(this.shipment.shipment_id)
        //             }else{
        //                 this.$emit('statusUpdated')
        //             }
        //         })
        //     }
        // },
        updateShipmentActionStatus(payload){
            return OrderService.updateShipmentStatus(payload)
            .then(response => {
                if(response.data && response.data.statuses && response.data.statuses.length) {
                    let statusResponse = response.data.statuses[0].shipments[0];
                    if(statusResponse.status === 200) {
                        this.$snackbar.global.showSuccess(
                            `Successfully updated the status of the shipment: ${statusResponse.identifier}`,
                            3000
                        );
                        return true
                    } else {
                        this.$snackbar.global.showError(
                            `Failed to update the status of the shipment:  ${statusResponse.identifier}`,
                            3000
                        );
                        console.error("Error in updating the status:   ", statusResponse.identifier);
                        return false
                    }
                } else {
                    this.$snackbar.global.showError(
                        `Failed to update the status of the shipment:  ${statusResponse.identifier}`,
                        3000
                    );
                    console.error("Error in updating the status:   ", statusResponse.identifier);
                    return false
                }
            })
            .catch(error => {
                this.$snackbar.global.showError(
                    `Failed to update the status of the shipment:  ${statusResponse.identifier}`,
                    3000
                );
                console.error("Error in updating the status:   ", error);
                return false
            })
        },
        unLockShipment(shipmentId){
            let payload = {
                action: "unlock",
                action_type: "complete",
                resume_tasks_after_unlock: true,
                entity_type: "shipments",
                user_id: this.accessDetail.user,
                entities: [
                    {
                        id: shipmentId,
                        reason_text: ""
                    }
                ]
            }

            OrderService.lockManager(payload)
            .then(response => {
                if(response.data && response.data.success) {
                    this.$snackbar.global.showSuccess(
                        response.data.message,
                        3000
                    );
                    this.$emit('statusUpdated')
                } else {
                    this.$snackbar.global.showError(
                        response.data.message,
                        3000
                    );
                    console.error("Error in unlocking the shipment:   ", shipmentId);
                }
            })
            .catch(error => {
                this.$snackbar.global.showError(
                    `Error in unlocking the shipment:  ${shipmentId}`,
                    3000
                );
                console.error("Error in unlocking the shipment:   ", error);
            })
        }
    },
};
</script>

<style lang="less" scoped>
.actions-container {
    display: flex;
    // flex-wrap: wrap;
    // justify-content: space-between;
    align-items: center;

}

.print-actions {
    display: flex;
    gap: 10px;
    // width: 100%;
    position: relative;
}

.print-invoice {
    display: flex;
    .header-icon {
        padding-right: 10px;
    }
    .header-icon.disabled {
        opacity: .3;
        cursor: default;
    }
}

</style>
