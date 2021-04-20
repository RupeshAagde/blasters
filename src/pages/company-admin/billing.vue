<template>
    <div class="panel">
        <page-header
            ref="page-header-ref"
            :title="'Invoice'"
            :contextMenuItems="contextMenuItems"
            @backClick="redirectToListing"
        >
        <div style="display:flex; width:18%">
            <nitrozen-button
            :theme="'secondary'"
            v-strokeBtn
            @click="downloadInvoice"
            >Download</nitrozen-button>

        <span
            @click="()=>{}"
            class="refresh-icon"
            title="Refresh"
        >
            <adm-inline-svg
                class="svg-icon"
                src="refresh"
            ></adm-inline-svg>
        </span>
        </div>
        </page-header>
        <div class="main-container">
            <div class="header-margin page-container">
                <div>
                    <div class="title">Details</div>
                    <div v-if="invoice && invoice.invoice">
                        <div class="flex m-b-24">
                            <div class="flex-2">
                                <table
                                    class="invoice-number-table width-50"
                                    v-if="registeredAddress"
                                >
                                    <tr>
                                        <td>Address</td>
                                        <td class="line-height-24">
                                            <div>
                                                {{ registeredAddress.address1 }}
                                            </div>
                                            <div>
                                                {{ registeredAddress.city }}
                                            </div>
                                            <div>
                                                {{ registeredAddress.state }}
                                                {{ registeredAddress.pincode }}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="flex-1 invoice-number-wrapper">
                                <table class="invoice-number-table width-100">
                                    <tr>
                                        <td>Invoice number</td>
                                        <td>{{ invoice.invoice.number }}</td>
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
                                        <td>Date issued</td>
                                        <td>
                                            {{
                                                invoice.invoice.created_at
                                                    | getDateString
                                            }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Status</td>
                                        <td>
                                            <div
                                                v-if="invoice.invoice.paid"
                                                class="paid-status"
                                            >
                                                Paid
                                            </div>
                                            <div
                                                v-if="!invoice.invoice.paid"
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
                        <div class="flex m-t-24">
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
                                        v-for="(item,
                                        i) in invoice.invoice_items"
                                    >
                                        <td>
                                            <div>{{ item.name }}</div>
                                        </td>
                                        <td>
                                            <div>{{ item.quantity }}</div>
                                        </td>
                                        <td>
                                            <div>
                                                {{
                                                    amountFormat({
                                                        currency: item.currency,
                                                        amount: item.unit_amount
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
                                                            item.unit_amount
                                                    })
                                                }}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <div class="bold">Sub Total</div>
                                        </td>
                                        <td>
                                            <div class="bold">
                                                {{
                                                    amountFormat({
                                                        currency:
                                                            invoice.invoice
                                                                .currency,
                                                        amount:
                                                            invoice.invoice
                                                                .subtotal
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
                                                                .total
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
            .paid-status {
                border: 1px solid #2E31BE;
                color: #2E31BE;
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
        tr:nth-last-child(1),
        tr:nth-last-child(2) {
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
.inline-block{
    display: inline-block;
}
.link {
    cursor: pointer;
    color: #2E31BE;
    font-size: 12px;
    font-family: Inter, sans-serif;
}
.danger {
    color: #fa3f4d;
}
.form-field {
    margin-bottom: 24px;
}
.float-right{
    float:right;
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
.justify-content-flex-end{
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

.width-50 {
    width: 50%;
    @media @mobile{
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
.box-sizing-border-box{
    box-sizing: border-box;
}
.from-container {
    border: 1px solid #f9f9f9;
    border-radius: 4px;
    padding: 24px;
    @media @mobile{
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
    color: #2E31BE;
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
import URLS from '@/services/domain.service';
import get from 'lodash/get';
import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenRadio,
    NitrozenCheckBox,
    NitrozenDialog,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

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
    },
    computed: {
        paidStatus() {
            let status_trail = get(this, 'invoice.invoice.status_trail', null);
            if (!status_trail || status_trail.length == 0) {
                return null;
            }
            let paid_status = status_trail.find(
                status => status.value == 'paid'
            );
            if (paid_status) {
                return paid_status;
            }
            return null;
        }
    },
    filters: {
        getDateString: function(value) {
            return moment(value).format('Do MMMM YYYY');
        },
        accountNumber: function(value) {
            if (!value) return '';
            var last = 4;

            value =
                new Array(value.length - last + 1).join('*') +
                value.slice(-last);
            return value;
        },
        capitalize: function(value) {
            if (!value) return '';
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            invoice:null,
            invoiceId:this.$route.params.billingNo,
            contextMenuItems: [
                {
                    text: 'Retry Payment',
                    action: 'retryPayment',
                },
            ],
            registeredAddress:{
            "country": "India",
            "address1": "WING-C,Navghar Rd,Bashikali Nagar,Shiv Kripa Chawl,Bhayandar East ",
            "country_code": "IN",
            "landmark": "",
            "longitude": 72.862951,
            "pincode": 400606,
            "state": "Andaman and Nicobar Islands",
            "city": "Mira Bhayandar",
            "latitude": 19.303474,
            "address2": "tof",
            "address_type": "registered"
            }
        };
    },
    mounted() {
        BillingService.getInvoiceDetail(this.invoiceId).then(({data})=>{
            this.invoice=data;
        })
    },
    methods: {
        redirectToListing() {
            this.$router.push({ path: '/administrator/company-details/1?tab=2' });
        },
        amountFormat(plan) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: plan.currency
            }).format(plan.amount);
        },
        safeGet(obj, path, defaultValue) {
            return get(obj, path, defaultValue);
        },
        downloadInvoice() {
            window.open(
                URLS.SUBSCRIPTION_DOWNLOAD_INVOICE(this.invoiceId),
                '_blank'
            );
        },
        
    },
};
</script>
