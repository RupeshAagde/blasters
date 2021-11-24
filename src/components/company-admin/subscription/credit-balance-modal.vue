<template>
    <nitrozen-dialog class="credit-dialog" ref="credit-balance-dialog" title="Credit balance" @close="closeModal">
        <template slot="body">
            <div class="m-b-24">
                <div class="credit-adjust width-100">
                    <div class="m-b-12">
                        <nitrozen-input
                            label="Amount *"
                            type="number"
                            v-model="creditAdjustment.amount.value"
                            @keydown.native="onCreditAdjustAmountChange"
                        ></nitrozen-input>
                        <nitrozen-error v-if="creditAdjustment.amount.error">{{creditAdjustment.amount.error}}</nitrozen-error>
                    </div>
                    <div class="m-b-24">
                        <nitrozen-input
                            label="Description *"
                            type="text"
                            v-model="creditAdjustment.description.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="creditAdjustment.description.error">{{creditAdjustment.description.error}}</nitrozen-error>
                    </div>
                    <div class="flex gap-12 btn-container">
                        <nitrozen-button
                            class="flex-1 adjust-credit-btn"
                            :theme="'secondary'"
                            v-strokeBtn
                            @click="makeCreditAdjustment('credit')"
                        >Credit amount</nitrozen-button>
                        <nitrozen-button
                            class="flex-1 adjust-credit-btn charge-amount-btn"
                            :theme="'secondary'"
                            v-strokeBtn
                            @click="makeCreditAdjustment('debit')"
                        >Charge amount</nitrozen-button>
                    </div>
                </div>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>
import { NitrozenDialog } from '@gofynd/nitrozen-vue';
import moment from 'moment';
import BillingSubscriptionService from '../../../services/billing.service';
import {
    NitrozenButton,
    NitrozenError,
    NitrozenInput,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
export default {
    name: 'credit-balance-modal',
    components:{
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-error':NitrozenError,
        'nitrozen-input': NitrozenInput,
        'nitrozen-button': NitrozenButton,
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    props: {
        
    },
    computed:{
        
    },
    data(){
        return {
            companyId: this.$route.params.companyId,
            creditAdjustment:{
                amount: {
                    value: 0,
                    error: ""
                },
                currency: "INR",
                description: {
                    value: "",
                    error: ""
                }
            }
        }
    },
    methods:{
        open(){
            this.$refs["credit-balance-dialog"].open({
                showCloseButton: true,
                positiveButtonLabel: false,
                negativeButtonLabel: false,
                neutralButtonLabel: false,
                width: '600px'
            });
        },
        closeModal(e){
            this.$emit('closeCreditBalanceModal', e);
        },
        validateCreditAdjustment(){
            let isValid = true
            if(this.creditAdjustment.amount.value == 0){
                isValid = false
                this.creditAdjustment.amount.error = "Should be greater than 0"
            }
            else if(!this.creditAdjustment.amount.value){
                isValid = false
                this.creditAdjustment.amount.error = "Required Field"
            }
            else{
                this.creditAdjustment.amount.error = ""
            }
            if(!this.creditAdjustment.description.value){
                isValid = false
                this.creditAdjustment.description.error = "Required Field"
            }
            else{
                this.creditAdjustment.description.error = ""
            }
            return isValid
        },
        makeCreditAdjustment(transaction_type){
            if(this.validateCreditAdjustment()){
                return BillingSubscriptionService.creditAdjustment({
                        unique_id: this.companyId,
                        product_suite: 'fynd-platform',
                        type: 'company'
                    },{
                    "amount":this.creditAdjustment.amount.value,
                    "currency":this.creditAdjustment.currency,
                    "description":this.creditAdjustment.description.value,
                    "type":transaction_type == "credit"? "top_up" : "adjustment",
                    "transaction_type":transaction_type
                })
                .then(({data})=>{
                    this.creditTransactions = data
                    this.$snackbar.global.showSuccess(`Transaction successful`);
                })
                .then(()=>{
                    this.$refs["credit-balance-dialog"].close({"creditAdjustment":{success:true}})
                })
            }
        },
        onCreditAdjustAmountChange(e){
            if(e.key == "-" || e.key=="+" || e.key=="e" || e.key=="E"){
                e.preventDefault()
                return false
            }
            return true
        },
        amountFormat(currency,amount) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: currency
            }).format(amount);
        },
        toDateTimeString(date) {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        },
    }
}
</script>

<style lang="less" scoped>
    .flex{
        display: flex;
        .flex-1{
            flex:1;
        }
    }
    .gap-12{
        gap:12px;
    }
    .m-b-12{
        margin-bottom:12px;
    }
    .m-b-24{
        margin-bottom:24px;
    }
    .credit-adjust{
        .adjust-credit-btn{
            position: relative;
            top: 21px;
        }
        .charge-amount-btn{
            color: #f33;
            border-color: #f33;
        }
    }
    .btn-container{
        margin-bottom: 42px;
    }
    .credit-dialog{
        ::v-deep .nitrozen-dialog-footer{
            display: none;
        }
    }
</style>