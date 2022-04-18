<template>
    <div class="panel">
        <div class="page-header-position">
            <adm-page-header
                @backClick="goToOrderList"
                :title="`${applicationName} Order Details`"
                :contextMenuItems="contextMenuItems"
                @refresh="loadData"
            >
                <div class="order-item-navigation">
                    <div class="middle-one">
                        <div
                            class="refresh-icon"
                            @click="reloadPage"
                            title="Refresh Order Details"
                        >
                            <inline-svg src="refresh"></inline-svg>
                        </div>
                    </div>
                    <span class="arrow-button previous">
                        <nitrozen-button
                            @click="getOrder('previous')"
                            theme="secondary"
                            title="Previous Order"
                            :disabled="!navigation.previous"
                        >
                            <inline-svg
                                src="arrow-solid"
                                class="order-arrow"
                            ></inline-svg>
                            Previous
                        </nitrozen-button>
                    </span>
                    |
                    <span class="arrow-button next">
                        <nitrozen-button
                            @click="getOrder('next')"
                            theme="secondary"
                            title="Next Order"
                            :disabled="!navigation.next"
                        >
                            Next
                            <inline-svg
                                src="arrow-solid"
                                class="order-arrow"
                            ></inline-svg>
                        </nitrozen-button>
                    </span>
                </div>
            </adm-page-header>
        </div>
        <div class="main-container">
            <mirage-alert
                :dismissible="true"
                ref="intro"
                class="intro"
                type="plain"
                v-show="!isIntroShown"
                @close="introShown"
            >
                <div>
                    <div class="intro-list">
                        <div
                            class="intro-point"
                            v-for="(point, i) in introList"
                            :key="i"
                        >
                            <div class="name">
                                {{ point.name }}
                            </div>
                            <div class="description">
                                {{ point.description }}
                            </div>
                        </div>
                    </div>
                    <nitrozen-button
                        class="got-it"
                        theme="secondary"
                        title="Okay"
                        v-flat-btn
                        @click="
                            () => {
                                $refs.intro.close();
                            }
                        "
                    >
                        Got it!
                    </nitrozen-button>
                </div>
            </mirage-alert>
            <mirage-alert class="support-alert">
                <div class="support-container">
                    <div class="email">
                        Email:
                        <a
                            target="_blank"
                            href="mailto:${storesupport@gofynd.com}"
                            class="contact-text"
                        >
                            storesupport@gofynd.com
                        </a>
                    </div>
                    <div class="phone">
                        Contact No.:
                        <a href="tel:+918879975431" class="contact-text">
                            +91-8879975431
                        </a>
                    </div>
                </div>
            </mirage-alert>
            <!-- 
                TODO: think on it, do not delete
                <mirage-alert
                :dismissible="successAlert.dismissable"
                type="success"
                ref="successAlert"
                class="success-alert"
                v-if="successAlert.show"
            >
                <div>
                    {{ successAlert.message }}
                    <span
                        class="check-order-text"
                        v-if="successAlert.orderId"
                        @click="goToOrder(successAlert.orderId)"
                    >
                        Check Order
                    </span>
                </div>
            </mirage-alert> -->
            <mirage-alert
                :dismissible="errorAlert.dismissable"
                type="error"
                ref="errorAlert"
                class="error-alert"
                v-if="errorAlert.show"
            >
                <div>
                    {{ errorAlert.message }}
                    <li v-for="(item, i) in errorAlert.data" :key="i">
                        {{ item }}
                    </li>
                </div>
            </mirage-alert>
            <div v-if="orderFilters.length" class="order-filters">
                <nitrozen-badge
                    v-for="(f, i) in orderFilters"
                    :key="i"
                    :fill="true"
                    state="info"
                >
                    {{ f }}
                </nitrozen-badge>
            </div>

            <page-error
                :errorText="errorText"
                v-if="showError"
                @tryAgain="loadData"
            ></page-error>

            <loader v-if="pageLoading"></loader>

            <div class="content-container" v-if="orderData && !pageLoading">
                <!-- order details -->
                <order-card
                    :order="orderData"
                    :orderDomain="orderDomain"
                    @call="clickToCall($event)"
                >
                    <!-- bulk shipment operations -->
                    <!-- <div
                        class="bulk-shipment-actions"
                        v-if="
                            isNew && orderData.shipments.length > 1 && !isClosed
                        "
                    >
                        <template>

                            <nitrozen-button
                                v-flatBtn
                                theme="secondary"
                                @click="updateMultipleShipment('bag_confirmed')"
                            >
                                Confirm
                            </nitrozen-button>
                          
                        </template>
                    </div> -->
                </order-card>

                <!-- Shipments Actions -->
                <shipment-actions
                    v-if="isNew && !isClosed && !applicationId"
                    :shipments="orderData.shipments"
                    :shipmentBagCount="shipmentBagCount"
                    @selectAllShipments="selectAllShipments"
                    @unselectAllShipments="unselectAllShipments"
                    @updateMultipleShipment="updateMultipleShipment($event)"
                ></shipment-actions>
                <!-- @cancelMultipleOrder="cancelMultipleOrder" -->

                <!-- Shipments list -->
                <shipment
                    v-for="(shipment, i) in orderData.shipments"
                    :key="i"
                    :shipment="shipment"
                    :orderId="orderData.id"
                    :user="orderData.user"
                    :deliveryAddress="orderData.delivery_address"
                    :applicationId="orderData.application.id"
                    :validActions="shipment.can_break"
                    :isClosed="isClosed"
                    :currentStateShipmentCount="
                        isNew ? orderData.shipments.length : 0
                    "
                    ref="shipment"
                    :showConfirm="!isNew"
                    @update="updateShipment"
                    @call="clickToCall($event)"
                    @calculateShipmentBag="calculateShipmentBag"
                    :readOnlyMode="!!applicationId"
                >
                    <loader v-if="inProgress" class="shipment-loading"></loader>
                </shipment>
            </div>
        </div>

        <!-- <click-to-call-dialog
            ref="clickToCallDialog"
            @close="$clickToCallDialogClosed"
        >
        </click-to-call-dialog> -->

        <!-- shipment cancellation -->
        <!-- <shipment-cancellation-dialog
            ref="shipmentCancellationDialog"
            title="Cancellation reason for unselected bags"
            v-if="orderData"
            @close="$shipmentCancellationDialogClosed"
        >
        </shipment-cancellation-dialog> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
    // GET_COMPANY_APPLICATIONS,
    // GET_EMPLOYEE_ACCESS_DETAIL,
    GET_USER_INFO
} from '@/store/getters.type';
import { getPrimaryDomain } from '@/helper/domains.util';
// import pageerror from '@/components/admin/common/adm-page-error';
import pageerror from '@/components/administrator/adm-page-error';
import AdmPageHeader from '@/components/administrator/adm-page-header.vue';
// import ShipmentCancellationDialog from './shipment-cancellation-dialog.vue';
import loader from '@/components/common/loader';
import uktnotfound from '@/components/common/ukt-not-found.vue';
import InlineSvg from '@/components/common/adm-inline-svg.vue';
import MirageAlert from '@/components/orders/alert.vue';

import Shipment from './shipment.vue';
import shipmentActions from './shipment-actions';
import ordercard from './order-card';
// import ClickToCallDialog from '@/components/common/tools/click-to-call-dialog.vue';
import {
    LocalStorageService,
    STORAGE_KEYS,
} from '@/services/localstorage.service';
import OrderService from '@/services/orders.service';
import moment from 'moment';
// import _ from 'lodash';
import find from 'lodash/find';
import keys from 'lodash/keys';
import crypto from 'crypto';
import { getAppInfo } from '@/services/utils.service';
// import { eventHelper } from '../../../analytics/helpers';
// import { EVENTS, getUserInfo } from "../../../analytics/index"

import {
    NitrozenToggleBtn,
    NitrozenBadge,
    NitrozenButton,
    NitrozenRadio,
    NitrozenInput,
    NitrozenError,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenInline,
    NitrozenDropdown,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';

const introList = [
    {
        name: 'Order ID',
        description:
            'A unique number used for identifying and tracking your orders',
    },
    {
        name: 'Shipment',
        description:
            'An order may contain multiple items; therefore it gets divided into one or more shipment (package) for ease of delivery',
    },
    {
        name: 'Shipping Information',
        description:
            'Details of the recipient to whom this order will be delivered',
    },
    {
        name: 'Bag Items',
        description: 'Shows the products included in a given shipment',
    },
    {
        name: 'Store Information',
        description:
            'This contains the details of the store that is fulfilling the order',
    },
    {
        name: 'Price Breakup',
        description:
            'Shows the marked price, discount and total price of the shipment',
    },
    {
        name: 'Customer Details',
        description:
            "Contains information of the customer who has placed the order. This information won't be shown for anonymous users",
    },
    {
        name: 'Tracking Details',
        description: 'Shows the current tracking status of the shipment',
    },
    {
        name: 'Device Information',
        description:
            'Shows the device information of customer. This information will be shown if it is present',
    },
    {
        name: 'Ordering Store Information',
        description:
            'Details of the ordering store from where order is placed. This information will be shown if it is present',
    },
];

export default {
    name: 'order-details',
    components: {
        AdmPageHeader,
        loader,
        'page-error': pageerror,
        'ukt-not-found': uktnotfound,
        Shipment,
        InlineSvg,
        'shipment-actions': shipmentActions,
        'order-card': ordercard,
        'nitrozen-toggle': NitrozenToggleBtn,
        NitrozenBadge,
        NitrozenButton,
        NitrozenRadio,
        NitrozenInput,
        NitrozenError,
        NitrozenMenu,
        NitrozenInline,
        NitrozenMenuItem,
        NitrozenDropdown,
        // ClickToCallDialog,
        // ShipmentCancellationDialog,
        MirageAlert
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    computed: {
        ...mapGetters({
            // companyApplications: [],GET_COMPANY_APPLICATIONS,
            accessDetail:{},// GET_EMPLOYEE_ACCESS_DETAIL,
            userinfo: GET_USER_INFO,
        }),
        orderApplication() {
            if (this.orderData) {
                return find(this.companyApplications, {
                    id: this.orderData.application.id,
                });
            }
            return;
        },
        orderDomain() {
            if (this.orderApplication) {
                return `https://${getPrimaryDomain(
                    this.orderApplication.domains
                )}`;
            }
        },
        orderId() {
            return this.$route.params.orderId;
        },
        isNew() {
            try {
                const status = this.orderData.shipments.filter(
                    (e) =>
                        e.status.current_shipment_status == 'placed' ||
                        e.status.current_shipment_status == 'store_reassigned'
                );
                return status.length == this.orderData.shipments.length;
            } catch (e) {
                return false;
            }
        },
        isClosed() {
            return this.$route.query.stage == 'closed';
        },
        isIntroShown() {
            let isIntroShown = LocalStorageService.getItem(
                STORAGE_KEYS.USER_ORDER_INTRO_SHOWN
            );
            isIntroShown = !!isIntroShown;
            return isIntroShown;
        },
        orderFilters() {
            try {
                const filters = [];
                const queries = this.$route.query;
                keys(queries).map((q) => {
                    switch (q) {
                        case 'from_date':
                            if (queries['to_date']) {
                                const from = moment(
                                    queries['from_date'],
                                    'MM-DD-YYYY'
                                );
                                const to = moment(
                                    queries['to_date'],
                                    'MM-DD-YYYY'
                                );
                                if (from.isValid() && to.isValid()) {
                                    filters.push(
                                        `Date range: ${from.format(
                                            'MMM Do, YY'
                                        )} to ${to.format('MMM Do, YY')}`
                                    );
                                }
                            }
                            break;
                        case 'stage':
                            filters.push(`Stage: ${queries[q]}`);
                            break;
                        // case 'channel':
                        //     filters.push(`Channel: ${queries[q]}`);
                        //     break;
                    }
                });
                return filters;
            } catch (e) {
                return [];
            }
        },
        applicationName(){
            return "" //getAppInfo()?.name || '';
        }
    },
    data() {
        return {
            contextMenuItems: [{ text: 'Refresh', action: 'refresh' }],
            showError: false,
            errorText: undefined,
            pageLoading: false,
            inProgress: false,
            orderData: null,
            shipmentList: [],
            companyId: this.$route.params.company_id,
            applicationId: this.$route.params.applicationId,

            errorAlert: {
                message: '',
                show: false,
                dismissable: false,
                data: [],
            },
            successAlert: {
                message: '',
                show: false,
                dismissable: false,
                orderId: null,
            },

            activity_history: [],

            navigation: {
                previous: null,
                next: null,
            },

            introList,
            shipmentBagCount: {},
            initStage: {},
            isStatusChange: false,
            initNavigation: null,
        };
    },
    mounted() {
        this.initStage = this.$route.query;
        this.loadData();
    },
    methods: {
        loadData() {
            this.getOrder(null, true);
        },
        reloadPage() {
            this.initStage = this.$route.query;
            this.loadData();
        },
        getInitialValue(value) {
            return {
                value,
                showerror: false,
                errortext: '',
            };
        },
        /**
         * @param String direction
         */
        getOrder(direction, init = false) {
            this.pageLoading = true;

            let params = {};
            if (direction && this.navigation[direction]) {
                params[direction] = this.navigation[direction];
                params['page_size'] = 1;
            } else {
                params['order_id'] = this.orderId;
            }
            if (
                this.isStatusChange &&
                this.initNavigation &&
                this.initStage &&
                direction
            ) {
                // console.log(this.initNavigation, this.initStage);
                this.navigation = { ...this.initNavigation };

                this.$router.push({
                    path: this.$route.path,
                    query: { ...this.initStage },
                });
                params[direction] = this.navigation[direction];
                params['page_size'] = 1;
                delete params['order_id'];
                params = {
                   // app_id: this.applicationId,
                    ...params,
                    ...this.initStage,
                };
                init = true;
                this.isStatusChange = false;
                this.initNavigation = null;
            } else {
                params = {
                    // app_id: this.applicationId,
                    ...params,
                    ...this.$route.query,
                };
            }

            OrderService.fetchOrderDetails(this.companyId,this.applicationId, params)
                .then(({ data }) => {
                    this.pageError = false;
                    this.errorText = undefined;
                    if (data.items && data.items.length) {
                        this.navigation = {
                            previous: data.page.previous,
                            next: data.page.next,
                        };
                        if (init) {
                            this.initNavigation = { ...this.navigation };
                        }
                        this.orderData = data.items[0];
                        this.calculateShipmentBag(true);
                        this.orderData.shipments = this.orderData.shipments.map(
                            (shipment) => {
                                shipment.orderDomain = this.orderDomain;
                                shipment.order = {
                                    delivery_address: this.orderData
                                        .delivery_address,
                                    channel: this.orderData.channel,
                                    created_time: moment(
                                        this.orderData.created_at
                                    ).format('LT, MMM Do, YY'),
                                    order_id: this.orderData.id,
                                };
                                this.shipmentList.push(shipment.id);
                                if (this.orderData.tax_details) {
                                    shipment.order.tax_details = this.orderData.tax_details;
                                }
                                return shipment;
                            }
                        );
                        direction &&
                        this.$router.replace({
                            params: {
                                orderId: this.orderData.id,
                            },
                            query: { ...this.$route.query },
                        });
                    } else {
                        if (!direction) {
                            this.$snackbar.global.showError('Order not found');
                            if (this.orderData) {
                                this.goToOrder(this.orderData.id);
                            } else {
                                this.goToOrderList();
                            }
                        } else {
                            this.navigation[direction] = null;
                        }
                    }
                })
                .catch((err) => {
                    if (
                        err &&
                        err.response &&
                        err.response.data &&
                        err.response.data.message
                    ) {
                        this.errorText = err.response.data.message;
                    }
                    this.pageError = true;
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },

        updateMultipleShipment(nextStatus, reason, reason_text) {
            const shipments = {};

            this.$refs.shipment.map((s) => {
                if (s.isSelected && s.isNew) {
                    shipments[s.shipment.id] = s.getShipmentPayload(
                        nextStatus,
                        reason,
                        reason_text
                    );
                }
            });
            const shipmentIds = keys(shipments);
            if (shipmentIds.length == 0) {
                this.$snackbar.global.showWarning('No Shipment/Bag Selected');
                return;
            }
            // partial confirmation of bags withing shipment leads to remaining bags to get cancelled
            if (nextStatus == 'bag_confirmed') {
                const cancellingShipments = [];
                for (let i = 0; i < shipmentIds.length; i++) {
                    const shipmentId = shipmentIds[i];
                    const shipment = shipments[shipmentId];

                    if (shipment.exclude_shipments_pending) {
                        delete shipment.exclude_shipments_pending;
                        cancellingShipments.push({
                            id: shipmentId,
                            bags: this.getShipmentBags(
                                shipmentId,
                                shipment.exclude_shipments[0].status_update.bags
                            ),
                        });
                    }
                }
                if (cancellingShipments.length > 0) {
                    this.cancelledBagReasonDialog(
                        cancellingShipments,
                        shipments
                    );
                    return;
                }
            }
            this.updateShipment(shipments, nextStatus);
        },
        updateShipment(shipments, nextStatus) {
            const payload = {
                shipments,
                force_transition: false,
                task: false,
            };

            this.inProgress = true;
            OrderService.updateShipmentStatus(payload, this.companyId)
                .then(({ data }) => {
                    const processShipmentPayload = {
                        shipment_ids: keys(shipments),
                        expected_status: nextStatus,
                    };
                    if (
                        data.error_shipments &&
                        data.error_shipments.length == 0
                    ) {
                        this.inProgress = true;
                        OrderService.processShipments(processShipmentPayload)
                            .then((ps_response) => {
                                // this.inProgress = false;
                                this.setSuccessAlert(
                                    true,
                                    'Shipments status updated successfully it might get sometime.',
                                    true,
                                    this.orderData.id
                                );
                                this.$snackbar.global.showSuccess(
                                    `Shipments status updated successfully it might get sometime.`,
                                    {
                                        duration: 2000,
                                    }
                                );
                                /* Google anaytics events start */
                                const gaEventName = nextStatus.toUpperCase();
                                const gaEventProperty = {
                                    shipment_ids: keys(shipments).map(i => `${i}`).join(","),
                                    order_id: this.orderId,
                                    source: 'order_details_view'
                                }
                                console.log(gaEventProperty)
                               // eventHelper.trackOrderUpdateEvent(EVENTS[gaEventName], getUserInfo(this.userinfo, this.accessDetail), gaEventProperty)
                                /* Google anaytics events end*/

                                setTimeout(() => {
                                    this.inProgress = false;
                                });
                                setTimeout(() => {
                                    this.isStatusChange = true;
                                    this.goToOrder(this.orderData.id, true);
                                }, 500);

                                // @NOTE Below logic is to compensate for syncing inconsistency
                                const hash_algo = 'sha1';
                                const output_format = 'hex';
                                const _old_route_state_hash = crypto
                                    .createHash(hash_algo)
                                    .update(JSON.stringify(this.$route.params))
                                    .digest(output_format);
                                setTimeout(() => {
                                    const old_state = _old_route_state_hash;
                                    const new_state = crypto
                                        .createHash(hash_algo)
                                        .update(
                                            JSON.stringify(this.$route.params)
                                        )
                                        .digest(output_format);
                                    if (old_state == new_state) {
                                        this.reloadPage();
                                    }
                                }, 10000);
                            })
                            .catch((err) => {
                                this.inProgress = false;
                                // this.setErrorAlert(
                                //     true,
                                //     'Unable to update status',
                                //     true
                                // );
                                this.$snackbar.global.showError(
                                    'Unable to update status'
                                );
                                console.error(err);
                            });
                    } else {
                        console.error('error in status update', data);
                        this.inProgress = false;
                        this.$snackbar.global.showError(
                            'ERROR: ' + data.message
                        );
                    }
                })
                .catch((err) => {
                    console.error(err);
                    this.inProgress = false;
                    // this.setErrorAlert(true, 'Unable to update status', true);
                    this.$snackbar.global.showError('Unable to update status');
                })
                .finally(() => {
                    this.inProgress = false;
                });
        },
        loadLatest() {
            let direction;
            if (
                this.orderData &&
                this.orderData.shipments &&
                this.orderData.shipments.length <= 1
            ) {
                direction = 'next';
            }
            this.getOrder(direction);
        },
        setRouteParams: function (params) {
            if (params.shipmentId) {
                this.$router.replace({
                    name: this.applicationId
                        ? 'application-order-details'
                        : 'company-order-details',
                    params: {
                        ...this.$route.params,
                        ...params,
                    },
                });
            }
        },
        // showErrorView() {
        //     this.showError = true;
        //     this.pageLoading = false;
        //     this.inProgress = false;
        // },
        clickToCall({ receiver, title }) {
            this.$refs.clickToCallDialog.open({ receiver, title });
        },
        $clickToCallDialogClosed(reason) {
            if (reason == 'success') {
                console.log(reason);
            }
        },

        goToOrderList: function () {
            this.$router
                .push({
                    // name: this.applicationId
                    //     ? 'application-orders'
                    //     : 'company-orders',
                    name: 'orders',
                    query: { ...this.$route.query },
                })
                .catch(() => {});
        },
        goToOrder(orderId, getOrder = false) {
            this.$router
                .push(
                    { params: { orderId }, query: {} }
                    // () => {
                    //     this.getOrder();
                    //     this.setSuccessAlert(false);
                    // }
                )
                .catch((err) => {});
            if (getOrder) {
                setTimeout(() => {
                    this.getOrder();
                }, 500);
                this.setSuccessAlert(false);
            }
        },
        cancelledBagReasonDialog(shipments, originalData) {
            this.$refs.shipmentCancellationDialog.open({
                shipments,
                originalData,
            });
        },
        getShipmentBags(shipmentId, bagIds = []) {
            if (!shipmentId || bagIds.length == 0) return [];
            const shipmentComponent = find(
                this.$refs.shipment,
                (item) => item.shipment.id == shipmentId
            );
            return shipmentComponent.shipment.bags.filter((bag) =>
                bagIds.includes(bag.id)
            );
        },
        $shipmentCancellationDialogClosed(data) {
            if (data && data.cancel) {
                const shipments = data.originalData;
                const shipmentIds = keys(shipments);
                for (let i = 0; i < shipmentIds.length; i++) {
                    const shipmentId = shipmentIds[i];
                    // load reason data selected in dialog
                    try {
                        shipments[
                            shipmentId
                        ].exclude_shipments[0].status_update.reason =
                            data.shipments[shipmentId].reason;
                        shipments[
                            shipmentId
                        ].exclude_shipments[0].status_update.reason_text =
                            data.shipments[shipmentId].reason_text;
                    } catch (error) {}
                }
                this.updateShipment(shipments, 'bag_confirmed');
            }
        },
        introShown() {
            LocalStorageService.addOrUpdateItem(
                STORAGE_KEYS.USER_ORDER_INTRO_SHOWN,
                true
            );
        },
        setSuccessAlert(show, message = '', dismissable, orderId) {
            this.successAlert = {
                show,
                message,
                orderId,
                dismissable,
            };
        },
        // setErrorAlert(show, message = '', dismissable, data = []) {
        //     this.errorAlert = {
        //         show,
        //         message,
        //         data,
        //         dismissable
        //     };
        // },
        detectKeyboardNavigation(event) {
            if (event.keyCode == 37) {
                //left arrow key
                event.preventDefault();
                event.stopPropagation();
                this.getOrder('previous');
            }
            if (event.keyCode == 39) {
                //right arrow key
                event.preventDefault();
                event.stopPropagation();
                this.getOrder('next');
            }
        },
        selectAllShipments() {
            this.$refs.shipment.map((s) => {
                s.selectAllBags();
            });
            this.calculateShipmentBag();
        },
        unselectAllShipments() {
            this.$refs.shipment.map((s) => {
                s.unselectAllBags();
            });
            this.calculateShipmentBag();
        },
        calculateShipmentBag(init = false) {
            let count = {
                bag: 0,
                shipment: 0,
            };
            if (this.$refs.shipment && !init) {
                this.$refs.shipment.map((v) => {
                    if (v.isSelected) {
                        count.shipment += 1;
                        count.bag += v.selectedBags.filter((v) => v).length;
                    }
                });
            } else {
                count.shipment = this.orderData.shipments.length;
                this.orderData.shipments.map((v) => {
                    count.bag += v.bags.length;
                });
            }
            this.shipmentBagCount = count;
        },
    },

    created() {
        document.addEventListener('keydown', this.detectKeyboardNavigation);
    },
    beforeDestroy: function () {
        document.removeEventListener('keydown', this.detectKeyboardNavigation);
    },
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.pad-right {
    margin-right: 8px;
}

.order-item-navigation {
    display: flex;
    color: @Iron;
    font-size: 24px;
    align-items: center;
    .middle-one {
        flex: 1;
        justify-content: center;
        align-items: center;
        display: flex;
    }
    .arrow-button {
        .order-arrow {
            background: white;
            ::v-deep svg {
                width: 36px;
                height: 36px;
                #prefix__Shape {
                    fill: @RoyalBlue;
                }
            }
        }
        &.previous {
            ::v-deep svg {
                transform: rotate(180deg);
                position: relative;
                top: 2px;
            }
        }
        &.next {
            ::v-deep svg {
                position: relative;
                top: -1px;
            }
        }
    }
}

.shipment {
    ::v-deep.shipment-tracking {
        .status {
            @media @mobile {
                padding-right: 115px;
            }
        }
    }

    ::v-deep.bag-details {
        @media @mobile {
            display: flex;
            flex-direction: column-reverse;
        }
        .total {
            @media @mobile {
                flex-direction: column;
            }
        }
        .amt {
            @media @mobile {
                margin-bottom: 5px;
            }
        }
    }
}
.main-container {
    flex-direction: column;
    .intro {
        margin-bottom: 24px;
        .intro-list {
            display: flex;
            padding: 12px;
            width: 100%;
            flex-wrap: wrap;
            .intro-point {
                width: calc(50% - 6px);
                padding: 6px 6px 6px 0;
                .name {
                    font-weight: 500;
                    padding-bottom: 4px;
                    @media @mobile {
                        font-size: 14px;
                    }
                }
                .description {
                    color: @Mako;
                    font-size: 14px;
                    @media @mobile {
                        font-size: 12px;
                    }
                }
            }
        }
        .got-it {
            float: right;
        }
    }
    .success-alert,
    .error-alert {
        margin-bottom: 24px;
        .check-order-text {
            font-size: 14px;
            text-decoration: underline;
            cursor: pointer;
        }
    }
    .order-filters {
        margin-bottom: 24px;
        @media @mobile {
            margin-left: 12px;
        }
        & > div {
            margin-right: 12px;
            font-size: 10px;
            text-transform: capitalize;
        }
    }
    .content-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        .bulk-shipment-actions {
            margin-top: 24px;
            display: flex;
            align-items: center;
        }
        .common-container {
            &:first-child {
                margin-right: 24px;
            }
        }

        .shipment-loading {
            position: absolute;
            justify-content: center;
            width: 100%;
            height: 100%;
            background: hsla(0, 0%, 83%, 0.3);
            top: 0;
            left: 0;
            z-index: 1;
        }
    }
}
.pd0 {
    padding-bottom: 0;
}
.shipment-actions {
    display: flex;
    margin: 6px 0;
    justify-content: flex-end;
    width: 100%;
    button {
        margin-left: 12px;
    }
}
.ninja_activity {
    ::v-deep .nitrozen-dialog {
        max-height: 80%;
    }
}
.ninja-activity-history {
    display: flex;
    flex-direction: column;
    .activity {
        display: flex;
        width: 100%;
        border: 1px solid @Iron;
        border-radius: 3px;
        padding: 12px 0;
        margin-bottom: 12px;
        &:hover {
            background-color: @WhiteSmoke;
        }
        .time {
            padding-left: 12px;
            width: 15%;
        }
        .message {
            width: 70%;
        }
        .user {
            padding-right: 12px;
            width: 15%;
            word-break: break-all;
        }
    }
}
::v-deep #invoicePreviewIframeContainer {
    width: 100%;
    height: 100%;
    iframe {
        width: 100%;
        height: 100%;
    }
}

.support-alert {
    margin-bottom: 15px;
    .support-container {
        display: flex;
        justify-content: space-around;
        width: 100%;
        font-size: 14px;
    }
}

.refresh-icon {
    cursor: pointer;
    margin: 0px 12px;
    ::v-deep svg {
        fill: @RoyalBlue;
        transition: all 0.6s ease;
    }

    &:hover {
        ::v-deep svg {
            transform: rotate(120deg);
        }
    }
}

.page-header-position {
    margin-bottom: 24px;
}
</style>
