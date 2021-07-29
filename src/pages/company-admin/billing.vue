<template>
    <div class="panel">
        <page-header
            ref="page-header-ref"
            :title="'Invoice'"
            :contextMenuItems="contextMenuItems"
            @backClick="redirectToListing"
            @payOffline="openPayOfflineModal"
            @openChargeInvoiceModal="openChargeInvoiceModal"
            @openVoiceInvoiceModal="openVoiceInvoiceModal"
        >
            <div>
                <nitrozen-button
                    :theme="'secondary'"
                    v-strokeBtn
                    id="download-invoice"
                    @click="downloadInvoice"
                    >Download
                </nitrozen-button>
            </div>
        </page-header>
        <div class="main-container">
            <div class="header-margin page-container">
                <div>
                    <div v-if="invoice && invoice.shopsense_details">
                        <div class="flex align-items-center">
                            <div class="m-r-24">
                                <img class="shopsense_logo" src="/public/assets/pngs/platform-logo.png" />
                            </div>
                            <div>
                                <div v-if="invoice.shopsense_details.company_name"
                                    class="title m-b-12"
                                >{{ invoice.shopsense_details.company_name }}</div>
                                <div v-if="invoice.shopsense_details.address"
                                    class="line-height-24"
                                >{{ invoice.shopsense_details.address }}</div>
                                <div v-if="invoice.shopsense_details.gstin"
                                    class="line-height-24"
                                >GSTIN : {{ invoice.shopsense_details.gstin }}</div>
                                <div v-if="invoice.shopsense_details.pan"
                                    class="line-height-24"
                                >PAN : {{ invoice.shopsense_details.pan }}</div>
                                <div v-if="invoice.shopsense_details.email"
                                    class="line-height-24"
                                >Email : {{ invoice.shopsense_details.email }}</div>
                            </div>
                        </div>
                        <hr>
                    </div>
                    <div v-if="invoice && invoice.invoice">
                        <div class="flex m-b-24">
                            <div class="flex-2">
                                <table class="bold m-b-12 m-t-6 width-80">
                                    <tr>
                                        <td>Billing Address</td>
                                    </tr>
                                </table>
                                <div class="line-height-24 bold">
                                    {{
                                        invoice.invoice.client.name
                                    }}
                                </div>
                                <div class="line-height-24" v-if="safeGet(invoice,'invoice.documents.gst')">
                                    GSTIN: {{
                                        invoice.invoice.documents.gst
                                    }}
                                </div>
                                <div class="line-height-24">
                                    {{
                                        invoice.invoice.client.address_lines.join(
                                            ' '
                                        )
                                    }}
                                </div>
                            </div>
                            <div class="flex-1 invoice-number-wrapper">
                                <table class="invoice-number-table width-100">
                                    <tr>
                                        <td>Invoice number</td>
                                        <td>{{ invoice.invoice.number }}</td>
                                    </tr>
                                    <tr>
                                        <td>Date issued</td>
                                        <td>
                                            {{
                                                invoiceOpenDate
                                            }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Billing period from</td>
                                        <td>
                                            {{
                                                invoice.invoice.period.start
                                                    | getDateString
                                            }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Billing period to</td>
                                        <td>
                                            {{
                                                invoice.invoice.period.end
                                                    | getDateString
                                            }}
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td>Status</td>
                                        <td>
                                            <div
                                                v-if="invoice.invoice.current_status == 'void'"
                                                class="void-status"
                                            >
                                                Void
                                            </div>
                                            <div
                                                v-else-if="invoice.invoice.paid"
                                                class="paid-status"
                                            >
                                                Paid
                                            </div>
                                            <div
                                                v-else-if="!invoice.invoice.paid"
                                                class="paid-status unpaid"
                                            >
                                                Unpaid
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div v-if="invoice && invoice.invoice_items" class="m-t-24">
                        <div class="m-t-24">
                            <table class="invoice-items-table width-100 m-t-24">
                                <thead>
                                    <tr>
                                        <th class="product-name">Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        :key="i"
                                        v-for="(
                                            item, i
                                        ) in invoice.invoice_items"
                                    >
                                        <td>
                                            <div class="invoice_item_name">{{ item.name }}</div>
                                            <div class="invoice_item_description" v-if="item.type !== 'subscription'">{{ item.description }}</div>
                                        </td>
                                        <td>
                                            <div>{{ item.quantity }}</div>
                                        </td>
                                        <td>
                                            <div>
                                                {{
                                                    amountFormat({
                                                        currency: item.currency,
                                                        amount:
                                                            item.unit_amount,
                                                    })
                                                }}
                                            </div>
                                        </td>
                                        <td>
                                            <div class="bold">
                                                {{
                                                    amountFormat({
                                                        currency: item.currency,
                                                        amount:
                                                            item.quantity *
                                                            item.unit_amount,
                                                    })
                                                }}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="no-border-left no-border-right"></td>
                                        <td class="no-border-left no-border-right"></td>
                                        <td class="no-border-left no-border-right">
                                            <div class="bold">Sub Total</div>
                                        </td>
                                        <td class="no-border-left no-border-right">
                                            <div class="bold">
                                                {{
                                                    amountFormat({
                                                        currency:
                                                            invoice.invoice
                                                                .currency,
                                                        amount:
                                                            invoice.invoice
                                                                .subtotal,
                                                    })
                                                }}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="!invoice.invoice.is_pricing_gst_included">
                                        <td class="no-border-left no-border-right"></td>
                                        <td class="no-border-left no-border-right"></td>
                                        <td class="no-border-left no-border-right">
                                            <div class="bold ">CGST {{ invoice.invoice
                                                                .taxation.cgst * 100 }}%</div>
                                        </td>
                                        <td class="no-border-left no-border-right">
                                            <div class="bold">
                                                {{
                                                    amountFormat({
                                                        currency:
                                                            invoice.invoice
                                                                .currency,
                                                        amount:
                                                            invoice.invoice
                                                                .taxation.cgst*invoice.invoice.subtotal,
                                                    })
                                                }}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="!invoice.invoice.is_pricing_gst_included && invoice.invoice.taxation.sgst">
                                        <td class="no-border-left no-border-right"></td>
                                        <td class="no-border-left no-border-right"></td>
                                        <td class="no-border-left no-border-right">
                                            <div class="bold">SCGST {{ invoice.invoice
                                                                .taxation.sgst * 100 }}%</div>
                                        </td>
                                        <td class="no-border-left no-border-right">
                                            <div class="bold">
                                                {{
                                                    amountFormat({
                                                        currency:
                                                            invoice.invoice
                                                                .currency,
                                                        amount:
                                                            invoice.invoice
                                                                .taxation.sgst*invoice.invoice.subtotal,
                                                    })
                                                }}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="!invoice.invoice.is_pricing_gst_included && invoice.invoice.taxation.igst">
                                        <td class="no-border-left no-border-right"></td>
                                        <td class="no-border-left no-border-right"></td>
                                        <td class="no-border-left no-border-right">
                                            <div class="bold">ICGST {{ invoice.invoice
                                                                .taxation.igst * 100 }}%</div>
                                        </td>
                                        <td class="no-border-left no-border-right">
                                            <div class="bold">
                                                {{
                                                    amountFormat({
                                                        currency:
                                                            invoice.invoice
                                                                .currency,
                                                        amount:
                                                            invoice.invoice
                                                                .taxation.igst*invoice.invoice.subtotal,
                                                    })
                                                }}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td><div class="bold">Total</div></td>
                                        <td>
                                            <div class="bold">
                                                {{
                                                    amountFormat({
                                                        currency:
                                                            invoice.invoice
                                                                .currency,
                                                        amount:
                                                            invoice.invoice
                                                                .total,
                                                    })
                                                }}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div
                            class="m-t-24"
                            v-if="
                                invoice &&
                                invoice.invoice &&
                                invoice.invoice.paymentMethod &&
                                paidStatus
                            "
                        >
                            <table class="m-t-24 card-details-table width-100">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Receipt Number</th>
                                        <th>Type</th>
                                        <th>Card type</th>
                                        <th>Card details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {{
                                                paidStatus.timestamp
                                                    | getDateString
                                            }}
                                        </td>
                                        <td>
                                            {{ invoice.invoice.receipt_number }}
                                        </td>
                                        <td>Payment</td>
                                        <td>
                                            {{
                                                safeGet(
                                                    invoice,
                                                    'invoice.paymentMethod.data.funding',
                                                    ''
                                                ) | capitalize
                                            }}
                                        </td>
                                        <td>
                                            <div>
                                                {{
                                                    '**** **** ****' +
                                                    safeGet(
                                                        invoice,
                                                        'invoice.paymentMethod.data.last4',
                                                        ''
                                                    )
                                                }}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-container">
            <div class="page-container" v-if="invoice && invoice.invoice_charges.length">
                <div class="title">Payment Attempt</div>
                <base-card-1
                    v-for="(item, index) in invoice.invoice_charges"
                    :key="index"
                    :item="item"
                    :index="index + 1"
                ></base-card-1>
            </div>
        </div>

        <transition name="modal">
            <nitrozen-dialog ref="dialog" title="Add Offline Payment" @close="closePayOfflineModal">
                <template slot="body">
                    <div class="meta-container">
                        <nitrozen-input
                            class="search"
                            type="input"
                            label="Payment Intent Id"
                            placeholder="Enter Payment Intent Id"
                            v-model="offline_payment.payment_intent_id"
                        ></nitrozen-input>
                        <nitrozen-error v-if="offline_payment.showError">This field is required</nitrozen-error>
                        <nitrozen-input
                            class="search m-t-24"
                            type="textarea"
                            label="Comment"
                            placeholder="Enter Comment"
                            v-model="offline_payment.comment"
                        ></nitrozen-input>
                        <nitrozen-error v-if="offline_payment.showError">This field is required</nitrozen-error>
                    </div>
                </template>
                <template slot="footer">
                    <nitrozen-button
                        style="width:100%"
                        :theme="'secondary'"
                        v-strokeBtn
                        @click="addOfflinePayment"
                        >Add Payment
                    </nitrozen-button>
                </template>
            </nitrozen-dialog>
        </transition>
        <transition name="modal">
            <nitrozen-dialog ref="confirm_void_invoice_dialog" title="Void Invoice" @close="onCloseVoidInvoiceDialog">
                <template slot="body">
                    <div class="meta-container">
                        <nitrozen-input
                            class="search"
                            type="password"
                            label="Password"
                            placeholder="Enter password to charge invoice"
                            v-model="void_invoice.password"
                            @change="void_invoice.showError=false"
                        ></nitrozen-input>
                        <nitrozen-error v-if="void_invoice.showError">This field is required</nitrozen-error>
                    </div>
                </template>
                <template slot="footer">
                    <nitrozen-button
                        :class="{'void-invoice-btn-loading':voidInvoiceLoading}"
                        class="void-invoice-btn"
                        :theme="'secondary'"
                        v-strokeBtn
                        :showProgress="voidInvoiceLoading"
                        @click="onVoidInvoice"
                        >Void Invoice
                    </nitrozen-button>
                </template>
            </nitrozen-dialog>
        </transition>
        <transition name="modal">
            <nitrozen-dialog ref="charge_invoice_dialog" title="Charge Invoice" @close="closeChargeInvoiceModal">
                <template slot="body">
                    <div class="meta-container">
                        <nitrozen-input
                            class="search"
                            type="password"
                            label="Password"
                            placeholder="Enter password to charge invoice"
                            v-model="charge_invoice.password"
                            @change="chargeInvoice.password=false"
                        ></nitrozen-input>
                        <nitrozen-error v-if="charge_invoice.showError">This field is required</nitrozen-error>
                    </div>
                </template>
                <template slot="footer">
                    <nitrozen-button
                        class="charge-invoice-btn"
                        :class="{'charge-invoice-btn-loading':chargeInvoiceLoading}"
                        :theme="'secondary'"
                        v-strokeBtn
                        :showProgress="chargeInvoiceLoading"
                        @click="chargeInvoice"
                        >Charge Invoice
                    </nitrozen-button>
                </template>
            </nitrozen-dialog>
        </transition>
    </div>
</template>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';
@import './../../less/common.less';

.line-height-24 {
    line-height: 24px;
}
.header-margin {
    margin-top: 56.5px;
}
.shopsense_logo{
    width: 240px;
    margin-right: 12px;
}
.void-invoice-btn{
    width:100%;
    background-color: #fff;
    color:#f33;
    border: 1px solid #f33;
    border-radius: 3px;
}
.void-invoice-btn-loading{
    width:100%;
    color: #fff;
    background-color:#f33;
    border-radius: 3px;
}
.charge-invoice-btn{
    width:100%;
    background-color: #fff;
    color:#2e31be;
    border: 1px solid #2e31be;
    border-radius: 3px;
}
.charge-invoice-btn-loading{
    width:100%;
    color: #fff;
    background-color:#2e31be;
    border-radius: 3px;
}
.page-container {
    flex-direction: column;

    .invoice-number-wrapper {
        border-radius: 5px;
    }
    .invoice-number-table {
        tr {
            td:first-child {
                font-weight: 600;
            }
            td:nth-child(2) {
                font-weight: 400;
                -webkit-font-smoothing: antialiased;
            }
            td {
                padding: 6px 6px;
            }
            .void-status{
                border: 1px solid #f33;
                color: #f33;
                display: inline;
                padding: 3px 5px;
            }
            .paid-status {
                border: 1px solid #2e31be;
                color: #2e31be;
                display: inline;
                padding: 3px 5px;
            }
            .unpaid {
                color: #f8c149;
                border: 1px solid #f8c149;
            }
        }
    }
    .bold {
        font-weight: 600;
    }
    .invoice-items-table {
        border-radius: 5px;
        .product-name {
            width: 45%;
        }
        th {
            font-weight: 600;
        }
        td,
        th {
            padding: 12px;
            text-align: left;
            border: 1px solid black;
        }
        .invoice_item_name{
            font-weight: 600;
        }
        .invoice_item_description{
            margin-top: 8px;
        }
        .no-border-left{
            border-left: none;
        }
        .no-border-right{
            border-right: none;
        }
        tr:nth-last-child(1) {
            td {
                border-left: none;
                border-right: none;
            }
        }
        tr:nth-last-child(1) {
            td {
                border-bottom: none;
            }
        }
    }
    .card-details-table {
        border-radius: 5px;
        th {
            font-weight: 600;
        }
        td,
        th {
            padding: 12px;
            text-align: left;
            border: 1px solid black;
        }
    }
}
.wrapper-footer-btn {
    display: flex;
    justify-content: space-between;
}
.refresh-icon {
    margin-left: auto;
    margin-top: auto;
    margin-bottom: auto;
    cursor: pointer;
    &:hover {
        ::v-deep {
            fill: @RoyalBlue;
        }
    }
}

.nitrozen-label {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}
.title {
    color: @Mako;
    font-weight: bold;
    font-size: 18px;
    line-height: 27px;
    text-align: left;
    margin-bottom: 24px;
}
.radio-inline {
    margin-top: 12px;
    display: inline-block;
    margin-right: 24px;
}
.cursor-pointer {
    cursor: pointer;
}
.inline-block {
    display: inline-block;
}
.link {
    cursor: pointer;
    color: #2e31be;
    font-size: 12px;
    font-family: Inter, sans-serif;
}
.danger {
    color: #fa3f4d;
}
.form-field {
    margin-bottom: 24px;
}
.float-right {
    float: right;
}
.flex-end {
    align-items: flex-end;
}

.align-items-center {
    align-items: center;
}
.align-self-center {
    align-self: center;
}
.justify-content-flex-end {
    justify-content: flex-end;
}
.hidden {
    visibility: none;
}
.flex {
    display: flex;
    .flex-1 {
        flex: 1;
    }
    .flex-2 {
        flex: 2;
    }
    .flex-3 {
        flex: 3;
    }
    .flex-4 {
        flex: 4;
    }
}
.m-r-24 {
    margin-right: 24px;
}
.m-t-6 {
    margin-top: 6px;
}
.m-t-24 {
    margin-top: 24px;
}
.m-b-24 {
    margin-bottom: 24px;
}
.m-l-24 {
    margin-left: 24px;
}

.m-r-12 {
    margin-right: 12px;
}
.m-t-12 {
    margin-top: 12px;
}
.m-b-12 {
    margin-bottom: 12px;
}
.m-l-12 {
    margin-left: 12px;
}

.p-r-12 {
    padding-right: 12px;
}
.p-t-12 {
    padding-top: 12px;
}
.p-b-12 {
    padding-bottom: 12px;
}
.p-l-12 {
    padding-left: 12px;
}

.m-r-0 {
    margin-right: 0px;
}
.m-t-0 {
    margin-top: 0px;
}
.m-b-0 {
    margin-bottom: 0px;
}
.m-l-0 {
    margin-left: 0px;
}
.width-80 {
    width: 80%;
    @media @mobile {
        width: 100%;
    }
}
.width-50 {
    width: 50%;
    @media @mobile {
        width: 100%;
    }
}
.width-100 {
    width: 100%;
}
.text-center {
    text-align: center;
}
.text-right {
    text-align: right;
}
.box-sizing-border-box {
    box-sizing: border-box;
}
.from-container {
    border: 1px solid #f9f9f9;
    border-radius: 4px;
    padding: 24px;
    @media @mobile {
        padding: 0;
    }
    .container {
        position: relative;
        border-radius: 4px;
        box-sizing: border-box;
        width: 100%;
        flex-direction: column;
        border: 1px solid #f9f9f9;
        padding: 24px;
        margin-bottom: 24px;
        .field-wrap {
            width: 100%;
            margin-bottom: 12px;
        }
        .remove {
            position: absolute;
            right: 0;
            top: 9px;
        }
    }
    .default {
        background: #f9f9f9;
    }
}
.bold-link {
    color: #2e31be;
    text-align: right;
    cursor: pointer;
    margin-bottom: 0px;
    margin-top: 12px;
    font-weight: 700;
    font-size: 13px;
}
</style>

<script>
import PageHeader from '@/components/common/layout/page-header';
import moment from 'moment';
import admInlineSvg from '@/components/common/adm-inline-svg.vue';
import BillingService from '@/services/billing.service';
import CompanyService from '@/services/company-admin.service';
import get from 'lodash/get';
import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenRadio,
    NitrozenCheckBox,
    NitrozenDialog,
    NitrozenError,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
import BaseCard1 from '../../components/common/base-card-1.vue';
import { getAuthToken } from '../../services/utils.service'
import GrindorService from '@/services/grindor.service';

export default {
    name: 'billing',
    components: {
        PageHeader,
        'nitrozen-input': NitrozenInput,
        'nitrozen-button': NitrozenButton,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dialog': NitrozenDialog,
        'adm-inline-svg': admInlineSvg,
        'nitrozen-error': NitrozenError,
        BaseCard1,
    },
    computed: {
        invoiceOpen(){
            let current_status = get(this, 'invoice.invoice.current_status', null);
            if(current_status != "open") return null;
            let status_trail = get(this, 'invoice.invoice.status_trail', null);
            let open_status = status_trail.find(
                (status) => status.value == 'open'
            );
            return open_status;
        },
        invoiceOpenDate(){
            let status_trail = get(this, 'invoice.invoice.status_trail', null);
            let open_status = status_trail.find(
                (status) => status.value == 'open'
            );
            if(!open_status){
                return null
            }
            return moment(open_status.timestamp).format('Do MMMM YYYY');
        },
        paidStatus() {
            let status_trail = get(this, 'invoice.invoice.status_trail', null);
            if (!status_trail || status_trail.length == 0) {
                return null;
            }
            let paid_status = status_trail.find(
                (status) => status.value == 'paid'
            );
            if (paid_status) {
                return paid_status;
            }
            return null;
        },
        registeredAddress() {
            let addresses = get(this, 'profileDetails.addresses', []);
            let registered = addresses.find(
                (address) => address.address_type == 'registered'
            );
            return registered;
        },
    },
    filters: {
        getDateString: function (value) {
            return moment(value).format('Do MMMM YYYY');
        },
        accountNumber: function (value) {
            if (!value) return '';
            var last = 4;

            value =
                new Array(value.length - last + 1).join('*') +
                value.slice(-last);
            return value;
        },
        capitalize: function (value) {
            if (!value) return '';
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            companyId: this.$route.params.companyId,
            invoice: null,
            profileDetails: null,
            invoiceId: this.$route.params.billingNo,
            chargeInvoiceLoading: false,
            voidInvoiceLoading: false,
            contextMenuItems: [
                {
                        text: 'Pay Offline',
                        action: 'payOffline',
                },
                {
                    text: 'Charge Invoice',
                    action: 'openChargeInvoiceModal'
                },
                {
                    text: 'Void Invoice',
                    action: 'openVoiceInvoiceModal'
                }
            ],
            offline_payment:{
                showError:false,
                payment_intent_id:'',
                comment:''
            },
            charge_invoice:{
                password: '',
                showError:false,
            },
            void_invoice:{
                password: '',
                showError:false,
            }
        };
    },
    mounted() {
        this.fetchInvoiceDetail()
        .then(()=>{
            if(!this.invoiceOpen){
                this.contextMenuItems = this.contextMenuItems.filter(a=>a.action != "payOffline")
            }
            if(this.paidStatus){
                this.contextMenuItems = this.contextMenuItems.filter(a=>a.action != "openChargeInvoiceModal")
            }
            if(["open","draft"].indexOf(this.invoice.invoice.current_status) == -1){
                this.contextMenuItems = this.contextMenuItems.filter(a=>a.action != "openVoiceInvoiceModal")
            }
        })
    },
    methods: {
        chargeInvoice(){
            this.charge_invoice.showError = false
            if(!this.charge_invoice.password){
                this.charge_invoice.showError = true
                return
            }
            this.chargeInvoiceLoading = true
            return BillingService.chargeInvoice({invoice_id:this.invoiceId, password: this.charge_invoice.password}).then(({ data }) => {
                this.$snackbar.global.showSuccess(`Invoice charged successfully`, {
                    duration: 2000
                });
                this.$refs['charge_invoice_dialog'].close()
            })
            .catch((err)=>{
                if(err.response.data && err.response.data.message){
                    this.$snackbar.global.showError(err.response.data.message, {
                        duration: 3000
                    });
                }
                else{
                    this.$snackbar.global.showError("Something went wrong", {
                        duration: 2000
                    });
                }
            })
            .finally(()=>{
                this.chargeInvoiceLoading = false
            })
        },
        fetchInvoiceDetail(){
            return BillingService.getInvoiceDetail(this.invoiceId).then(({ data }) => {
                this.invoice = data;
            });
        },
        redirectToListing() {
            this.$router.back();
        },
        amountFormat(plan) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: plan.currency,
            }).format(plan.amount);
        },
        safeGet(obj, path, defaultValue) {
            return get(obj, path, defaultValue);
        },
        getPublicUrl(urls,expiry){
            return GrindorService.getPublicUrl(this.companyId,{
                expiry,
                urls
            })
            .then(res=>res.data)
        },
        downloadInvoice() {
            var link = document.createElement('a');
            return this.getPublicUrl([this.invoice.invoice.pdf_url],20000)
            .then((publicUrlResponse)=>{
                let public_signed_url = get(publicUrlResponse,'urls.0.signed_url')
                link.setAttribute('href', public_signed_url);
                link.setAttribute('target', '_blank');
                link.setAttribute('download', 'invoice.pdf');
                document.body.appendChild(link); // Required for FF
    
                link.click();
            })
            .catch(err=>{
                console.log(err)
            })
        },
        openPayOfflineModal() {
            this.$refs['dialog'].open({
                width: '500px',
                height: '450px',
                showCloseButton: true,
                dismissible: false,
                positiveButtonLabel: 'Add Payment'
            });
        },
        openChargeInvoiceModal() {
            this.$refs['charge_invoice_dialog'].open({
                width: '500px',
                height: '250px',
                showCloseButton: true,
                dismissible: true,
                positiveButtonLabel: 'Charge Invoice'
            });
        },
        openVoiceInvoiceModal(){
            this.$refs['confirm_void_invoice_dialog'].open({
                width: '500px',
                showCloseButton: true,
                dismissible: true,
                neutralButtonLabel: false,
                positiveButtonLabel: 'Void Invoice',
                negativeButtonLabel: 'Cancel'
            });
        },
        onVoidInvoice(){
            this.void_invoice.showError = false
            if(!this.void_invoice.password){
                this.void_invoice.showError = true
                return
            }

            this.voidInvoiceLoading = true
            let payload={
                invoice_id: this.invoiceId,
                password: this.void_invoice.password
            }
            BillingService.voidInvoice(payload)
            .then(res=>{
                this.$snackbar.global.showSuccess(`Invoice marked as void successfully`, {
                    duration: 2000
                });
                return this.fetchInvoiceDetail()
            })
            .then(()=>{
                this.$refs['confirm_void_invoice_dialog'].close()
            })
            .catch(err=>{
                if(err && err.response && err.response.data && err.response.data.message){
                    this.$snackbar.global.showError(err.response.data.message, {
                        duration: 3000
                    });
                }
                else{
                    this.$snackbar.global.showError("Something went wrong", {
                        duration: 2000
                    });
                }
            })
            .finally(()=>{
                this.voidInvoiceLoading = false
            })
        },
        onCloseVoidInvoiceDialog(meta){
            
        },
        closeChargeInvoiceModal(meta){
            this.refreshInvoiceDetailUntilPaid(1)
        },
        refreshInvoiceDetailUntilPaid(count=1){
            setTimeout(() => {
                this.fetchInvoiceDetail()
                .then(()=>{
                    if(count < 10 && this.invoice.invoice.current_status == 'paid' && !this.invoice.invoice.paid){
                        this.refreshInvoiceDetailUntilPaid(count+1)
                    }
                })
            }, 1500);
        },
        closePayOfflineModal(meta){
            this.offline_payment.showError=false;
            if(meta.offlinePaidSuccess){
                this.fetchInvoiceDetail()
            }
        },
        addOfflinePayment(){
            if(!this.offline_payment.payment_intent_id || !this.offline_payment.comment){
                this.offline_payment.showError=true;
                return
            }else{
                let payload={
                    payment_intent_id: this.offline_payment.payment_intent_id,
                    comment: this.offline_payment.comment
                }
                BillingService.updateOfflinePayment(this.invoiceId,payload).then(res=>{
                    this.$refs['dialog'].close({offlinePaidSuccess:true})
                    this.$snackbar.global.showSuccess(`Invoice marked paid as offline successfully`, {
                        duration: 2000
                    });
                })
                .catch(err=>{
                    this.$refs['dialog'].close({offlinePaidSuccess:true})
                    this.$snackbar.global.showError(`Failed to mark invoice as offline paid`, {
                        duration: 2000
                    });
                })
            }
        }
    },
};
</script>
