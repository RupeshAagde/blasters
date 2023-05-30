<template>
    <div>
        <div class="tabs">
            <nitrozen-tab
                class="style-font"
                :tabItem="tabsOptions.map((item) => item.text)"
                :activeIndex="selectedStageTabIndex"
                @tab-change="changeLaneType"
                ref="tab"
            />
        </div>

        <div class="tabs-details">
            <div
                class="shipment-details"
                id="fulfillment-tab"
                v-if="
                    shipment.fulfilling_store &&
                    selectedTabValue === 'fulfillment'
                "
            >
                <div v-if="shipment.fulfilling_store.code">
                    <div class="header-title">Location Code</div>
                    <br />
                    <div class="details-data">
                        {{ shipment.fulfilling_store.code }}
                    </div>
                </div>

                <div v-if="shipment.fulfilling_store.id">
                    <div class="header-title">Location ID</div>
                    <br />
                    <div class="details-data">
                        {{ shipment.fulfilling_store.id }}
                    </div>
                </div>

                <div v-if="shipment.fulfilling_store.store_name">
                    <div class="header-title">Location Name</div>
                    <br />
                    <div class="details-data">
                        {{ shipment.fulfilling_store.store_name }}
                    </div>
                </div>

                <div
                    v-if="
                        shipment.fulfilling_store &&
                        shipment.fulfilling_store.fulfillment_channel
                    "
                >
                    <div class="header-title">Integration Type</div>
                    <br />
                    <div class="details-data fulfillment-channel">
                        {{ shipment.fulfilling_store.fulfillment_channel }}
                    </div>
                </div>
            </div>

            <div
                class="shipment-details"
                id="invoice-tab"
                v-if="
                    (shipment.invoice ||
                        (shipment.affiliate_details &&
                            shipment.affiliate_details.pdf_links)) &&
                    selectedTabValue === 'invoice'
                "
            >
                <div
                    v-if="
                        shipment.affiliate_details &&
                        shipment.affiliate_details.pdf_links &&
                        shipment.affiliate_details.pdf_links.po_invoice
                    "
                >
                    <div class="header-title">Purchase Order</div>
                    <br />
                    <div class="details-data downloadable" @click="downloadSourceFile(shipment.affiliate_details.pdf_links.po_invoice)">Download</div>
                </div>

                <!-- <div
                    v-if="
                        shipment.meta.einvoice_info &&
                        shipment.meta.einvoice_info.invoice
                    "
                > -->
                <div v-if="shipment.meta.einvoice_info && (shipment.meta.einvoice_info.invoice || shipment.meta.einvoice_info.credit_note)">
                    <div class="header-title">E-Invoice</div>
                    <br />
                    <div class="fail-einvoice" v-if="(shipment.meta.einvoice_info.invoice.message && 
                        shipment.meta.einvoice_info.invoice.message[0] &&
                        shipment.meta.einvoice_info.invoice.message[0].ErrorCode &&
                            shipment.meta.einvoice_info.invoice.message[0].ErrorMessage) ||

                            (shipment.meta.einvoice_info.credit_note.message && 
                        shipment.meta.einvoice_info.credit_note.message[0] &&
                        shipment.meta.einvoice_info.credit_note.message[0].ErrorCode &&
                            shipment.meta.einvoice_info.credit_note.message[0].ErrorMessage)">
                        <div class="details-data">Not generated</div>
                        <nitrozen-tooltip
                            position="top"
                        >
                        <span class="fail-tooltip-einvoice">
                            <p class="einvoice-head">Error while generating e-invoice</p>
                            <p>
                                <span class="einvoice-error-code">
                                    Error Code: 
                                </span>
                                <span>
                                    {{ (shipment.meta.einvoice_info.credit_note && shipment.meta.einvoice_info.credit_note.message[0] && shipment.meta.einvoice_info.credit_note.message[0].ErrorCode) ? 
                                        shipment.meta.einvoice_info.credit_note.message[0].ErrorCode : 
                                            shipment.meta.einvoice_info.invoice.message[0].ErrorCode }}
                                </span>
                            </p>
                            <p>
                                <span class="einvoice-error-message">
                                    Error: 
                                </span>
                                <span>
                                    {{ (shipment.meta.einvoice_info.credit_note && shipment.meta.einvoice_info.credit_note.message[0] && shipment.meta.einvoice_info.credit_note.message[0].ErrorMessage) ? 
                                        shipment.meta.einvoice_info.credit_note.message[0].ErrorMessage : 
                                            shipment.meta.einvoice_info.invoice.message[0].ErrorMessage }}
                                </span>
                            </p>
                        </span>
                        </nitrozen-tooltip>
                    </div>
                    <div class="success-einvoice" v-if="shipment.meta.einvoice_info.invoice.Irn || shipment.meta.einvoice_info.credit_note.Irn">
                        <div class="details-data">{{ (shipment.meta.einvoice_info.credit_note && shipment.meta.einvoice_info.credit_note.Irn) ? 
                                shipment.meta.einvoice_info.credit_note.Irn.slice(0, 12) : 
                                    shipment.meta.einvoice_info.invoice.Irn.slice(0, 12) }}...</div>
                        <div @click="copyToClipboard($event, (shipment.meta.einvoice_info.credit_note && shipment.meta.einvoice_info.credit_note.Irn) ? 
                            shipment.meta.einvoice_info.credit_note.Irn : 
                                shipment.meta.einvoice_info.invoice.Irn)">
                            <inline-svg class="svg-copy" src="copy-icon"></inline-svg>
                        </div>
                        <nitrozen-tooltip
                            position="top"
                        >
                        <span class="success-tooltip-einvoice">
                            <p class="einvoice-head">Successfully generated e-invoice</p>
                            <p class="einvoice-details">
                                <span class="einvoice-head">IRN: </span>
                                <span> {{ (shipment.meta.einvoice_info.credit_note && shipment.meta.einvoice_info.credit_note.Irn) ? 
                                        shipment.meta.einvoice_info.credit_note.Irn : 
                                            shipment.meta.einvoice_info.invoice.Irn}}</span>
                            </p>
                        </span>
                        </nitrozen-tooltip>
                    </div>
                </div>

                <div v-if="shipment.invoice.credit_note_id">
                    <div class="header-title">Credit Note</div>
                    <br />
                    <div class="details-data pointer" @click="copyToClipboard($event, shipment.invoice.credit_note_id )">
                        {{ shipment.invoice.credit_note_id }}
                    </div>
                </div>

                <div v-if="shipment.invoice.store_invoice_id">
                    <div class="header-title">Invoice ID</div>
                    <br />
                    <div class="details-data pointer" @click="copyToClipboard($event, shipment.invoice.store_invoice_id)">
                        {{ shipment.invoice.store_invoice_id }}
                    </div>
                </div>
                <div v-if="shipment &&
                shipment.affiliate_details && 
                shipment.affiliate_details.affiliate_meta && 
                shipment.affiliate_details.affiliate_meta.replacement_details &&
                shipment.affiliate_details.affiliate_meta.replacement_details.original_bag_invoice_details &&
                shipment.affiliate_details.affiliate_meta.replacement_details.original_bag_invoice_details.store_invoice_id">
                    <div class="header-title">Orignal Invoice ID</div>
                    <br />
                    <div class="details-data">
                        {{ shipment.affiliate_details.affiliate_meta.replacement_details.original_bag_invoice_details.store_invoice_id }}
                    </div>
                </div>

                <!-- <div v-if="shipment.invoice.external_invoice_id">
                    <div class="header-title">External Invoice ID</div>
                    <br />
                    <div class="details-data">
                        {{ shipment.invoice.external_invoice_id }}
                    </div>
                </div> -->
            </div>

            <div
                class="shipment-details"
                id="delivery-tab"
                v-if="
                    shipment.fulfilling_store && selectedTabValue === 'delivery'
                "
            >
                <div v-if="shipment.dp_details.awb_no">
                    <div class="header-tooltip">
                        <span class="header-title">AWB</span>
                        <nitrozen-tooltip
                            v-if="shipment.meta && shipment.meta.forward_awb"
                            position="top"
                            :tooltipText="`AWB (Forward) : ${shipment.meta.forward_awb}` "
                        >
                        </nitrozen-tooltip>
                    </div>
                    <br />
                    <p class="details-data css-flex pointer" @click="copyToClipboard($event, shipment.dp_details.awb_no)">
                        {{ shipment.dp_details.awb_no }}
                        <a
                            v-if="shipment.dp_details.track_url"
                            ref="packaging-icon"
                            class="packaging-icon"
                            :href="shipment.dp_details.track_url"
                            target="_blank"
                        >
                            <inline-svg src="info-new-icon"></inline-svg>
                        </a>
                    </p>
                </div>

                <div v-if="shipment.delivery_slot">
                    <div class="header-title">Delivery Date</div>
                    <br />
                    <div class="details-data">{{ deliveryDate }}</div>
                </div>

                <div v-if="shipment.delivery_slot">
                    <div class="header-title">Promised Date</div>
                    <br />
                    <div class="details-data">{{ promisedDate }}</div>
                </div>

                <div v-if="shipment.dp_details.name">
                    <div class="header-title">Delivery Partner</div>
                    <br />
                    <span class="details-data">{{
                        shipment.dp_details.name
                    }}</span>
                </div>

                <div
                    v-if="
                        shipment.meta &&
                        shipment.meta.processing_dates &&
                        shipment.meta.processing_dates.dp_pickup_slot &&
                        shipment.meta.processing_dates.dp_pickup_slot
                            .end_time &&
                        shipment.meta.processing_dates.dp_pickup_slot.start_time
                    "
                >
                    <p class="header-title css-flex">
                        Pickup Slot
                        <span
                            ref="pickup-slot-drawer"
                            class="packaging-icon"
                            @click="openPickupSlotDrawer()"
                        >
                            <inline-svg src="packaging-icon"></inline-svg>
                        </span>
                    </p>
                    <br />
                    <div class="details-data">{{ pickupSlot }}</div>
                </div>
            </div>

            <div 
                class="shipment-details" 
                id="shipping-details"
                v-if="
                    shipment.delivery_details && selectedTabValue === 'shipping'
                "
            >
                <div v-if="shipment.delivery_details.address1">
                    <div class="header-title">Address</div>
                    <br />
                    <div class="details-data shipping-address-tab">
                        <div @click="copyToClipboard($event, shipment.delivery_details.address1)">
                            {{ shipment.delivery_details.address1 }}
                        </div>

                        <div v-if="shipment.delivery_details.area">
                            <span class="shipping-address-label">Area: </span>
                            <span class="shipping-address-value">{{ shipment.delivery_details.area }}</span>
                        </div>
                        <div v-if="shipment.delivery_details.landmark">
                            <span class="shipping-address-label">Landmark: </span>
                            <span class="shipping-address-value">{{ shipment.delivery_details.landmark }}</span> 
                        </div>
                        <div v-if="shipment.delivery_details.pincode">
                            <span class="shipping-address-label">PIN Code: </span>
                            <span class="shipping-address-value">{{ shipment.delivery_details.pincode }}</span>
                        </div>
                        <div v-if="shipment.delivery_details.city">
                            <span class="shipping-address-label">City: </span>
                            <span class="shipping-address-value">{{ shipment.delivery_details.city }}</span>
                        </div>
                        <div v-if="shipment.delivery_details.state">
                            <span class="shipping-address-label">State: </span>
                            <span class="shipping-address-value">{{ shipment.delivery_details.state }}</span>
                        </div>
                        <div v-if="shipment.delivery_details.country">
                            <span class="shipping-address-label">Country: </span>
                            <span class="shipping-address-value">{{ shipment.delivery_details.country }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="shipment.delivery_details.name">
                    <div class="header-title">Name</div>
                    <br />
                    <div class="details-data copy-to-click" @click="copyToClipboard($event, shipment.delivery_details.name)">
                        {{ shipment.delivery_details.name }}
                    </div>
                </div>

                <div v-if="shipment.delivery_details.phone">
                    <div class="header-title">Phone</div>
                    <br />
                    <div class="details-data copy-to-click" @click="copyToClipboard($event, shipment.delivery_details.phone)">
                        {{ shipment.delivery_details.phone }}
                    </div>
                </div>

                <div v-if="shipment.delivery_details.email">
                    <div class="header-title">Email ID</div>
                    <br />
                    <div class="details-data copy-to-click" @click="copyToClipboard($event, shipment.delivery_details.email)">
                        {{ shipment.delivery_details.email }}
                    </div>
                </div>
            </div>
        </div>

        <div class="extra-info">
            <div
                class="extra-info-box"
                v-if="displayEstimatedShippingCharges(shipment)"
            >
                <span class="header-title"> Estimated Shipping Charges: </span>
                <span class="details-data">
                    ₹{{ shipment.order.prices.delivery_charge.toFixed(2) }}
                </span>
            </div>
            <div
                class="extra-info-box"
                v-if="shipment &&
                 shipment.affiliate_details &&
                 shipment.affiliate_details.affiliate_meta &&
                 shipment.affiliate_details.affiliate_meta.replacement_details &&
                shipment.affiliate_details.affiliate_meta.replacement_details.replacement_type"
            >
                <span class="header-title"> Replacement Type: </span>
                <span class="details-data">
                    {{  shipment.affiliate_details.affiliate_meta.replacement_details.replacement_type }}
                </span>
            </div>
            <div
                class="extra-info-box"
                v-if="shipment && 
                shipment.affiliate_details &&
                shipment.affiliate_details.affiliate_meta &&
                shipment.affiliate_details.affiliate_meta.replacement_details &&
                shipment.affiliate_details.affiliate_meta.replacement_details.original_affiliate_order_id"
            >
                <span class="header-title"> Orignal Order ID: </span>
                <span class="details-data">
                    {{  shipment.affiliate_details.affiliate_meta.replacement_details.original_affiliate_order_id }}
                </span>
            </div>

            <div v-if="shipment.is_dp_assign_enabled" class="extra-info-box">
                <span class="header-title"> Estimated Delivery Partner: </span>
                <span
                    class="details-data"
                    v-if="shipment.dp_details && shipment.dp_details.name"
                >
                    {{
                        shipment.dp_details.name
                    }}
                </span>
                <span
                    class="details-data"
                    v-else-if="!shipment.dp_details.name  && 
                                    shipment.meta.dp_id && 
                                        (shipment.meta.parent_dp_id !== shipment.meta.dp_id)"
                >
                    {{
                        shipment.meta.dp_options[shipment.meta.dp_id].display_name
                            ? shipment.meta.dp_options[shipment.meta.dp_id].display_name
                            : shipment.meta.dp_options[shipment.meta.dp_id].name
                    }}
                </span>
                <span
                    class="details-data"
                    v-else-if="!shipment.dp_details.name && 
                                    shipment.meta.dp_options && 
                                        (shipment.meta.dp_id == shipment.meta.parent_dp_id) &&
                                            shipment.meta.parent_dp_id"
                >
                    {{
                        shipment.meta.dp_options[shipment.meta.parent_dp_id]
                            .display_name
                            ? shipment.meta.dp_options[shipment.meta.parent_dp_id]
                                  .display_name
                            : shipment.meta.dp_options[shipment.meta.parent_dp_id].name
                    }}
                </span>
                <span class="details-data">
                    <span
                        ref="packaging-dimensions"
                        class="packaging-icon"
                        @click="openSelectDeliveryPartner()"
                    >
                        <inline-svg src="packaging-icon"></inline-svg>
                    </span>
                </span>
            </div>

            <div 
                class="extra-info-box" 
                v-if="shipment.fulfilling_store && shipment.fulfilling_store.phone">
                <span class="header-title"> Fulfilling Store Phone: </span>
                <span 
                    class="details-data copy-to-click"
                    @click="copyToClipboard($event, shipment.fulfilling_store.phone)"
                >
                    {{ shipment.fulfilling_store.phone }}
                </span>
                <span v-if="shipment.fulfilling_store && 
                    shipment.fulfilling_store.meta && 
                    shipment.fulfilling_store.meta.additional_contact_details &&
                    shipment.fulfilling_store.meta.additional_contact_details.number">
                    <span class="details-data copy-to-click"
                        v-for="(item, index) in shipment.fulfilling_store.meta.additional_contact_details.number"
                        :key="index"
                        @click="copyToClipboard($event, shipment.fulfilling_store.meta.additional_contact_details.number[index])">
                        , {{ item }}
                    </span>
                </span>
            </div>

            <div 
                class="extra-info-box" 
                v-if="
                    shipment.fulfilling_store && 
                    shipment.fulfilling_store.meta && 
                    shipment.fulfilling_store.meta.notification_emails &&
                    shipment.fulfilling_store.meta.notification_emails.length
                ">
                <span class="header-title"> Fulfilling Store Email: </span>
                <span 
                    v-for="(item, index) in shipment.fulfilling_store.meta.notification_emails"
                    :key="index"
                    class="details-data copy-to-click"
                    @click="copyToClipboard($event, shipment.fulfilling_store.meta.notification_emails[index])"
                >
                    <span v-if="index > 0">
                        ,
                    </span>
                    {{ item }}
                </span>
            </div>

            <div class="extra-info-box" v-if="viewPrescription.length">
                <span class="header-title"> View Prescription </span>
                <span class="details-data">
                    <span
                        ref="packaging-dimensions"
                        class="packaging-icon"
                        @click="openPrescriptionDialog"
                    >
                        <inline-svg src="info-new-icon"></inline-svg>
                    </span>
                </span>
            </div>

            <div
                class="extra-info-box"
                v-if="shipment.can_update_dimension && shipment.dp_assignment"
            >
                <span class="header-title"> Packaging: </span>
                <span class="details-data css-flex uppercase">
                    {{ shipment.packaging_type || 'Update Packaging' }}
                    <span
                        ref="packaging-dimensions"
                        class="packaging-icon"
                        @click="openPackagingDimensions()"
                    >
                        <!-- <inline-svg v-if="checkReadRole && !checkCustomerCareRole " src="packaging-icon"></inline-svg> -->
                        <inline-svg v-if="checkReadRole" src="packaging-icon"></inline-svg>
                    </span>
                </span>
            </div>

            <div
                class="extra-info-box"
                v-if="dunzoOtpCheck()"
            >
                <span 
                    v-if="
                    (shipment.meta.otp_details.drop && dunzoBackwardStatuses.includes(shipment.status.status)) ||
                    (shipment.meta.otp_details.pick && dunzoForwardStatuses.includes(shipment.status.status))
                    " 
                    class="header-title"> DP OTP: </span>
                <span v-if="shipment.meta.otp_details.drop && dunzoBackwardStatuses.includes(shipment.status.status)" class="details-data">
                    {{ shipment.meta.otp_details.drop }}
                </span>
                <span v-if="shipment.meta.otp_details.pick && dunzoForwardStatuses.includes(shipment.status.status)" class="details-data">
                    {{ shipment.meta.otp_details.pick }}
                </span>
            </div>

            <div
                class="extra-info-box"
                v-if="shipment.manifest_id"
            >
                <span class="header-title"> Manifest ID: </span>
                <span class="details-data css-flex uppercase">
                    {{ shipment.manifest_id }}
                    <span
                        ref="packaging-dimensions"
                        class="packaging-icon"
                        @click="navigate(shipment.manifest_id)"
                    >
                        <inline-svg src="info-new-icon"></inline-svg>
                    </span>
                </span>
            </div>
        </div>

        <transition name="slide">
            <template v-if="isPickupSlot">
                <side-drawer
                    ref="close-details"
                    @close="closeDetails()"
                    :title="`Pickup Slot`"
                    :footer="true"
                >
                    <pickup-slot-drawer
                        ref="pickup-slot-drawer"
                        :pickUpSlotOptions="pickUpSlotOptions"
                        @enableSubmit="enableSubButton($event)"
                        @callPickupSlotApi="putPickupSlot($event)"
                    ></pickup-slot-drawer>
                    <template #footer>
                        <nitrozen-button
                            :disabled="enablePickUpSlotButton"
                            @click="postSelectedPickupSlot()"
                            class="button-submit"
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
            <template v-if="isPackagingDimension">
                <side-drawer
                    @close="closeDetails()"
                    :title="`Packaging Dimensions`"
                    :footer="true"
                >
                    <packaging-drawer
                        ref="packaging-drawer"
                        :shipment="shipment"
                        @updatePackagingEvent="updatePackaging($event)"
                        @disableSubmit="enablePackagingSubmt($event)"
                        @closeDimensionDrawer="openPackagingDimensions"
                        @updateOrderDetails="updateOrderDetails()"
                    ></packaging-drawer>
                    <template #footer>
                        <nitrozen-button
                            :disabled="canSubmitDimesion"
                            class="button-submit"
                            theme="secondary"
                            v-flatBtn
                            @click="updateDimension"
                            >Submit</nitrozen-button
                        >
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="isSelectDp">
                <side-drawer
                    @close="closeDetails()"
                    :title="`Select Delivery Partner`"
                    :footer="true"
                >
                    <delivery-partner-drawer
                        ref="dp-drawer"
                        :dpOptionsData="this.shipment.meta"
                        @makePostRequest="sendDeliveryPartnerValue($event)"
                        @disableSubmit="changeStatSubmit($event)"
                    ></delivery-partner-drawer>
                    <template #footer>
                        <nitrozen-button
                            class="button-submit"
                            :disabled="submitButStat"
                            theme="secondary"
                            v-flatBtn
                            @click="sendSelectedDpValue()"
                        >
                            Submit
                        </nitrozen-button>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <view-prescription
            ref="prescriptionDialog"
            v-if="shipment && viewPrescription.length"
        >
        </view-prescription>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenBadge,
    NitrozenTab,
    NitrozenButton,
    flatBtn,
    NitrozenTooltip
} from '@gofynd/nitrozen-vue';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters } from 'vuex';

/* Component imports */
import ShipmentInfoHeader from './header.vue';
import ShipmentTracker from '@/pages/oms/shipment-tracker/index.vue'; 
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';
import PickupSlotDrawer from './pickup-slot-drawer.vue';
import PackagingDrawer from './packaging-dimensions.vue'; 
import DeliveryPartnerDrawer from './select-delivery-drawer.vue';
import ViewPrescription from './view-prescription-dialog';

/* Helper imports */
import { copyToClipboard } from '@/helper/utils.js';

/* Service imports */
import OrderService from '@/services/orders.service.js';

/* Mock imports */
import SelectDeliveryPartner from './../fixtures/select-delivery-partner.json';

/* Payload import */
import PICKUP_SLOT_PAYLOAD from './../mocks/pickup-slot-payload.json';


const TABS_OPTIONS = [
    {
        text: 'Fulfilment Details',
        value: 'fulfillment',
    },
    {
        text: 'Invoice Details',
        value: 'invoice',
    },
    {
        text: 'Delivery Details',
        value: 'delivery',
    },
    {
        text: 'Shipping Details',
        value: 'shipping'
    }
];

export default {
    name: 'details-section',
    props: {
        shipment: {
            type: Object,
        },
    },
    data() {
        return {
            isSelectDp: false,
            isOpen: false,
            isPackagingDimension: false,
            isPickupSlot: false,
            selectedStageTabIndex: 0,
            selectedTabValue: TABS_OPTIONS[0].value,
            canSubmitDimesion: true,
            selectDpPartner: [],
            tabsOptions: [],
            submitButStat: false,
            selectedDp: '',
            showSelectedDpOnSubmit: false,
            pickUpSlotOptions: [],
            enablePickUpSlotButton: true,
            payloadForPickupSlot: cloneDeep(PICKUP_SLOT_PAYLOAD),
            dunzoForwardStatuses: ["dp_assigned", "bag_packed", "handed_over_to_dg", "bag_picked", "out_for_delivery", "delivery_done"],
            dunzoBackwardStatuses: ["rto_initiated", "rto_in_transit", "rto_bag_out_for_delivery", "rto_bag_delivered", "rto_bag_accepted"],
            applicationId: this.$route.params.applicationId,
        };
    },
    components: {
        DeliveryPartnerDrawer,
        InlineSvg,
        NitrozenBadge,
        NitrozenButton,
        NitrozenTab,
        PackagingDrawer,
        PickupSlotDrawer,
        ShipmentInfoHeader,
        ShipmentTracker,
        SelectDeliveryPartner,
        SideDrawer,
        UktInlineSvg,
        ViewPrescription,
        NitrozenTooltip
    },
    directives: {
        flatBtn,
    },
    computed: {
        ...mapGetters({
            accessDetail: {},
        }),
        checkReadRole() {
            // const role =
            //     this.accessDetail &&
            //     this.accessDetail.order_role &&
            //     this.accessDetail.order_role != 'read_only';
            // return role;
            return true;
        },
        pickupSlot() {
            if (
                !isEmpty(this.shipment) &&
                !isEmpty(this.shipment.meta) &&
                !isEmpty(this.shipment.meta.processing_dates)
            ) {
                let day = moment(
                    this.shipment.meta.processing_dates.dp_pickup_slot.end_time
                ).format('MMM D, YYYY');
                let startTime = moment(
                    this.shipment.meta.processing_dates.dp_pickup_slot
                        .start_time
                ).format('LT');
                let endTime = moment(
                    this.shipment.meta.processing_dates.dp_pickup_slot.end_time
                ).format('LT');
                return `${day} ${startTime} -  ${endTime}`;
            }
        },
        deliveryDate() {
            if (
                !isEmpty(this.shipment) &&
                !isEmpty(this.shipment.delivery_slot)
            ) {
                let day = moment(this.shipment.delivery_slot.upper_bound).add(new Date().getTimezoneOffset(), 'minutes').format('MMM D, YYYY');
                // let fromTime = moment(this.shipment.pickup_slot.lower_bound).format('LT');
                // let toTime = moment(this.shipment.pickup_slot.upper_bound).format('LT');
                // return `${day} ${fromTime} -  ${toTime}`;

                return `${day}`;
            }
        },
        viewPrescription() {
            const prescription = [];
            if (this.shipment && this.shipment.bags.length) {
                this.shipment.bags.map((ele) => {
                    if (ele.meta && ele.meta.files) {
                        ele.meta.files.map((file) => {
                            if (file.key === 'prescription') {
                                prescription.push({
                                    id: ele.bag_id,
                                    file,
                                });
                            }
                        });
                    }
                });
            }
            return prescription;
        },
        promisedDate() {
            if (
                !isEmpty(this.shipment) &&
                !isEmpty(this.shipment.delivery_slot) &&
                this.shipment.delivery_slot.date
            ) {
                let day = moment(this.shipment.delivery_slot.date).add(new Date().getTimezoneOffset(), 'minutes').format('MMM D, YYYY');
                return `${day}`;
            }
        },
    },
    mounted() {
        if (this.shipment.fulfilling_store) {
            if (
                this.shipment.fulfilling_store.code ||
                this.shipment.fulfilling_store.id ||
                this.shipment.fulfilling_store.store_name ||
                this.shipment.fulfilling_store.meta.integration_type.inventory
            ) {
                this.tabsOptions.push(TABS_OPTIONS[0]);
            }
        }
        if (
            this.shipment.invoice ||
            (this.shipment.affiliate_details &&
                this.shipment.affiliate_details.pdf_links)
        ) {
            if (
                (this.shipment.affiliate_details &&
                    this.shipment.affiliate_details.pdf_links &&
                    this.shipment.affiliate_details.pdf_links.po_invoice) ||
                (this.shipment.affiliate_details &&
                    this.shipment.affiliate_details.pdf_links &&
                    this.shipment.affiliate_details.pdf_links.invoice_a4) ||
                this.shipment.invoice.store_invoice_id ||
                this.shipment.invoice.external_invoice_id
            ) {
                this.tabsOptions.push(TABS_OPTIONS[1]);
                let index = this.tabsOptions.length - 1
                this.$refs.tab.selectTab(index, TABS_OPTIONS[1].text)
            }
        }
        if (this.shipment.dp_details) {
            if (
                this.shipment.dp_details.awb_no ||
                this.shipment.dp_details.delivery_date ||
                this.shipment.dp_details.name ||
                this.shipment.dp_details.pickup_slot
            ) {
                this.tabsOptions.push(TABS_OPTIONS[2]);
                let index = this.tabsOptions.length - 1
                this.$refs.tab.selectTab(index, TABS_OPTIONS[2].text)
            }
        }
        if(
            this.shipment.delivery_details &&
            (
                this.shipment.delivery_details.address1 ||
                this.shipment.delivery_details.address ||
                this.shipment.delivery_details.city ||
                this.shipment.delivery_details.email ||
                this.shipment.delivery_details.phone
            )
        ) {
            this.tabsOptions.push(TABS_OPTIONS[3]);
        }
    },
    methods: {
        isEmpty,
        // @todo if they tell to hit grindor then hit this below function
        // getPublicUrl(url){
        //     return GrindorService.getPublicUrl({
        //         expiry: 300,
        //         urls: [url]
        //     })
        //     .then((res) => {
        //         if(res && res.status == 200 && res.data && res.data.urls[0] && res.data.urls[0].signed_url) {
        //             this.downloadSourceFile(res.data.urls[0].signed_url);
        //         }
        //     })
        //     .catch((error) => {
        //         this.$snackbar.global.showError(`Unable to Download `);
        //         console.error("Error in downloading the file:   ", error);
        //     })
        // },
        updateOrderDetails(){
         setTimeout(()=> {
           this.$emit('updateOrderDetails')
         }, 1000)
        },
        dunzoOtpCheck() {
            return this.selectedTabValue === 'delivery' &&
                this.shipment.status && 
                this.shipment.status.status &&
                this.shipment.meta &&
                this.shipment.meta.otp_details &&
                this.shipment.meta.otp_details.drop &&
                this.shipment.meta.otp_details.pick && 
                ((this.shipment.meta.otp_details.drop && this.dunzoBackwardStatuses.includes(this.shipment.status.status)) ||
                (this.shipment.meta.otp_details.pick && this.dunzoForwardStatuses.includes(this.shipment.status.status)))  
        },
        downloadSourceFile(signedUrl) {
            try {
                this.$snackbar.global.showInfo(`Your download will begin shortly`);
                const url = signedUrl;
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('click', '_blank');
                document.body.appendChild(link);
                link.click();

                /**
                 * @todo The message that needs to be sent on successful download needs to be
                 * dynamic and not based on setTimeout. Need to improve this code.
                 * - Rushabh Mulraj Shah
                 */
                setTimeout(() => {
                    this.$snackbar.global.showSuccess(`Your purchase order file has been successfully downloaded`, 3000);
                }, 1000);
            }
            catch(error) {
                console.error(`Error in downloading the purchase order file:   `, error);
                this.$snackbar.global.showError(
                    `Unable to download the file. Please try again after some time.`,
                    3000
                )
            }
        },
        copyToClipboard(e, text) {
            e.stopPropagation();
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000); 
        },
        closeDetails() {
            this.isPickupSlot = false;
            this.isPackagingDimension = false;
            this.isSelectDp = false;
            // this.isDeliveryPartner = false;
        },
        changeStatSubmit(e) {
            this.submitButStat = e;
        },
        changeLaneType(e) {
            let selectedTab = TABS_OPTIONS.find((tab) => tab.text === e.item);
            this.selectedTabValue = selectedTab.value;

            if (this.selectedStageTabIndex == e.index) {
                return;
            } else {
                this.selectedStageTabIndex = e.index;
            }
        },
        displayEstimatedShippingCharges(shipment) {
            return (
                ((this.selectedStageTabIndex == 0 ||
                    this.selectedStageTabIndex == 1) &&
                    !isEmpty(shipment.order) &&
                    !isEmpty(shipment.order.prices) &&
                    shipment.order.prices.delivery_charge !== null) ||
                shipment.order.prices.delivery_charge !== undefined
            );
        },
        /**
         * This function is been emitted from the child component packaging
         * and it's sending a boolean value in the event and based on that flag
         * we are enabling and disabling the submit button of the packaging drawer.
         * @param {Boolean} e
         * @author Sameer Shaikh
         */
        enablePackagingSubmt(e) {
            this.canSubmitDimesion = e;
        },
        enableSubButton(e) {
            this.enablePickUpSlotButton = e;
        },
        getSlot(item) {
            let day = moment(item.end_time).format('DD MMM, YYYY');
            let startTime = moment(item.start_time).format('LT');
            let endTime = moment(item.end_time).format('LT');
            return `${day} ${startTime} -  ${endTime}`;
        },
        openPickupSlotDrawer() {
            if (
                !isEmpty(this.shipment) &&
                !isEmpty(this.shipment.meta) &&
                !isEmpty(this.shipment.meta.processing_dates)
            ) {
                this.pickUpSlotOptions =
                    this.shipment.meta.processing_dates.dp_pickup_slot.options.map(
                        (item) => {
                            let slotOptions = {};
                            let returnSlotTextValue = this.getSlot(item);
                            slotOptions['text'] = returnSlotTextValue;
                            slotOptions['value'] = {
                                start_time: item.start_time,
                                end_time: item.end_time,
                            };
                            // slotOptions["start_time"] = item.start_time;
                            // slotOptions["end_time"] = item.end_time;
                            return slotOptions;
                        }
                    );
                this.isPickupSlot = !this.isPickupSlot;
            }
        },
        openPackagingDimensions() {
            this.isPackagingDimension = !this.isPackagingDimension;
        },
        /**
         * Since submit button of pacakging drawer is not a part of packaging
         * drawer compoment here we are calling packaging drawer function through ref
         * @author Sameer Shaikh
         */
        updateDimension() {
            this.$refs['packaging-drawer'].updatePacKaging();
        },

        openSelectDeliveryPartner() {
            this.isSelectDp = true;
        },
        openPrescriptionDialog() {
            this.$refs.prescriptionDialog.open(this.viewPrescription);
        },
        postSelectedPickupSlot() {
            this.$refs['pickup-slot-drawer'].sendSelectedSlots();
            this.isPickupSlot = false;
        },
        putPickupSlot(selectedPickUpSlots) {
            let processingDates = this.shipment.meta.processing_dates;

            processingDates.dp_pickup_slot.end_time =
                selectedPickUpSlots.end_time;
            processingDates.dp_pickup_slot.start_time =
                selectedPickUpSlots.start_time;

            this.payloadForPickupSlot.statuses[0].shipments[0].identifier =
                this.shipment.shipment_id;
            this.payloadForPickupSlot.statuses[0].shipments[0].data_updates.entities[0].data.meta.processing_dates =
                processingDates;

            OrderService.updateShipmentStatus(this.payloadForPickupSlot)
                .then((response) => {
                    if (
                        response.data &&
                        response.data.statuses &&
                        response.data.statuses.length
                    ) {
                        let statusResponse =
                            response.data.statuses[0].shipments[0];
                        if (statusResponse.status === 200) {
                            this.$snackbar.global.showSuccess(
                                `Pickup slot for shipment: ${this.shipment.shipment_id} has been successfully updated.`,
                                {
                                    duration: 3000,
                                }
                            );
                            // @Note the below setTimeout is for the start_time and end_time value to sync with the database. DO not delete it
                            // setTimeout(() => {
                            //     this.$root.$emit("refreshThePage", true);
                            // }, 2000)
                            this.$root.$emit('refreshThePage', true);
                        } else {
                            this.$snackbar.global.showError(
                                'Failed to update the pickup slot'
                            );
                        }
                    }
                })
                .catch((error) => {
                    console.error(
                        'Error in updating the pickup slot:   ',
                        error
                    );
                    this.$snackbar.global.showError(
                        `Unable to update the pickup slot`,
                        {
                            duration: 2000,
                        }
                    );
                });
        },
        sendSelectedDpValue() {
            this.$refs['dp-drawer'].sendSelectedDp();
            this.isSelectDp = false;
        },
        sendDeliveryPartnerValue(e) {
            if (e == this.shipment.meta.dp_id) {
                this.$snackbar.global.showError(
                    'You have selected the same delivery partner'
                );
            } else {
                this.selectedDp = e;
                this.showSelectedDpOnSubmit = true;
                const post_dp = OrderService.postSelectedDeliveryPartner({
                    shipment_ids: [this.shipment.shipment_id],
                    dp_id: e,
                    order_type: 'forward',
                    qc_required: false,
                });
                return post_dp
                    .then((response) => {
                        if (response.data.success) {
                            this.$snackbar.global.showSuccess(`
                                Updated the delivery partner to
                                ${
                                    this.shipment.meta.dp_options[e]
                                        .display_name
                                        ? this.shipment.meta.dp_options[e]
                                              .display_name
                                        : shipment.meta.dp_options[e].name
                                }
                            `);

                            /** Trigger a latest fetch of order details */
                            this.$emit('updateOrderDetails');
                        } else {
                            this.$snackbar.global.showError(
                                'Unable to change Delivery Partner'
                            );
                            console.error(
                                'Error in updating the delivery partner   ',
                                response.data
                            );
                        }
                    })
                    .catch((error) => {
                        this.$snackbar.global.showError(
                            'Unable to change Delivery Partner'
                        );
                        console.error(
                            'Error in updating the delivery partner   ',
                            error
                        );
                    });
            }
        },
        navigate(id) {
            this.$router.push({
                name: 'company-manifest-detail',
                params: {
                    manifestId: id
                },
            })
        }
    },
};
</script>

<style lang="less" scoped>
::v-deep .sidedrawer-footer {
    display: flex;
    justify-content: flex-end;
}

.pointer{
    cursor: pointer;
}

.tabs {
    margin-top: 33px;

    ::v-deep .nitrozen-tab-item {
        color: #979797;
        padding: 6px 16px 6px 16px;
        border: 1px solid #e0e0e0;
        border-bottom: none;
        border-radius: 4px 4px 0px 0px;
        margin-right: 8px;
        background: #f9f9f9;
    }

    ::v-deep .nitrozen-tab-active {
        color: #2e31be;
        border: 1px solid #2e31be;
        background: #f5f5fc;
    }
}

.tabs-details {
    width: 98%;
    height: 80px;
    border: 1px solid #e0e0e0;
    border-radius: 0px 0px 4px 4px;
    margin-bottom: 24px;

    .shipment-details {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: space-between;
        align-content: center;
        height: 80px;
    }
}

.shipment-details:first-child {
    margin-left: 16px;
}

.shipment-details:last-child {
    margin-right: 16px;
}

.header-title {
    margin-bottom: -8px;
    color: #9b9b9b;
    font-size: 12px;
    line-height: 18px;
    font-weight: 400;

    ::v-deep .inline-svg {
        display: inline;
        margin-left: 4px;
    }
}

.details-data {
    color: #4d4d4e;
    font-size: 12px;
    line-height: 18px;
    font-weight: 500;

    ::v-deep .inline-svg {
        display: inline;
        margin-left: 4px;
    }
}

.style-font {
    font-size: 12px;
    line-height: 18px;
    font-weight: 500;
}

.extra-info {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    row-gap: 8px;
}

.extra-info-box {
    display: flex;
    gap: 4px;
    color: #979797;
    padding: 6px 8px 6px 8px;
    border: 1px solid #f4f4f4;
    border-radius: 2px 2px 2px 2px;
    margin-right: 8px;
    background: #f4f4f4;
}

.css-flex {
    display: flex;
}

.packaging-icon {
    cursor: pointer;
}

.fulfillment-channel {
    text-transform: capitalize;
}

.downloadable {
    font-size: 12px;
    color: #2e31be;
    text-decoration: underline;
    cursor: pointer;
}

.uppercase {
    text-transform: uppercase;
}

#delivery-tab,
#invoice-tab,
#fulfillment-tab {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 2rem;
}

::v-deep .slide-fade {
    .sidedrawer-footer {
        display: flex;
        justify-content: flex-end;
    }
}

.header-tooltip {
    display: flex;
    align-items: baseline;
    gap: 9px;
    ::v-deep .nitrozen-tooltip {
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
            margin-left: -93px;
        }
    }
}

.fail-einvoice {
    display: flex;
    align-items: baseline;
    gap: 9px;
    ::v-deep .nitrozen-tooltip {
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
            max-width: 400px;
            width: 700px;
        //     height: 50px;
        }
        .nitrozen-tooltip-top {
            margin-left: -123px;
            .fail-tooltip-einvoice {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                .einvoice-head {
                    color: #41434C;
                    font-weight: 600;
                }
                .einvoice-error-code {
                    color: #41434C;
                    font-weight: 600;
                }
                .einvoice-error-message {
                    color: #41434C;
                    font-weight: 600;
                }
            }
        }
    }
}

.success-einvoice {
    display: flex;
    align-items: baseline;
    gap: 9px;
    ::v-deep .nitrozen-tooltip {
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
            max-width: 700px;
            // width: 500px;
        //     height: 50px;
        }
        .nitrozen-tooltip-top {
            margin-left: -144px;
            .success-tooltip-einvoice {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                .einvoice-head {
                    color: #41434C;
                    font-weight: 600;
                }
                .einvoice-details {
                    display: flex;
                }
            }
        }
    }
}

::v-deep .svg-copy {
    cursor: pointer;
    svg {
        height: 14px;
        width: 14px;
        g {
            fill: @RoyalBlue;
        }
    }
}

.copy-to-click {
    cursor: pointer;
}

.shipping-address-tab {
    overflow-y: scroll;
    height: 40px;
    max-width: 200px;
    cursor: pointer;

    .shipping-address-label {
        color: #9b9b9b;
        font-weight: 300;
    }
}

</style>
