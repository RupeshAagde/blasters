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
            @click="()=>{}"
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
        this.invoice={
  "invoice": {
    "period": {
      "start": "2020-08-17T13:45:36.722Z",
      "end": "2020-09-17T13:45:36.722Z"
    },
    "client": {
      "address_lines": [
        "TV TOWER, Foot Over Bridge Khar",
        null,
        "Mumbai, 400079, Maharashtra, India"
      ],
      "name": "RELIANCE RETAIL LTD",
      "email": "ZAK@GMAIL.COM",
      "phone": "91 9869821300"
    },
    "auto_advance": true,
    "currency": "INR",
    "paid": true,
    "attemp": 3,
    "_id": "5f7acb709e76da30e3b92cdb",
    "collection_method": "charge_automatically",
    "subscriber_id": "5ee773e1351e5e84289ed9cf",
    "invoice_url": "",
    "number": "FP-1-72020-736",
    "pg_data": {},
    "receipt_number": "5fd9b08464dc6ac048a08988",
    "statement_descriptor": "RELIANCE RETAIL LTD",
    "current_status": "paid",
    "status_trail": [
      {
        "_id": "5f7ad29bd562744eab216379",
        "value": "draft",
        "timestamp": "2020-10-05T08:00:27.753Z"
      },
      {
        "_id": "5fcf40ce1613c029aff417dd",
        "value": "open",
        "timestamp": "2020-12-08T09:01:02.038Z"
      },
      {
        "_id": "5fd9b08664dc6a1ad0a08989",
        "value": "paid",
        "timestamp": "2020-12-16T07:00:22.973Z"
      }
    ],
    "subtotal": 15720.08,
    "total": 15720.08,
    "subscription": "5f3a8a00668947663b7fbd38",
    "next_action_time": "2020-10-05T09:00:27.754Z",
    "paymentMethod": {
      "id": 73,
      "type": "card",
      "pg_payment_method_id": "pm_1H9PRrJ1ZTFIN1aDhz3TKqgV",
      "data": {
        "brand": "visa",
        "last4": "4242",
        "checks": {
          "cvc_check": "pass",
          "address_line1_check": null,
          "address_postal_code_check": null
        },
        "wallet": null,
        "country": "US",
        "funding": "credit",
        "exp_year": 2044,
        "networks": {
          "available": [
            "visa"
          ],
          "preferred": null
        },
        "exp_month": 12,
        "fingerprint": "0aror24meTf8iYfw",
        "generated_from": null,
        "three_d_secure_usage": {
          "supported": true
        }
      },
      "is_default": true
    },
    "created_at": "2020-10-05T07:29:52.876Z",
    "modified_at": "2020-12-16T07:00:22.980Z",
    "hash_identifier": "575999aca03e36f0fa54db5235bc7f25",
    "payment_method": {
      "pg_payment_method_id": null
    }
  },
  "invoice_items": [
    {
      "_id": "5f7acb709e76da48b1b92cdd",
      "currency": "INR",
      "plan": {
        "recurring": {
          "interval": "month",
          "interval_count": 1
        },
        "is_trial_plan": false,
        "plan_group": "default",
        "tagLines": [],
        "currency": "INR",
        "is_active": true,
        "is_visible": true,
        "trial_period": 0,
        "addons": [],
        "tags": [],
        "type": "public",
        "country": "IN",
        "_id": "5f3a8786c90d780037723a14",
        "name": "Professional",
        "description": "Professional",
        "amount": 1499,
        "product_suite_id": "5f3a8786c90d7800377239f3",
        "created_at": "2020-08-17T13:35:02.802Z",
        "modified_at": "2020-08-17T13:35:02.802Z"
      },
      "name": "Professional",
      "quantity": 1,
      "description": "Professional",
      "period": {
        "start": "2020-08-17T13:45:36.722Z",
        "end": "2020-10-05T07:29:52.868Z"
      },
      "unit_amount": 2356.77,
      "amount": 2356.77,
      "type": "subscription",
      "invoice_id": "5f7acb709e76da30e3b92cdb",
      "created_at": "2020-10-05T07:29:52.886Z",
      "modified_at": "2020-10-05T07:29:52.886Z"
    },
    {
      "_id": "5f7acf199aa6830c4fe5e984",
      "currency": "INR",
      "plan": {
        "recurring": {
          "interval": "month",
          "interval_count": 1
        },
        "is_trial_plan": false,
        "plan_group": "default",
        "tagLines": [],
        "currency": "INR",
        "is_active": true,
        "is_visible": true,
        "trial_period": 0,
        "addons": [],
        "tags": [
          "popular"
        ],
        "type": "public",
        "country": "IN",
        "_id": "5f3a8786c90d780037723a13",
        "name": "Premium",
        "description": "Premium",
        "amount": 2499,
        "product_suite_id": "5f3a8786c90d7800377239f3",
        "created_at": "2020-08-17T13:35:02.547Z",
        "modified_at": "2020-08-17T13:35:02.547Z"
      },
      "name": "Premium",
      "quantity": 1,
      "description": "Premium",
      "period": {
        "start": "2020-08-17T13:45:36.722Z",
        "end": "2020-10-05T07:45:29.755Z"
      },
      "unit_amount": 3929.87,
      "amount": 3929.87,
      "type": "subscription",
      "invoice_id": "5f7acb709e76da30e3b92cdb",
      "created_at": "2020-10-05T07:45:29.765Z",
      "modified_at": "2020-10-05T07:45:29.765Z"
    },
    {
      "_id": "5f7acf7da10a707fc502dcd4",
      "currency": "INR",
      "plan": {
        "recurring": {
          "interval": "month",
          "interval_count": 1
        },
        "is_trial_plan": false,
        "plan_group": "default",
        "tagLines": [],
        "currency": "INR",
        "is_active": true,
        "is_visible": true,
        "trial_period": 0,
        "addons": [],
        "tags": [],
        "type": "public",
        "country": "IN",
        "_id": "5f3a8786c90d780037723a16",
        "name": "Ultra Premium",
        "description": "Ultra Premium",
        "amount": 2999,
        "product_suite_id": "5f3a8786c90d7800377239f3",
        "created_at": "2020-08-17T13:35:02.802Z",
        "modified_at": "2020-08-17T13:35:02.802Z"
      },
      "name": "Ultra Premium",
      "quantity": 1,
      "description": "Ultra Premium",
      "period": {
        "start": "2020-08-17T13:45:36.722Z",
        "end": "2020-10-05T07:47:09.532Z"
      },
      "unit_amount": 4716.27,
      "amount": 4716.27,
      "type": "subscription",
      "invoice_id": "5f7acb709e76da30e3b92cdb",
      "created_at": "2020-10-05T07:47:09.541Z",
      "modified_at": "2020-10-05T07:47:09.541Z"
    },
    {
      "_id": "5f7ad29bd56274f23321637a",
      "currency": "INR",
      "plan": {
        "recurring": {
          "interval": "month",
          "interval_count": 1
        },
        "is_trial_plan": false,
        "plan_group": "default",
        "tagLines": [],
        "currency": "INR",
        "is_active": true,
        "is_visible": true,
        "trial_period": 0,
        "addons": [],
        "tags": [],
        "type": "public",
        "country": "IN",
        "_id": "5f3a8786c90d780037723a16",
        "name": "Ultra Premium",
        "description": "Ultra Premium",
        "amount": 2999,
        "product_suite_id": "5f3a8786c90d7800377239f3",
        "created_at": "2020-08-17T13:35:02.802Z",
        "modified_at": "2020-08-17T13:35:02.802Z"
      },
      "name": "Ultra Premium",
      "quantity": 1,
      "description": "Ultra Premium",
      "period": {
        "start": "2020-08-17T13:45:36.722Z",
        "end": "2020-10-05T08:00:27.753Z"
      },
      "unit_amount": 4717.17,
      "amount": 4717.17,
      "type": "subscription",
      "invoice_id": "5f7acb709e76da30e3b92cdb",
      "created_at": "2020-10-05T08:00:27.768Z",
      "modified_at": "2020-10-05T08:00:27.768Z"
    }
  ]
}

    },
    computed: {

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
        
    },
};
</script>
