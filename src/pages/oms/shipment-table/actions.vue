<template>
    <div class="actions-container">
        <div class="print-actions">
            <!-- Update Invoice Number -->
            <template
                v-if="
                    currentStatus === 'bag_confirmed' &&
                    (!shipment.store_invoice_id ||
                        !shipment.store_invoice_id) &&
                    !readOnlyMode
                "
            >
                <div class="invoice-action-container">
                    <adm-button-input
                        class="container-invoice-action"
                        :type="'text'"
                        :value="invoiceNumber"
                        :maxLength="16"
                        :placeHolderText="'Invoice number'"
                        :buttonText="'Update'"
                        :disabled="locked || !shipment.actionable"
                        @change="onInvoiceChange"
                        @submit="onInvoiceSubmit"
                    ></adm-button-input>
                </div>
            </template>

            <!-- View Prescriptions -->
            <template v-if="viewPrescription.length">
                <div>
                    <nitrozen-button
                        theme="secondary"
                        title="View Prescription"
                        @click="openPrescriptionDialog"
                        v-strokeBtn
                        class="shipment-action-button"
                    >
                        View Prescription
                    </nitrozen-button>
                </div>
            </template>

            <!-- Print Invoice -->
            <template v-if="showInvoiceActions">
                <div class="print-invoice">
                    <span
                        tabindex="0"
                        class="header-icon"
                        @click="openInvoiceMenu"
                        title="Print Invoice"
                        @blur="openInvoiceMenu"
                        v-if="showInvoiceIcon"
                    >
                        <adm-inline-svg class="svg-color-change" :src=" isInvoiceLock ? 'printer-icon-present': 'printer-icon' "> </adm-inline-svg>
                        <invoice-label-menu
                            v-show="toggleInvoice"
                            :toggleMenu="'invoice'"
                            :shipment="shipment"
                            @downloadSuccess="() => onInvoiceLabelDownload('invoice')"
                        ></invoice-label-menu>
                    </span>
                    <span
                        tabindex="0"
                        class="header-icon"
                        @click="openLabelMenu"
                        title="Print Label"
                        @blur="openLabelMenu"
                        v-if="showLabelIcon"
                    >
                        <adm-inline-svg :src="isLabelLock ? 'tag-icon-present' : 'tag-icon' "></adm-inline-svg>
                        <invoice-label-menu
                            v-show="toggleLabel"
                            :toggleMenu="'label'"
                            :shipment="shipment"
                            @downloadSuccess="() => onInvoiceLabelDownload('label')"
                        ></invoice-label-menu>
                    </span>
                    <!-- Commented as of Dec 16, 2022 TBD -->
                    <!-- <span
                        class="header-icon"
                        @click="openCommonMenu"
                        title="Print Invoice & Label"
                    >
                        <adm-inline-svg src="merge-icon"></adm-inline-svg>
                        <invoice-label-menu
                            v-if="toggleCommon"
                            :toggleMenu="'invoice and label'"
                            :shipment="shipment"
                        ></invoice-label-menu>
                    </span> -->
                </div>
            </template>
        </div>

        <!-- <div
            class="dp-actions"
            v-if="shipment.enable_dp_tracking"
        >
            <div class="dp-action-container">
                <span  class="header-icon" @click="openShipmentTracking">
                    <adm-inline-svg src="tracking-pin"/>
                </span>
            </div>
        </div> -->

        <!-- <div class="track-shipment-link" v-if="shipment.enable_dp_tracking" >
            <span class="opener" @click="openShipmentTracking">
                Track Shipment
            </span>
        </div> -->

        <!-- Bag confirm/cancel -->
        <template v-if="!readOnlyMode && isNew && !isClosed">
            <div class="confirm-cancel-container">
                <!-- Cancel order -->
                <nitrozen-button
                    v-strokeBtn
                    theme="secondary"
                    class="shipment-action-button"
                    @click="cancelOrder"
                    :disabled="locked || !shipment.actionable"
                >
                    {{ cancelBtnText }}
                </nitrozen-button>

                <!-- Bag Confirm -->
                <nitrozen-button
                    :disabled="
                        (locked || ordering_channel === 'MARKETPLACE') ||
                        disableConfirm || !shipment.actionable
                    "
                    v-if="!readOnlyMode"
                    v-flatBtn
                    theme="secondary"
                    class="shipment-action-button"
                    @click="checkForUserNote"
                >
                    {{ confirmBtnText }}
                </nitrozen-button>
                <!-- <nitrozen-button
                    :disabled="(locked && ordering_channel === 'MARKETPLACE') || disableConfirm || !shipment.actionable"
                    v-if="checkUpdateRole && !readOnlyMode"
                    v-flatBtn
                    theme="secondary"
                    class="shipment-action-button"
                    @click="updateShipmentStatus('bag_confirmed')"
                >
                    {{ confirmBtnText }}
                </nitrozen-button> -->
            </div>
        </template>

        <!-- DP Assign -->
        <template
            v-if="
                isDpAssign &&
                !isClosed &&
                !readOnlyMode
            "
        >
            <div>
                <nitrozen-button
                    v-flatBtn
                    theme="secondary"
                    @click="updateShipmentStatus('ready_for_dp_assignment')"
                    class="shipment-action-button"
                    :disabled="locked || !shipment.actionable"
                >
                    Assign DP
                </nitrozen-button>
            </div>
        </template>
       
        <!-- Bag Packed --> 
        <template
            v-if="
                isConfirmed &&
                !isClosed &&
                !readOnlyMode
            "
        >
            <nitrozen-button
                :disabled="
                    shipment.lock_status ||
                    shipment.ordering_channel == 'MARKETPLACE'
                "
                v-flatBtn
                theme="secondary"
                @click="updateShipmentStatus('bag_packed')"
            >
                {{'Packed' }}
            </nitrozen-button>
        </template>

        <!-- Dispatch -->
        <!-- As requested by Talha Khan this has been commented -->
        <!-- <template
            v-if="
                isPacked &&
                !isClosed &&
                !readOnlyMode
            "
        >
            <div>
                <nitrozen-button
                    :disabled="locked || ordering_channel === 'MARKETPLACE' || !shipment.actionable"
                    theme="secondary"
                    v-flatBtn
                    @click="updateShipmentStatus('handed_over_to_dg')"
                    class="shipment-action-button"
                    >Ready to Dispatch
                </nitrozen-button>
            </div>
        </template> -->

        <!-- Dispatch -->
        <!-- @ToDo Hide for P0 -->
        <!-- <template
            v-if="shipment.can_process && isPacked && !isClosed && checkUpdateRole && !readOnlyMode"
        >
            <nitrozen-button
                :disabled="locked && ordering_channel === 'MARKETPLACE' || !shipment.actionable"
                v-flatBtn
                theme="secondary"
                @click="updateShipmentStatus('handed_over_to_dg')"
                class="shipment-action-button"
            >
                Dispatched
            </nitrozen-button>
        </template> -->

        <!-- Return Initiated -->
         <!-- Return Initiated  Commented due to ticket FPCO-8696 -->
        <!-- <template 
            v-if="
                isReturnInitiated &&
                !isClosed &&
                ordering_channel.toLowerCase() === 'marketplace'
            "
        >
            <div>
                <nitrozen-button
                    v-flatBtn
                    theme="secondary"
                    @click="updateShipmentStatus('return_initiated')"
                    class="shipment-action-button"
                    :disabled="locked || !shipment.actionable"
                >
                    Initiate Return
                </nitrozen-button>
            </div>
        </template> -->

        <!-- Return Accepted -->
        <!-- Uncomment the below code and delete the code and replace it with Accept Return. Also, delete the code below it. -->
        <!-- <template
            v-if="shipment.can_process &&
                isReturnDelivered &&
                !isClosed &&
                (checkReadRole || checkUpdateRole) &&
                ordering_channel === 'MARKETPLACE' &&
                !readOnlyMode
            "
        > -->
        <template v-if="isReturnDelivered && !isClosed">
            <div>
                <nitrozen-button
                    v-flatBtn
                    theme="secondary"
                    @click="openQCDialog"
                    class="shipment-action-button"
                    :disabled="locked || !shipment.actionable"
                >
                    Accept Return
                </nitrozen-button>
            </div>
        </template>

        <!-- <div class="track-shipment-link" v-if="shipment.enable_dp_tracking">
            <span class="opener" @click="openShipmentTracking">
                Track Shipment
            </span>
        </div> -->

        <transition name="slide">
            <template v-if="quickTrackingDetailsView">
                <div
                    class="slide-fade"
                    ref="slide-fade"
                    @click="closeTrackingDialog($event)"
                >
                    <div class="container">
                        <shipment-tracking
                            ref="shipmentTracking"
                            v-if="shipment"
                            :shipment_id="shipment.shipment_id"
                        ></shipment-tracking>
                        <a
                            class="cancel-btn"
                            @click="closeTrackingDialog($event)"
                        >
                            <ukt-inline-svg
                                :src="'cross-black'"
                            ></ukt-inline-svg>
                        </a>
                    </div>
                </div>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="popUp">
                <div class="drawer-view" @click="close($event)">
                    <div class="drawer-container">
                        <order-confirm-popup
                            @buttonCliked="onOrderConfimClick($event)"
                        />
                    </div>
                </div>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="showReturnSummary">
                <side-drawer
                    :title="'Return Summary'"
                    :footer="true"
                    @close="closeReturnSummary"
                    :css="{ width: '50%' }"
                >
                    <return-summary :shipment="shipment" ref="return-summary" />

                    <template #footer>
                        <div class="footer-container">
                            <nitrozen-button
                                theme="secondary"
                                v-flat-btn
                                @click="onReturnSummarySubmit"
                            >
                                Submit
                            </nitrozen-button>
                        </div>
                    </template>
                </side-drawer>
            </template>
        </transition>
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
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import AdmInputWithButton from '@/components/common/adm-input-with-button.vue';
import AdmInlineSvg from '@/components/common/inline-svg.vue';
import InvoiceLabelMenu from '@/pages/oms/invoice-label-menu.vue';
import OrderConfirmPopup from './order-confirm-popup.vue';
import ReturnSummary from '@/pages/oms/return-summary/return-summary.vue';
import ShipmentTracking from '@/pages/oms/shipment-dp-tracking-dialog.vue';
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';
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
    name: 'shipment-actions',
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
        OrderConfirmPopup,
        ReturnSummary,
        ShipmentTracking,
        SideDrawer,
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
        checkReadRole() {
            // const role =
            //     this.accessDetail &&
            //     this.accessDetail.order_role &&
            //     this.accessDetail.order_role != 'read_only';
            // return role;
            return true;
        },
        checkUpdateRole() {
            // const role =
            //     this.accessDetail &&
            //     this.accessDetail.order_role &&
            //     (this.accessDetail.order_role == 'store_manager' ||
            //         this.accessDetail.order_role == 'full_access');
            // return role;
            return true;
        },
        // checkCustomerCareRole() {
        //     const role =
        //         this.accessDetail &&
        //         this.accessDetail.order_role &&
        //         (this.accessDetail.order_role == 'customer_care' ||
        //             this.accessDetail.order_role == 'full_access');
        //     return role;
        // },
        isNew() {
            try {
                // return ['placed', 'store_reassigned'].includes(this.shipment.shipment_status.status);
                return ['placed', 'store_reassigned'].includes(
                    this.currentStatus
                );
            } catch (e) {
                return false;
            }
        },
        isConfirmed() {
            try {
                return [
                    'dp_assigned',
                    'dp_reassigned',
                    'out_for_pickup',
                ].includes(this.currentStatus);
            } catch (e) {
                return false;
            }
        },
        isDpAssign() {
            try {
                let assignDPFromSB = null;
                let autoTriggerDPAssignmentACF = null;
                if(this.shipment && this.shipment.meta && this.shipment.meta.assign_dp_from_sb) {
                    assignDPFromSB = this.shipment.meta.assign_dp_from_sb;
                } 
                if(this.shipment && this.shipment.meta && this.shipment.meta.auto_trigger_dp_assignment_ACF) {
                    autoTriggerDPAssignmentACF = this.shipment.meta.auto_trigger_dp_assignment_ACF;
                }
                /* NOTE: DO NOT DELETE THE FOLLOWING COMMENTED CODE. */
                /** 27-12-2022 */
                // let finalFlag = true;
                // if(assignDPFromSB === false) finalFlag = false;
                // else if(assignDPFromSB === true && autoTriggerDPAssignmentACF === false) finalFlag = false;
                // console.log("this.shipment.meta.assign_dp_from_sb:   ", this.shipment.meta.assign_dp_from_sb);
                // console.log("this.shipment.meta.auto_trigger_dp_assignment_ACF:   ", this.shipment.meta.auto_trigger_dp_assignment_ACF);
                // console.log("this.shipment:   ", this.shipment);
                // console.log("finalFlag:   ", finalFlag);
                // return (
                    //     ['bag_invoiced', 'cancelled_at_dp', 'ready_for_dp_assignment', 'dp_not_assigned'].includes(this.currentStatus) &&
                //     !finalFlag
                // );
                /** .27-12-2022 */

                /** 28-12-2022 */
                // if(['cancelled_at_dp', 'dp_not_assigned'].includes(this.currentStatus) && assignDPFromSB === true) return true;
                // else if(['ready_for_dp_assignment', 'bag_invoiced'].includes(this.currentStatus) && assignDPFromSB === false) return true;
                // else if(
                //     ['ready_for_dp_assignment', 'bag_invoiced', 'dp_not_assigned', 'cancelled_at_dp'].includes(this.currentStatus) &&
                //     assignDPFromSB === null
                // ) return true;
                // else return false;
                /** .28-12-2022 */

                /**
                 * Current logic, as of December 28, 2022 20:14
                 * 1. If state is 'bag_invoiced' and either of the 'assign_dp_from_sb' or
                 *    'auto_trigger_dp_assignment_ACF' is false, we will show the 'DP Assign' button.
                 * 2. If state is 'bag_invoiced' and both the 'assign_dp_from_sb' and
                 *    'auto_trigger_dp_assignment_ACF' is true, we will HIDE the 'DP Assign' button.
                 * 3. If state is 'ready_for_dp_assignment', we will not consider 'auto_trigger_dp_assignment_ACF',
                 *    and if 'assign_dp_from_sb' is false, we will SHOW the 'DP Assign' button, else hide it.
                 * 4. In case of 'cancelled_at_dp' and 'dp_not_assigned', we will always show the 'DP Assign' button.
                 * 5. Default, show false.
                 */
                if(
                    ['bag_invoiced'].includes(this.currentStatus) && 
                    (!assignDPFromSB || !autoTriggerDPAssignmentACF)
                ) return true;
                else if(
                    ['bag_invoiced'].includes(this.currentStatus) && 
                    (assignDPFromSB && autoTriggerDPAssignmentACF)
                ) return false;

                if(['ready_for_dp_assignment'].includes(this.currentStatus) && !assignDPFromSB) return true;
                else if(['ready_for_dp_assignment'].includes(this.currentStatus) && assignDPFromSB) return false;

                if(['cancelled_at_dp', 'dp_not_assigned'].includes(this.currentStatus)) return true;

                return false;
            } catch (e) {
                return false;
            }
        },
        isPacked() {
            try {
                return [
                    'bag_packed',
                    'bag_not_picked',
                    'bag_not_packed',
                ].includes(this.currentStatus);
            } catch (e) {
                return false;
            }
        },
        isReturnDelivered() {
            try {
                return ['return_bag_delivered', 'rto_bag_delivered'].includes(
                    this.currentStatus // status => operational status, current_shipment_status => financial status
                );
            } catch (e) {
                return false;
            }
        },
        isReturnInitiated() {
            try {
                return ['delivery_done'].includes(this.currentStatus);
            } catch (e) {
                return false;
            }
        },
        viewPrescription() {
            const prescription = [];
            if (this.shipment && this.shipment.bags.length) {
                this.shipment.bags.map((ele) => {
                    if (ele.files) {
                        ele.files.map((file) => {
                            if (file.key === 'prescription') {
                                prescription.push({
                                    id: ele.id,
                                    file,
                                });
                            }
                        });
                    }
                });
            }
            return prescription;
        },
        isClosed() {
            return this.$route.query.stage == 'closed';
        },
        showPrintActions() {
            return true;
            let status = this.shipment.status.status;
            if (status) {
                if (status !== 'placed' && status !== 'bag_invoiced') {
                    if (status === 'bag_confirmed' && !this.shipment.invoice)
                        return false;
                    else if (this.viewPrescription.length <= 0) return false;
                    return true;
                }
            }
            return false;
        },
        cancelBtnText() {
            let itemsRejected = 0;
            if (this.rejectUpdate.length) {
                let activeShipment = this.rejectUpdate.find(
                    (shipment) =>
                        shipment.shipment_id === this.shipment.shipment_id
                );
                let totalItems = activeShipment.bags.reduce((total, bag) => {
                    return total + bag.quantity;
                }, 0);
                itemsRejected = activeShipment.bags.reduce((total, bag) => {
                    return total + bag.rejected;
                }, 0);

                if (itemsRejected === 0) return `Cancel All`;
                if (itemsRejected === totalItems) return `Cancel All`;
                else if (itemsRejected > 0) return `Cancel (${itemsRejected})`;
            }
            return `Cancel All`;
        },
        confirmBtnText() {
            if (this.rejectUpdate.length) {
                let activeShipment = this.rejectUpdate.find(
                    (shipment) =>
                        shipment.shipment_id === this.shipment.shipment_id
                );
                let totalItems = activeShipment.bags.reduce((total, bag) => {
                    return total + bag.quantity;
                }, 0);
                let itemsRejected = activeShipment.bags.reduce((total, bag) => {
                    return total + bag.rejected;
                }, 0);

                if (itemsRejected === 0) return `Confirm All`;
                if (itemsRejected === totalItems) return `Confirm`;
                else if (itemsRejected > 0)
                    return `Confirm (${totalItems - itemsRejected})`;
            }
            return `Confirm All`;
        },
        disableConfirm() {
            if (this.rejectUpdate.length) {
                let activeShipment = this.rejectUpdate.find(
                    (shipment) =>
                        shipment.shipment_id === this.shipment.shipment_id
                );
                let totalItems = activeShipment.bags.reduce((total, bag) => {
                    return total + bag.quantity;
                }, 0);
                let itemsRejected = activeShipment.bags.reduce((total, bag) => {
                    return total + bag.rejected;
                }, 0);

                return itemsRejected === totalItems;
            }
            return false;
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
        /**
         * Checks if any of the selected shipment's bags have a user note.
         * If user note exists for any of the bag, we will trigger a display of the popup.
         * Else, we will move to the updateShipmentStatus function.
         *
         * @author: Rushabh Mulraj Shah
         */

        checkForUserNote() {
            let userNoteExists = this.shipment.bags.some(
                (bag) =>  {
                    if(bag.entity_type == 'set') return bag.products[0].meta.custom_message;
                    else return bag.meta.custom_message;
                }
            );
            if (userNoteExists) this.popUp = true;
            else {
                this.popUp = false;
                this.updateShipmentStatus('bag_confirmed');
            }
        },
        close: function (e) {
            e.stopPropagation();
            this.popUp = false;
        },
        closeReturnSummary() {
            this.showReturnSummary = false;
        },

        /**
         * Method to handle submit click of Return Summary.
         * 
         * @author: Rushabh Mulraj Shah
         */
        onReturnSummarySubmit() {
            /* API to be hit on return summary submission */
            let updatedShipmentData = cloneDeep(
                this.$refs['return-summary'].shipmentData
            );

            let currentStatus;
            if(updatedShipmentData.status && updatedShipmentData.status.status) {
                currentStatus = updatedShipmentData.status.status;
            }

            if(!currentStatus) {
                console.error(`Unable to update this shipment as current status is not available:  `, this.shipment);
                this.$snackbar.global.showError(`Unable to update this shipment`);
                return;
            }

            let payload = {
                statuses: [
                    {
                        shipments: [
                            {
                                identifier: updatedShipmentData.shipment_id,
                                products: [],
                                reasons: {
                                    products: [],
                                    entities: []
                                },
                                data_updates: {
                                    products: [],
                                    entities: []
                                }
                            }
                        ],
                        status: currentStatus === 'rto_bag_delivered' ? 'rto_bag_accepted' : 'return_accepted',
                        exclude_bags_next_state: null
                    }
                ],
                task: false,
                force_transition: false,
                lock_after_transition: false,
                unlock_before_transition: false
            };

            let bags = cloneDeep(updatedShipmentData.bags);
            let shipmentProducts = payload.statuses[0].shipments[0].products;
            let shipmentReasons = payload.statuses[0].shipments[0].reasons;
            let shipmentDataUpdates = payload.statuses[0].shipments[0].data_updates;

            for(let bag of bags) {
                /**
                 * Rejecting totalBadQCs over bag.quantity, as per backend's 
                 * suggestion. However, retaining the code in case of posterity.
                 * - Rushabh Mulraj Shah
                 * Dec 14, 2022 14:59
                 * */
                let totalBadQCs = bag.qc.bad.reasons.reduce((total, reason) => total + reason.quantity, 0);

                /* Add total bad QCs to the products key */
                if(bag.entity_type == 'set'){
                    shipmentProducts.push({
                        quantity: bag.article.set.quantity,
                        identifier: bag.products[0].seller_identifier
                    })
                } else {
                    shipmentProducts.push({
                        line_number: bag.line_number,
                        identifier: bag.seller_identifier,
                        quantity: bag.quantity
                    });
                }
                let badQCReasons = bag.qc.bad.reasons;
                badQCReasons.forEach(reason => {
                    let currentReasonObj = shipmentReasons.products.find(item => item.data.reason_id === reason.reason);

                    /* Update reasons object */
                    if(!isEmpty(currentReasonObj)) {
                        if(bag.entity_type == 'set'){
                            currentReasonObj.filters.push({
                                quantity: reason.quantity,
                                identifier: bag.products[0].seller_identifier
                            })
                        } else {
                            currentReasonObj.filters.push({
                                line_number: bag.line_number,
                                quantity: reason.quantity,
                                identifier: bag.seller_identifier
                            });
                        }
                    } else {
                        let reasonObj = {
                            filters: [],
                            data: {
                                reason_id: reason.reason_id,
                                reason_text: reason.reason_text
                            }
                        };
                        if(bag.entity_type == 'set'){
                            reasonObj.filters.push({
                                quantity: reason.quantity,
                                identifier: bag.products[0].seller_identifier
                            })
                        } else {
                            reasonObj.filters.push({
                                line_number: bag.line_number,
                                quantity: reason.quantity,
                                identifier: bag.seller_identifier
                            });
                        }
                        shipmentReasons.products.push(reasonObj);
                    }

                    /* Update data_updates key */
                    let dataUpdates = {
                        filters: [],
                        data: {
                            meta: {
                                qc_text: reason.remark
                            }
                        }
                    };
                    if(bag.entity_type == 'set'){
                        dataUpdates.filters.push({
                            quantity: reason.quantity,
                            identifier: bag.products[0].seller_identifier
                        })
                    } else {
                        dataUpdates.filters.push({
                            line_number: bag.line_number,
                            quantity: reason.quantity,
                            identifier: bag.seller_identifier
                        });
                    }

                    if(reason.img && reason.img.upload && reason.img.upload.url) {
                        dataUpdates.data.meta['qc_image_links'] = reason.img.upload.url;
                    }

                    shipmentDataUpdates.products.push(dataUpdates);
                })
            }
 

            OrderService.updateShipmentStatus(payload)
            .then(response => {
                if(response.data && response.data.statuses && response.data.statuses.length) {
                    let statusResponse = response.data.statuses[0].shipments[0];
                    if(statusResponse.status === 200) {
                        this.$snackbar.global.showSuccess(
                            `Successfully updated the status of the shipment: ${updatedShipmentData.shipment_id}`,
                            3000
                        );
                        this.showReturnSummary = false;
                        this.$emit('statusUpdated')
                    } else {
                        this.$snackbar.global.showError(
                            `Failed to update the status of the shipment:  ${updatedShipmentData.shipment_id}`,
                            3000
                        );
                        console.error("Error in updating the status:   ", response.data.statuses[0].shipments[0].message);
                    }
                } else {
                    this.$snackbar.global.showError(
                        `Failed to update the status of the shipment:  ${updatedShipmentData.shipment_id}`,
                        3000
                    );
                    console.error("Error in updating the status:   ", response.data.statuses[0].shipments[0]);
                }
            })
            .catch(error => {
                this.$snackbar.global.showError(
                    `Failed to update the status of the shipment:  ${updatedShipmentData.shipment_id}`,
                    3000
                );
                console.error("Error in updating the status:   ", error);
            })
        },
        
        onOrderConfimClick(value) {
            if (value == true) {
                this.updateShipmentStatus('bag_confirmed');
            } else if (value == false) {
                this.popUp = false;
            }
        },
        cancelOrder() {
            this.$emit('updateStatus', 'cancel_order');
        },
        updateShipmentStatus(stage, data) {
            this.$emit('updateStatus', stage, data);
        },
        openQCDialog() {
            this.showReturnSummary = true;
        },
        openPrescriptionDialog() {
            console.log('It will open the prescription dialog');
        },
        closeInvoice() {
            this.toggleInvoice = false;
        },
        closeLabel() {
            this.toggleLabel = false;
        },
        onInvoiceChange(event) {
            console.log('[onInvoiceChange] event:   ', event);
        },
        onInvoiceSubmit(invoice) {
            let regex = new RegExp(/^([a-zA-Z1-9]{1}[a-zA-Z0-9\/-]{0,15})$/);
            if (!invoice) {
                this.$snackbar.global.showError(
                    'Please enter the invoice number'
                );
                return;
            } else if (!regex.test(invoice)) {
                this.$snackbar.global.showError(
                    'Invalid Invoice no: Only A-Z, a-z, 0-9, /, - without spaces and max 16 length are allowed'
                );
                return;
            }
            this.updateShipmentStatus('bag_invoiced', invoice);
        },
        openShipmentTracking() {
            this.quickTrackingDetailsView = true;
        },
        closeTrackingDialog() {
            this.quickTrackingDetailsView = false;
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
        onInvoiceLabelDownload(docType) {
            let payload = {
                statuses: [
                    {
                        shipments:[
                            {
                                identifier: this.shipment.shipment_id,
                                products: [],
                                data_updates: {
                                    entities: [
                                        {
                                            filters: [{}],
                                            data:  {
                                            actionable_item_json: {}
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ],
                lock_after_transition: true,
                unlock_before_transition: true
            }
            if(docType == 'invoice' && this.isInvoiceLock){
                payload.statuses[0].shipments[0].data_updates.entities[0].data.actionable_item_json['download_invoice'] = 'unlock'
                this.updateShipmentActionStatus(payload)
                .then(res => {
                    if(res && !this.isLabelLock){
                        this.unLockShipment(this.shipment.shipment_id)
                    }else{
                        this.$emit('statusUpdated')
                    }
                })
            }
            if(docType == 'label' && this.isLabelLock){
                payload.statuses[0].shipments[0].data_updates.entities[0].data.actionable_item_json['download_label'] = 'unlock'
                this.updateShipmentActionStatus(payload)
                .then(res => {
                    if(res && !this.isInvoiceLock){
                        this.unLockShipment(this.shipment.shipment_id)
                    }else{
                        this.$emit('statusUpdated')
                    }
                })
            }
        },
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
                entities: [
                    {
                        id: shipmentId,
                        reason_text: ""
                    }
                ]
            }

            if(this.accessDetail) {
                payload['user_id'] = this.accessDetail.user;
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

    .shipment-action-button {
        font-size: 12px;
        font-weight: 600;
        width: auto;
        max-width: 160px;
        padding: 5px 15px;
        min-width: 86px;
        vertical-align: middle;
        height: 34px;

        ::v-deep .n-button-content {
            white-space: nowrap;
        }
    }
}

.invoice-action-container {
    background: white;
    .button-input-container {
        height: 34px;
        ::v-deep input {
            height: 80%;
            border-radius: 2px;
        }
        ::v-deep button {
            height: 90%;
            width: 35%;
            margin-right: 2px;
            font-size: 12px;
            font-weight: 600;
            padding: 0px 30px;

            &[disabled="disabled"]{
                opacity: 1;
                background-color: #e0e0e0;
                color: #9e9494;
            }
        }

            
    }
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
}

.confirm-cancel-container {
    display: flex;
    justify-content: flex-start;

    button:first-child {
        margin-right: 8px;
    }
}
.track-shipment-link {
    margin-top: 4px;
    margin-left: 4px;
    min-width: 100px;
    display: flex;
    align-items: center;
    .opener {
        font-size: 12px;
        color: @RoyalBlue;
        &:hover {
            text-decoration: underline;
        }
    }
}
.slide-fade {
    height: 100%;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @shipmentDrawer;
    .container {
        position: absolute;
        right: 0px;
        width: 60%;
        height: 100%;
        background: @White;
        overflow-y: scroll;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
        &::-webkit-scrollbar {
            display: none;
        }
        @media @mobile {
            position: fixed;
            width: 100%;
        }
        .cancel-btn {
            position: absolute;
            top: 15px;
            right: 20px;
            cursor: pointer;
        }
    }
}
.drawer-view {
    height: 100%;
    position: fixed;
    // top: 64px; // To expose header
    top: 0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @shipmentDrawer;

    .drawer-container {
        background-color: #ffffff;
        position: absolute;
        right: 40%;
        top: 36%;
        min-width: 24%;
        min-height: 310px;
        box-shadow: 0 2px 16px 0 rgb(0 0 0%);
        border-radius: 12px;
        &::-webkit-scrollbar {
            display: none !important;
        }
        @media @mobile {
            position: fixed;
            width: 100%;
        }
    }
}

.footer-container {
    display: flex;
    justify-content: flex-end;
}
::v-deep svg {
    .svg-color-change {
        path {
            fill: red;
            fill-opacity: 2;
        }
    }
}
</style>
