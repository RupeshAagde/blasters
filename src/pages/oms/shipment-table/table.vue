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
                        ₹{{ formatPrice(activeShipmentPrice) }}
                    </td>
                    <td class="items-count">
                        {{ activeShipmentDetails.total_items }}
                    </td>
                    <td>
                        <div class="status">
                             <nitrozen-badge state="success" v-if="activeShipmentDetails.status.status">
                                <!-- {{ convertCase(activeShipmentDetails.status.current_operational_status || activeShipmentDetails.status.status) }} -->
                                {{ activeShipmentDetails.status.display_name }}
                            </nitrozen-badge>
                            <nitrozen-badge state="info" class="progress-badge" v-if="shipmentProcessing && activeShipmentDetails.shipment_id === activeId">
                                {{ "PROCESSING" }}
                            </nitrozen-badge>
                        </div>
                    </td>
                    <td class="actions" v-if="!shipmentProcessing">
                        <div class="admin-action"    v-if="activeShipmentDetails.shipment_id == activeId">
                            <invoice-label-actions
                             
                                class="action-s"
                                :shipment="activeShipmentDetails"
                                :ordering_channel="activeShipmentDetails && activeShipmentDetails.order.ordering_channel"
                                :locked="activeShipmentDetails && activeShipmentDetails.lock_status"
                                :readOnlyMode="readOnlyMode"
                            >
                            </invoice-label-actions>
                            <admin-actions 
                                @change="performMenuAction"
                                :activeShipment="activeShipment" />
                        </div>
                    </td>
                    <!-- <td>
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
                    </td> -->
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

        <table class="mirage-table list-table" v-if="items.length > 0">
            <template v-for="item in otherShipments">
                <tr 
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
                        ₹{{ formatPrice(item.bags.reduce((total, bag) => total + ((bag.quantity - (bag.rejected || 0)) * bag.financial_breakup.brand_calculated_amount), 0)) }}
                    </td>
                    <td class="items-count">
                        {{ item.total_items }}
                    </td>
                    <td>
                        <div class="status">
                             <nitrozen-badge state="success" v-if="item.status.status">
                                <!-- {{ convertCase(item.status.current_operational_status || item.status.status) }} -->
                                {{ item.status.display_name }}
                            </nitrozen-badge>
                            <nitrozen-badge state="info" class="progress-badge" v-if="shipmentProcessing && item.shipment_id === activeId">
                                {{ "PROCESSING" }}
                            </nitrozen-badge>
                        </div>
                    </td>
                    <td class="actions" v-if="!shipmentProcessing">
                        <!-- <shipment-actions
                            class="action-s"
                            v-if="!(shipmentProcessing && item.shipment_id === activeId) && item.order && item.order.ordering_channel && item.shipment_id === activeId"
                            :shipment="item"
                            :ordering_channel="item && item.order.ordering_channel"
                            :locked="item && item.lock_status"
                            @updateStatus="onStatusUpdate"
                            :rejectUpdate="rejectUpdate"
                            :readOnlyMode="readOnlyMode"
                        ></shipment-actions> -->
                        <div class="admin-action">
                            <invoice-label-actions
                                class="action-s"
                                v-if="!(shipmentProcessing && item.shipment_id === activeId) && item.order && item.order.ordering_channel && item.shipment_id === activeId"
                                :shipment="item"
                                :ordering_channel="item && item.order.ordering_channel"
                                :locked="item && item.lock_status"
                                @updateStatus="onStatusUpdate"
                                :rejectUpdate="rejectUpdate"
                                :readOnlyMode="readOnlyMode"
                            >
                            </invoice-label-actions>
                            <admin-actions 
                                v-if="
                                    !(shipmentProcessing && item.shipment_id === activeId) && 
                                    item.order && 
                                    item.order.ordering_channel && 
                                    item.shipment_id === activeId
                                "
                                @change="performMenuAction"
                                :activeShipment="activeShipment"
                            />
                        </div>
                    </td>
                    <!-- <td>
                        <div tabindex="0" @blur="() => $refs.menus[index].closeMenu()">
                            <nitrozen-menu class="actions-menu" mode="vertical" ref="menus">
                                <nitrozen-menu-item @click="openHelpPage" >Help</nitrozen-menu-item>
                            </nitrozen-menu>
                        </div>
                    </td> -->
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

        <!-- Change Bag State Drawer -->
        <transition name="slide">
            <template v-if="isChangeBagState">
                <side-drawer
                    @close="closeDetails()"
                    :title="`Choose Next Bag State`"
                    :footer="true"
                    :css="isCreditNoteReturn ? isMobile() ? { width: '100%' } : { width: '60%' } : {width: '30%'}"
                    class="cn-return-drawer"
                >
                    <change-bag-state-drawer
                        ref="change-bag-state"
                        :shipment="activeShipment"
                        @change="onBagChangeState"
                        @showCreditNoteReturn="showCreditNoteReturn"
                        @updateStatusOfFooter="updateStatusOfFooter"
                        @isVerified="isVerified"
                        @isHide="isHide"
                        @openRefundDrawer="openRefundDrawer"
                        @callOrderDetails="callOrderDetails"
                        @closeDrawer="closeDetails()"
                    />
                    <template #footer v-if="!isCreditNoteReturn">
                        <nitrozen-button
                            class="button-submit"
                            :disabled="!enableBagStateChange"
                            theme="secondary"
                            v-flatBtn
                            @click="onStateChangeClick"
                        >
                            Submit
                        </nitrozen-button>
                    </template>
                    <template #footer v-else>
                        <div class="footer-container">
                            <div class="progress" v-if="shipment.status.status!=='delivery_done'">{{ step }}/{{isUserRegistered?2:3}}</div>
                            <div class="progress" v-else-if="shipment.status.status == 'delivery_done'">1/1</div>
                            <div class="progress" v-else>{{ step }}/{{isUserRegistered?1:2}}</div>
                            <nitrozen-button
                                theme="secondary"
                                v-flat-btn
                                v-if="showItemsToReturn"
                                @click="ProceedBtn"
                                :disabled="hide || remark"
                            >
                                Proceed
                            </nitrozen-button>
                            <nitrozen-button
                                theme="secondary"
                                v-flat-btn
                                v-if="!showItemsToReturn && !activeShipment.user.mobile && activeShipment.status.status == 'handed_over_to_customer'"
                                @click="registerUser"
                                :disabled="!verifiedUser"
                            >
                                Register Customer
                            </nitrozen-button>
                        </div>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <!------- Refund Mode Drawer --------> 
        <transition name="slide">
            <template v-if="showRefundMode">
                <div class="refund-mode-selection-drawer">
                    <side-drawer
                        :title="'Select Refund Mode'"
                        :footer="true"
                        @close="closeRefundMode"
                        :css="isMobile() ? { width: '100%' } :{ width: '60%' }"
                    >  

                    <template #header>
                        <div>
                            <a class="back-btn" @click="backToPreviousDrawer">
                                <adm-inline-svg :src="'arrow-nitrozen'" class="details-header-back-arrow"></adm-inline-svg>
                            </a>
                        </div>
                    </template>     
                    <div class="loader-container">
                        <shimmer v-if="inProgress" :count="4"></shimmer>
                    </div>
                    <div v-if="!inProgress">
                        <refund-mode-selection-drawer 
                            ref="refund-mode-selection" 
                            :shipment="activeShipment" 
                            :refundModeData="refundModeData" 
                            :amountToRefund="amountToRefund" 
                            @selectedValue="valueSelected" />
                    </div>
                        <template #footer>
                            <div class="footer-container">
                                <div class="progress">{{isUserRegistered ? '2/2' : '3/3'}}</div>
                                <nitrozen-button
                                    theme="secondary"
                                    v-flat-btn
                                    @click="onRefundProceed"
                                    :disabled="selectedModeByCustomer==''? true:false"
                                >
                                    Process Return
                                </nitrozen-button>
                            </div>
                        </template>
                    </side-drawer>
                </div>
            </template>
        </transition>

        <div class="refund-proceed-dialog">
            <nitrozen-dialog ref="refund-dialog" class="refund-dialog-main" @close="closeOpen">
                <template slot="body">
                    <div class="refund-dialog-data">
                        <div class="refund-top">
                            <adm-inline-svg class="warn-icon" src="warn-icon-yellow"></adm-inline-svg>
                            <span class="refund-question" v-if="(selectedModeByCustomer == 'credit_note' || selectedModeByCustomer == 'source') && amountToRefund">Are you sure to refund ₹{{amountToRefund.toFixed(2)}} ?</span>
                            <span class="refund-question" v-if="selectedModeByCustomer == ('bank_transfer') ">Are you sure to refund ?</span>
                        </div>
                    </div>
                </template>
            </nitrozen-dialog>
        </div>

        <!------ Confirm summary drawer ------>
        <transition name="slide">
            <template v-if="showConfirmationSummary">
                <side-drawer
                    :title="'Confirmation Summary'"
                    :footer="true"
                    @close="onCloseSummary"
                    :css="isMobile() ? { width: '100%' } :{ width: '60%' }"
                >
                    <confirmation-summary-drawer 
                        :shipment="shipment" 
                        :confirmSummaryRequiredData="confirmSummaryRequiredData"
                        :loadConfirmPage="loadConfirmPage" />

                    <template #footer>
                        <div class="footer-container confirmation-summary-footer">
                            <nitrozen-button
                                theme="secondary"
                                v-flat-btn
                                @click="preparePayload"
                                v-if="showLoaderAndConfirmPage"
                                :disabled="disableRetry"
                            >
                                Retry
                            </nitrozen-button>
                            <nitrozen-button
                                theme="secondary"
                                v-flat-btn
                                @click="onConfirmSummary"
                                v-if="!showLoaderAndConfirmPage"
                            >
                                Done
                            </nitrozen-button>
                        </div>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <!-- SMS Drawer -->
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
                        :shipment="activeShipment"
                        @enableSubmitButton="enableSubmitButtonSms"
                        @closeDrawer="closeDetails()"
                    />
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

        <!-- Call Drawer -->
        <transition name="slide">
            <template v-if="isCall">
                <side-drawer
                    class="call-side-drawer"
                    @close="closeDetails()"
                    :title="`Call`"
                    :footer="true"
                >
                    <call-drawer 
                        :ref="'call-drawer'"
                        :shipment="activeShipmentDetails"
                        @change="onCallersChange"
                    />
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            theme="secondary"
                            v-flatBtn
                            @click="callCustomer"
                            :disabled="!enableCalling"
                        >
                            Call
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <!-- Reassign Store Drawer -->
        <transition name="slide">
            <template v-if="isReassignStore">
                <side-drawer
                    class="reassign-store-drawer"
                    @close="closeDetails()"
                    :title="`Reassign store`"
                    :footer="true"
                >
                    <reassign-store
                        ref="store-assign-call"
                        :reasons="reasons"
                        :stores="stores"
                        :bagId="bagId"
                        @enableSubmitForReassignStore="isSubmitReassingStore"
                        @closeDrawer="closeDetails()"
                    />
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

        <!-- Change Address Drawer -->
        <transition name="slide">
            <template v-if="isChangeAddress">
                <side-drawer
                    class="change-address-drawer"
                    @close="closeDetails()"
                    :title="`Change Address`"
                    :footer="true"
                >
                    <change-address-drawer
                        ref="change-address-drawer"
                        :shipment="activeShipment"
                        @change="onAddressChange"
                    />
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="!enableAddressUpdation"
                            theme="secondary"
                            v-flatBtn
                            @click="changeAddress"
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
    NitrozenBadge, NitrozenMenu, NitrozenMenuItem, NitrozenTooltip, flatBtn, NitrozenButton, NitrozenDialog
} from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';

/* Component imports */
import ShipmentDetails from '@/pages/oms/shipment-details/index.vue';
import ShipmentActions from './actions.vue';
import AdmInlineSvg from '@/components/common/inline-svg.vue';
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';
import ChangeBagStateDrawer from './change-bag-state-drawer.vue';
import SmsDrawer from './sms-drawer.vue';
import CallDrawer from './call-drawer.vue';
import ReassignStoreDrawer from './reassign-store-drawer.vue';
import ChangeAddressDrawer from './change-address-drawer.vue';
import AdminActions from '@/pages/oms/shipment-table/admin-actions.vue';
import invoiceLabelAction from './invoice-label-action.vue';
import Shimmer from '@/components/common/shimmer';
import refundModeSelectionDrawer from '../credit-notes-pos/refund-mode-selection-drawer.vue';
import ConfirmationSummaryDrawer from '../credit-notes-pos/confirmation-summary-drawer.vue'

/* Helper imports */
import { convertSnakeCaseToString, copyToClipboard, formatPrice } from '@/helper/utils.js';
import { detectMobile } from '@/helper/utils';

/* Service imports */
import OrderService from '@/services/orders.service'; 
import URLS from '@/services/domain.service';



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
        CallDrawer,
        'reassign-store': ReassignStoreDrawer,
        ChangeAddressDrawer,
        AdminActions,
        'invoice-label-actions': invoiceLabelAction,
        Shimmer,
        refundModeSelectionDrawer,
        NitrozenDialog,
        ConfirmationSummaryDrawer
    },
    directives: {
        flatBtn,
    },
    computed:{
        activeShipment(){
            return this.items.find(i => i.shipment_id == this.activeId, {})
        },
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
            enableCalling: false,
            enableBagStateChange: false,
            enableAddressUpdation: false,
            remarkOnBagStateChange: '',
            isCreditNoteReturn: false,
            isUserRegistered: true,
            step: 1,
            showItemsToReturn: true,
            hide: true,
            verifiedUser: false,
            remark: true,
            showRefundMode: false,
            inProgress:true,
            selectedModeByCustomer: '',
            shipment: null,
            showConfirmationSummary: false,
            amountToRefund: 0,
            confirmSummaryRequiredData: {},
            loadConfirmPage: false,
            showLoaderAndConfirmPage: true,
            disableRetry: true
        }
    },
    mounted(){
        this.callOrderDetails(true);
        this.items.forEach(ele => {
            if(ele.shipment_id == this.activeId){
                this.activeShipmentDetails = ele;
                this.number.push({ text: this.activeShipmentDetails.user.mobile, value: this.activeShipmentDetails.user.mobile});
                this.fullName = `${this.activeShipmentDetails.user.first_name} ${this.activeShipmentDetails.user.last_name}`;
                this.orderId = this.activeShipmentDetails.order.fynd_order_id;
                this.shipmentId = this.activeShipmentDetails.shipment_id;
                this.bagId = this.activeShipmentDetails.bags[0].bag_id.toString();
                this.brandName = this.activeShipmentDetails.bags[0].item.brand;
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
                    let finalPrice = item.quantity * item.financial_breakup.brand_calculated_amount;
                    return finalPrice + total;
                }, 0);
            } else {
                this.otherShipments.push(ele);
            }
        });
        if(this.activeShipment && this.activeShipment.user){
            this.isUserRegistered=this.activeShipment.user.mobile;
        }
    },
    methods: {
        formatPrice,
        isHide(e) {
            this.hide = e;
        },
        isVerified(e) {
            this.verifiedUser = e;
        },
        updateStatusOfFooter(e) {
            this.showItemsToReturn = e.showItemsToReturn;
            this.step = e.step;
        },  
        showCreditNoteReturn(e) {
            if(e == true) { this.isCreditNoteReturn = true; }
            else { this.isCreditNoteReturn = false; }
        },
        ProceedBtn() {
            this.$refs['change-bag-state'].ProceedBtn();
        },
        registerUser() {
            this.$refs['change-bag-state'].registerUser();
        },
        closeDetails() {
            this.isCreateInvoiceS3 = false;
            this.isCall = false;
            this.isSms = false;
            this.isDebugShipment = false;
            this.isTagEmployee = false;
            this.isChangeBagState = false;
            this.isBankDetails = false;
            this.isReassignStore = false;
            this.isInitiateNdr = false;
            this.isChangeAddress = false;
        },
        openRefundDrawer(SelectedItemsData) {
            if(SelectedItemsData.status == 'delivery_done') {
                this.showReturnPanel= false;
                this.selectedProducts = SelectedItemsData.data;
                this.preparePayload();
            }
            else {
                this.showRefundMode = true;
                this.showReturnPanel= false;
                this.selectedProducts = SelectedItemsData.data;
                this.addPriceQuantity(SelectedItemsData.data);
                this.getRefundModes();
            }
        },
        closeRefundMode() {
            this.showRefundMode = false;
            this.closeReturnPanel();
            if(!this.isUserRegistered){
                this.$root.$emit('refreshThePage', true);
            }
        },
        backToPreviousDrawer() {
            this.showRefundMode = false;
            this.showReturnPanel = true;
        },
        getRefundModes() {
            let data = {
                customer_mobile_number: this.activeShipment.user.mobile,
                seller_id: this.activeShipment.company_id,
                affiliate_id: this.activeShipment.affiliate_details.affiliate_id,
                ordering_channel: this.ordering_channel,
                fynd_order_id: this.activeShipment.order.fynd_order_id
            }
            const get_refund_modes = OrderService.postRefundModeConfig(data)
            return get_refund_modes
                .then(({data}) => {
                    if(data) {
                        this.inProgress=false;
                        this.refundModeData = data.data;
                    }
                })
                .catch((error) => {
                    this.showRefundMode = false;
                    this.$snackbar.global.showError('Unable to fetch refund modes');
                    console.error("Error in fetching refund modes:   ", error);
                })
        },
        isMobile() {
            return detectMobile();
        },
        addPriceQuantity(itemsData) {
            let total = 0;
            for(let index in itemsData) {
                total += itemsData[index].per_unit_price * itemsData[index].quantity;
            }
            this.amountToRefund = total;
        },
        closeConfirmationSummary() {
            this.showConfirmationSummary = false;
            this.closeReturnPanel();
        },
        onRefundProceed() {
            // this.$refs['refund-mode-selection'].sendTheSelectedValue();
            this.$refs["refund-dialog"].open({
                width: "550px",
                showCloseButton: false,
                positiveButtonLabel: 'Proceed',
                negativeButtonLabel: 'Cancel',
                neutralButtonLabel: "",
            });
        },
        valueSelected(event) {
            this.selectedModeByCustomer = event.mode;
        },
        closeReturnPanel(){
            this.showReturnPanel = false;
        },
        closeOpen(e) {
            if (e === 'Proceed') {
                this.preparePayload();
                this.$emit('proceed');
                this.showRefundMode = false;
                this.showConfirmationSummary = true;
                
                return;
            }
            this.$emit('close', e);
        },
        callOrderDetails(ismounted) {
            const get_order_details_promise = this.isApplicationLevel ? 
                OrderService.fetchApplicationOrderV2Details(
                    this.$route.params.company_id,
                    this.$route.params.applicationId,
                    {order_id: this.$route.params.orderId}
                ) :
                OrderService.fetchOrderV2Details(
                    this.$route.params.company_id, 
                    null, 
                    {
                        order_id: this.$route.params.orderId
                    }
                );

            return get_order_details_promise
            .then(res => {
                let response = res.data;
                this.orderData = cloneDeep(response);
                
                if(!ismounted){
                    this.confirmSummaryData = this.orderData.shipments.find(shipment => shipment.forward_shipment_id === this.shipment.shipment_id);
                    if(this.confirmSummaryData !== undefined && this.confirmSummaryData) {
                        this.confirmSummaryRequiredData = {
                            amountRefund: this.amountToRefund,
                            selectedMode: this.selectedModeByCustomer
                        }
                        if(this.confirmSummaryData.invoice){
                            this.confirmSummaryRequiredData.credit_note = this.confirmSummaryData.invoice.credit_note_id;
                        }
                        if(this.confirmSummaryData.user){
                            this.confirmSummaryRequiredData.number = this.confirmSummaryData.user.mobile;
                        }
                        if(this.confirmSummaryData.meta && this.confirmSummaryData.meta.credit_note_data){
                            this.confirmSummaryRequiredData.expiry = this.confirmSummaryData.meta.credit_note_data.expiry_date;
                        }
                        if(this.confirmSummaryData.affiliate_details && this.confirmSummaryData.affiliate_details.pdf_links){
                            this.confirmSummaryRequiredData.credit_note_pdf = this.confirmSummaryData.affiliate_details.pdf_links.credit_note;
                        }
                        this.showLoaderAndConfirmPage = false;
                    }
                    else {
                        this.loadConfirmPage = true;
                        this.showLoaderAndConfirmPage = false;
                    }
                }
                else{
                    this.orderDetails=cloneDeep(response);
                    this.shipment =this.orderDetails.shipments.find(shipment => shipment.shipment_id === this.shipmentId);
                    if(this.shipment && this.shipment.user){
                            this.isUserRegistered=this.shipment.user.mobile ? true : false;
                        }
                }

            })
            .catch(error => {
                this.loadConfirmPage = true;
                this.showLoaderAndConfirmPage = false;
                console.error("Error in fetching shipment data:   ", error);
                this.$snackbar.global.showError(`Unable to fetch details for the order ID: ${this.$route.params.orderId}`);
            })
        },
        showRetryButton(){
            this.showLoaderAndConfirmPage = true;
        },
        updateStatus(payload, from) {
            OrderService.updateShipmentStatus(payload)
            .then(response => {
                if(response.data && response.data.statuses && response.data.statuses.length) {
                    let statusResponse = response.data.statuses[0].shipments[0];
                    if(statusResponse.status === 200) {
                        if(from == 'credit_note') {
                            setTimeout(()=>this.callOrderDetails(false), 2000);
                        }
                        this.$snackbar.global.showSuccess(
                            `Shipment ID: ${this.shipment.shipment_id} has been successfully updated.`,
                            {
                                duration: 2000
                            }
                        );
                        if(from == 'delivery_done') {
                            setTimeout(()=>this.$root.$emit('refreshThePage', true), 2000);
                        }
                    } else {
                        if(statusResponse.message) {
                            this.$snackbar.global.showError(statusResponse.message);
                        } else {
                            this.$snackbar.global.showError('Failed to update the shipment status');
                        }
                    }
                }
            })
            .catch(error => {
                if(from == 'credit_note') {
                    this.showRetryButton();
                    this.updateInProgress = false;
                }
                this.disableRetry=false;
                this.$snackbar.global.showError('Failed to update the shipment status');
                console.error("Error in updating the status:   ", error);
            })
        },
        preparePayload() {
            let payload = {
                "statuses": [
                    {
                        "shipments": [
                            {
                                "identifier": "",
                                "products": [
                                ],
                                 "reasons": {
                                    "products": [
                                        
                                    ]
                                },
                                "data_updates": {
                                    "products": [
                                            {
                                                "data": {
                                                    "meta": {
                                                        "refund_to": "",
                                                        "activity_comment": ""
                                                    }
                                                }
                                            }
                                        ],
                                    "entities": [
                                        {
                                            "data": {
                                                "meta": {
                                                    "refund_to": "",
                                                    "activity_comment": ""
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                        "status": "return_initiated",
                        "exclude_bags_next_state": null
                    }
                ],
                "task": false,
                "force_transition": false,
                "lock_after_transition": false,
                "unlock_before_transition": false
            }
            
            payload.statuses[0].shipments[0].identifier = this.shipment.shipment_id;
            let shortVar = payload.statuses[0].shipments[0].products;
            for(let index in this.selectedProducts){
                shortVar[index] = {
                    "line_number": this.selectedProducts[index].line_number,
                    "quantity": this.selectedProducts[index].quantity,
                    "identifier": this.selectedProducts[index].seller_identifier
                }
            }
            let dataEnteries = payload.statuses[0].shipments[0].reasons.products;
            for(let index in this.selectedProducts){
                dataEnteries[index] = {
                    "filters": [
                        {
                            "identifier": this.selectedProducts[index].seller_identifier,
                            "line_number": this.selectedProducts[index].line_number,
                            "quantity": this.selectedProducts[index].quantity
                        }
                    ],
                    "data": {
                        "reason_id": this.selectedProducts[index].reason_id,
                        "reason_text": this.selectedProducts[index].reason_text
                    },
                }
            }
            payload.statuses[0].shipments[0].data_updates.products[0].data.meta.refund_to = this.selectedModeByCustomer;
            payload.statuses[0].shipments[0].data_updates.entities[0].data.meta.refund_to = this.selectedModeByCustomer;

            payload.statuses[0].shipments[0].data_updates.products[0].data.meta.activity_comment = this.remarkOnBagStateChange;
            payload.statuses[0].shipments[0].data_updates.entities[0].data.meta.activity_comment = this.remarkOnBagStateChange;

            if(this.status == 'delivery_done') {
                delete payload.statuses[0].shipments[0].data_updates.products[0].data.meta.refund_to;
                delete payload.statuses[0].shipments[0].data_updates.entities[0].data.meta.refund_to;
                this.updateStatus(payload, "delivery_done");
            }
            else {
                this.updateStatus(payload, "credit_note");
            }

        },
        onCloseSummary() {
            this.showConfirmationSummary = false;
            this.closeReturnPanel();
            this.$root.$emit('refreshThePage', true);
        },
        onConfirmSummary() {
            this.showConfirmationSummary = false;
            this.closeReturnPanel();
            this.$root.$emit('refreshThePage', true);
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
                let finalQuantity = item.quantity - item.rejected;
                let finalPrice = finalQuantity * item.financial_breakup.brand_calculated_amount;
                return finalPrice + total;
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
            this.$refs['context-menu'].closeMenu();
        },
        createS3Invoice(){
            let data = {shipment_ids: [this.activeId]}
            this.$snackbar.global.showInfo('Your S3 invoice is getting generated');
            OrderService.createS3Invoice(data).then((res)=>{
                this.$snackbar.global.showSuccess('S3 invoice generated!');
            }).catch((err)=> {
                console.error("Failed to create S3 invoice ", err);
                this.$snackbar.global.showError(
                    'We are unable to generate the S3 invoice for your shipment',
                    3000
                );
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
            if(item.value == 'debug_logistics') { this.navigateToLogisticsPage(); };
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
        callCustomer() {
            this.$refs['call-drawer'].callCustomer();
        },
        fetchReasons() {
            OrderService.getReasons(this.activeShipment.shipment_id, this.activeShipment.bags[0].bag_id.toString(), this.activeShipment.status.status)
            .then((res)=>{
                if(res.data.success == true) {
                    this.reasons = res.data.reasons.map(reason => {
                        reason['text'] = reason.display_name;
                        reason['value'] = reason.id;
                        return reason;
                    });
                    if(res.data.reasons.length > 0) {
                        this.fetchStores();
                    } else {
                        this.$snackbar.global.showError(
                            `We are unable to fetch reasons for reassigning this store. Kindly try again after some time.`,
                            3000
                        );
                    }
                }
            })
            .catch((err)=> {
                console.error("Failed to get reasons for re-assigning the store ", err);
                this.$snackbar.global.showError(
                    'We are unable to fetch reasons for reassigning the store. Kindly try again after sometime.',
                    3000
                );
            })
        },
        fetchStores() {
            let params = {
                bag_id: this.bagId,
                all_stores: true,
                limit: 100,
            }
            OrderService.getStores(params).then((res) => {
                if(res.data.success == true) {
                    this.stores = res.data.stores.map(store => {
                        store['text'] = store.name;
                        store['value'] = store.store_id;
                        store['address'] = `${store.address1} ${store.address2} ${store.city}`
                        return store;
                    });
                    this.isReassignStore = true;
                }
            }).catch((err) => {
                console.error("Failed to get stores for re-assign store ", err);
                this.$snackbar.global.showError(
                    'We are unable to fetch stores. Kindly try again after sometime.',
                    3000
                );
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
                if(res && !res.status) {
                    this.$snackbar.global.showError("Failed to generate E-invoice")
                }
                else {
                    this.$snackbar.global.showSuccess('E-invoice generated successfully')
                }
            }).catch((err)=> {
                console.error("Failed to generate E-invoice ", err);
                this.$snackbar.global.showError(
                    'We failed to generate the e-invoice for your order. Kindly try again after sometime.',
                    3000
                );
            })
        },

        /**
         * Method to enable/disable calling button in the call drawer.
         * If the user has entered a valid number for caller and he/she
         * has selected one of the receivers' values, only then the call
         * button will be active.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @param {Object} event The event object emitted by the call-drawer component.
         */
        onCallersChange(event) {
            if(event.caller.toString().length > 0 && event.receiver.toString().length > 0) {
                this.enableCalling = true;
            } else {
                this.enableCalling = false;
            }
        },

        /**
         * Method to navigate user to the logistics page on a new tab.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        navigateToLogisticsPage() {
            if(this.activeId) {
                window.open(`https://pulse-admin.${URLS.PLATFORM_DOMAIN()}/firebolt/monitor/debug/${this.activeId}`, '_blank');
            } else {
                console.error("Error in navigating to the logistics page as the active ID is undefined.");
                this.$snackbar.global.showError(
                    `We are unable to navigate you to the logistics page`,
                    3000
                );
            }
        },

        /**
         * Method to decide whether the "Submit" button for changing the state should be enabled.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @param {Object} event The object containing changed values sent by the child component.
         */
        onBagChangeState(event) {
            let invoiceRegex = new RegExp(/^([a-zA-Z1-9]{1}[a-zA-Z0-9\/-]{0,15})$/);
            let reasonStates = ['bag_not_confirmed', 'cancelled_fynd', 'cancelled_seller', 
                'cancelled_customer', 'return_initiated', 'bag_lost', 
                'return_bag_lost', 'dead_stock', 'deadstock', 'deadstock_defective'];
            if(event.state.length > 0 && event.remark.length > 9) {
                this.remarkOnBagStateChange = event.remark;
                this.remark = false;
                if(reasonStates.includes(event.state) && event.reason.toString().length > 0) {
                    this.enableBagStateChange = true;
                } else if(reasonStates.includes(event.state) && event.reason.toString().length === 0) {
                    this.enableBagStateChange = false;
                } else if(!reasonStates.includes(event.state) && event.state == 'bag_invoiced' && invoiceRegex.test(event.store_invoice_id)) {
                    this.enableBagStateChange = true
                } else if(!reasonStates.includes(event.state) && event.state == 'bag_invoiced' && !invoiceRegex.test(event.store_invoice_id)) {
                    this.enableBagStateChange = false;
                } else if(!reasonStates.includes(event.state)) {
                    this.enableBagStateChange = true;
                } 
            } else {
                this.enableBagStateChange = false;
            }
        },

        /**
         * Method to update the state of the shipment.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        onStateChangeClick() {
            let changeBagStateDrawer = this.$refs['change-bag-state'];
            
            /* Check if the selected state's value exists, else throw an error */
            if(changeBagStateDrawer.selectedState === undefined || changeBagStateDrawer.selectedState === null) {
                this.$snackbar.global.showError(
                    `Unable to update the status for this shipment: ${this.activeShipment.shipment_id}`,
                    3000
                );
                return;
            }
            
            /* Basic payload structure (without reasons) */
            let payload = {
                statuses: [
                    {
                        shipments: [
                            {
                                identifier: this.activeShipment.shipment_id,
                                products: []
                            }
                        ],
                        status: changeBagStateDrawer.selectedState,
                        exclude_bags_next_state: null
                    }
                ],
                task: false,
                force_transition: false,
                lock_after_transition: false,
                unlock_before_transition: false
            };
            
            /* Adding reasons for cancelled states */
            let reasonStates = ['bag_not_confirmed', 'cancelled_fynd', 'cancelled_seller', 
                'cancelled_customer', 'return_initiated', 'bag_lost', 
                'return_bag_lost', 'dead_stock', 'deadstock', 'deadstock_defective'];
            if(reasonStates.includes(changeBagStateDrawer.selectedState)) {
                let reasonValue = changeBagStateDrawer.selectedReason;
                let reasonText = '';
                let selectedReason = changeBagStateDrawer.reasons.find(reason => reason.value === changeBagStateDrawer.selectedReason);
                if(selectedReason && selectedReason.text) {
                    reasonText = selectedReason.text;
                }

                payload.statuses[0].shipments[0]['reasons'] = {
                    products: [
                        {
                            filters: [{}],
                            data: {
                                reason_id: reasonValue,
                                reason_text: this.remarkOnBagStateChange
                            }
                        }
                    ],
                    entities: []
                }
            } else {
                payload.statuses[0].shipments[0]['data_updates'] = {
                    products: [
                        {
                            filters: [{}],
                            data: {
                                meta:{comment: this.remarkOnBagStateChange}
                            }
                        }
                    ],
                    entities: [{
                            filters: [{}],
                            data: {
                                meta:{comment: this.remarkOnBagStateChange}
                            }
                        }]
                }
            }
            /* Adding store_invoice_id incase of updating invoice number */
        
            // if(InvoiceRegex.test(changeBagStateDrawer.invoiceId)){
                
            // }
            if(changeBagStateDrawer.selectedState == 'bag_invoiced' && Object.keys(this.activeShipment.next_possible_states).includes('bag_invoiced')) {
                payload.statuses[0].shipments[0]['data_updates'] = {
                    products: [{
                        filters: [{}],
                        data: {
                            store_invoice_id:  changeBagStateDrawer.invoiceId,
                            meta: {
                                activity_comment: this.remarkOnBagStateChange
                            }
                        }
                    }],
                    entities: [{
                        filters: [{}],
                        data: {
                            store_invoice_id: changeBagStateDrawer.invoiceId
                        }
                    }]
                }
            }
          


            /* Hitting the API for changing the state */
            return OrderService.updateShipmentStatus(payload)
            .then(response => {
                if(response.data && response.data.statuses && response.data.statuses.length) {
                    let statusResponse = response.data.statuses[0].shipments[0];
                    if(statusResponse.status === 200) {
                        this.$snackbar.global.showSuccess(
                            `Successfully updated the status of the shipment: ${this.activeShipment.shipment_id}`,
                            3000
                        );
                        this.isChangeBagState = false;
                        setTimeout(() => {
                            this.$emit('statusUpdated', this.activeShipment.shipment_id);
                        }, 500);
                    } else {
                        if(this.activeShipment.lock_status){
                            this.$snackbar.global.showError(
                                statusResponse.message,
                                3000
                            );
                        } else {
                            this.$snackbar.global.showError(
                                `Failed to update the status of the shipment:  ${this.activeShipment.shipment_id}`,
                                3000
                            );
                        }
                        console.error("Error in updating the status:   ", response.data.statuses[0].shipments[0].message);
                    }
                } else {
                    this.$snackbar.global.showError(
                        `Failed to update the status of the shipment:  ${this.activeShipment.shipment_id}`,
                        3000
                    );
                    console.error("Error in updating the status:   ", response.data.statuses[0].shipments[0]);
                }
            })
            .catch(error => {
                this.$snackbar.global.showError(
                    `Failed to update the status of the shipment:  ${this.activeShipment.shipment_id}`,
                    3000
                );
                console.error("Error in updating the status:   ", error);
            });
        },

        /**
         * Method to verify if all the required values are present to enable 
         * address updation.
         * Currently, as of January 10, 2023, the list of required values includes:
         * Name, Phone, Pincode, City, State
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @param {Object} event The address object shared by the change-address-drawer component.
         */
        onAddressChange(event, validForm) {
            if(
                event.name.length > 0 &&
                event.phone.toString().length > 0 &&
                event.pincode.toString().length > 0 &&
                event.city.length > 0 &&
                event.state.length > 0 &&
                validForm
            ) {
                this.enableAddressUpdation = true;
            } else {
                this.enableAddressUpdation = false;
            }
        },

        /**
         * Method to change the address.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        changeAddress() {
            let changeAddressDrawer = this.$refs['change-address-drawer'];
            if(changeAddressDrawer !== undefined) {
                let finalData = {
                    name: changeAddressDrawer.name,
                    phone: changeAddressDrawer.phoneNumber,
                    email: changeAddressDrawer.email,
                    area: changeAddressDrawer.area,
                    landmark: changeAddressDrawer.landmark,
                    city: changeAddressDrawer.city,
                    address: changeAddressDrawer.address,
                    pincode: changeAddressDrawer.pincode,
                    state: changeAddressDrawer.state,
                    address_type: changeAddressDrawer.selectedAddressType,
                    address_category: changeAddressDrawer.selectedAddressType,
                    country: changeAddressDrawer.country,
                    shipment_id: this.activeId
                };
    
                return OrderService.updateAddress(finalData)
                .then(response => {
                    if(response.data && response.data.success) {
                        this.$snackbar.global.showSuccess(
                            `Address has been successfully updated for the shipment ID: ${this.activeId}`,
                            3000
                        );
                        this.$emit('reload');
                        this.isChangeAddress = false;
                    } else {
                        console.error(`Error in updating the address:  `, response);
                        this.$snackbar.global.showError(
                            `We are unable to update the address. Please try again later.`,
                            3000
                        );
                    }
                })
                .catch(error => {
                    console.error(`Error in updating the address:  `, error);
                    this.$snackbar.global.showError(
                        `We are unable to update the address. Please try again later.`,
                        3000
                    );
                })
            } else {
                this.$snackbar.global.showError('Unable to update the address', 3000);
                console.error('Error in updating the address as the code is unable to find the component:  ', changeAddressDrawer);
            }
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
    .admin-action{
        display: flex;
    }
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
.footer-container{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .progress{
        font-weight: 700;
        font-size: 14px;
        color: #000;
    }
}

.refund-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    margin-top: 16px;
    margin-bottom: 10px;
    .warn-icon {
        width: 34px;
    }
    .refund-question {
        font-weight: 600;
        font-size: 14px;
        line-height: 130%;
        color: #41434C;
    }
}
.refund-bottom {
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
    .refund-first-line {
        font-weight: 600;
        font-size: 12px;
        line-height: 130%;
        color: #5C5C5C;
    }
}
::v-deep .nitrozen-dialog {
    border-radius: 8px;
}
.back-btn {
    cursor: pointer;

    ::v-deep svg {
        transform: rotate(90deg);
        height: 30px;
        width: 30px;
    }
}
.details-header-back-arrow {
    transform: rotate(-90deg);
    height: 20px;
    width: 20px;
    margin-right: 1rem;
}
.refund-mode-selection-drawer {
    ::v-deep .slide-fade {
        .sidedrawer-container {
            .sidedrawer-header{
                display: flex;
                flex-direction: row-reverse;
                justify-content: flex-end;
                align-items: center;
                padding: 24px;
                border-bottom: 1px solid #E0E0E0;
                .sidedrawer-header-title {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                }
            }
        }
    }
}
.footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .progress{
        font-weight: 700;
        font-size: 14px;
        color: #000000;
    }
}
::v-deep .sidedrawer-content{
    @media @mobile{
        padding-bottom: 24px;
    }
}
.footer-container.confirmation-summary-footer{
        justify-content: end;
    }

</style>

