<template>
    <div class="sms-body">
        <div class="dropdowns">
            <div class="dropdowns-one">
                <div class="dropdown" tabindex="0" @blur="handleDropdownBlur($event, 'templateDropdown')">
                    <nitrozen-dropdown
                        class=""
                        label="SMS template"
                        @change="sendMessage"
                        :items="smsTemplate"
                        v-model="selectedTemplate"
                        ref="templateDropdown"
                    />
                </div>

                <div class="dropdown" tabindex="0" @blur="handleDropdownBlur($event, 'recipientDropdown')">
                    <nitrozen-dropdown
                        class=""
                        label="Recipient"
                        @change="sendMessage"
                        :items="number"
                        v-model="selectedNumber"
                        ref="recipientDropdown"
                    />
                </div>
            </div>

            <div class="dropdowns-two" v-if="selectedTemplate == 'custom_delayed_shipment'">
                <nitrozen-input
                    :type="'textarea'"
                    label="Reason"
                    v-model="reason"
                    placeholder="Write reason here"
                    :disabled="false"
                    class="reason-box"
                />

                <div class="days-container">
                    <span class="days-label">Days</span>
                    <custom-input-number
                        :allowNegative="false"
                        :disabled="true"
                        :min="1"
                        :max="30"
                        :value="daysValue"
                        @increment="daysValue+=1"
                        @decrement="daysValue-=1"
                    />
                </div>
            </div>
        </div>
        <div class="user-input">
            <nitrozen-input
                :type="'textarea'"
                label="Preview"
                v-model="getMeNote"
                placeholder="(Min. 10 characters)"
                :disabled="true"
            />
        </div>
    </div>
</template>

<script>
/* Package imports */
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';

/* Components import */
import CustomInputNumber from '@/components/common/adm-input-number-controls.vue';
import InlineSvg from '@/components/common/inline-svg.vue';

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
            selectedNumber: '',
            selectedTemplate: '',
            checkForNote: '',
            reason: '',
            daysValue: 1,
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
            slugs: {
                delayed_shipment: 'aldaviz-delayed-shipment-event',
                custom_delayed_shipment: 'aldaviz-custom-delayed-shipment-event',
                not_reachable: 'aldaviz-not-reachable-event',
                shipment_rto: 'aldaviz-shipment-rto-event',
                account_details: 'aldaviz-account-details-event',
                refund: 'aldaviz-return-bag_picked-event'
            }
        }
    },
    components: {
        CustomInputNumber,
        InlineSvg,
        NitrozenDropdown,
        NitrozenInput
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
                this.checkForNote = `Dear ${this.fullName}, your order for Celio - ${this.orderId} has been delayed due to ${this.reason}. It will be delivered within ${this.daysValue} working days. For any queries, please reach out to us on care@fynd.com.`
                return `Dear ${this.fullName}, your order for Celio - ${this.orderId} has been delayed due to ${this.reason}. It will be delivered within ${this.daysValue} working day(s). For any queries, please reach out to us on care@fynd.com.`
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
                "slug": this.slugs[this.selectedTemplate],
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
            };

            if(selectedTemplate == 'custom_delayed_shipment') {
                data.data['days'] = this.daysValue;
                data.data['reason'] = this.reason;
            }

            const send_sms = OrderService.sendSms(data)
            return send_sms
            .then(({data}) => {
                if(data.success) {
                    this.$snackbar.global.showSuccess(`Message to ${this.fullName} sent successfully`);
                }
                else {
                    this.$snackbar.global.showError('Unable to send message to customer');
                    console.error("Error in sending SMS to customer:   ", data);
                }
                this.$emit('closeDrawer');
            })
            .catch((error) => {
                this.$snackbar.global.showError('Unable to send message to customer');
                console.error("Error in sending SMS to customer:   ", error);
            });
        },
        handleDropdownBlur(e, ref){
            if(this.$refs[ref]) this.$refs[ref].documentClick(e);
        }
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
            margin-bottom: 1rem;
        }

        .dropdowns-two {
            display: flex;
            gap: 16px;
            width: 100%;
            margin-bottom: 1rem;

            .days-label {
                color: #9b9b9b;
                font-size: 12px;
                font-weight: 500;
                line-height: 21px;
            }

            ::v-deep .nitrozen-form-input {
                .nitrozen-input-grp {
                    .n-input-textarea {
                        height: 40px;
                        line-height: 16px;
                    }
                }
            }

            .reason-box {
                flex-grow: 1;
            }
        }
    }
}
</style>