<template>
    <div :id="shipment.id" class="shipment-card" :class="{'hover': !isDrawerView}">
        <mirage-alert type="error" v-if="shipment.lock_status && shipment.ordering_channel == 'MARKETPLACE'">This shipment is currently in lock state</mirage-alert>
        <slot></slot>
        <loader v-if="inProgress" class="loading"></loader>
        <div class="title-row">
            <!-- <nitrozen-check-box
                ref="shipment-selector"
                class="shipment-selector"
                v-if="
                    currentStateShipmentCount > 1 &&
                    isNew &&
                    !isClosed &&
                    checkUpdateRole &&
                    !readOnlyMode
                "
                v-model="isSelected"
                @input="selectShipment"
            ></nitrozen-check-box> -->
            <div class="shipment-title-header">
                <div>Shipment ID:</div>
                <div
                    class="shipment-id-value"
                    @click="copyURLToClipboard(shipment.id)"
                    title="Click to copy"
                >
                    {{ shipment.id }}
                </div>
            </div>        

            <div class="action-items">
                <!-- <div class="shipment-lock" v-if="shipment.lock_status && shipment.ordering_channel == 'MARKETPLACE'">
                    <adm-inline-svg src="lock" title="Shipment is locked"></adm-inline-svg>
                </div> -->
                <!-- shipment actions start -->

                <!-- Bag Confirm/Cancel Order -->
                <!-- <template v-if="isNew && !isClosed && !readOnlyMode"> -->
                    <!-- Bag Confirm -->
                    <!-- <nitrozen-button
                        :disabled="
                            shipment.lock_status &&
                            shipment.ordering_channel == 'MARKETPLACE'
                        "
                        v-if="showConfirm && checkUpdateRole"
                        v-flatBtn
                        theme="secondary"
                        @click="updateShipmentStatus('bag_confirmed')"
                    >
                        {{
                            shipment.bags.length > 1
                                ? selectedBags.every((v) => v)
                                    ? 'Confirm All'
                                    : 'Confirm Selected'
                                : 'Confirm'
                        }}
                    </nitrozen-button> -->

                    <!-- Cancel Order -->
                    <!-- <nitrozen-button
                        v-if="checkReadRole"
                        v-strokeBtn
                        theme="secondary"
                        @click="cancelOrder"
                        :disabled="!selectedBags.every((v) => v)"
                    >
                        Cancel
                    </nitrozen-button> -->
                <!-- </template> -->

                <!-- Bag Packed -->
                <!-- <template v-if="isConfirmed && !isClosed && checkUpdateRole && !readOnlyMode">
                    <nitrozen-button
                    :disabled="
                                shipment.lock_status &&
                                shipment.ordering_channel == 'MARKETPLACE'
                            "
                        v-flatBtn
                        theme="secondary"
                        @click="updateShipmentStatus('bag_packed')"
                    >
                        {{ shipment.bags.length > 1 ? 'All Packed' : 'Packed' }}
                    </nitrozen-button>
                </template> -->


                <!-- DP Assign -->
                <!-- <template v-if="isDpAssign && !isClosed && checkUpdateRole&& !readOnlyMode">
                    <nitrozen-button
                        v-flatBtn
                        theme="secondary"
                        @click="updateShipmentStatus('ready_for_dp_assignment')"
                    >
                        Assign DP
                    </nitrozen-button>
                </template> -->


                <!-- Dispatch -->
                <!-- <template v-if="isPacked && !isClosed && checkUpdateRole&& !readOnlyMode">
                    <nitrozen-button
                    :disabled="
                                shipment.lock_status &&
                                shipment.ordering_channel == 'MARKETPLACE'
                            "
                        v-flatBtn
                        theme="secondary"
                        @click="updateShipmentStatus('handed_over_to_dg')"
                    >
                        {{
                            shipment.bags.length > 1
                                ? 'All Dispatched'
                                : 'Dispatched'
                        }}
                    </nitrozen-button>
                </template> -->

                <!-- Return Initiated -->
                <!-- <template
                    v-if="
                        isReturnInitiated &&
                        !isClosed &&
                        checkCustomerCareRole &&
                        shipment.ordering_channel != 'MARKETPLACE' &&
                        !readOnlyMode
                    "
                >
                    <nitrozen-button
                        v-flatBtn
                        theme="secondary"
                        @click="updateShipmentStatus('return_initiated')"
                    >
                        Return Initiated
                    </nitrozen-button>
                </template> -->

                <!-- Return Accepted -->
                <!-- <template
                    v-if="
                        isReturnDelivered &&
                        !isClosed &&
                        (checkReadRole || checkUpdateRole) &&
                        shipment.ordering_channel != 'MARKETPLACE' &&
                        !readOnlyMode
                    "
                >
                    <nitrozen-button
                        v-flatBtn
                        theme="secondary"
                        @click="openQCDialog"
                    >
                        Return Accepted
                    </nitrozen-button>
                </template> -->

                <!-- Bank Details -->
                <!-- DO NOT DELETE  -->
                <!-- <template
                    v-if="
                        checkRefundObj &&
                        checkRefundObj[shipment.id] &&
                        checkRefundObj[shipment.id] == true &&
                        checkReadRole &&
                        shipment.ordering_channel != 'MARKETPLACE'
                    "
                >
                    <nitrozen-button
                        v-flatBtn
                        theme="secondary"
                        @click="openBankDetails()"
                    >
                        Bank Details
                    </nitrozen-button>
                </template> -->

                <!-- shipment actions end -->

                <div class="print-actions">
                    <!-- Update Invoice Number -->
                    <!-- <template
                        v-if="
                            shipment &&
                            shipment.status &&
                            shipment.status.current_shipment_status ==
                                'bag_confirmed' &&
                            ((shipment.invoice &&
                                !shipment.invoice.store_invoice_id) ||
                                !shipment.invoice) &&
                            checkUpdateRole && 
                            !readOnlyMode
                        "
                    >
                        <nitrozen-button
                            theme="secondary"
                            :disabled="
                                shipment.lock_status &&
                                shipment.ordering_channel == 'MARKETPLACE'
                            "
                            @click="enterInvoiceId()"
                            title="Enter Invoice"
                            v-flatBtn
                        >
                            Update Invoice
                        </nitrozen-button>
                    </template> -->

                    <template v-if="viewPrescription.length">
                        <nitrozen-button
                            theme="secondary"
                            title="View Prescription"
                            @click="$openPrescriptionDialog"
                            v-strokeBtn
                        >
                            View Prescription
                        </nitrozen-button>
                    </template>

                    <!-- Print Invoice -->
                    <template
                        v-if="
                            shipment &&
                            shipment.invoice &&
                            shipment.invoice.store_invoice_id
                        "
                    >
                        <div 
                            class="print-invoice"
                        >
                            <span
                                class="header-icon"
                                @click="toggleInvoice = !toggleInvoice"
                                title="Print Invoice"
                                v-clickOutside="closeInvoice"
                            >
                                <ukt-inline-svg src="print"> </ukt-inline-svg>
                                <invoice-label-menu 
                                    v-if="toggleInvoice"
                                    :toggleMenu="'invoice'"
                                    :shipment="shipment"
                                    :viewType="isDrawerView"
                                ></invoice-label-menu>
                            </span>
                            <span
                                class="header-icon"
                                @click="toggleLabel = !toggleLabel"
                                title="Print Label"
                                v-clickOutside="closeLabel"
                            >
                                <ukt-inline-svg src="receipt"></ukt-inline-svg>
                                <invoice-label-menu 
                                    v-if="toggleLabel"
                                    :toggleMenu="'label'"
                                    :shipment="shipment"
                                    :viewType="isDrawerView"
                                ></invoice-label-menu>
                            </span>
                        </div>
                    </template>

                    <!-- Shipment Activity and Report Issues -->
                    <template>
                        <div
                            class="activity-log"
                            v-if="firstBag"
                            title="View Shipment Activity"
                        >
                            <div @click="shipmentActivity">
                                <ukt-inline-svg
                                    src="shipment-activity"
                                ></ukt-inline-svg>
                            </div>
                        </div>
                        <span
                            class="report-an-issue"
                            @click="$openIssueList"
                            title="Report an Issue"
                        >
                            <ukt-inline-svg src="report-issue"></ukt-inline-svg>
                            <span
                                v-if="issues && issues.length"
                                class="issues-count"
                                title="Click to see all issues"
                            >
                                {{ issues.length }}
                            </span>
                        </span>
                    </template>
                </div>
            </div>

        </div>
        <div class="sub-row" v-if="shipment && shipment.affiliate_details && shipment.affiliate_details.config">
            <div class="application-name">Application Name: {{shipment.affiliate_details.config.name}}</div>
        </div>
        <div class="sub-row">
            <div class="shipment-id">
                <nitrozen-badge
                    v-if="shipment"
                    :style="{
                        color: shipment.status.color_code || 'green',
                        'border-color': shipment.status.color_code || 'green',
                    }"
                >
                    {{ shipment.status.name }}
                </nitrozen-badge>
                
                <nitrozen-badge
                    class="ma-left"
                    v-if="shipment.priority < 10"
                    :style="{
                        color: '#F4F4F4',
                        'background-color':'#2E31BE',
                        'font-weight' : 600,
                        'border-color': '#2E31BE',
                    }"
                >
                    {{shipment.priority_text || 'High Priority'}}
                </nitrozen-badge>

                <div
                    class="multicheck"
                    v-if="
                        (isNew || isReturnInitiated) &&
                        !isClosed &&
                        shipment.bags.length > 1
                    "
                >
                    <span
                        @click="selectAllBags"
                        v-if="!selectedBags.every((v) => v) && canShipmentBreak"
                    >
                        Select All
                    </span>
                    <span
                        @click="unselectAllBags"
                        v-if="selectedBags.filter((v) => v).length != 0 && canShipmentBreak"
                    >
                        Clear All
                    </span>
                </div>
            </div>
        </div>

        <div class="shipment-card-content">
            <mirage-alert
                v-if="shipment.bags.length > 1 && !selectedBags.every((v) => v)"
                type="warning"
                class="unselected-bags"
            >
                <span v-if="isNew">Unselected bags will get cancelled</span>
                <span v-if="isReturnInitiated"
                    >Unselected bags will not get returned</span
                >
            </mirage-alert>

            <div class="sub-card" v-if="shipment">
                <shipment-bags 
                    :bags="shipment.bags"
                    :shipmentStatus="shipment.status"
                    v-model="selectedBags"
                    :isNew="isNew"
                    :isReturnInitiated="isReturnInitiated"
                    :orderDomain="shipment.orderDomain"
                    @selectionChange="selectBag"
                    :canBreak="canShipmentBreak"
                ></shipment-bags>
            </div>

            <div class="shipment-details">
                <div
                    class="fullfillment-store sub-card"
                    v-if="shipment.fulfilling_store"
                >
                    <fullfillment-store
                        :address="shipment.fulfilling_store"
                        :comment="shipment.comment"
                        @call="$emit('call', $event)"
                    ></fullfillment-store>
                    <div v-if="isShipmentReturnable()">
                        <div class="title-row bold-sm">Return Details</div>
                        <div class="desc-row" v-if="deliveryPromisedDate">
                            <span class="desc-title">Collect By: </span>
                            <span class="desc-value">{{shipment.collect_by}}</span>
                        </div>
                        <div class="desc-row" v-if="deliveryPromisedDate">
                            <span class="desc-title">Refund By: </span>
                            <span class="desc-value">{{shipment.refund_by}}</span>
                        </div>
                        <!-- <span
                            href="#"
                            class="desc-link"
                            @click="editShipmentAddressDialog('delivery')"
                        >
                            {{`View${!readOnlyMode?'/Edit':''} Pickup Address`}}
                        </span> -->
                    </div>
                    <div v-if="pickedDate">
                        <div class="desc-row">
                            <span class="desc-title">Picked Date: </span>
                            <span class="desc-value">{{
                                toDateTimeString(pickedDate)
                            }}</span>
                        </div>
                    </div>
                    <div v-if="shipment.packaging_type">
                        <div class="title-row bold-sm">Package Details</div>
                        <div class="desc-row">
                            <span class="desc-title">Package Type: </span>
                            <span class="desc-value"> {{ shipment.packaging_type }} </span>
                        </div>
                    </div>
                    <div v-if=" deliveryPromisedDate || deliveryEstimatedDate || dueDate ">
                        <div class="title-row bold-sm">Dates</div>
                        <div class="desc-row" v-if="deliveryPromisedDate">
                            <span class="desc-title">Promised Date: </span>
                            <span class="desc-value">{{
                                toDateTimeString(deliveryPromisedDate)
                            }}</span>
                        </div>
                        <div class="desc-row" v-if="deliveryEstimatedDate">
                            <span class="desc-title">Estimated Date: </span>
                            <span class="desc-value">{{
                                toDateTimeString(deliveryEstimatedDate)
                            }}</span>
                        </div>
                        <div class="desc-row" v-if="dueDate">
                            <span class="desc-title">Due Date: </span>
                            <span class="desc-value">{{ toDateTimeString(dueDate) }}</span>
                        </div>
                        <div class="desc-row">
                            <span class="desc-value">{{
                                deliveryStateString
                            }}</span>
                        </div>
                    </div>
                    <div v-if="shipment.credit_note_id">
                        <div class="title-row bold-sm">Credit Note Details</div>
                        <div class="desc-row">
                            <span class="desc-title">Credit Note ID: </span>
                            <span class="desc-value"> {{ shipment.credit_note_id }} </span>
                        </div>
                    </div>
                </div>

                <div class="price-tracking sub-card" v-if="shipment">
                    <prices-detail :shipment="shipment"></prices-detail>
                </div>
                <div class="price-tracking sub-card">
                    <!-- :awb="
                            firstBag
                                ? firstBag.current_status.delivery_awb_number
                                : ''
                        " -->
                    <shipment-tracking
                        v-if="shipment && shipment.tracking_details"
                        :shipment_id="shipment.id"
                        :tracking="shipment.tracking_details"
                        :invoiceId="
                            shipment &&
                            shipment.invoice &&
                            shipment.invoice.store_invoice_id
                        "
                        :awb="
                            shipment &&
                            shipment.dp_details &&
                            shipment.dp_details.awb_no
                        "
                        :dp_name="
                            shipment &&
                            shipment.dp_details &&
                            shipment.dp_details.name
                        "
                        :ewayBillNumber="
                            shipment &&
                            shipment.dp_details &&
                            shipment.dp_details.eway_bill_number
                        "
                        :track_url="shipment.dp_details.track_url_awb"
                    ></shipment-tracking>
                </div>
            </div>
        </div>

        <!-- shipment cancellation -->
        <!-- <shipment-cancellation-dialog
            ref="shipmentCancellationDialog"
            v-if="shipment"
            @close="$shipmentCancellationDialogClosed"
        >
        </shipment-cancellation-dialog> -->

        <!-- shipment activity -->
        <shipment-activity-dialog
            ref="shipmentActivityDialog"
            v-if="shipment && firstBag"
            @close="$shipmentActivityDialogClosed"
            :shipment_id="shipment.id"
            :bag_id="`${firstBag.id}`"
        >
        </shipment-activity-dialog>

        <!-- issues list -->
        <shipment-issue-list-dialog
            ref="shipmentIssueListDialog"
            v-if="shipment && issues"
            @close="$shipmentIssueListDialogClosed"
            :shipment_id="shipment.id"
            :issues="issues"
            :isDrawerView="isDrawerView"
        >
        </shipment-issue-list-dialog>

        <!-- Enter Invoice Number -->
        <!-- <nitrozen-dialog
            v-if="
                shipment &&
                shipment.status &&
                shipment.status.current_shipment_status == 'bag_confirmed' &&
                ((shipment.invoice && !shipment.invoice.store_invoice_id) ||
                    !shipment.invoice)
            "
            ref="enterInvoiceId"
            :title="`Enter Invoice Number for ${shipment ? shipment.id : ''}`"
        >
            <template slot="body">
                <nitrozen-input
                    v-model="store_invoice_id.value"
                    placeholder="Store Invoice Number"
                    label="Store Invoice Number"
                    :maxlength="16"
                ></nitrozen-input>
                <nitrozen-error
                    v-if="store_invoice_id.showError"
                    >{{ store_invoice_id.errorText }}</nitrozen-error
                >
            </template>

            <template slot="footer">
                <div>
                    <nitrozen-button
                        class="mr24"
                        @click="submitInvoiceId"
                        v-flatBtn
                        :theme="'secondary'"
                        >Submit</nitrozen-button
                    >
                    <nitrozen-button
                        @click="closeInvoiceDialog"
                        v-strokeBtn
                        :theme="'secondary'"
                        >Cancel</nitrozen-button
                    >
                </div>
            </template>
        </nitrozen-dialog> -->

        <!-- shipment qc dialog -->
        <!-- <shipment-qc-dialog
            ref="shipmentQCDialog"
            v-if="shipment"
            @close="$shipmentQcDialogClosed"
        >
        </shipment-qc-dialog> -->

        <!-- view prescription dialog -->
        <view-prescription
            ref="prescriptionDialog"
            v-if="shipment && viewPrescription.length"
        >
        </view-prescription>

        <!-- <nitrozen-dialog
            class="shipment-address-dialog"
            ref="addressDialog"
            :title="shipmentAddressCategory=='delivery' ? `Return Pickup Address` : `Billing Address`"
            :readOnlyMode="readOnlyMode"
            @close="closeAddressDialog"
        >   
            
            <template slot="body">
                <loader
                    v-if="shipmentAddressLoading"
                    class="loading"
                ></loader>
                <div class="name-div">
                <nitrozen-input
                    label="Name"
                    placeholder="Ex: Paul Lobo"
                    v-model="shipmentAddressName.value"
                ></nitrozen-input>
                    <nitrozen-error v-if="shipmentAddressName.showerror">
                        {{ shipmentAddressName.errortext }}
                    </nitrozen-error>
                </div>
                <div class="email-div">
                    <nitrozen-input
                        label="Email"
                        placeholder="Ex: paul@xyz.com"
                        v-model="shipmentAddressEmail.value"
                    ></nitrozen-input>
                    <nitrozen-error v-if="shipmentAddressEmail.showerror">
                        {{ shipmentAddressEmail.errortext }}
                    </nitrozen-error>
                </div>
                <div class="phone-div">
                    <nitrozen-input
                        label="Phone Number"
                        placeholder="Ex: 989XXXXXXX"
                        v-model="shipmentAddressPhone.value"
                    ></nitrozen-input>
                    <nitrozen-error v-if="shipmentAddressPhone.showerror">
                        {{ shipmentAddressPhone.errortext }}
                    </nitrozen-error>
                </div>
                <adm-address 
                    ref="address" 
                    v-model="formattedShipmentAddress"
                    :showMap="false"
                ></adm-address>
            </template>
        </nitrozen-dialog> -->
    </div>
</template>

<script>
import loader from '@/components/common/loader.vue';
// import MirageAlert from '@/components/alert/index.vue';
import FullfillmentStore from './fullfillment-store.vue';
import PricesDetail from './prices-detail.vue';
import ShipmentBags from './shipment-bags.vue';
import ShipmentTracking from './shipment-tracking.vue';
// import ShipmentCancellationDialog from './shipment-cancellation-dialog.vue';
import ShipmentActivityDialog from './shipment-activity-dialog.vue';
import ShipmentIssueListDialog from './shipment-issue-list-dialog.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import AdmInlineSvg from '@/components/common/adm-inline-svg.vue';
// import ShipmentQcDialog from './shipment-qc-dialog';
import ViewPrescription from './view-prescription-dialog';
import InvoiceLabelMenu from './invoice-label-menu.vue';

import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenBadge,
    NitrozenCheckBox,
    NitrozenDialog,
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown,
    NitrozenMenu,
    NitrozenMenuItem,
    clickOutside,
} from '@gofynd/nitrozen-vue';
import OrderService from '@/services/orders.service';
import SupportService from '@/services/support.service';
import { copyToClipboard } from '@/helper/utils.js';
import { GET_USER_INFO } from '@/store/getters.type';

import { mapGetters } from 'vuex';
import moment from 'moment';
import { RETURN_ORDER_STATUS } from '@/helper/constants';
// import admaddress from '@/components/common/address/index.vue';
const SHIPMENT_RETURNABLE_STAGES = ["delivery_done","return_request_cancelled"];
// import { eventHelper } from '../../../analytics/helpers';
// import { EVENTS, getUserInfo } from "../../../analytics/index"
export default {
    name: 'order-shipment',
    props: {
        readOnlyMode: {
            type: Boolean,
            default: false,
        },
        shipment: {
            type: Object,
            required: true,
        },
        currentStateShipmentCount: {
            type: Number,
            required: true,
        },
        isClosed: {
            type: Boolean,
            default: false,
        },
        showConfirm: {
            type: Boolean,
            default: false,
        },
        orderId: {
            type: String,
            required: true,
        },
        deliveryAddress: {
            type: Object,
            required: false,
        },
        applicationId: {
            type: String,
            required: true,
        },
        user: {
            type: Object,
        },
        validActions: {
            type: Object,
            // required: true,
            default: () => {}
        },
        isDrawerView: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    components: {
        UktInlineSvg,
        NitrozenButton,
        NitrozenBadge,
        NitrozenCheckBox,
        NitrozenDialog,
        NitrozenDropdown,
        NitrozenMenu,
        NitrozenMenuItem,
        FullfillmentStore,
        PricesDetail,
        ShipmentBags,
        ShipmentTracking,
        // ShipmentCancellationDialog,
        ShipmentActivityDialog,
        ShipmentIssueListDialog,
        loader,
        // MirageAlert,
        NitrozenInput,
        NitrozenError,
        AdmInlineSvg,
        // BankDetailsDialog,
        // ShipmentQcDialog,
        ViewPrescription,
        // 'adm-address':admaddress,
        InvoiceLabelMenu,
    },
    directives: { flatBtn, strokeBtn, clickOutside },
    data: function () {
        return {
            inProgress: false,
            isSelected: true, //false
            selectedBags: [],

            issues: [],
            store_invoice_id: {
                value: '',
                showError: false,
                errorText: '',
            },
            checkRefundObj: null,
            shipmentAddress:{},
            shipmentAddressLoading:true,
            shipmentAddressCategory:"delivery",
            formattedShipmentAddress:{},
            shipmentAddressName:this.getInitialValue(''),
            shipmentAddressEmail:this.getInitialValue(''),
            shipmentAddressPhone:this.getInitialValue(''),
            toggleInvoice: false,
            toggleLabel: false,
        };
    },
    computed: {
        deliveryPromisedDate() {
            return (
                this.shipment.promise &&
                this.shipment.promise.timestamp &&
                this.shipment.promise.timestamp.max
            );
        },
        deliveryEstimatedDate() {
            return (
                this.shipment.estimated_delivery_date &&
                this.shipment.estimated_delivery_date
            );
        },
        dueDate(){
            // return "due date"//this.shipment?.affiliate_details?.affiliate_meta?.due_date;
            return false;
        },
        pickedDate() {
            return (
                this.shipment.picked_date
            );
        },
        deliveryStateString() {
            let promisedDate = this.deliveryPromisedDate;
            let estimatedDate = this.deliveryEstimatedDate;
            if (promisedDate && estimatedDate) {
                promisedDate = moment(promisedDate);
                estimatedDate = moment(estimatedDate);
                let days = Number(estimatedDate.diff(promisedDate, 'days'));
                return days > 0
                    ? `Delivery ${Math.abs(days)} ${
                          days === 1 ? `day` : `days`
                      } late`
                    : days === 0
                    ? `Delivery on time`
                    : days < 0
                    ? `Delivery ${Math.abs(days)} ${
                          days === -1 ? `day` : `days`
                      } early`
                    : '';
            } else {
                return '';
            }
        },
        firstBag() {
            if (this.shipment && this.shipment.bags.length > 0) {
                const bag = this.shipment.bags[0];
                return bag;
            }
            return null;
        },
        // getDueTime() {
        //     return OrderService.getDueTime(this.shipment);
        // },
        isNew() {
            try {
                return ['placed', 'store_reassigned'].includes(
                    this.shipment.status.current_shipment_status
                );
            } catch (e) {
                return false;
            }
        },
        // isConfirmed() {
        //     try {
        //         return [
        //             'dp_assigned',
        //             'dp_reassigned',
        //             'out_for_pickup',
        //         ].includes(this.shipment.status.current_shipment_status);
        //     } catch (e) {
        //         return false;
        //     }
        // },
        // isDpAssign() {
        //     try {
        //         return [
        //             'bag_invoiced'
        //         ].includes(this.shipment.status.current_shipment_status) && !this.shipment.auto_trigger_dp_assignment;
        //     } catch (e) {
        //         return false;
        //     }
        // },
        // isPacked() {
        //     try {
        //         return [
        //             'bag_packed',
        //             'bag_not_picked',
        //             'bag_not_packed',
        //         ].includes(this.shipment.status.current_shipment_status);
        //     } catch (e) {
        //         return false;
        //     }
        // },
        // isReturnDelivered() {
        //     try {
        //         return ['return_bag_delivered', 'rto_bag_delivered'].includes(
        //             this.shipment.status.status // status => operational status, current_shipment_status => financial status
        //         );
        //     } catch (e) {
        //         return false;
        //     }
        // },
        isReturnInitiated() {
            try {
                return ['delivery_done'].includes(
                    this.shipment.status.current_shipment_status
                );
            } catch (e) {
                return false;
            }
        },
        ...mapGetters({
            accessDetail:{},// GET_EMPLOYEE_ACCESS_DETAIL,
            userinfo: GET_USER_INFO,
        }),
        checkReadRole() {
            const role = true;
                // this.accessDetail &&
                // this.accessDetail.order_role &&
                // this.accessDetail.order_role != 'read_only';
            return role;
        },
        checkUpdateRole() {
            const role = true
                // this.accessDetail &&
                // this.accessDetail.order_role &&
                // (this.accessDetail.order_role == 'store_manager' ||
                //     this.accessDetail.order_role == 'full_access');
            return role;
        },
        canShipmentBreak(){
            return false//this.validActions?.bag_confirmed?.can_break_entity ? this.validActions.bag_confirmed.can_break_entity : false
        },
        checkCustomerCareRole() {
            const role = true;
                // this.accessDetail &&
                // this.accessDetail.order_role &&
                // (this.accessDetail.order_role == 'customer_care' ||
                //     this.accessDetail.order_role == 'full_access');
            return role;
        },
        viewPrescription() {
            const prescription = [];
            if (this.shipment && this.shipment.bags.length) {
                this.shipment.bags.map((ele) => {
                    if(ele.files) {
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

    },
    mounted() {
        this.getReportedIssues();
        // this.checkShipmentRefund();
        this.smoothScroll();
    },
    methods: {
        getInitialValue(value) {
            return {
                value,
                showerror: false,
                errortext: ''
            };
        },  
        // checkExpectedPickedDate() {
        //     this.shipment.shipment_tracker?.statuses.forEach((item) => {
        //     if (item.display_status === "Packed" && item.passed) {
        //         const year = moment
        //         .unix(this.shipment?.shipment_created_at)
        //         .format("YYYY");
        //         const shipmentDate = item.date;
        //         const shipmentTime = item.time;
        //         const dateTime = new Date(shipmentDate + year + " " + shipmentTime);
        //         const thresoldTime = moment("12:00 PM", "hh:mma");
        //         const packedTime = moment(shipmentTime, "hh:mma");
        //         const nextDay = moment(dateTime).add(1, "days").weekday();
        //         const today = moment(dateTime).weekday();
        //         if (packedTime.isBefore(thresoldTime) && today !== 0) {
        //         this.pickUpDate = moment(dateTime).format("ddd, DD MMM");
        //         } else if (nextDay === 0) {
        //         this.pickUpDate = moment(dateTime)
        //             .add(2, "days")
        //             .format("ddd, DD MMM");
        //         } else {
        //         this.pickUpDate = moment(dateTime)
        //             .add(1, "days")
        //             .format("ddd, DD MMM");
        //         }
        //     }
        //     })
        // },
        copyURLToClipboard(text) {
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard');
        },
        toDateTimeString(date) {
            return moment(date).format('LT, MMM Do, YY');
        },
        // getShipmentPayload(nextStatus, reason, reason_text) {
        //     // shipment bags
        //     let bags;
        //     const shipmentBagIds = this.shipment.bags.map((b) => b.id);
        //     if (this.isNew || this.isReturnInitiated) {
        //         const selectedBags = shipmentBagIds.filter(
        //             (d, i) => this.selectedBags[i]
        //         );
        //         const isAllBags =
        //             selectedBags.length == this.shipment.bags.length;
        //         bags = isAllBags ? shipmentBagIds : selectedBags;
        //     } else {
        //         bags = shipmentBagIds;
        //     }

        //     let payload = {
        //         status_update: {
        //             bags,
        //             status: nextStatus,
        //             reason,
        //             reason_text,
        //         },
        //     };
        //     // partial confirmation of bags withing shipment leads to remaining bags to get cancelled
        //     if (
        //         nextStatus == 'bag_confirmed' &&
        //         !this.selectedBags.every((s) => s)
        //     ) {
        //         const unselectedBags = shipmentBagIds.filter(
        //             (d, i) => !this.selectedBags[i]
        //         );
        //         payload['exclude_shipments_pending'] = true;
        //         payload['exclude_shipments'] = [
        //             {
        //                 status_update: {
        //                     bags: unselectedBags,
        //                     status: 'bag_not_confirmed',
        //                     reason: {
        //                         90: unselectedBags,
        //                     },
        //                     reason_text:
        //                         'Unselected bags get cancelled from Fynd Platform',
        //                 },
        //             },
        //         ];
        //     }
        //     return payload;
        // },
        // updateShipmentStatus(nextStatus, reason, reason_text) {
        //     // final shipment payload
        //     const shipments = {
        //         [this.shipment.id]: this.getShipmentPayload(
        //             nextStatus,
        //             reason,
        //             reason_text
        //         ),
        //     };
        //     if (this.store_invoice_id.value) {
        //         shipments[this.shipment.id].status_update[
        //             'store_invoice_id'
        //         ] = this.store_invoice_id.value;
        //     }
        //     this.$emit('update', shipments, nextStatus);

        //     // event tracking
        //     const gaEventName = nextStatus.toUpperCase();
        //     const gaEventProperty = {
        //         shipment_ids:`${this.shipment.id}`,
        //         order_id: this.orderId,
        //         source: this.isDrawerView ? 'quick_view' : 'order_details_view'
        //     }
        //    // eventHelper.trackOrderUpdateEvent(EVENTS[gaEventName], getUserInfo(this.userinfo, this.accessDetail), gaEventProperty)
        // },
        getReportedIssues() {
            return SupportService.fetchTickets({
                limit: 200,
                page: 1,
                attachment_type: 'shipment',
                attachment_value: this.shipment.id,
            })
                .then(({ data }) => {
                    this.issues = data.items;
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        // cancelOrder() {
        //     this.$refs.shipmentCancellationDialog.open({
        //         shipments: [
        //             {
        //                 id: this.shipment.id,
        //                 bags: this.shipment.bags,
        //             },
        //         ],
        //     });
        // },
        // openQCDialog() {
        //     this.$refs.shipmentQCDialog.open(this.shipment.bags);
        // },
        // $shipmentQcDialogClosed(data) {
        //     if (data && data.action == 'submit') {
        //         // this.updateShipmentStatus(
        //         //     'return_accepted',
        //         //     data.reason,
        //         //     data.reason_text
        //         // );
        //     }
        // },
        $shipmentCancellationDialogClosed(data) {
            if (data && data.cancel) {
                // this.updateShipmentStatus(
                //     'bag_not_confirmed',
                //     data.shipments[this.shipment.id].reason,
                //     data.shipments[this.shipment.id].reason_text
                // );
            }
        },
        shipmentActivity() {
            this.$refs.shipmentActivityDialog.open();
        },
        $shipmentActivityDialogClosed(data) {
            console.log(data);
        },
        $openIssueList() {
            this.$refs.shipmentIssueListDialog.open();
        },
        $shipmentIssueListDialogClosed(data) {
            console.log(data);
        },
        selectAllBags() {
            this.selectedBags = this.selectedBags.map((v) => true);
            this.isSelected = true;
            this.$emit('calculateShipmentBag');
        },
        unselectAllBags() {
            this.selectedBags = this.selectedBags.map((v) => false);
            this.isSelected = false;
            this.$emit('calculateShipmentBag');
        },
        selectBag(e) {
            this.$forceUpdate();
            this.$nextTick(() => {
                if (this.selectedBags.filter((v) => v).length == 0) {
                    this.isSelected = false;
                } else {
                    this.isSelected = true;
                }
                this.$emit('calculateShipmentBag');
            });
        },
        selectShipment(e) {
            this.isSelected ? this.selectAllBags() : this.unselectAllBags();
        },
        // enterInvoiceId() {
        //     this.store_invoice_id.showError = false; 
        //     this.$refs.enterInvoiceId.open({
        //         width: '550px',
        //         height: '300px',
        //         showCloseButton: true,
        //     });
        // },
        // closeInvoiceDialog: function () {
        //     this.$refs.enterInvoiceId.close();
        // },
        submitInvoiceId() {
             let regex = new RegExp(/^([a-zA-Z1-9]{1}[a-zA-Z0-9\/-]{0,15})$/);
            if (!this.store_invoice_id.value) {
                this.store_invoice_id.showError = true;
                this.store_invoice_id.errorText = 'Enter Store Invoice Number';
                return
            } else if (!regex.test(this.store_invoice_id.value)){
                this.store_invoice_id.showError = true;
                this.store_invoice_id.errorText = 'Invalid Invoice no: Only A-Z, a-z, 0-9, /, - without spaces and max 16 length are allowed';
                return  
            }
            this.store_invoice_id.showError = false;
            this.store_invoice_id.errorText = '';
            this.updateShipmentStatus('bag_invoiced');
            this.closeInvoiceDialog();
        },
        isShipmentReturnable(){
            return this.shipment && this.shipment.status && SHIPMENT_RETURNABLE_STAGES.includes(this.shipment.status.status);
        },
        // checkShipmentRefund() {
        //     if (
        //         this.shipment &&
        //         this.shipment.status &&
        //         RETURN_ORDER_STATUS.includes(this.shipment.status.status)
        //     ) {
        //         OrderService.checkShipmentRefund(this.shipment.id)
        //             .then(({ data }) => {
        //                 this.checkRefundObj = data;
        //             })
        //             .catch((err) => {
        //                 console.error(err);
        //             });
        //     }
        // },
        // openBankDetails() {
        //     const data = {
        //         shipment: this.shipment,
        //         order_id: this.orderId,
        //         application_id: this.applicationId,
        //         delivery_address: this.deliveryAddress,
        //         user: this.user,
        //     };
        //     this.$refs.bankDetailsDialog.open(data);
        // },
        $openPrescriptionDialog() {
            this.$refs.prescriptionDialog.open(this.viewPrescription);
        },
        // getShipmentAddress() {
        //     if(this.isShipmentReturnable() && this.shipmentDetailsModifiable()){
        //         this.shipmentAddressLoading = true;
        //         const params = {
        //             shipment_id:this.shipment.id,
        //             address_category:this.shipmentAddressCategory
        //         }
        //         OrderService.getShipmentAddress(params)
        //             .then(({ data }) => {
        //                 let address = data.data;
        //                 this.shipmentAddress = address;
        //                 this.formattedShipmentAddress = {
        //                     address1: address.address,
        //                     address2: address.area,
        //                     landmark: address.landmark,
        //                     city: address.city,
        //                     state:address.state,
        //                     country:address.country,
        //                     pincode: address.pincode,
        //                 }
        //                 this.shipmentAddressName.value = address.name;
        //                 this.shipmentAddressEmail.value = address.email;
        //                 this.shipmentAddressPhone.value = address.phone;
        //                 this.shipmentAddressLoading = false;
        //             })
        //             .catch((err) => {
        //                 console.error(err);
        //                 this.$refs.addressDialog.close();
        //             });
        //     }
        // },
        // updateShipmentAddress() {
        //     if(this.isShipmentReturnable() && this.shipmentDetailsModifiable()){
        //         this.shipmentAddressLoading = true;
                
        //         const params = {
        //             shipment_id:this.shipment.id,
        //             address_category:this.shipmentAddressCategory
        //         }
        //         const a = this.$refs.address.getAddress();
        //         const body = {
        //             name:this.shipmentAddressName.value,
        //             email:this.shipmentAddressEmail.value,
        //             phone:this.shipmentAddressPhone.value,
        //             address: a.address1,
        //             area: a.address2,
        //             landmark: a.landmark,
        //             city: a.city && a.city.text,
        //             state:a.state && a.state.text,
        //             country:a.country && a.country.text,
        //             pincode: a.pincode
        //         }

        //         OrderService.updateShipmentAddress(params,body)
        //             .then(({ data }) => {
        //                 this.shipmentAddress = {};
        //                 this.formattedShipmentAddress = {}
        //                 this.shipmentAddressLoading = false;
        //                 this.$snackbar.global.showSuccess('Pickup Address updated successfully');
        //                 this.$refs.addressDialog.close();
        //             })
        //             .catch((err) => {
        //                 console.error(err);
        //                 this.$snackbar.global.showError('Something went wrong!');
        //             });
        //     }
        // },
        // editShipmentAddressDialog(address_category) {
        //     this.shipmentAddressCategory = address_category;
        //     this.getShipmentAddress();
        //     if(this.isShipmentReturnable()){
        //         this.$refs.addressDialog.open({
        //             width: '700px',
        //             height:'600px',
        //             showCloseButton: true,
        //             positiveButtonLabel:!this.readOnlyMode&&'Update',
        //             neutralButtonLabel:'Cancel'
        //         });   
        //     }
        // },
        // closeAddressDialog(value){
        //     if(value==='Update'){
        //         this.updateShipmentAddress()
        //     }
        // },
        smoothScroll() {
            if(this.$route.query.shipment_id){
            let target = document.getElementById(this.$route.query.shipment_id)
            let scrollContainer = target;
            do { //find scroll container
                scrollContainer = scrollContainer.parentNode;
                if (!scrollContainer) return;
                scrollContainer.scrollTop += 1;
            } while (scrollContainer.scrollTop == 0);

            let targetY = 0;
            do { //find the top of target relatively to the container
                if (target == scrollContainer) break;
                targetY += target.offsetTop;
            } while (target = target.offsetParent);

            scroll = function(c, a, b, i) {
                i++; if (i > 30) return;
                c.scrollTop = a + (b - a) / 20 * i;
                setTimeout(function(){ scroll(c, a, b, i); }, 20);
            }
            // start scrolling
            scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
            }
        },
        closeInvoice() {
            this.toggleInvoice = false;
        },
        closeLabel() {
            this.toggleLabel = false;
        }
    },
};
</script>

<style lang="less" scoped>

.hover {
    padding: 24px;
    &:hover {
        box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
    }
}

.shipment-title-header {
    display: flex;
}

.shipment-card {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    border-radius: 4px;
    background-color: #fff;
    position: relative;
    @media @mobile {
        display: block;
    }
    .desc-link {
        cursor: pointer;
        color: #2e31be;
        font-size: 12px;
        line-height: 22px;
        font-weight: 700;
    }
    .desc-row {
        .desc-title {
            color: #9b9b9b;
            font-size: 12px;
            font-weight: 700;
        }
        .desc-value {
            color: #9b9b9b;
            font-size: 12px;
            line-height: 22px;
            font-weight: 400;
        }
    }
    .title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        font-weight: 600;
        font-size: 14px;
        line-height: 25px;
        color: @Mako;
        margin-top: 6px;
        @media @mobile {
            display: block;
        }

        .shipment-id-value {
            cursor: pointer;
            padding-left: 10px;
            @media @mobile {
                padding-left: 0px;
            }
        }        
        .shipment-selector {
            height: 18px;
        }
        .due-date-container {
            color: @Mako;
            font-weight: 700;
            line-height: 43px;
            display: inline-block;
            height: 40px;
            font-size: 12px;
            padding: 0 12px;
        }
        .action-items {
            display: flex;
            flex: 1;
            justify-content: flex-end;
            align-items: center;
            @media @mobile {
                justify-content: space-between;
                margin-left: -12px;
                margin-bottom: 12px;
            }
            .shipment-lock{
            padding: 0px 12px;
            ::v-deep svg {
                fill: @RoyalBlue;
                transition:all 0.6s ease;
            }
        }
            button {
                margin-left: 12px;
            }
        }
    }
    .sub-row {
        display: flex;
        margin-top: 6px;
        .application-name{
        font-weight: 600;
        font-size: 14px;
        line-height: 25px;
        color: @Mako;
        }
        & > button {
            height: auto;
        }
        .shipment-id {
            display: flex;
            flex: 1;
            color: @Mako;
            font-size: 14px;
            line-height: 30px;
            .due-date-container {
                color: @Mako;
                font-weight: 700;
                display: inline-block;
                font-size: 12px;
                padding: 0 12px;
            }
            .shipment-id-value {
                cursor: pointer;
                padding-left: 10px;
                @media @mobile {
                    padding-left: 0px;
                }
            }
            .ma-left{
                margin-left: 8px;
            }
            .multicheck {
                margin-left: 12px;
                & > span {
                    color: @DustyGray2;
                    font-size: 12px;
                    padding: 0 3px;
                    cursor: pointer;
                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
    }

    .shipment-card-content {
        display: flex;
        flex-direction: column;
        .sub-card {
            background: white;
            border-radius: 4px;
            height: max-content;
            padding: 12px 6px 0;
        }
        .shipment-details {
            display: flex;
            flex-wrap: wrap;
            border-top: 1px solid @Iron;
            @media @mobile {
                display: block;
            }
            .fullfillment-store {
                width: calc(50% - 12px);
                @media @mobile {
                    width: 100%;
                }
            }
            .price-tracking {
                width: calc(25% - 12px);
                @media @mobile {
                    width: 100%;
                }
            }
        }
        .unselected-bags {
            margin: 24px 0 0 0;
        }
    }
}

.print-actions {
    display: flex;
    align-items: center;
    .print-invoice {
        display: flex;
        align-items: center;
    }
    .header-icon {
        display: flex;
        margin-left: 12px;
        border-radius: 3px;
        cursor: pointer;
        height: 40px;
        position: relative;
        svg{
            width: 30px;
            height: 30px;
        }
        ::v-deep svg {
            #prefix__Group-7,
            #prefix__Group-11,
            #prefix__Group-13 {
                stroke: @Mako;
            }
            &:hover {
                #prefix__Group-7,
                #prefix__Group-11,
                #prefix__Group-13 {
                    stroke: @RoyalBlue;
                }
            }
        }
    }
    .activity-log {
        justify-content: flex-end;
        margin: 0 0 0 12px;
        display: flex;
        border-radius: 3px;
        cursor: pointer;
        & > div > span {
            cursor: pointer;
        }
        &:hover {
            ::v-deep svg {
                #prefix__Stroke-1,
                #prefix__Stroke-3,
                #prefix__Stroke-12,
                #prefix__Group-28,
                #prefix__Group-13 {
                    stroke: @RoyalBlue;
                }
            }
        }
        ::v-deep svg {
            width: 20px;
            height: 20px;
            fill: 41434c;
        }
    }
    .report-an-issue {
        display: flex;
        border-radius: 3px;
        cursor: pointer;
        margin: 0 0 0 12px;
        position: relative;
        &:hover {
            ::v-deep svg {
                #prefix__Stroke-1,
                #prefix__Group-28,
                #prefix__Group-13 {
                    stroke: @RoyalBlue;
                }
            }
        }

        .issues-count {
            border-radius: 10px;
            line-height: 20px;
            color: white;
            background-color: tomato;
            display: flex;
            justify-content: center;
            padding: 0px 8px;
            cursor: pointer;
            font-size: 12px;
            position: absolute;
            top: -10px;
            right: -10px;
        }
    }
}

::v-deep .shipment-address-dialog {
    .nitrozen-dialog-body{
        .name-div,.email-div,.phone-div {
            margin-top: 15px;
        }
        .phone-div {
            margin-bottom: -5px;
        }
    }
    
}

</style>
