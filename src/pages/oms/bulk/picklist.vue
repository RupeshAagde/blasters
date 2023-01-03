<template>
    <div class="panel">
        <mirage-alert
            :dismissible="true"
            ref="intro"
            class="error"
            type="error"
            v-show="showInvoiceErrorFn"
            @close="hideInvoiceError"
        >
            <div>
                <p class="invoice-error-msg">
                    Below shipment id/s haven't met invoice validation:
                </p>
                <ul class="error-info">
                    <li class="error-items">Max 16 characters are supported</li>
                    <li class="error-items">
                        Only / and - special characters are supported
                    </li>
                    <li class="error-items">Don't leave space</li>
                    <li class="error-items">
                        Don't start with zero and special characters
                    </li>
                </ul>
                <div>
                    <ul class="shipments-error">
                        <li
                            class="shipment-error"
                            v-for="(shipmentId, i) in invoiceFailedShipments"
                            :key="i"
                        >
                            {{ shipmentId }}
                        </li>
                    </ul>
                </div>
            </div>
        </mirage-alert>
        <div class="page-container">
            <div>
                <csv-view
                    title="Update shipment status in bulk"
                    ref="csv-picklist"
                    class="csv-picklist"
                    v-show="true"
                    :csvExportFileName="csvExportFileName"
                >
                    <template slot="action-button">
                        <!-- <div class="button-box">
                            <label class="toggle-label">
                                <div
                                    class="cl-RoyalBlue bold-xs status-text"
                                    :class="
                                        !shipmentOrBagView
                                            ? 'disabledToggleString'
                                            : ''
                                    "
                                >
                                    {{
                                        shipmentOrBagView
                                            ? 'Shipment View'
                                            : 'Bag View'
                                    }}
                                </div>
                                <nitrozen-toggle-btn
                                    class="pad-right"
                                    @change="setShipmentOrBagView"
                                    v-model="shipmentOrBagView"
                                ></nitrozen-toggle-btn>
                            </label>
                        </div> -->
                        <div class="button-box">
                            <nitrozen-button
                                theme="secondary"
                                class="action-btn"
                                v-strokeBtn
                                v-if="
                                    (selectedStageTab == 'unfulfilled' && lane != 'new')||(selectedStageTab == 'fulfilled') || (selectedStageTab == 'return')
                                "
                                @click="toggleBulkInvoice = !toggleBulkInvoice"
                                v-click-outside="closeBulkInvoiceLabels"
                                >Bulk Invoice</nitrozen-button
                            >
                            <div 
                                class="menu"
                                v-if="toggleBulkInvoice"
                            >
                                <div class="menu-header">Bulk Invoice</div>
                                <ul class="invoice-menu">
                                    <li class="menu-item"
                                        v-for="(labels, index) in invoiceLabels"
                                        :key="'bulk-invoice-'+index">
                                        {{ labels.text }}
                                        <span class="item-icons">
                                            <span class="icons-item" @click="generateBulkInvoice(labels.value)">
                                                <ukt-inline-svg src="download"></ukt-inline-svg>
                                            </span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <nitrozen-button
                                v-if="nextShipmentState"
                                theme="secondary"
                                v-flatBtn
                                class="action-btn"
                                @click="updateStatus"
                            >
                                {{ nextState }}
                            </nitrozen-button>
                        </div>
                    </template>
                </csv-view>
            </div>

            <!-- shipment cancellation -->
            <shipment-cancellation-dialog
                ref="shipmentCancellationDialog"
                title="Cancellation reason for unselected bags"
                @close="$shipmentCancellationDialogClosed"
            >
            </shipment-cancellation-dialog>

            <adm-loader class="loading" v-if="inProgress"></adm-loader>
        </div>
    </div>
</template>

<script>
/* Package imports */
import { mapGetters } from 'vuex';
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenDropdown,
    NitrozenPagination,
    NitrozenInput,
    NitrozenToggleBtn,
} from '@gofynd/nitrozen-vue';
import moment from 'moment';
import root from 'window-or-global';
import cloneDeep from 'lodash/cloneDeep';
import keys from 'lodash/keys';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import flattenDeep from 'lodash/flattenDeep';
import find from 'lodash/find';

/* Component imports */
import AdmPageHeader from '@/components/common/layout/adm-page-header.vue';
import DatePicker from '@/components/common/date-picker.vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import AdmLoader from '@/components/common/loader.vue';
import CsvView from '@/components/common/adm-csv-viewer.vue';
import { CustomTooltip } from './customTooltip';
import ShipmentCancellationDialog from '../shipment-cancellation-dialog.vue';
import loader from '@/components/common/loader';
import MirageAlert from '@/components/alert/index.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';


/* Helper imports */
import { convertSnakeCaseToString } from '@/helper/utils';

/* Service imports */
import OrderService from '@/services/orders.service';

const {
    NEXT_ORDER_STATUS,
    ALL_ORDER_STATUS,
    ORDER_STATE_MAPPING,
} = require('./next-order-status');

const PAGINATION_OBJECT = {
    limit: 100,
    current: 1,
    total: 0,
};
// const extraDateRange = [
//     {
//         text: 'Last 6 Months',
//         start: moment().subtract(6, 'months'),
//         end: new Date(),
//     },
// ];
const INVOICE_LABEL = [
    {
        text: 'A4',
        value: 'a4',
    },
    {
        text: 'A6',
        value: 'a6'    
    },
    {
        text: 'POS',
        value: 'pos'
    }
];
const BULK_INVOICE_INVALID_STATES = ['bag_confirmed','dp_not_assigned','assigning_dp','bag_invoiced']
export default {
    name: 'order-bulk-picklist',
    components: {
        NitrozenButton,
        NitrozenInput,
        NitrozenDropdown,
        NitrozenPagination,
        AdmPageHeader,
        NitrozenToggleBtn,
        DatePicker,
        CsvView,
        AdmLoader,
        ShipmentCancellationDialog,
        loader,
        InlineSvg,
        MirageAlert,
        UktInlineSvg,
    },
    directives: { flatBtn, strokeBtn },
    computed: {
        ...mapGetters({
            // accessDetail: GET_EMPLOYEE_ACCESS_DETAIL,
            accessDetail: {},
        }),
        csvExportFileName() {
            return `${this.companyId}_picklist_${moment().format(
                'YYYYMMDD_hhmmss'
            )}`;
        },
        showInvoiceErrorFn() {
            return this.showInvoiceError;
        },
        checkUpdateRole() {
            const role =
                this.accessDetail &&
                this.accessDetail.order_role &&
                (this.accessDetail.order_role == 'store_manager' ||
                    this.accessDetail.order_role == 'full_access');
            return role;
        },
    },
    data: function () {
        return {
            showInvoiceError: false,
            inProgress: false,
            companyId: this.$route.params.company_id,
            applicationId: this.$route.params.applicationId,
            orders: [],
            currentStatuses: ORDER_STATE_MAPPING['new'],
            selectedCurrentStatus: 'all',
            editData: [],
            next_order_status: null,
            current_status: 'placed',
            selectedNextStatus: '',
            allOrderStatus: [],
            all_status_value: {},
            allBagsData: [],
            checkedData: [],
            shipmentOrBagView: true,
            invoiceFailedShipments: [],
            nextShipmentState: '',
            nextState: '',
            toggleBulkInvoice: false,
            invoiceLabels: cloneDeep(INVOICE_LABEL),
        };
    },
    props: {
        activeLane: {
            type: Object,
            default: () => {},
        },
        shipmentList: {
            type: Array,
            default: () => [],
        },
        selectedStore: {
            type: [String,Number]
        },
        lane: {
            type: String
        },
        selectedStageTab: {
            type: String
        }
    },
    mounted() {
        if (this.$route.query.super_lane != 'all') {
            this.nextShipmentState = this.activeLane && this.activeLane.actions && this.activeLane.actions.length && this.activeLane.actions[0].value
            this.nextState = this.activeLane && this.activeLane.actions && this.activeLane.actions.length && this.activeLane.actions[0].text
        }

        /* 
            The following code might get removed in the future if we 
            provide options to the user for deciding the next state.
        */
        if (this.nextShipmentState) {
            this.selectedNextStatus = this.nextShipmentState;
        }

        this.fetchShipments();
    },
    methods: {
        closeBulkInvoiceLabels() {
            this.toggleBulkInvoice = false;
        },
        hideInvoiceError() {
            this.showInvoiceError = false;
        },
        // setShipmentOrBagView() {
        //     this.generateCSVData(this.shipmentOrBagView);
        // },
        fetchShipments(init = false, params = {}) {
            this.orders = cloneDeep(this.shipmentList);
            this.generateCSVData(this.shipmentOrBagView);
            this.next_order_status = NEXT_ORDER_STATUS;
        },
        generateCSVData(isShipmentView) {
            const bags = [];
            const shipments = [];

            if (isShipmentView) {
                this.orders.map((s) => {
                    const shipment = {
                        shipment_id: s.shipment_id,
                        bag_total: s.bags.length,
                        order_date: s.shipment_created_at,
                        brand_name:
                            s.bags && s.bags.length
                                ? s.bags[0].brand.name
                                : 'NA',
                        bag_ids: s.bags.map((b) => b.id),
                        qty_obj: s.bags.map((b) => {
                            return {
                                identifier: b.identifier,
                                quantity: b.product_quantity,
                            };
                        }),
                        price:
                            s.bags && s.bags.length
                                ? Math.round(
                                      s.bags[0].gst_details
                                          .brand_calculated_amount
                                  )
                                : 0,
                        mrp: Math.round(s.prices.price_marked),
                        payment_mode: s.payment_mode,
                        current_status: s.shipment_status,
                        actual_current_status: s.shipment_status,
                        display_current_status:
                            this.all_status_value[s.shipment_status] ||
                            convertSnakeCaseToString(s.shipment_status) ||
                            s.shipment_status,
                        awb_no: (s.dp_details && s.dp_details.awb_no) || 'NA',
                        dp_name: (s.dp_details && s.dp_details.name) || 'NA',
                        customer_name: s.delivery_address.name,
                        delivery_city: s.delivery_address.city,
                        customer_number: s.delivery_address.phone,
                        delievery_pincode: s.delivery_address.pincode,
                        address: s.delivery_address.customer_address,
                        channel: s.channel.name,
                        channel_shipment_id: s.shipment_id || 'NA',
                        seller_identifier: s.bags.map(bag => {
                            for (let key in bag) {
                                if(key == 'identifier' && bag[key] !== "") {
                                    return bag[key].replace(/"/g, '')
                                }
                            }
                        }).join(', '),
                        // seller_identifier:s.bags[0].article.identifiers ? Object.keys(s.bags[0].article.identifiers).map(i=>`${i.trim().toUpperCase().replace(/_/g,' ')}:${s.bags[0].article.identifiers[i]}`).join(', '): '',
                        sku_code: 
                            Object.values(s.bags[0].article.identifiers)[0] ||
                            '',
                        gstin:
                            s.bags && s.bags.length
                                ? s.bags[0].gst_details.gstin_code
                                : 'NA',
                        order_id: s.order_id,
                        // external_order_id:
                        //     s.affiliate_details.affiliate_order_id,
                        store_invoice_id: s.invoice_id || s.store_invoice_id || '',
                        actual_store_invoice_id: s.invoice_id || s.store_invoice_id || '',
                        fulfillment_store:s.fulfilling_store.name,
                        can_process: s.can_process
                    };
                    shipments.push(shipment);
                });
            }

            const rowData = isShipmentView ? shipments : bags;
            this.allBagsData = isShipmentView ? shipments : bags;
            const columns = [
                {
                    checkboxSelection: true,
                    headerCheckboxSelection: true,
                    pinned: 'left',
                    width: 50,
                },
                {
                    name: 'Order Id',
                    field: 'order_id',
                    filter: true,
                    width: 250,
                },
                {
                    name: 'Shipment Id',
                    field: 'shipment_id',
                    filter: true,
                    width: 250,
                },
                {
                    name: 'Current Status',
                    field: 'display_current_status',
                    width: 200,
                    cellEditorParams: {
                        values: this.next_order_status,
                    },
                },
                {
                    name: 'Invoice Id',
                    field: 'store_invoice_id',
                    editable: true,
                },
                { name: 'Brand Name', field: 'brand_name', filter: true },
                { name: 'Item Name', field: 'item_name', filter: true },
                { name: 'Item Code', field: 'item_code', filter: true },
                { name: 'Seller Identifier', field: 'seller_identifier' },
                { name: 'Size', field: 'size' },
                // { name: 'Price', field: 'price', sortable: true },
                // { name: 'MRP', field: 'mrp', sortable: true },
                { name: 'Payment Mode', field: 'payment_mode', filter: true },
                // { name: 'Article Code', field: 'article_code' },
                // { name: 'AWB No', field: 'awb_no' },
                { name: 'DP Name', field: 'dp_name' },
                {
                    name: 'Customer Name',
                    field: 'customer_name',
                    width: 200,
                    filter: true,
                    tooltipField: 'customer_name',
                    tooltipComponentParams: { displayField: 'customer_number' },
                },
                // { name: 'Delivery City', field: 'delivery_city', filter: true },
                // {
                //     name: 'Customer Number',
                //     field: 'customer_number',
                //     filter: true
                // },
                {
                    name: 'Delivery Pincode',
                    field: 'delievery_pincode',
                    filter: true,
                    tooltipField: 'delievery_pincode',
                    tooltipComponentParams: { displayField: 'address' },
                },
                { name: 'Channel', field: 'channel', filter: true },
                { name: 'Fulfillment Centre', field: 'fulfillment_store', filter: true },

                // {
                //     name: 'Channel Shipment ID',
                //     field: 'channel_shipment_id'
                // },
                { name: 'GSTIN', field: 'gstin' },
                { name: 'EAN', field: 'ean' },
                // {
                //     name: 'External Order Id',
                //     field: 'external_order_id',
                //     filter: true,
                // },
            ];

            if (isShipmentView) {
                columns.splice(3, 0, {
                    name: 'Total Bag',
                    field: 'bag_total',
                    filter: true,
                });

                [
                    'item_name',
                    'item_code',
                    'size',
                    'article_code',
                    'sku_code',
                ].forEach((item) => {
                    columns.splice(
                        columns.findIndex((i) => i.field === item),
                        1
                    );
                });
            } else {
                columns.splice(3, 0, {
                    name: 'Bag Id',
                    field: 'bag_id',
                    filter: true,
                    tooltipField: 'bag_id',
                    tooltipComponentParams: { displayField: 'bag_id' },
                });
            }
            const next_order_status = NEXT_ORDER_STATUS;
            const nextShipmentState = this.nextShipmentState;
            if (this.$refs['csv-picklist']) {
                this.$refs['csv-picklist'].createGrid(
                    {
                        column: columns.map((e) => ({
                            headerName: e.name,
                            field: e.field,
                            editable: e.editable ? true : false,
                            resizable: true,
                            tooltipComponent: 'customTooltip',
                            width: e.width ? e.width : 120,
                            cellStyle: function (params) {
                                if (params.colDef.field === 'shipment_id') {
                                    // mark as link
                                    return {
                                        color: '#2E31BE',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                    };
                                } else if (
                                    params.colDef.field === 'store_invoice_id'
                                ) {
                                    return {
                                        border: '1px solid rgba(0,0,0,0.06)',
                                        borderRadius: '6px',
                                        cursor: 'text',
                                    };
                                } else if (
                                    params.colDef.field === 'delievery_pincode'
                                ) {
                                    return {
                                        color: '#2E31BE',
                                    };
                                } else {
                                    return null;
                                }
                            },
                            // checking filters
                            sortable: e.sortable ? true : false,
                            pinned: e.pinned ? e.pinned : undefined,
                            filter: e.filter ? true : false,
                            cellEditor: e.cellEditor ? e.cellEditor : null,
                            cellEditorParams: e.cellEditorParams
                                ? e.cellEditorParams
                                : null,
                            tooltipField: e.tooltipField
                                ? e.tooltipField
                                : null,
                            tooltipComponentParams: e.tooltipComponentParams
                                ? e.tooltipComponentParams
                                : null,
                            checkboxSelection: e.checkboxSelection
                                ? e.checkboxSelection
                                : false,
                            headerCheckboxSelection: e.headerCheckboxSelection
                                ? e.headerCheckboxSelection
                                : false,
                        })),
                        rows: rowData,
                    },
                    // extra configuration
                    {
                        rowSelection: 'multiple',
                        isRowSelectable: function(rowNode){
                            return rowNode.data.can_process
                            // if(!rowNode.data.can_process){
                            //     return false
                            // }
                            // return true;
                            // if(next_order_status[rowNode.data.current_status] && nextShipmentState){
                            //     const nextPossibleStatus = next_order_status[rowNode.data.current_status].map((e) => e.value);
                            //     if(nextPossibleStatus.includes(nextShipmentState)){
                            //         return true
                            //     }
                            //     return false
                            // }
                            //     return false
                            },
                        singleClickEdit: true,
                        rowMultiSelectWithClick: true,
                        tooltipShowDelay: 0,
                        components: {
                            customTooltip: CustomTooltip,
                        },
                    }
                );

                // handle cell click
                this.$refs['csv-picklist'].grid.gridOptions.onCellClicked = (
                    e
                ) => {
                    if (e.colDef.field === 'shipment_id') {
                        const company_id = this.$route.params.company_id;
                        let route = `orders/${e.data.order_id}/details?shipmentId=${e.data.shipment_id}`;
                        root.open(`${route}`, '_blank');
                    }
                };

                // handle cell edit start
                this.$refs[
                    'csv-picklist'
                ].grid.gridOptions.onCellEditingStarted = (e) => {
                    // if (e.colDef.field === 'current_status') {
                    //     console.log(e, 'start');
                    // }
                    if (e.colDef.field === 'store_invoice_id') {
                        if (
                            e.data.current_status == 'bag_confirmed' &&
                            !e.data.actual_store_invoice_id
                        ) {
                            console.log('in if');
                        } else {
                            e.api.stopEditing();
                        }
                    }
                };

                // handle cell edit end
                // this.$refs[
                //     'csv-picklist'
                // ].grid.gridOptions.onCellEditingStopped = e => {
                //     if (e.colDef.field === 'current_status') {
                //         // if (e.value !== this.) {
                //         //     this.editData.push(e.data);
                //         // }
                //     }
                // };

                // handle cell value change
                this.$refs[
                    'csv-picklist'
                ].grid.gridOptions.onCellValueChanged = (e) => {
                    if (e.colDef.field === 'current_status') {
                        if (e.oldValue !== e.newValue) {
                            this.editData.push(e.data);
                        }
                    } else if (e.colDef.field === 'store_invoice_id') {
                        let regex = new RegExp(
                            /^([a-zA-Z1-9]{1}[a-zA-Z0-9\/-]{0,15})$/
                        );
                        if (!regex.test(e.data.store_invoice_id)) {
                            this.$snackbar.global.showError(
                                `Invalid Invoice: Only A-Z, a-z, 0-9, /, - without spaces and max 16 length are allowed`,
                                {
                                    duration: 5000,
                                }
                            );
                        } else {
                            rowData.map((bg) => {
                                if (bg.shipment_id == e.data.shipment_id) {
                                    bg.store_invoice_id = e.value;
                                }
                            });
                        }

                        setTimeout(() => {
                            this.$refs[
                                'csv-picklist'
                            ].grid.gridOptions.api.redrawRows();
                        }, 0);
                    }
                };

                // handle selection change
                // this.$refs[
                //     'csv-picklist'
                // ].grid.gridOptions.onSelectionChanged = e => {
                //     this.$refs['csv-picklist'].grid.gridOptions.rowData.map(ele => {
                //         if (ele.error) {
                //             ele.error = false;
                //         }
                //     });
                //     setTimeout(() => {
                //         this.$refs[
                //             'csv-picklist'
                //         ].grid.gridOptions.api.redrawRows();
                //     }, 0);
                // };

                this.$refs['csv-picklist'].grid.gridOptions.onRowSelected = (
                    e
                ) => {
                    if (
                        this.$refs['csv-picklist'].grid.gridOptions.rowData[
                            e.rowIndex
                        ].error
                    ) {
                        this.$refs['csv-picklist'].grid.gridOptions.rowData[
                            e.rowIndex
                        ].error = false;
                        setTimeout(() => {
                            this.$refs[
                                'csv-picklist'
                            ].grid.gridOptions.api.redrawRows();
                        }, 0);
                    }
                };
            }
        },
        customer_address(address) {
            return `${address.address1}, ${address.address2},
            ${address.area}, ${address.city},
            ${address.state}, ${address.country}, ${address.pincode}. `;
        },
        // downloadPicklist() {
        //     console.log(this.$refs['csv-picklist'].grid);
        // },
        updateStatus() {
            this.showInvoiceError = false;
            this.checkedData = [];
            this.invoiceFailedShipments = [];
            if (!this.selectedNextStatus) {
                this.$snackbar.global.showInfo(`Please select next state`, {
                    duration: 2000,
                });
                return;
            }
            this.checkedData = this.$refs[
                'csv-picklist'
            ].grid.gridOptions.api.getSelectedRows();

            if (!this.checkedData.length) {
                this.$snackbar.global.showInfo(
                    `Please select at least one item to update the status.`,
                    {
                        duration: 2000,
                    }
                );
                return;
            }

            let finalData = [];
            let errorData = [];
            this.checkedData.map((ele) => {
                let nextPossibleStatus = [];
                ele.current_status = ele.actual_current_status; //for restoring the value if error comes
                if (
                    this.next_order_status &&
                    this.next_order_status[ele.current_status]
                ) {
                    nextPossibleStatus = this.next_order_status[
                        ele.current_status
                    ].map((e) => e.value);
                }
                if (
                    nextPossibleStatus.length &&
                    nextPossibleStatus.includes(this.selectedNextStatus)
                ) {
                    if (
                        ele.current_status == 'bag_confirmed' &&
                        !ele.store_invoice_id
                    ) {
                        ele.error = true;
                        errorData.push(ele);
                    } else {
                        ele.current_status = this.selectedNextStatus;
                        ele.error = false;
                        finalData.push(ele);
                    }
                } else {
                    ele.error = true;
                    errorData.push(ele);
                }
            });

            this.$refs['csv-picklist'].grid.gridOptions.getRowClass = function (
                params
            ) {
                if (params.data.error) {
                    return 'error-row';
                } else {
                    return '';
                }
            };
            if (errorData.length) {
                setTimeout(() => {
                    this.$refs[
                        'csv-picklist'
                    ].grid.gridOptions.api.redrawRows();
                }, 0);
            }

            if (!finalData.length || errorData.length) {
                if (!errorData[0].store_invoice_id) {
                    finalData.map((ele) => {
                        ele.current_status = this.selectedCurrentStatus;
                    });
                    this.$snackbar.global.showError(
                        `Please enter the invoice ID`,
                        {
                            duration: 2000,
                        }
                    );
                } else {
                    this.$snackbar.global.showError(
                        `Please select valid next state`,
                        {
                            duration: 2000,
                        }
                    );
                }
                return;
            } else {
                this.editData = finalData;
                if (this.editData.length) {
                    const shipments = this.getPayload();
                    let regex = new RegExp(
                        /^([a-zA-Z1-9]{1}[a-zA-Z0-9\/-]{0,15})$/
                    );
                    for (let shipmentId in shipments) {
                        if (shipments[shipmentId].status == 'bag_invoiced') {
                            if (
                                !regex.test(
                                    shipments[shipmentId].store_invoice_id
                                )
                            ) {
                                this.invoiceFailedShipments.push(shipment);
                                delete shipments[shipment];
                                this.showInvoiceError = true;
                            }
                        }
                    }

                    if (Object.keys(shipments).length > 0) {
                        this.shipmentOrBagView
                            ? this.processShipmentView(shipments)
                            : this.checkUnselectedBags(shipments);
                    }
                } else {
                    this.$snackbar.global.showInfo(
                        `Please select at least one item to update the status.`,
                        {
                            duration: 2000,
                        }
                    );
                }
            }
        },
        getPayload() {
            let shipments = {};
            this.editData.map((e) => {
                if (!shipments[e.shipment_id]) {
                    shipments[e.shipment_id] = {
                        products: [...e.qty_obj],
                        reasons: [],
                    };
                } else {
                    if (!this.shipmentOrBagView) {
                        shipments[e.shipment_id].status_update.bags.push(
                            e.bag_id
                        );
                    }
                }
                if (e.current_status == 'bag_not_confirmed') {
                    shipments[e.shipment_id].status_update.reason_text = '';
                    shipments[e.shipment_id].status_update.reason = {
                        [82]: [],
                    };
                }
                if (e.current_status == 'bag_invoiced' && e.store_invoice_id) {
                    shipments[e.shipment_id].status_update.store_invoice_id =
                        e.store_invoice_id;
                }
            });
            return shipments;
        },
        checkUnselectedBags(data) {
            if (this.selectedNextStatus == 'bag_confirmed') {
                let unselectedBags = {};
                let openCancelModal = false;
                this.allBagsData.map((bg) => {
                    if (data[bg.shipment_id] && bg.can_break) {
                        if (
                            !data[bg.shipment_id].status_update.bags.includes(
                                bg.bag_id
                            )
                        ) {
                            if (!unselectedBags[bg.shipment_id]) {
                                unselectedBags[bg.shipment_id] = [];
                            }
                            openCancelModal = true;
                            unselectedBags[bg.shipment_id].push(bg);
                        }
                    }
                });
                if (openCancelModal) {
                    //open popup
                    const shipmentIds = keys(unselectedBags);

                    const shipments = [];
                    for (let i = 0; i < shipmentIds.length; i++) {
                        const shipmentId = shipmentIds[i];
                        shipments.push({
                            id: shipmentId,
                            bags: unselectedBags[shipmentId],
                        });
                    }
                    this.cancelledBagReasonDialog(shipments, data);
                    return;
                }
            }
            this.updateStatusApiCall(data);
        },

        processShipmentView(data) {
            let finalData = {
                shipments: { ...data },
                status: this.nextShipmentState,
                exclude_bags_next_state: null,
            };
            this.updateStatusApiCall(finalData);
        },

        cancelledBagReasonDialog(shipments, originalData) {
            this.$refs.shipmentCancellationDialog.open({
                shipments,
                originalData,
            });
        },
        $shipmentCancellationDialogClosed(data) {
            if (data && data.cancel) {
                const shipments = data.originalData;
                const shipmentIds = keys(shipments);
                for (let i = 0; i < shipmentIds.length; i++) {
                    const shipmentId = shipmentIds[i];
                    // load reason data selected in dialog
                    let cancelledBags = [];
                    const bagReasons =
                        (data.shipments[shipmentId] &&
                            data.shipments[shipmentId].reason) ||
                        {};
                    for (let key in bagReasons) {
                        if (bagReasons.hasOwnProperty(key)) {
                            cancelledBags = [
                                ...cancelledBags,
                                ...bagReasons[key],
                            ];
                        }
                    }
                    if (cancelledBags.length) {
                        shipments[shipmentId].exclude_shipments = [
                            {
                                status_update: {
                                    bags: cancelledBags,
                                    status: 'bag_not_confirmed',
                                    reason: bagReasons,
                                    reason_text:
                                        data.shipments[shipmentId] &&
                                        data.shipments[shipmentId].reason_text,
                                },
                            },
                        ];
                    }
                }
                this.updateStatusApiCall(shipments);
            }
        },
        updateStatusApiCall(shipments) {
            const payload = {
                statuses: [shipments],
                force_transition: false,
                task: true,
            };
            // console.log(shipments)
            // return;
            this.inProgress = true;
            OrderService.updateShipmentStatusV2(payload)
                .then((response) => {
                    let picklist = this;
                    if (response.data.status === true) {
                        this.$snackbar.global.showSuccess(
                            `Updated Succesfully it might get sometime`,
                            { duration: 2000 }
                        );
                        setTimeout(() => {
                            this.$snackbar.global.showSuccess(
                                `Updated succesfully`,
                                { duration: 2000 }
                            );
                            setTimeout(() => {
                                this.inProgress = false;
                                this.$refs['csv-picklist'].removeGrid();
                                picklist.$emit('refreshView');
                            }, 200);
                            this.selectedNextStatus = '';
                        }, 3000);
                    } else {
                        this.inProgress = false;
                        this.$snackbar.global.showError(`Failed to update`, {
                            duration: 2000,
                        });
                    }
                })
                .catch((err) => {
                    this.inProgress = false;
                    console.error(err.response);
                    const { error_shipments } = err.response.data;
                    if (error_shipments && error_shipments.length) {
                        this.checkedData.map((ele) => {
                            if (error_shipments.includes(ele.shipment_id)) {
                                ele.error = true;
                            } else {
                                ele.error = false;
                            }
                        });
                        this.$refs[
                            'csv-picklist'
                        ].grid.gridOptions.getRowClass = function (params) {
                            if (params.data.error) {
                                return 'error-row';
                            } else {
                                return '';
                            }
                        };
                        setTimeout(() => {
                            this.$refs[
                                'csv-picklist'
                            ].grid.gridOptions.api.redrawRows();
                        }, 0);
                    }
                    this.$snackbar.global.showError(`Failed to update`, {
                        duration: 2000,
                    });
                });
        },
        // filterSelectedStatusChange() {
        //     // Will help in narrowing down the results and also provide appropriate next state
        //     this.setNextOrderStatusDropdown();
        //     // Re-render CSV Table
        //     this.generateCSVData(this.shipmentOrBagView);
        // },
        setNextOrderStatusDropdown() {
            this.allOrderStatus = [];
            // Getting the corresponding list for Selected Status
            this.currentStatuses = ORDER_STATE_MAPPING[this.selectedStageTab];

            // Get Actions according to selected current State
            let actions = [];
            if (this.currentStatuses && this.currentStatuses.length) {
                const found = this.currentStatuses.findIndex(
                    (s) => s.value === this.selectedCurrentStatus
                );
                if (found != -1) {
                    actions = this.currentStatuses[found].actions;
                }
            }
            // Set Next Possible Actions
            this.allOrderStatus = actions;
            if (actions && actions.length === 1) {
                this.selectedNextStatus = actions[0].value;
            } else {
                this.selectedNextStatus = '';
            }
        },
        generateBulkInvoice(document_type = 'a4') {
            if(!this.selectedStore){
                this.$snackbar.global.showWarning('Please select a Fulfillment Center');
                return
            }
            if (this.$refs['csv-picklist']) {
                const selectedShipment = []
                const invalidSelectedShipmentStatus = []
                this.$refs[
                    'csv-picklist'
                ].grid.gridOptions.api
                    .getSelectedRows().map(ele => {
                       selectedShipment.push(ele.shipment_id);
                        if(BULK_INVOICE_INVALID_STATES.includes(ele.current_status)){
                            invalidSelectedShipmentStatus.push(ele.shipment_id)
                        }
                    })
                if(!selectedShipment.length){
                    this.$snackbar.global.showWarning('Please select atleast one shipment');
                    return;
                }
                if(invalidSelectedShipmentStatus.length == selectedShipment.length){
                    this.$snackbar.global.showError('Please select valid shipments'); // @ToDo change meesage 
                    return;
                } else if(invalidSelectedShipmentStatus.length){
                    this.$snackbar.global.showWarning('For shipments that are awaiting dp assignment, no invoice or label will be generated'); // @ToDo change meesage 
                }
                const body = {
                    store_id: this.selectedStore,
                    from_date: this.$route.query.from_date,
                    to_date: this.$route.query.to_date,
                    document_type,
                    shipment_ids: selectedShipment,
                };
                return OrderService.generateBulkInvoice(body).then(({data}) => {
                    this.$snackbar.global.showSuccess(
                        'Invoice Generated Sucessfully'
                    );
                    setTimeout(() => {
                            this.$router.push({
                                name: 'company-order-export-list',
                                params: {
                                    type: 0,
                                    storeId: this.selectedStore,
                                },
                                query: this.$route.query
                            });
                        }, 100);
                }).catch(err => {
                    this.$snackbar.global.showError(
                        'Unable to fetch generate invoice'
                    );
                    console.log('error:   ', err);
                })
            }
        },
        redrawRows(){
            setTimeout(() => {
                this.$refs['csv-picklist'].grid.gridOptions.api.redrawRows()
            }, 0);
        }
    },
};
</script>

<style lang="less" scoped>
@import './../../less/page-header.less';
@import './../../less/page-ui.less';
.error-info {
    margin-bottom: 10px;
    list-style-type: disc;
    color: @Mako;
    margin-left: 18px;
    .error-items {
        padding: 2px 0 2px 0;
    }
}
.page-container {
    min-height: 400px;
    flex-direction: column;
    padding: 0px;
    .picklist-actions {
        margin: 12px 0;
        p {
            color: @Required;
            font-size: 14px;
            padding-bottom: 12px;
        }
    }
}
.status-text {
    text-align: left;
}

.button-box {
    display: flex;
    align-items: center;
    position: relative;
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
    .menu {   
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 132px;
    top: 40px;
    background-color: @White;
    padding: 6px;
    border-radius: 4px;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 10%);
    z-index: @layer;
     .menu-header{
        padding: 8px 0px;
        font-size: 14px;
        font-weight: 500;
        text-transform: capitalize;
    }
}
}
.invoice-error-msg {
    margin-bottom: 4px;
    color: @Mako;
}
.error {
    margin: 0 1.2% 0 1.2%;
}
.shipments-error ul {
    list-style-type: none;
    margin: 10px 0 0 0;
    padding-right: 16px;
    overflow: hidden;
}

.shipments-error li {
    float: left;
    display: block;
    text-align: center;
    padding-right: 20px;
    text-decoration: none;
}

.action-btn {
    margin-right: 8px;
}

.invoice-menu {
    display: flex;
    flex-direction: column;

    .menu-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 5px;
        font-size: 13px;

        .item-icons {
            padding-top: 3px;
          //  width: 45%; temp
            display: flex;
            cursor: pointer;
            justify-content: space-between;
            &:hover {
                ::v-deep svg {
                    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
                    #prefix__Eye_Open {
                        stroke: @RoyalBlue;
                    }
                }
            }
            ::v-deep svg {
                width: 16px;
                height: 16px;
                #prefix__Eye_Open {
                    stroke: @Mako;
                }
            }
        }
    }
}

.invoice-preview {
    ::v-deep svg {
        width: 14px;
        height: 14px;
        cursor: pointer;
    }
    ::v-deep .invoicePreviewIframeContainer {
        width: 100%;
        height: 100%;
        iframe {
            width: 100%;
            height: 100%;

            .mirage-scrollbar;
        }
    }
}
</style>
