<template>
    <div class="sms-body">
        <div class="dropdowns">
            <div class="dropdowns-one">
                <nitrozen-dropdown
                    class=""
                    label="SMS template"
                    @change="sendMessage"
                    :items="smsTemplate"
                    v-model="selectedTemplate"
                >
                </nitrozen-dropdown>

                <nitrozen-dropdown
                    class=""
                    label="Recipient"
                    @change="sendMessage"
                    :items="number"
                    v-model="selectedNumber"
                >
                </nitrozen-dropdown>
            </div>
            <div class="dropdowns-two" v-if="selectedTemplate == 'custom_delayed_shipment'">
                <nitrozen-input
                    :type="'textarea'"
                    label="Reason"
                    v-model="checkForReason"
                    placeholder="Write reason here"
                    :disabled="false"
                ></nitrozen-input>

                <nitrozen-dropdown
                    class=""
                    label="Days"
                    @change="sendMessage"
                    :items="days"
                    v-model="daysValue"
                >
                </nitrozen-dropdown>
            </div>
        </div>
        <div class="user-input">
            <nitrozen-input
                :type="'textarea'"
                label="Preview"
                v-model="getMeNote"
                placeholder="(Min. 10 characters)"
                :disabled="true"
            ></nitrozen-input>
        </div>
    </div>
</template>

<script>
/* Components import */
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import admNoContent from '@/components/common/adm-no-content.vue';

/* Service imports */
import OrderService from '@/services/orders.service';

/* Package imports */
import isEmpty from 'lodash/isEmpty';

export default {
    name: "sms-drawer",
    props: {
        number: Array,
        fullName: String,
        orderId: String,
        shipmentId: String,
        bagId: String,
        brandName: String,
        amountPaid: String,
        paymentMode: String,
        isSendSms: Boolean
    },
    data() {
        return {
            selectedNumber: "",
            selectedTemplate: "",
            checkForNote: "",
            checkForReason: "",
            daysValue: "",
            smsTemplate: [
                {
                    text: "Delayed Shipment",
                    value: "delayed_shipment"
                },
                {
                    text: "Custom Delayed Shipment",
                    value: "custom_delayed_shipment"
                },
                {
                    text: "Not reachable",
                    value: "not_reachable"
                },
                {
                    text: "Shipment RTO",
                    value: "shipment_rto"
                },
                {
                    text: "Account Details",
                    value: "account_details"
                },
                {
                    text: "Refund - Bank Details",
                    value: "refund"
                },
            ],  
            // number: [
            //     {
            //         text: "8451986726",
            //         value: "8451986726"
            //     },
            // ],
            days: [
                {
                    text: "1",
                    value: "1"
                },
                {
                    text: "2",
                    value: "2"
                },
                {
                    text: "3",
                    value: "3"
                }
            ]
            
        }
    },
    components: {
        InlineSvg,
        NitrozenDropdown,
        admNoContent,
        NitrozenInput,
    },
    mounted() {
        this.$emit("enableSubmitButton", true);
    },
    computed: {
        getMeNote() {
            if(this.selectedTemplate == "delayed_shipment") {
                this.checkForNote = `Dear ${this.fullName}, your order for Celio - ${this.orderId} has been delayed. We are doing our best to get it delivered as soon as possible. You can track your shipment ${this.shipmentId} on track.fynd.com. For any queries, please reach out to us on care@fynd.com.`
                return `Dear ${this.fullName}, your order for Celio - ${this.orderId} has been delayed. We are doing our best to get it delivered as soon as possible. You can track your shipment ${this.shipmentId} on track.fynd.com. For any queries, please reach out to us on care@fynd.com.`
            };
            if(this.selectedTemplate == "custom_delayed_shipment") {
                this.checkForNote = `Dear ${this.fullName}, your order for Celio - ${this.orderId} has been delayed due to ${this.checkForReason}. It will be delivered within ${this.daysValue} working days. For any queries, please reach out to us on care@fynd.com.`
                return `Dear ${this.fullName}, your order for Celio - ${this.orderId} has been delayed due to ${this.checkForReason}. It will be delivered within ${this.daysValue} working days. For any queries, please reach out to us on care@fynd.com.`
            };
            if(this.selectedTemplate == "not_reachable") {
                this.checkForNote = `Dear ${this.fullName}, we've been trying to contact you for your shipment ${this.shipmentId} but were unable to reach you. For further assistance, please reach out to us on care@fynd.com.`
                return `Dear ${this.fullName}, we've been trying to contact you for your shipment ${this.shipmentId} but were unable to reach you. For further assistance, please reach out to us on care@fynd.com.`
            };
            if(this.selectedTemplate == "shipment_rto") {
                this.checkForNote = `Dear ${this.fullName}, your shipment ${this.shipmentId} has been returned to its origin. If you're still interested in buying the product, we request you to please place the order again. For further assistance, please reach out to us on care@fynd.com.`
                return `Dear ${this.fullName}, your shipment ${this.shipmentId} has been returned to its origin. If you're still interested in buying the product, we request you to please place the order again. For further assistance, please reach out to us on care@fynd.com.`
            };
            if(this.selectedTemplate == "account_details") {
                this.checkForNote = `Dear ${this.fullName}, we have initiated refund for your order for And Data - ${this.orderId}, please reach out to us on care@fynd.com.`
                return `Dear ${this.fullName}, we have initiated refund for your order for And Data - ${this.orderId}, please reach out to us on care@fynd.com.`
            };
            if(this.selectedTemplate == "refund") {
                this.checkForNote = `Dear ${this.fullName}, your And Data - ${this.shipmentId} refund of Rs.599 is due and will be processed in the next 2-3 days. Please provide your bank details in the link below to initiate the payment link. Notification via Fynd.`
                return `Dear ${this.fullName}, your And Data - ${this.shipmentId} refund of Rs.599 is due and will be processed in the next 2-3 days. Please provide your bank details in the link below to initiate the payment link. Notification via Fynd.`
            };
        },
    },
    methods: {
        sendMessage() {
            if(!isEmpty(this.smsTemplate) && !isEmpty(this.selectedNumber)) {
                this.$emit("enableSubmitButton", false)
            }
        },
        sendSmsToCustomer() {
            let data = {
                "bag_id": this.bagId,
                "slug": "aldaviz-delayed-shipment-event",
                "data": {
                    "country_code": "+91",
                    "phone_number": this.selectedNumber,
                    "message": this.checkForNote,
                    "customerName": this.fullName,
                    "brandName": this.brandName,
                    "orderId": this.orderId,
                    "shipmentId": this.shipmentId,
                    "amount_paid": this.amountPaid,
                    "payment_mode": this.paymentMode
                }
            }
            const send_sms = OrderService.sendSms(data)
            return send_sms
                .then(({data}) => {
                    if(data.success) {
                        this.$snackbar.global.showSuccess(`Message to ${this.fullName} sent successfully`);
                    }
                    else {
                        this.$snackbar.global.showError('Unable to send message to customer');
                        console.error("error:   ", error);
                    }
                })
                .catch((error) => {
                    this.$snackbar.global.showError('Unable to send message to customer');
                    console.error("error:   ", error);
                })
        },
    }

}
</script>

<style lang="less" scoped> 

.sms-body {
    .dropdowns {
        display: flex;
        flex-direction: column;
        .dropdowns-one {
            display: flex;
            gap: 16px;
            margin-bottom: 40px;
        }
        .dropdowns-two {
            display: flex;
            gap: 16px;
            margin-bottom: 40px;
            ::v-deep .nitrozen-form-input {
                .nitrozen-input-grp {
                    .n-input-textarea {
                        height: unset;
                        line-height: 16px;
                    }
                    .n-input {
                        width: unset;
                    }
                }
            }
        }
    }
}
</style>