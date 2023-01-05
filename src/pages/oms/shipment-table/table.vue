<template>
    <div class="table-container">
        <table class="mirage-table list-table" v-if="items.length > 0">
            <tr class="table-header-row" v-if="columns.length && columns.length">
                <th
                    v-for="column in columns"
                    :key="column.value"
                    class="no-wrap"
                >
                    <div class="row-content">
                        <span class="table-header">
                            {{ column.text }}
                        </span>
                    </div>
                </th>
            </tr>

            <template v-if="activeShipmentDetails">
                <tr
                    :key="activeShipmentDetails.shipment_id"
                    class="line-break"
                    @click="onRowClick(activeShipmentDetails.shipment_id)"
                    :class="{activeRow: activeShipmentDetails.shipment_id === activeId}">
                    <td class="shipment-id" @click="copyShipmentId(activeShipmentDetails.shipment_id)">
                        <p class="shipment-id-css">
                            <span>{{ activeShipmentDetails.shipment_id }}</span>
                            <nitrozen-tooltip
                                v-if="activeShipmentDetails && activeShipmentDetails.forward_shipment_id"
                                position="top"
                                :tooltipText="`Shipment ID (Forward) : ${activeShipmentDetails.forward_shipment_id}` "
                            >
                            </nitrozen-tooltip>
                        </p>
                    </td>
                    <td class="shipment-price">
                        <!-- ₹{{ activeShipmentDetails.gst_details.brand_calculated_amount }} -->
                        ₹{{ activeShipmentPrice.toFixed(2) }}
                    </td>
                    <td class="items-count">
                        {{ activeShipmentDetails.total_items }}
                    </td>
                    <td>
                        <div class="status">
                             <nitrozen-badge state="success" v-if="activeShipmentDetails.status.status">
                                {{ convertCase(activeShipmentDetails.status.current_operational_status || activeShipmentDetails.status.status) }}
                            </nitrozen-badge>
                            <nitrozen-badge state="info" class="progress-badge" v-if="shipmentProcessing && activeShipmentDetails.shipment_id === activeId">
                                {{ "PROCESSING" }}
                            </nitrozen-badge>
                        </div>
                    </td>
                    <td class="actions" v-if="!shipmentProcessing">
                        <shipment-actions
                            class="actions-shipment"
                            v-if="!(shipmentProcessing && activeShipmentDetails.shipment_id === activeId) && activeShipmentDetails.order && activeShipmentDetails.order.ordering_channel && activeShipmentDetails.shipment_id === activeId"
                            :shipment="activeShipmentDetails"
                            :ordering_channel="activeShipmentDetails && activeShipmentDetails.order.ordering_channel"
                            :locked="activeShipmentDetails && activeShipmentDetails.lock_status"
                            @updateStatus="onStatusUpdate"
                            :rejectUpdate="rejectUpdate"
                            :readOnlyMode="readOnlyMode"
                            @statusUpdated="$emit('statusUpdated')"
                        ></shipment-actions>
                    </td>
                    <td>
                        <div tabindex="0" @blur="handleMenuBlur"> 
                            <nitrozen-menu class="advanced-menu" mode="vertical" ref="menu" v-if="advancedMenuItems && advancedMenuItems.length" @click="closeMenu()">
                                <nitrozen-menu-item 
                                    class="advanced-menu-item"
                                    v-for="menu_item in advancedMenuItems" 
                                    :key="menu_item.id" 
                                    :id="menu_item.id" 
                                    @click.stop="performMenuAction(menu_item)">
                                    <adm-inline-svg
                                        v-if="menu_item.icon"
                                        class="item-icon"
                                        :src="menu_item.icon"
                                        @mouseover="tag-icon"
                                    ></adm-inline-svg>
                                    <div class="item-text">{{menu_item.text}}</div>
                                </nitrozen-menu-item>
                            </nitrozen-menu>
                        </div>
                    </td>
                </tr>
                <tr
                    class="details-row"
                    :key="`detail_${activeShipmentDetails.shipment_id}`"
                    v-if="activeShipmentDetails.shipment_id === activeId">
                    <td colspan="6" class="details-cell">
                        <shipment-details
                            class="cell-details"
                            :data="activeShipmentDetails"
                            @reject="onRejectChange"
                            :readOnlyMode="readOnlyMode"
                            @updateOrderDetails="() => $emit('updateOrderDetails')"
                        ></shipment-details>
                    </td>
                </tr>
            </template>
        </table>

        <!-- <template v-if="items.length > 1">
            <div class="other-shipments">Other Shipments</div>
        </template> -->

        <table class="mirage-table list-table" v-if="items.length > 0">
            <template v-for="(item, index) in otherShipments">
                <tr 
                    :key="item.shipment_id" 
                    class="line-break" 
                    @click="onRowClick(item.shipment_id)"
                    :class="{activeRow: item.shipment_id === activeId}">
                    <td class="shipment-id" @click="copyShipmentId(item.shipment_id)">
                        <p class="shipment-id-css">
                            <span>{{ item.shipment_id }}</span>
                            <nitrozen-tooltip
                                v-if="item.forward_shipment_id"
                                position="top"
                                :tooltipText="`Shipment ID (Forward) : ${item.forward_shipment_id}` "
                            >
                            </nitrozen-tooltip>
                        </p>
                    </td>
                    <td class="shipment-price">
                        ₹{{ item.gst_details.brand_calculated_amount.toFixed(2) }}
                    </td>
                    <td class="items-count">
                        {{ item.total_items }}
                    </td>
                    <td>
                        <div class="status">
                             <nitrozen-badge state="success" v-if="item.status.status">
                                {{ convertCase(item.status.current_operational_status || item.status.status) }}
                            </nitrozen-badge>
                            <nitrozen-badge state="info" class="progress-badge" v-if="shipmentProcessing && item.shipment_id === activeId">
                                {{ "PROCESSING" }}
                            </nitrozen-badge>
                        </div>
                    </td>
                    <td class="actions" v-if="!shipmentProcessing">
                        <shipment-actions
                            class="action-s"
                            v-if="!(shipmentProcessing && item.shipment_id === activeId) && item.order && item.order.ordering_channel && item.shipment_id === activeId"
                            :shipment="item"
                            :ordering_channel="item && item.order.ordering_channel"
                            :locked="item && item.lock_status"
                            @updateStatus="onStatusUpdate"
                            :rejectUpdate="rejectUpdate"
                            :readOnlyMode="readOnlyMode"
                        ></shipment-actions>
                    </td>
                    <td>
                        <div tabindex="0" @blur="() => $refs.menus[index].closeMenu()">
                            <nitrozen-menu class="actions-menu" mode="vertical" ref="menus">
                                <nitrozen-menu-item @click="openHelpPage" >Help</nitrozen-menu-item>
                            </nitrozen-menu>
                        </div>
                    </td>
                </tr>
                <tr
                    class="details-row"
                    :key="`detail_${item.shipment_id}`"
                    v-if="item.shipment_id === activeId">
                    <td colspan="6" class="details-cell">
                        <shipment-details
                            :data="item"
                            @reject="onRejectChange"
                            :readOnlyMode="readOnlyMode"
                        ></shipment-details>
                    </td>
                </tr>
            </template>
        </table>

        <transition name="slide">
            <template v-if="isChangeBagState">
                <side-drawer
                    @close="closeDetails()"
                    :title="`Choose Next Bag State`"
                    :footer="true"
                >
                    <change-bag-state-drawer
                    ></change-bag-state-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="true"
                            theme="secondary"
                            v-flatBtn
                        >
                            Submit
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isSms && activeShipmentDetails">
                <side-drawer
                    class="sms-side-drawer"
                    @close="closeDetails()"
                    :title="`Send SMS to Customer`"
                    :footer="true"
                >
                    <sms-drawer
                        ref="sms-drawer"
                        :number="number"
                        :fullName="fullName"
                        :shipmentId="shipmentId"
                        :orderId="orderId"
                        :bagId="bagId"
                        :brandName="brandName"
                        :amountPaid="amountPaid"
                        :paymentMode="paymentMode"
                        @enableSubmitButton="enableSubmitButtonSms"
                    >
                    </sms-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="smsSubmit"
                            theme="secondary"
                            v-flatBtn
                            @click="sendSmsCutomer"
                        >
                            Send
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isDebugShipment">
                <side-drawer
                    class="debug-shipment-side-drawer"
                    @close="closeDetails()"
                    :title="`Debug Order Info For: FY53425324532453245324`"
                    :footer="false"
                >
                    <debug-shipment-drawer
                    >
                    </debug-shipment-drawer>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isCall">
                <side-drawer
                    class="call-side-drawer"
                    @close="closeDetails()"
                    :title="`Call`"
                    :footer="true"
                >
                    <call-drawer
                    >
                    </call-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="true"
                            theme="secondary"
                            v-flatBtn
                            @click="sendSmsCutomer"
                        >
                            Call
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isTagEmployee">
                <side-drawer
                    class="tag-employee-drawer"
                    @close="closeDetails()"
                    :title="`Tag Employee to Shipment`"
                    :footer="true"
                >
                    <tag-employee-drawer
                    >
                    </tag-employee-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="true"
                            theme="secondary"
                            v-flatBtn
                        >
                            Submit
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isReassignStore">
                <side-drawer
                    class="reassign-store-drawer"
                    @close="closeDetails()"
                    :title="`Reassign store`"
                    :footer="true"
                >
                    <reassgin-store-drawer
                        ref="store-assign-call"
                        :reasons="reasons"
                        :stores="stores"
                        :bagId="bagId"
                        @enableSubmitForReassignStore="isSubmitReassingStore"
                    >
                    </reassgin-store-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="isSubmitStore"
                            theme="secondary"
                            v-flatBtn
                            @click="callStoreAssign"
                        >
                            Submit
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isBankDetails">
                <side-drawer
                    class="bank-details-drawer"
                    @close="closeDetails()"
                    :title="`Add Bank Details: 16345834590202348554`"
                    :footer="true"
                >
                    <bank-details-drawer
                    >
                    </bank-details-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="true"
                            theme="secondary"
                            v-flatBtn
                        >
                            Submit
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isChangeAddress">
                <side-drawer
                    class="change-address-drawer"
                    @close="closeDetails()"
                    :title="`Change Adress`"
                    :footer="true"
                >
                    <change-address-drawer
                    >
                    </change-address-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="true"
                            theme="secondary"
                            v-flatBtn
                        >
                            Submit
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isDebugShipment">
                <side-drawer
                    class="debug-shipment-side-drawer"
                    @close="closeDetails()"
                    :title="`Debug Order Info For: FY53425324532453245324`"
                    :footer="false"
                >
                    <debug-shipment-drawer
                    >
                    </debug-shipment-drawer>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isCall">
                <side-drawer
                    class="call-side-drawer"
                    @close="closeDetails()"
                    :title="`Call`"
                    :footer="true"
                >
                    <call-drawer
                    >
                    </call-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="true"
                            theme="secondary"
                            v-flatBtn
                        >
                            Call
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isTagEmployee">
                <side-drawer
                    class="tag-employee-drawer"
                    @close="closeDetails()"
                    :title="`Tag Employee to Shipment`"
                    :footer="true"
                >
                    <tag-employee-drawer
                    >
                    </tag-employee-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="true"
                            theme="secondary"
                            v-flatBtn
                        >
                            Submit
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isReassignStore">
                <side-drawer
                    class="reassign-store-drawer"
                    @close="closeDetails()"
                    :title="`Reassign store`"
                    :footer="true"
                >
                    <reassgin-store-drawer
                        ref="store-assign-call"
                        :reasons="reasons"
                        :stores="stores"
                        :bagId="bagId"
                        @enableSubmitForReassignStore="isSubmitReassingStore"
                    >
                    </reassgin-store-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="isSubmitStore"
                            theme="secondary"
                            v-flatBtn
                            @click="callStoreAssign"
                        >
                            Submit
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isBankDetails">
                <side-drawer
                    class="bank-details-drawer"
                    @close="closeDetails()"
                    :title="`Add Bank Details: 16345834590202348554`"
                    :footer="true"
                >
                    <bank-details-drawer
                    >
                    </bank-details-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="true"
                            theme="secondary"
                            v-flatBtn
                        >
                            Submit
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isChangeAddress">
                <side-drawer
                    class="change-address-drawer"
                    @close="closeDetails()"
                    :title="`Change Adress`"
                    :footer="true"
                >
                    <change-address-drawer
                    >
                    </change-address-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="true"
                            theme="secondary"
                            v-flatBtn
                        >
                            Submit
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenBadge, NitrozenMenu, NitrozenMenuItem, NitrozenTooltip, flatBtn, NitrozenButton
} from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';

/* Component imports */
import ShipmentDetails from '@/pages/oms/shipment-details/index.vue';
import ShipmentActions from './actions.vue';
import AdmInlineSvg from '@/components/common/inline-svg.vue';
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';
import ChangeBagStateDrawer from './change-bag-state-drawer.vue';
import SmsDrawer from './sms-drawer.vue';
import DebugShipmentDrawer from './debug-shipment-drawer.vue';
import CallDrawer from './call-drawer.vue';
import ReassginStoreDrawer from './reassign-store-drawer.vue';
import TagEmployeeDrawer from './tag-employee-drawer.vue';
import BankDetailsDrawer from './bank-details-drawer.vue';
import ChangeAddressDrawer from './change-address-drawer.vue';

/* Helper imports */
import { convertSnakeCaseToString, copyToClipboard } from '@/helper/utils.js';

/* Service imports */
import OrderService from '@/services/orders.service';

/* Constants */
const BASE_MENU_ITEMS = [
    {
        id:1,
        text:"Create Invoice (S3)",
        value:"create_invoice_s3",
        icon:"create-invoice",
        forceDisplay: false
    },
    // {
    //     id:2,
    //     text:"Call",
    //     value:"call",
    //     icon:"call-icon",
    //     forceDisplay: false
    // },
    {
        id:3,
        text:"SMS",
        value:"sms",
        icon:"sms-logo",
        forceDisplay: false
    },
    // {
    //     id:4,
    //     text:"Debug Logistics",
    //     value:"debug_logistics",
    //     icon:"debug-logistics"
    // },
    // {
    //     id:5,
    //     text:"Debug Shipment",
    //     value:"debug_shipment",
    //     icon:"debug-shipment"
    // },
    // {
    //     id:6,
    //     text:"Tag Employee",
    //     value:"tag_employee",
    //     icon:"tag-employee"
    // },
    // {
    //     id:7,
    //     text:"Change Bag State",
    //     value:"change_bag_state",
    //     icon:"flag"
    // },
    // {
    //     id:8,
    //     text:"Bank Details",
    //     value:"bank_details",
    //     icon:"bank"
    // },
    {
        id:9,
        text:"Reassign Store",
        value:"reassign_store",
        icon:"store-assign",
        forceDisplay: false
    },
    // {
    //     id:10,
    //     text:"Initiate NDR",
    //     value:"initiate_ndr",
    //     icon:"ndr"
    // },
    // {
    //     id:11,
    //     text:"Change Address",
    //     value:"change_address",
    // },
    {
        id: 12,
        text: "Generate E-invoice ",
        value: "generate_e_invoice",
        forceDisplay: false
    },
    {
        id: 13,
        text: "Mark Return As Delivered",
        value: "mark_return_delivered",
        forceDisplay: false
    },
    {
        id: 14,
        text: "Help",
        value: "help",
        forceDisplay: true
    }
];


export default {
    name: 'shipment-table',
    props: {
        items: Array,
        columns: Array,
        activeId: String,
        readOnlyMode: {
            type: Boolean,
            default: false
        },
        shipmentProcessing:{
            type: Boolean,
            default: false
        }
    },
    components: {
        NitrozenBadge,
        NitrozenMenu,
        NitrozenMenuItem,
        ShipmentActions,
        ShipmentDetails,
        AdmInlineSvg,
        SideDrawer,
        ChangeBagStateDrawer,
        NitrozenButton,
        NitrozenTooltip,
        SmsDrawer,
        DebugShipmentDrawer,
        CallDrawer,
        ReassginStoreDrawer,
        TagEmployeeDrawer,
        BankDetailsDrawer,
        ChangeAddressDrawer
    },
    directives: {
        flatBtn,
    },
    data() {
        return {
            rejectUpdate: cloneDeep(this.items),
            activeShipmentDetails: null,
            otherShipments: [],
            activeShipmentPrice: 0,
            isCreateInvoiceS3: false,
            isCall: false,
            isSms: false,
            isDebugLogistics: false,
            isDebugShipment: false,
            isTagEmployee: false,
            isChangeBagState: false,
            isBankDetails: false,
            isReassignStore: false,
            isInitiateNdr: false,
            isChangeAddress: false,
            number: [],
            fullName: "",
            orderId: "",
            shipmentId: "",
            bagId: "",
            brandName: "",
            amountPaid: "",
            paymentMode: "",
            smsSubmit: true,
            status: "",
            reasons: [],
            stores: [],
            isSubmitStore: true,
            statusForCreateS3: [],
        }
    },
    computed:{
        advancedMenuItems(){
            return BASE_MENU_ITEMS.filter(mi=> this.isMenuItemValid(mi));
        },
    },
    mounted(){
        this.items.forEach(ele => {
            if(ele.shipment_id == this.activeId){
                this.activeShipmentDetails = ele;
                this.number.push({ text: this.activeShipmentDetails.user.mobile, value: this.activeShipmentDetails.user.mobile});
                this.fullName = `${this.activeShipmentDetails.user.first_name} ${this.activeShipmentDetails.user.last_name}`;
                this.orderId = this.activeShipmentDetails.order.fynd_order_id;
                this.shipmentId = this.activeShipmentDetails.shipment_id;
                if(this.activeShipmentDetails.bags[0].entity_type == 'set') {
                    this.bagId = this.activeShipmentDetails.bags[0].products[0].bag_id.toString();
                    this.brandName = this.activeShipmentDetails.bags[0].products[0].item.brand;
                } else {
                    this.bagId = this.activeShipmentDetails.bags[0].bag_id.toString();
                    this.brandName = this.activeShipmentDetails.bags[0].item.brand;
                }
                this.status = this.activeShipmentDetails.status.status;
                this.amountPaid = this.activeShipmentDetails.order.prices.amount_paid.toString();
                if(
                    this.activeShipmentDetails && 
                    this.activeShipmentDetails.order &&
                    this.activeShipmentDetails.order.payment_methods &&
                    Object.keys(this.activeShipmentDetails.order.payment_methods) == "COD") {
                    this.paymentMode = "COD";
                }
                else {
                    this.paymentMode = "PREPAID";
                }
                this.activeShipmentPrice = cloneDeep(ele.bags).reduce((total, item) => {
                    let finalQuantity = 0;
                    let finalPrice = 0;
                    if(item.entity_type === 'set' && item.article && item.article.set && item.article.set.quantity) {
                        finalQuantity = item.article.set.quantity;
                        if(item.financial_breakup) {
                            finalPrice = item.financial_breakup.reduce((total, bag) => total + bag.brand_calculated_amount, 0);
                        }
                    } else {
                        finalQuantity = item.quantity;
                        finalPrice = finalQuantity * item.financial_breakup[0].brand_calculated_amount;
                    }
                    return finalPrice + total;
                }, 0);
            } else {
                this.otherShipments.push(ele);
            }
        });
    },
    methods: {
        closeDetails() {
            this.isCreateInvoiceS3 = false;
            this.isCall = false;
            this.isSms = false;
            this.isDebugLogistics = false;
            this.isDebugShipment = false;
            this.isTagEmployee = false;
            this.isChangeBagState = false;
            this.isBankDetails = false;
            this.isReassignStore = false;
            this.isInitiateNdr = false;
            this.isChangeAddress = false;
        },
        onRowClick(id) {
            if(id !== this.activeId) {
                this.$emit('changeShipment', id);
            }
        },
        convertCase(text) {
            return convertSnakeCaseToString(text);
        },
        onRejectChange() {
            let updatedPrice = cloneDeep(this.activeShipmentDetails.bags).reduce((total, item) => {
                if(item.entity_type == 'set'){
                    let finalQuantity = item.article.set.quantity - item.rejected;
                    let finalPrice = finalQuantity > 0 ? item.financial_breakup.reduce((sum, item) => sum + item.brand_calculated_amount, 0) : 0
                    return finalPrice + total
                } else {
                    let finalQuantity = item.quantity - item.rejected;
                    let finalPrice = finalQuantity * item.financial_breakup[0].brand_calculated_amount;
                    return finalPrice + total;
                }
            }, 0);
            this.activeShipmentPrice = updatedPrice;
            this.rejectUpdate = cloneDeep(this.items);
        },
        onStatusUpdate(event, actionItem) {
            if(event === 'bag_confirmed') {
                this.$emit('displayConfirmScreen', { cancel: false });
            } else if(event === 'cancel_order') {
                this.$emit('displayConfirmScreen', { cancel: true });
            } else {
                let payload = {
                    force_transition: false,
                    task: false,
                    lock_after_transition: false,
                    unlock_before_transition: false,
                    statuses: [
                        {
                            shipments: [
                                {
                                    identifier: this.activeId,
                                    products: []
                                }
                            ],
                            status: event,
                            exclude_bags_next_state: null
                        }
                    ]
                };

                if(event === 'bag_invoiced') {
                    /**
                     * Old: 26/11/2022 19:33
                     * Latest: 08/12/2022 01:58
                     * The following commented code was used for the original updation.
                     * It has now been replaced by the code according to the new format.
                     * Decision has to be taken for the final format.
                     * - Rushabh Mulraj Shah
                     */
                    // payload.statuses[0].shipments[this.activeId]['store_invoice_id'] = actionItem;

                    payload.statuses[0].shipments[0]['data_updates'] = {
                        products: [{
                            filters: [{}],
                            data: {
                                store_invoice_id: actionItem
                            }
                        }],
                        entities: [{
                            filters: [{}],
                            data: {
                                store_invoice_id: actionItem
                            }
                        }]
                    };
                } else {
                    let activeShipment = this.items.find(shipment => shipment.shipment_id === this.activeId);
                    if(activeShipment.store_invoice_id) {
                        /**
                         * 26/11/2022 19:33
                         * Latest: 08/12/2022 01:58
                         * The following commented code was used for the original updation.
                         * It has now been replaced by the code according to the new format.
                         * Decision has to be taken for the final format.
                         * - Rushabh Mulraj Shah
                         */
                        // payload.statuses[0].shipments[this.activeId]['store_invoice_id'] = activeShipment.store_invoice_id;
                        payload.statuses[0].shipments[0]['data_updates'] = {
                            products: [{
                                filters: [{}],
                                data: {
                                    store_invoice_id: actionItem
                                }
                            }],
                            entities: [{
                                filters: [{}],
                                data: {
                                    store_invoice_id: actionItem
                                }
                            }]
                        };
                    }
                }

                this.$emit('updateStatus', payload);
            }
        },
        copyShipmentId(text) {
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard');
        },
        closeContextMenu(){
            this.$refs['context-menu'].closeMenu()
        },
        createS3Invoice(){
            let data = {shipment_ids: [this.activeId]}
            this.$snackbar.global.showInfo('Your S3 invoice is getting generated');
            OrderService.createS3Invoice(data).then((res)=>{
                this.$snackbar.global.showSuccess('S3 invoice generated!')
            }).catch((err)=> {
                console.error("Failed to create S3 invoice ", err)
            })
        },
        isMenuItemValid(item){
            if(item.value == "create_invoice_s3") {
                this.statusForCreateS3 = ['placed', 'bag_confirmed', 'bag_not_confirmed', 'store_reassigned', 'dp_not_assigned'];
                return (!this.statusForCreateS3.includes(this.activeShipmentDetails.status.status)) && (this.activeShipmentDetails.actionable);
            }
            if(item.value == "generate_e_invoice") {
                return  this.activeShipmentDetails &&
                        this.activeShipmentDetails.actionable &&
                        this.activeShipmentDetails.einvoice_info && 
                        this.activeShipmentDetails.einvoice_info.invoice &&
                        this.activeShipmentDetails.einvoice_info.invoice.message &&
                        this.activeShipmentDetails.einvoice_info.invoice.message[0] &&
                        this.activeShipmentDetails.einvoice_info.invoice.message[0].ErrorCode &&
                        this.activeShipmentDetails.einvoice_info.invoice.message[0].ErrorMessage;
            }
            if(item.value == 'mark_return_delivered') {
                return this.activeShipmentDetails.status.status == 'return_initiated' && this.activeShipmentDetails.actionable;
            }
            if(item.value == 'sms') {
                return this.activeShipmentDetails.actionable;
            }
            if(item.value == 'reassign_store') {
                return this.activeShipmentDetails.actionable && ['placed', 'store_reassigned', 'bag_not_confirmed'].includes(this.activeShipmentDetails.status.status);
            }
            else {
                return true;
            }
        },
        performMenuAction(item){
            if(item.value == 'create_invoice_s3') { this.createS3Invoice() };
            if(item.value == 'call') { this.isCall = true };
            if(item.value == 'sms') { this.isSms = true };
            if(item.value == 'debug_logistics') { this.isDebugLogistics = true };
            if(item.value == 'debug_shipment') { this.isDebugShipment = true };
            if(item.value == 'tag_employee') { this.isTagEmployee = true };
            if(item.value == 'change_bag_state') { this.isChangeBagState = true };
            if(item.value == 'bank_details') { this.isBankDetails = true };
            if(item.value == 'reassign_store') { this.fetchReasons() };
            if(item.value == 'initiate_ndr') { this.isInitiateNdr = true };
            if(item.value == 'change_address') { this.isChangeAddress = true };
            if(item.value == 'generate_e_invoice') { this.generateEInvoice() };
            if(item.value == 'mark_return_delivered') { this.markReturnDelivered() };
            if(item.value == 'help') { this.openHelpPage() };
        },
        openHelpPage() {
            window.open(`https://platform.fynd.com/help/`, '_blank');
        },
        markReturnDelivered() {
            let payload = {
                statuses: [
                    {
                        shipments: [
                            {
                                identifier: this.activeShipmentDetails.shipment_id,
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
                        status: 'return_bag_delivered',
                        exclude_bags_next_state: null
                    }
                ],
                task: false,
                force_transition: false,
                lock_after_transition: false,
                unlock_before_transition: false
            };
            this.$emit('updateStatus', payload);
        },
        handleMenuBlur() {
            if(this.$refs.menu) this.$refs.menu.closeMenu();
        },
        enableSubmitButtonSms(event) {
            this.smsSubmit = event;
        },
        sendSmsCutomer() {
            this.$refs['sms-drawer'].sendSmsToCustomer();
        },
        fetchReasons() {
            OrderService.getReasons(this.shipmentId, this.bagId, this.status).then((res)=>{
                if(res.data.success == true) {
                    this.reasons = res.data.reasons.map(reason => {
                        reason['text'] = reason.display_name;
                        reason['value'] = reason.id;
                        return reason;
                    });
                    this.fetchStores();
                }
            }).catch((err)=> {
                console.error("Failed to get reasons for re-assign store ", err)
            })
        },
        fetchStores() {
            let params = {
                bag_id: this.bagId,
                all_stores: true,
                limit: 100,
            }
            OrderService.getStores(params).then((res)=>{
                if(res.data.success == true) {
                    this.stores = res.data.stores.map(store => {
                        store['text'] = store.name;
                        store['value'] = store.store_id;
                        store['address'] = `${store.address1} ${store.address2} ${store.city}`
                        return store;
                    });
                    this.isReassignStore = true;
                }
            }).catch((err)=> {
                console.error("Failed to get stores for re-assign store ", err)
            })
        },
        isSubmitReassingStore(e) {
            this.isSubmitStore = e;
        },
        callStoreAssign() {
            this.$refs['store-assign-call'].assignNewStore();
        },
        generateEInvoice() {
            let data = {
                shipment_ids: [this.shipmentId],
                force_invoicing: true
            }
            OrderService.hitEInvoice(data).then((res)=>{
                if(res.data.errors[0].msg.error) {
                    this.$snackbar.global.showError("Failed to generate E-invoice")
                }
                else {
                    this.$snackbar.global.showSuccess('E-invoice generated successfully')
                }
            }).catch((err)=> {
                console.error("Failed to generate E-invoice ", err)
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import './../less/table.less';

.mirage-table tr:not(:first-child) {
    border-bottom: 1px solid #E4E5E6 !important;
}

.table-container{
    max-height: unset;
    overflow-y: hidden;
    border: none;
}

.list-table{
    border: 1px solid #eeeeee;
}

.table-container .list-table td {
    vertical-align: middle !important;
    
}

tr.table-header-row:hover {
    cursor: default !important;
    background-color: #F6F6F6 !important;
}

.details-row:hover {
    background: none !important;
    cursor: default !important;
}

.details-cell {
    padding: 16px !important;
}

.activeRow {
    background-color: unset !important;
}

tr.list-table.activeRow:hover{
    cursor: default !important;
    background-color: unset !important;
}

.status {
    display: flex;
    gap: 10px;
}

.actions {
    width: 35%;
}

.no-wrap {
  white-space: nowrap;
}

.progress-badge{
  -webkit-animation: linear infinite;
  -webkit-animation-name: breathe;
  -webkit-animation-duration: 1.2s;
  animation: linear infinte;
  animation-name: breathe;
  animation-duration: 1.2s;
}

@keyframes breathe {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}
.other-shipments{
    padding: 24px 0 16px;
    font-size: 14px;
    line-height: 21px;
    color: @Mako;
}

.advanced-menu{
    .advanced-menu-item{
        display: flex;
        gap: 10px;
        color: #4D4D4E;

        ::v-deep.item-icon{
            svg path{
                fill: #979797;
            }
        }

        &:hover{
            color:@RoyalBlue;
            background: #E7EEFF;
            ::v-deep.item-icon{
                 svg path{
                    fill: @RoyalBlue;
                }
            }
        }
    }
}
    
.shipment-id {
    .shipment-id-css {
        display: flex;
        align-items: center;
            ::v-deep .nitrozen-tooltip {
            padding-left: 9px;
            .nitrozen-inline-svg {
                svg {
                width: 10px;
                    height: 10px;
                }
                g {
                    fill: #9B9B9B;
                    stroke-width: 3;
                }
            }
            .nitrozen-tooltiptext {
            //     background: #3D3D3D;
            //     border-radius: 4px;
                font-weight: 400;
                font-size: 12px;
                line-height: 160%;
            //     display: flex;
            //     align-items: center;
            //     color: #FFFFFF;
                width: 400px;
            //     height: 50px;
            }
            .nitrozen-tooltip-top {
                margin-left: -88px;
            }
        }
    }
}
::v-deep .slide-fade {
    .sidedrawer-footer {
        display: flex;
        justify-content: flex-end;
    }
}

::v-deep .slide-fade {
    .sidedrawer-footer {
        display: flex;
        justify-content: flex-end;
    }
}

.sms-side-drawer, .debug-shipment-side-drawer, .reassign-store-drawer, .bank-details-drawer {
    ::v-deep .sidedrawer-container {
        width: 50%;
    }
}
.call-side-drawer {
    ::v-deep .sidedrawer-container {
        min-width: 25%;
    }
}
.call-side-drawer {
    ::v-deep .sidedrawer-container {
        min-width: 25%;
    }
}

</style>

