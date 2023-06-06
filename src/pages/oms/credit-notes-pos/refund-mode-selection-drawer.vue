<template>
  <div class="main-refund-mode-selection">
    <div class="refund-personal-details">
        <span class="refund-amount" v-if="amountToRefund">Amount to Refund: ₹{{ amountToRefund.toFixed(2) }}</span>
        <div class="personal-details">
            <span class="contact-detail" v-if="shipment && shipment.user && shipment.user.mobile">Contact number: {{ shipment.user.mobile ? shipment.user.mobile : '' }}</span>
            <span class="status">Registered</span>
        </div>
    </div>
    <div class="different-refund-mode-selection">
        <nitrozen-radio 
            class="refund-mode-box"
            v-for="(modes, index) in differentRefundModeSelection" 
            :key="index"
            name="refundType"
            :radioValue="modes.slug"
            v-model="selectedRefundMode"
            @change="sendTheSelectedValue">
            <div class="refund-mode-card">
                <span class="refund-mode-text-main">
                    {{ modes.display_name }}
                </span>
                <span class="refund-mode-text-define">
                    {{ modes.text }}
                </span>
            </div>
        </nitrozen-radio>
    </div>
  </div>
</template>

<script>
/* Components import */
import { NitrozenRadio } from '@gofynd/nitrozen-vue';

export default {
    name: "refund-mode-selection-drawer",
    props: {
        shipment: {
            type: Object 
        },
        refundModeData: {
            type: Object
        },
        amountToRefund: {
            type: Number
        }
    },
    data() {
        return {
            differentRefundModeSelection: {},
            selectedRefundMode: ''
        }
    },
    components: {
        NitrozenRadio
    },
    mounted() {
        for(let index in this.refundModeData){
            if(this.refundModeData[index].slug == 'credit_note' && this.amountToRefund){
                this.refundModeData[index].text = `₹${this.amountToRefund.toFixed(2)} will be instantly refunded as a Credit Note`
            }
            if(this.refundModeData[index].slug == 'source' && this.amountToRefund){
                this.refundModeData[index].text = `₹${this.amountToRefund.toFixed(2)} will be credited back to the source`
            }
            if(this.refundModeData[index].slug == 'bank_transfer'){
                this.refundModeData[index].text = 'Customer will receive a form to fill their bank details. Afterward, our customer success team will proceed with refund'
            }
        }
        this.differentRefundModeSelection = this.refundModeData;
    },
    computed: {
        
    },
    methods: {
        sendTheSelectedValue() {
            this.$emit('selectedValue', {mode: this.selectedRefundMode, price: this.amountToRefund});
        }
    }
}
</script>

<style scoped lang="less">
.main-refund-mode-selection {
    .refund-personal-details {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 18px;
        .refund-amount {
            font-weight: 600;
            font-size: 16px;
            line-height: 130%;
            text-align: center;
            color: #41434C;
        }
        .personal-details {
            display: flex;
            .contact-detail {
            font-weight: 600;
            font-size: 16px;
            line-height: 130%;
            text-align: center;
            color: #41434C;
            margin-right: 8px;
            }
            .status {
                font-weight: 600;
                font-size: 14px;
                line-height: 130%;
                text-align: center;
                color: #0A5F23;
                background: #E3F2E9;
                border-radius: 4px;
                padding: 2px 8px;
            }
        }
    }
    .different-refund-mode-selection {
        .refund-mode-box {
            background: #FFFFFF;
            border: 1px solid #E0E0E0;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 18px;
            // min-height: 30px;
            height: fit-content;
            // word-wrap: break-word;
            .refund-mode-card {
                display: flex;
                flex-direction: column;
                margin-left: 14px;
                .refund-mode-text-main {
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 130%;
                    color: #41434C;
                    margin-bottom: 8px;
                }
                .refund-mode-text-define {
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 150%;
                    color: #41434C;
                }

            }
        }
    }
    @media @mobile{
        .main-refund-mode-selection {
            .refund-personal-details{
                display: block;
            }
        }
    }

}
</style>